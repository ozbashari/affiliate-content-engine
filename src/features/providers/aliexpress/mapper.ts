import { CatalogProduct } from '@/features/products/types';
import { normalizeAliExpressProduct } from './normalizer';

/**
 * Maps a single raw AliExpress product into a CatalogProduct.
 */
export function mapToCatalogProduct(raw: Record<string, unknown>): CatalogProduct {
  const normalized = normalizeAliExpressProduct(raw);
  
  const now = new Date();

  return {
    id: `aliexpress_${normalized.externalId}`,
    source: 'aliexpress',
    externalId: normalized.externalId,
    title: normalized.title,
    imageUrl: normalized.imageUrl,
    productUrl: normalized.productUrl,
    affiliateUrl: normalized.affiliateUrl,
    price: {
      amount: normalized.salePriceAmount,
      currency: normalized.currency,
    },
    originalPrice: normalized.originalPriceAmount !== undefined ? {
      amount: normalized.originalPriceAmount,
      currency: normalized.currency,
    } : undefined,
    discountPercent: normalized.discountPercent,
    rating: normalized.rating,
    salesCount: normalized.salesCount,
    commissionRate: normalized.commissionRate,
    status: 'draft',
    createdAt: now,
    updatedAt: now,
  };
}
