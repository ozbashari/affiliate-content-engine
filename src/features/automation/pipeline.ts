import 'server-only';
import { AutomationPipelineInput, AutomationPipelineResult } from './types';
import { 
  isProductPublished, 
  savePublishedProduct, 
  UniqueConstraintViolationError 
} from '@/features/publishing/published-products-repository';
import { generateAliExpressAffiliateLink } from '@/lib/aliexpress';
import { GeminiProvider } from '@/features/ai/gemini-provider';
import { TelegramPublisher } from '@/features/publishing/telegram-provider';
import { GeneratedPost } from '@/features/ai/types';

export async function runAutomationPipeline(input: AutomationPipelineInput): Promise<AutomationPipelineResult> {
  const { product, generatedPost: providedPost } = input;

  // Step 1: Validate product parameters
  if (!product) {
    return {
      success: false,
      alreadyPublished: false,
      errorCode: 'VALIDATION_FAILED',
      errorMessage: 'Missing product parameter.',
    };
  }

  const source = product.source?.trim();
  const externalId = product.externalId?.trim();

  if (!source || !externalId) {
    return {
      success: false,
      alreadyPublished: false,
      errorCode: 'VALIDATION_FAILED',
      errorMessage: 'Product source and externalId are required.',
    };
  }

  if (!product.productUrl?.trim()) {
    return {
      success: false,
      alreadyPublished: false,
      errorCode: 'VALIDATION_FAILED',
      errorMessage: 'Product productUrl is required.',
    };
  }

  if (!product.imageUrl?.trim()) {
    return {
      success: false,
      alreadyPublished: false,
      errorCode: 'VALIDATION_FAILED',
      errorMessage: 'Product imageUrl is required.',
    };
  }

  try {
    // Step 2: Check Supabase for duplicate publication
    const alreadyPublished = await isProductPublished(source, externalId);
    if (alreadyPublished) {
      return {
        success: false,
        alreadyPublished: true,
        errorCode: 'PRODUCT_ALREADY_PUBLISHED',
        errorMessage: 'This product has already been published.',
      };
    }

    let finalPost: GeneratedPost;

    if (providedPost) {
      // Step 3 & 4 (Bypassed): Use the user-reviewed preview post exactly as-is
      finalPost = providedPost;
    } else {
      // Step 3: Generate official short affiliate link
      let affiliateUrl = product.affiliateUrl;
      try {
        affiliateUrl = await generateAliExpressAffiliateLink(product.productUrl);
      } catch (linkError) {
        console.warn('Failed to generate short affiliate link, falling back to original:', linkError);
      }

      const productWithShortLink = {
        ...product,
        affiliateUrl,
      };

      // Step 4: Generate Gemini post
      const provider = new GeminiProvider();
      const generationResult = await provider.generateTelegramPost({ product: productWithShortLink });
      finalPost = generationResult.post;
    }

    // Step 5: Publish to Telegram
    if (input.dryRun) {
      console.log('Dry run enabled. Skipping Telegram publication and database saving.');
      return {
        success: true,
        publishType: 'photo',
        telegramMessageId: 'mock-dry-run-message-id',
        generatedPost: finalPost,
        alreadyPublished: false,
      };
    }

    const publisher = new TelegramPublisher();
    const publishResult = await publisher.publish({
      post: finalPost,
      imageUrl: product.imageUrl,
    });

    if (!publishResult.success) {
      return {
        success: false,
        alreadyPublished: false,
        errorCode: 'PUBLISH_FAILED',
        errorMessage: publishResult.error || 'Failed to publish to Telegram.',
      };
    }

    const telegramMessageId = publishResult.externalId || '';

    // Step 6: Save publication to Supabase after Telegram succeeds
    try {
      await savePublishedProduct({
        source,
        externalId,
        telegramMessageId,
      });

      if (product.primaryDiscoveryContext) {
        try {
          const { SupabaseDiversityRepository } = await import('../discovery/diversity-repository');
          const repo = new SupabaseDiversityRepository();
          await repo.savePublishedDiversity(
            externalId,
            product.primaryDiscoveryContext.categoryId,
            product.primaryDiscoveryContext.keyword
          );
        } catch (divError: unknown) {
          console.warn('Failed to save published diversity record:', divError);
        }
      }
    } catch (dbError: unknown) {
      if (dbError instanceof UniqueConstraintViolationError) {
        return {
          success: false,
          alreadyPublished: false,
          errorCode: 'DUPLICATE_RECORD_AFTER_PUBLISH',
          errorMessage: `Product was successfully published to Telegram (ID: ${telegramMessageId}), but database record check failed (duplicate entry detected).`,
          telegramMessageId,
          generatedPost: finalPost,
        };
      }

      const dbErrorMessage = dbError instanceof Error ? dbError.message : String(dbError);
      return {
        success: false,
        alreadyPublished: false,
        errorCode: 'DATABASE_SAVE_FAILED',
        errorMessage: `Product was successfully published to Telegram (ID: ${telegramMessageId}), but saving to database failed: ${dbErrorMessage}`,
        telegramMessageId,
        generatedPost: finalPost,
      };
    }

    // Step 7: Return typed result
    return {
      success: true,
      publishType: publishResult.publishType,
      telegramMessageId,
      generatedPost: finalPost,
      alreadyPublished: false,
    };
  } catch (err: unknown) {
    return {
      success: false,
      alreadyPublished: false,
      errorCode: 'PUBLISH_FAILED',
      errorMessage: err instanceof Error ? err.message : String(err),
    };
  }
}
