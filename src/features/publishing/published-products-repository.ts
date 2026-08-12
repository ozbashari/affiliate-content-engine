import 'server-only';
import { getSupabaseServerClient } from '@/lib/supabase';

export class UniqueConstraintViolationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UniqueConstraintViolationError';
  }
}

export async function isProductPublished(source: string, externalId: string): Promise<boolean> {
  const supabase = getSupabaseServerClient();
  
  const { data, error } = await supabase
    .from('published_products')
    .select('id')
    .eq('source', source)
    .eq('external_id', externalId)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to check if product is published: ${error.message}`);
  }

  return !!data;
}

const SAVE_PUBLISHED_PRODUCT_MAX_ATTEMPTS = 4;
const SAVE_PUBLISHED_PRODUCT_RETRY_DELAY_MS = 500;

/**
 * Saves the publication record after a product has already gone out to
 * Telegram. A dropped insert here (transient network/Supabase error) would
 * leave the product unrecorded, so the next cron tick's isProductPublished
 * check would return false and could re-select and re-publish the same
 * product. Retrying with backoff closes that window for transient failures;
 * a genuine unique-constraint violation is not retried since it means the
 * record already exists.
 */
export async function savePublishedProduct(input: {
  source: string;
  externalId: string;
  telegramMessageId: string;
}): Promise<void> {
  const supabase = getSupabaseServerClient();

  let lastErrorMessage = 'Unknown error';

  for (let attempt = 1; attempt <= SAVE_PUBLISHED_PRODUCT_MAX_ATTEMPTS; attempt++) {
    const { error } = await supabase
      .from('published_products')
      .insert([
        {
          source: input.source,
          external_id: input.externalId,
          telegram_message_id: input.telegramMessageId,
          published_at: new Date().toISOString(),
        },
      ]);

    if (!error) {
      return;
    }

    // PostgreSQL error code for unique constraint violation is '23505'.
    // This means the record already exists - retrying would not help.
    if (error.code === '23505') {
      throw new UniqueConstraintViolationError(
        `Unique constraint violation: Product (source: ${input.source}, externalId: ${input.externalId}) has already been recorded.`
      );
    }

    lastErrorMessage = error.message;

    if (attempt < SAVE_PUBLISHED_PRODUCT_MAX_ATTEMPTS) {
      const delayMs = SAVE_PUBLISHED_PRODUCT_RETRY_DELAY_MS * attempt;
      console.warn(
        `savePublishedProduct attempt ${attempt}/${SAVE_PUBLISHED_PRODUCT_MAX_ATTEMPTS} failed for product (source: ${input.source}, externalId: ${input.externalId}, telegramMessageId: ${input.telegramMessageId}): ${error.message}. Retrying in ${delayMs}ms.`
      );
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  throw new Error(
    `Failed to save published product after ${SAVE_PUBLISHED_PRODUCT_MAX_ATTEMPTS} attempts: ${lastErrorMessage}`
  );
}

export async function getPublishedExternalIds(
  source: string,
  externalIds: string[]
): Promise<Set<string>> {
  if (externalIds.length === 0) {
    return new Set<string>();
  }

  const supabase = getSupabaseServerClient();

  const { data, error } = await supabase
    .from('published_products')
    .select('external_id')
    .eq('source', source)
    .in('external_id', externalIds);

  if (error) {
    throw new Error(`Failed to check published external IDs: ${error.message}`);
  }

  const publishedSet = new Set<string>();
  if (data) {
    for (const row of data as Array<{ external_id: string }>) {
      publishedSet.add(row.external_id);
    }
  }

  return publishedSet;
}
