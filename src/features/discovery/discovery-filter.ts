import { PRICE_RULES_BY_CURRENCY, SupportedCurrency } from '../automation/product-selection-config';
import { UniqueDiscoveredProduct } from './discovery-types';

export interface FilteringResult {
  eligible: UniqueDiscoveredProduct[];
  rejected: {
    product: UniqueDiscoveredProduct;
    reason: string;
  }[];
}

/**
 * Validates whether a unique discovered product meets eligibility constraints.
 */
export function filterProducts(uniqueProducts: UniqueDiscoveredProduct[]): FilteringResult {
  const eligible: UniqueDiscoveredProduct[] = [];
  const rejected: { product: UniqueDiscoveredProduct; reason: string }[] = [];

  for (const item of uniqueProducts) {
    const p = item.product;
    const reasons: string[] = [];

    // 1. Validate externalId
    if (!p.externalId || p.externalId.trim() === '') {
      reasons.push('Missing external ID');
    }

    // 2. Validate title
    if (!p.title || p.title.trim() === '') {
      reasons.push('Missing or empty title');
    }

    // 3. Validate current price and currency safety
    if (!p.price || p.price.amount === undefined) {
      reasons.push('Missing or invalid sale price');
    } else if (p.price.amount <= 0) {
      reasons.push('Missing or invalid sale price');
    } else {
      const currencyUpper = p.price.currency?.toUpperCase();
      const isSupported = currencyUpper === 'USD' || currencyUpper === 'ILS';
      if (!p.price.currency || !isSupported) {
        reasons.push(`Unsupported or unknown currency: "${p.price.currency || 'unknown'}"`);
      } else {
        const rules = PRICE_RULES_BY_CURRENCY[currencyUpper as SupportedCurrency];
        if (p.price.amount > rules.max) {
          const sym = currencyUpper === 'ILS' ? '₪' : '$';
          reasons.push(`Price ${sym}${p.price.amount} exceeds the ${currencyUpper} maximum of ${sym}${rules.max}`);
        }
      }
    }

    // 4. Validate imageUrl
    if (!p.imageUrl || p.imageUrl.trim() === '') {
      reasons.push('Missing image URL');
    }

    // 5. Validate affiliateUrl presence
    if (!p.affiliateUrl || p.affiliateUrl.trim() === '') {
      reasons.push('Missing affiliate URL');
    }

    // 6. Handle productUrl according to the current affiliate-link generation flow
    const isAffiliateUrlGenerated = p.affiliateUrl && (
      p.affiliateUrl.includes('click.aliexpress.com') || 
      p.affiliateUrl.includes('s.click.aliexpress')
    );

    if (!isAffiliateUrlGenerated) {
      if (!p.productUrl || p.productUrl.trim() === '') {
        reasons.push('Missing product URL (needed for affiliate link generation)');
      }
    }

    if (reasons.length > 0) {
      rejected.push({
        product: item,
        reason: reasons.join(', '),
      });
    } else {
      eligible.push(item);
    }
  }

  return { eligible, rejected };
}
