import { NextResponse, NextRequest } from 'next/server';
import crypto from 'crypto';
import { scanUnpublishedProducts, runAutomationPipeline } from '@/features/automation';
import { CatalogProduct } from '@/features/products/types';

export const dynamic = 'force-dynamic';

function timingSafeEqual(a: string, b: string): boolean {
  const hashA = crypto.createHash('sha256').update(a).digest();
  const hashB = crypto.createHash('sha256').update(b).digest();
  return crypto.timingSafeEqual(hashA, hashB);
}

export async function GET(request: NextRequest) {
  try {
    // 1. Authenticate the request.
    const cronSecret = process.env.CRON_SECRET;
    if (!cronSecret) {
      return NextResponse.json(
        {
          success: false,
          code: 'CRON_SECRET_NOT_CONFIGURED',
          error: 'Cron secret is not configured on server.',
        },
        { status: 500 }
      );
    }

    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        {
          success: false,
          code: 'UNAUTHORIZED_CRON_REQUEST',
          error: 'Missing or invalid Authorization header.',
        },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    if (!timingSafeEqual(token, cronSecret)) {
      return NextResponse.json(
        {
          success: false,
          code: 'UNAUTHORIZED_CRON_REQUEST',
          error: 'Unauthorized token.',
        },
        { status: 401 }
      );
    }

    // 2. Read category ID and page size from environment.
    const categoryId = process.env.AUTOMATION_CATEGORY_ID || '44';
    const pageSizeStr = process.env.AUTOMATION_PAGE_SIZE || '20';
    const pageSize = parseInt(pageSizeStr, 10) || 20;

    // 3. Call scanUnpublishedProducts.
    let unpublishedProducts: CatalogProduct[];
    try {
      unpublishedProducts = await scanUnpublishedProducts({ categoryId, pageSize });
    } catch (scanError: unknown) {
      const scanErrorMessage = scanError instanceof Error ? scanError.message : String(scanError);
      return NextResponse.json(
        {
          success: false,
          code: 'PRODUCT_SCAN_FAILED',
          error: `Product scan failed: ${scanErrorMessage}`,
        },
        { status: 500 }
      );
    }

    // 4. If no unpublished products are available.
    if (unpublishedProducts.length === 0) {
      return NextResponse.json({
        success: true,
        status: 'no-products',
        code: 'NO_UNPUBLISHED_PRODUCTS',
        message: 'No unpublished products were found.',
      });
    }

    // 5. Select exactly one product.
    const product = unpublishedProducts[0];

    // 6. Run the automation pipeline.
    const result = await runAutomationPipeline({ product });

    // 7. Handle duplicate / concurrency skipped cases.
    if (result.alreadyPublished || result.errorCode === 'DUPLICATE_RECORD_AFTER_PUBLISH') {
      return NextResponse.json(
        {
          success: false,
          code: result.errorCode || 'PRODUCT_ALREADY_PUBLISHED',
          status: 'skipped',
          message: 'The selected product was already published by a concurrent request.',
          productExternalId: product.externalId,
          productTitle: product.title,
          telegramMessageId: result.telegramMessageId,
        },
        { status: 409 }
      );
    }

    // 8. Handle other failures.
    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          code: 'AUTOMATION_PIPELINE_FAILED',
          error: result.errorMessage || 'Automation pipeline execution failed.',
          productExternalId: product.externalId,
          productTitle: product.title,
        },
        { status: 500 }
      );
    }

    // 9. Success response.
    return NextResponse.json({
      success: true,
      status: 'published',
      productExternalId: product.externalId,
      productTitle: product.title,
      telegramMessageId: result.telegramMessageId,
      publishType: result.publishType,
    });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        success: false,
        code: 'UNKNOWN_ERROR',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
