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

export async function savePublishedProduct(input: {
  source: string;
  externalId: string;
  telegramMessageId: string;
}): Promise<void> {
  const supabase = getSupabaseServerClient();

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

  if (error) {
    // PostgreSQL error code for unique constraint violation is '23505'
    if (error.code === '23505') {
      throw new UniqueConstraintViolationError(
        `Unique constraint violation: Product (source: ${input.source}, externalId: ${input.externalId}) has already been recorded.`
      );
    }
    throw new Error(`Failed to save published product: ${error.message}`);
  }
}
