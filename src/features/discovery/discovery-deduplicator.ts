import { DiscoveredProduct, UniqueDiscoveredProduct } from './discovery-types';

/**
 * Merges discovered products from all strategies and deduplicates them by source and externalId.
 * If a product is returned by multiple strategies, it is represented as a single UniqueDiscoveredProduct
 * containing an array of all its discovery origins.
 */
export function deduplicateProducts(discoveredProducts: DiscoveredProduct[]): UniqueDiscoveredProduct[] {
  const map = new Map<string, UniqueDiscoveredProduct>();

  for (const dp of discoveredProducts) {
    const key = `${dp.product.source}:${dp.product.externalId}`;
    const existing = map.get(key);

    if (existing) {
      // Prevent duplicate identical origins (e.g. same page, strategy type, and strategy value)
      const duplicateOrigin = existing.origins.some(
        (o) =>
          o.strategyType === dp.discovery.strategyType &&
          o.strategyValue === dp.discovery.strategyValue &&
          o.page === dp.discovery.page
      );
      if (!duplicateOrigin) {
        existing.origins.push(dp.discovery);
      }
    } else {
      const uniqueItem: UniqueDiscoveredProduct = {
        product: dp.product,
        origins: [dp.discovery],
      };
      dp.product.origins = uniqueItem.origins;
      map.set(key, uniqueItem);
    }
  }

  return Array.from(map.values());
}
