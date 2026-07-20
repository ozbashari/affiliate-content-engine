import { NextResponse, NextRequest } from 'next/server';
import crypto from 'crypto';
import { runScheduledProductDiscovery } from '@/features/discovery';
import { SupabaseCronLockRepository } from '@/features/discovery/cron-lock-repository';

export const dynamic = 'force-dynamic';

function timingSafeEqual(a: string, b: string): boolean {
  const hashA = crypto.createHash('sha256').update(a).digest();
  const hashB = crypto.createHash('sha256').update(b).digest();
  return crypto.timingSafeEqual(hashA, hashB);
}

export async function GET(request: NextRequest) {
  const lockKey = 'affiliate-publish-cron';
  const ownerId = crypto.randomUUID();
  
  // Parse and validate TTL environment variable
  const rawTtl = process.env.CRON_LOCK_TTL_SECONDS?.trim();
  let ttlSeconds = 900; // Default 15 minutes
  if (rawTtl) {
    const parsed = parseInt(rawTtl, 10);
    if (!isNaN(parsed) && parsed > 0) {
      ttlSeconds = parsed;
    }
  }

  const repo = new SupabaseCronLockRepository();
  const startTime = Date.now();
  let lockAcquired = false;

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

    // 2. Atomic Lock Acquisition (Fail-Closed Policy)
    try {
      lockAcquired = await repo.tryAcquire(lockKey, ownerId, ttlSeconds);
    } catch (lockDbError: unknown) {
      console.error(`[CronLock] Database error during lock acquisition for key "${lockKey}":`, lockDbError);
      return NextResponse.json(
        {
          success: false,
          code: 'CRON_LOCK_ACQUISITION_FAILED',
          error: 'Failed to acquire cron lock due to database error.',
        },
        { status: 500 }
      );
    }

    if (!lockAcquired) {
      console.log(`[CronLock] Lock skipped. Key "${lockKey}" is currently held by another active process. ownerId=${ownerId}`);
      return NextResponse.json({
        success: true,
        skipped: true,
        reason: 'cron_lock_active',
      }, { status: 200 });
    }

    console.log(`[CronLock] Lock acquired. key="${lockKey}" ownerId=${ownerId} ttlSeconds=${ttlSeconds}`);

    // 3. Call the scheduled product discovery workflow
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
  } finally {
    const executionDurationMs = Date.now() - startTime;
    if (lockAcquired) {
      try {
        const released = await repo.release(lockKey, ownerId);
        console.log(`[CronLock] Lock released status. key="${lockKey}" ownerId=${ownerId} released=${released} durationMs=${executionDurationMs}`);
      } catch (releaseError: unknown) {
        console.error(`[CronLock] Failed to release lock. key="${lockKey}" ownerId=${ownerId} error=`, releaseError);
      }
    }
  }
}
