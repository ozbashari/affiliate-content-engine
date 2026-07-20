import { NextResponse, NextRequest } from 'next/server';
import crypto from 'crypto';
import { runScheduledProductDiscovery } from '@/features/discovery';

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

    // 2. Call the scheduled product discovery workflow
    const result = await runScheduledProductDiscovery();

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          code: result.code,
          error: result.message,
        },
        { status: 500 }
      );
    }

    if (result.status === 'no-products') {
      return NextResponse.json({
        success: true,
        status: result.status,
        code: result.code,
        message: result.message,
      });
    }

    const pResult = result.pipelineResult;
    // Handle skipped concurrency or other statuses
    if (pResult && (pResult.alreadyPublished || pResult.errorCode === 'DUPLICATE_RECORD_AFTER_PUBLISH')) {
      return NextResponse.json(
        {
          success: false,
          code: pResult.errorCode || 'PRODUCT_ALREADY_PUBLISHED',
          status: 'skipped',
          message: 'The selected product was already published by a concurrent request.',
          productExternalId: result.selectedProduct?.externalId,
          productTitle: result.selectedProduct?.title,
          telegramMessageId: pResult.telegramMessageId,
        },
        { status: 409 }
      );
    }

    if (pResult && !pResult.success) {
      return NextResponse.json(
        {
          success: false,
          code: 'AUTOMATION_PIPELINE_FAILED',
          error: pResult.errorMessage || 'Automation pipeline execution failed.',
          productExternalId: result.selectedProduct?.externalId,
          productTitle: result.selectedProduct?.title,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      status: 'published',
      productExternalId: result.selectedProduct?.externalId,
      productTitle: result.selectedProduct?.title,
      telegramMessageId: pResult?.telegramMessageId,
      publishType: pResult?.publishType,
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
