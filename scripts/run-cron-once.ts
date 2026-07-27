import crypto from 'crypto';
import { runScheduledProductDiscovery } from '../src/features/discovery';
import { SupabaseCronLockRepository } from '../src/features/discovery/cron-lock-repository';

async function main() {
  console.log('[CronRunOnce] Starting production cron execution...');

  const lockKey = 'affiliate-publish-cron';
  const ownerId = crypto.randomUUID();

  // Parse TTL seconds from environment
  const rawTtl = process.env.CRON_LOCK_TTL_SECONDS?.trim();
  let ttlSeconds = 900;
  if (rawTtl) {
    const parsed = Number(rawTtl);
    if (Number.isInteger(parsed) && parsed > 0) {
      ttlSeconds = parsed;
    } else {
      console.warn(
        `[CronRunOnce] Invalid CRON_LOCK_TTL_SECONDS="${rawTtl}". Using default TTL of 900 seconds.`
      );
    }
  }

  const repo = new SupabaseCronLockRepository();
  let lockAcquired = false;

  try {
    // Acquire distributed lock
    console.log(`[CronRunOnce] Attempting to acquire lock "${lockKey}" (ownerId: ${ownerId}, ttl: ${ttlSeconds}s)...`);
    lockAcquired = await repo.tryAcquire(lockKey, ownerId, ttlSeconds);

    if (!lockAcquired) {
      console.log(`[CronRunOnce] Execution skipped. Lock "${lockKey}" is currently held by another active process.`);
      return;
    }

    console.log(`[CronRunOnce] Lock acquired successfully.`);

    // Execute the discovery workflow
    console.log('[CronRunOnce] Executing scheduled product discovery workflow...');
    const result = await runScheduledProductDiscovery();

    if (!result.success) {
      console.error(`[CronRunOnce] Workflow execution failed. Code: ${result.code || 'UNKNOWN_CODE'}, Error: ${result.message || 'No error message provided.'}`);
      process.exitCode = 1;
      return;
    }

    if (result.status === 'no-products') {
      console.log(`[CronRunOnce] Workflow finished: No products found. Code: ${result.code || 'NO_PRODUCTS'}, Message: ${result.message}`);
      return;
    }

    const pResult = result.pipelineResult;
    if (pResult && (pResult.alreadyPublished || pResult.errorCode === 'DUPLICATE_RECORD_AFTER_PUBLISH')) {
      console.log(`[CronRunOnce] Workflow finished (Skipped/Duplicate): Product was already published. Product External ID: ${result.selectedProduct?.externalId}, Product Title: "${result.selectedProduct?.title}"`);
      return;
    }

    if (pResult && !pResult.success) {
      console.error(`[CronRunOnce] Pipeline execution failed. Error: ${pResult.errorMessage || 'Automation pipeline execution failed.'}, Product External ID: ${result.selectedProduct?.externalId}, Product Title: "${result.selectedProduct?.title}"`);
      process.exitCode = 1;
      return;
    }

    console.log(`[CronRunOnce] Workflow finished: Product published successfully. Product External ID: ${result.selectedProduct?.externalId}, Product Title: "${result.selectedProduct?.title}", Telegram Message ID: ${pResult?.telegramMessageId}, Publish Type: ${pResult?.publishType}`);

  } catch (error: unknown) {
    console.error('[CronRunOnce] Unexpected exception during cron execution:', error instanceof Error ? error.stack || error.message : String(error));
    process.exitCode = 1;
  } finally {
    if (lockAcquired) {
      try {
        console.log(`[CronRunOnce] Releasing lock "${lockKey}" (ownerId: ${ownerId})...`);
        const released = await repo.release(lockKey, ownerId);
        console.log(`[CronRunOnce] Lock released. Status: ${released}`);
      } catch (releaseError: unknown) {
        console.error(
          '[CronRunOnce] Failed to release lock:',
          releaseError instanceof Error
            ? releaseError.stack || releaseError.message
            : String(releaseError)
        );
        process.exitCode = 1;
      }
    }
    console.log('[CronRunOnce] Execution completed.');
  }
}

main();
