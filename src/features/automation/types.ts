import { CatalogProduct } from '@/features/products/types';
import { GeneratedPost } from '@/features/ai/types';

export interface AutomationPipelineInput {
  product: CatalogProduct;
  generatedPost?: GeneratedPost;
}

export interface AutomationPipelineResult {
  success: boolean;
  publishType?: 'photo' | 'photo-with-text' | 'text-fallback';
  telegramMessageId?: string;
  generatedPost?: GeneratedPost;
  alreadyPublished: boolean;
  errorCode?: 'PRODUCT_ALREADY_PUBLISHED' | 'DUPLICATE_RECORD_AFTER_PUBLISH' | 'DATABASE_SAVE_FAILED' | 'PUBLISH_FAILED' | 'VALIDATION_FAILED';
  errorMessage?: string;
}
