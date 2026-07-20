import fs from 'fs';
import path from 'path';

/**
 * Loads a prompt template from the docs/prompts directory.
 * @param templateName Name of the prompt file (e.g., 'telegram-post-template.md')
 */
export function loadPromptTemplate(templateName: string): string {
  // process.cwd() returns the absolute root directory of the project in Next.js
  const filePath = path.join(process.cwd(), 'docs', 'prompts', templateName);
  
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    throw new Error(
      `Failed to load prompt template "${templateName}": ` +
      `${error instanceof Error ? error.message : String(error)}`
    );
  }
}
