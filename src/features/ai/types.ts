import { CatalogProduct } from '@/features/products/types';

export interface GeneratedPost {
  headline: string;
  body: string;
  cta: string;
  telegramPost: string;
  affiliateUrl: string;
  fullText: string; // Maintain backward compatibility with fullText (holds telegramPost)
  title?: string; // Optional backward compatibility
  hashtags?: string[]; // Optional backward compatibility
}

export interface GeneratePostInput {
  product: CatalogProduct;
  additionalInstructions?: string;
}

export interface GeneratePostResult {
  post: GeneratedPost;
  generatedAt: Date;
}
