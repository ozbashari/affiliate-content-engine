import fs from 'fs';
import path from 'path';
import { CatalogProduct } from '@/features/products/types';

/**
 * Loads a prompt template from the docs/prompts directory.
 * @param templateName Name of the prompt file (e.g., 'gemini-telegram-post.md')
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

/**
 * Replaces placeholders in a prompt template with the actual values of a CatalogProduct.
 */
export function fillPromptTemplate(template: string, product: CatalogProduct): string {
  const rating = product.rating !== undefined ? product.rating.toFixed(1) : 'N/A';
  const discount = product.discountPercent !== undefined ? String(product.discountPercent) : '0';
  const originalPriceStr = product.originalPrice 
    ? `${product.originalPrice.amount} ${product.originalPrice.currency}` 
    : 'N/A';
  const priceStr = `${product.price.amount} ${product.price.currency}`;

  return template
    .replace(/\{\{title\}\}/g, product.title)
    .replace(/\{\{price\}\}/g, priceStr)
    .replace(/\{\{originalPrice\}\}/g, originalPriceStr)
    .replace(/\{\{original_price\}\}/g, originalPriceStr)
    .replace(/\{\{currency\}\}/g, product.price.currency)
    .replace(/\{\{discountPercent\}\}/g, discount)
    .replace(/\{\{discount\}\}/g, discount)
    .replace(/\{\{rating\}\}/g, rating)
    .replace(/\{\{salesCount\}\}/g, product.salesCount !== undefined ? String(product.salesCount) : '0')
    .replace(/\{\{sales\}\}/g, product.salesCount !== undefined ? String(product.salesCount) : '0')
    .replace(/\{\{affiliate_url\}\}/g, product.affiliateUrl)
    .replace(/\{\{affiliateUrl\}\}/g, product.affiliateUrl);
}
