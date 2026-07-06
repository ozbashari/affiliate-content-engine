import { CatalogProduct } from '@/features/products/types';

export interface GeneratedPost {
  title: string;
  body: string;
  hashtags: string[];
  cta: string;
  affiliateUrl: string;
  fullText: string;
}

export interface GeneratePostInput {
  product: CatalogProduct;
  additionalInstructions?: string;
}

export interface GeneratePostResult {
  post: GeneratedPost;
  generatedAt: Date;
}
