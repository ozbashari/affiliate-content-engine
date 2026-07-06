import { GeneratePostInput, GeneratePostResult } from './types';

export interface AIProvider {
  name: string;
  generateTelegramPost(input: GeneratePostInput): Promise<GeneratePostResult>;
}
