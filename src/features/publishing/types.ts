import { GeneratedPost } from '@/features/ai/types';

export interface PublishInput {
  post: GeneratedPost;
}

export interface PublishResult {
  success: boolean;
  externalId?: string;
  error?: string;
}
