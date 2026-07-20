export interface NormalizedAliExpressProduct {
  externalId: string;
  title: string;
  imageUrl: string;
  productUrl: string;
  affiliateUrl: string;
  salePriceAmount: number;
  originalPriceAmount?: number;
  currency: string;
  discountPercent?: number;
  rating?: number;
  salesCount?: number;
  commissionRate?: number;
}

/**
 * Normalizes a raw string or number into a clean number.
 * e.g., "12.34" -> 12.34, "45%" -> 45
 */
export function normalizeNumber(val: unknown): number | undefined {
  if (val === undefined || val === null || val === '') {
    return undefined;
  }
  if (typeof val === 'number') {
    return isNaN(val) ? undefined : val;
  }
  if (typeof val === 'string') {
    // Strip everything except digits, decimal point, and minus sign
    const clean = val.replace(/[^0-9.-]/g, '');
    const num = parseFloat(clean);
    return isNaN(num) ? undefined : num;
  }
  return undefined;
}

/**
 * Normalizes a string. Trims it and falls back to empty string if missing.
 */
export function normalizeString(val: unknown): string {
  if (val === undefined || val === null) {
    return '';
  }
  return String(val).trim();
}

/**
 * Normalizes a raw AliExpress product item.
 */
export function normalizeAliExpressProduct(raw: Record<string, unknown>): NormalizedAliExpressProduct {
  const externalId = normalizeString(raw.product_id);
  const title = normalizeString(raw.product_title);
  const imageUrl = normalizeString(raw.product_main_image_url);
  const productUrl = normalizeString(raw.product_detail_url);
  
  // promotion_link or fallback to productUrl
  const affiliateUrl = normalizeString(raw.promotion_link) || productUrl;

  const salePriceAmount = normalizeNumber(raw.sale_price) ?? 0;
  const originalPriceAmount = normalizeNumber(raw.original_price);
  
  // AliExpress return discount in formats like "15%" or "15" or number 15
  const discountPercent = normalizeNumber(raw.discount);

  const rating = normalizeNumber(raw.evaluate_rate);
  const salesCount = normalizeNumber(raw.lastest_volume);
  const commissionRate = normalizeNumber(raw.commission_rate);

  // Handle target_currency or default to ILS
  const currency = normalizeString(raw.target_currency) || 'ILS';

  if (!externalId) {
    throw new Error('Normalization failed: product_id is missing or invalid.');
  }
  if (!title) {
    throw new Error('Normalization failed: product_title is missing or invalid.');
  }

  return {
    externalId,
    title,
    imageUrl,
    productUrl,
    affiliateUrl,
    salePriceAmount,
    originalPriceAmount,
    currency,
    discountPercent,
    rating,
    salesCount,
    commissionRate,
  };
}
