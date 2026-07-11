import { NextResponse, NextRequest } from 'next/server';
import { runAutomationPipeline } from '@/features/automation';
import { CatalogProduct } from '@/features/products/types';
import { GeneratedPost } from '@/features/ai/types';

export const dynamic = 'force-dynamic';

interface PublishRequestShape {
  product?: CatalogProduct;
  post?: GeneratedPost;
}

export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json();
    
    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { success: false, error: 'Invalid request body.' },
        { status: 400 }
      );
    }

    const { product, post } = body as PublishRequestShape;

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Missing required field: product.' },
        { status: 400 }
      );
    }

    if (!post) {
      return NextResponse.json(
        { success: false, error: 'Missing required field: post.' },
        { status: 400 }
      );
    }

    // Call the automation pipeline with both the product and the pre-generated post
    const result = await runAutomationPipeline({
      product,
      generatedPost: post,
    });

    if (result.alreadyPublished) {
      return NextResponse.json(
        {
          success: false,
          code: 'PRODUCT_ALREADY_PUBLISHED',
          message: result.errorMessage || 'This product has already been published.',
        },
        { status: 409 }
      );
    }

    if (!result.success) {
      const code = result.errorCode || 'PUBLISH_FAILED';
      const status = (code === 'DUPLICATE_RECORD_AFTER_PUBLISH' || code === 'PRODUCT_ALREADY_PUBLISHED') ? 409 : 500;
      
      return NextResponse.json(
        {
          success: false,
          code,
          message: result.errorMessage || 'Failed to publish product.',
          messageId: result.telegramMessageId,
        },
        { status }
      );
    }

    return NextResponse.json({
      success: true,
      messageId: result.telegramMessageId,
      publishType: result.publishType,
    });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
