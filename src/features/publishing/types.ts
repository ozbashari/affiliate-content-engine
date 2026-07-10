import { GeneratedPost } from '@/features/ai/types';

export interface PublishInput {
  post: GeneratedPost;
  imageUrl: string;
}

export interface PublishResult {
  success: boolean;
  externalId?: string;
  error?: string;
  publishType?: 'photo' | 'photo-with-text' | 'text-fallback';
  photoMessageId?: string;
}
