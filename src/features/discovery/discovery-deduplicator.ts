import { DiscoveredProduct, UniqueDiscoveredProduct } from './discovery-types';
import { ProductDiscoveryContext } from '@/features/products/types';
import { discoveryLibraryV2 } from './discovery-config';

/**
 * Deterministically computes the primary context from multiple contexts based on:
 * 1. Category index order in discoveryLibraryV2.categories.
 * 2. Keyword index order in category.keywords.
 * 3. Alphabetical fallback.
 */
export function computePrimaryDiscoveryContext(
  contexts: ProductDiscoveryContext[]
): ProductDiscoveryContext | undefined {
  if (!contexts || contexts.length === 0) return undefined;
  if (contexts.length === 1) return contexts[0];

  const sorted = [...contexts].sort((a, b) => {
    const idxA = discoveryLibraryV2.categories.findIndex(c => c.id === a.categoryId);
    const idxB = discoveryLibraryV2.categories.findIndex(c => c.id === b.categoryId);
    
    const orderA = idxA === -1 ? Infinity : idxA;
    const orderB = idxB === -1 ? Infinity : idxB;
    
    if (orderA !== orderB) {
      return orderA - orderB;
    }
    
    const cat = discoveryLibraryV2.categories[idxA];
    if (cat) {
      const kwIdxA = cat.keywords.indexOf(a.keyword);
      const kwIdxB = cat.keywords.indexOf(b.keyword);
      
      const kwOrderA = kwIdxA === -1 ? Infinity : kwIdxA;
      const kwOrderB = kwIdxB === -1 ? Infinity : kwIdxB;
      
      if (kwOrderA !== kwOrderB) {
        return kwOrderA - kwOrderB;
      }
    }
    
    return a.keyword.localeCompare(b.keyword);
  });
  
  return sorted[0];
}

/**
 * Merges discovered products from all strategies and deduplicates them by source and externalId.
 * If a product is returned by multiple strategies, it merges their discoveryContexts and 
 * computes primaryDiscoveryContext.
 */
export function deduplicateProducts(discoveredProducts: DiscoveredProduct[]): UniqueDiscoveredProduct[] {
  const map = new Map<string, UniqueDiscoveredProduct>();

  for (const dp of discoveredProducts) {
    const key = `${dp.product.source}:${dp.product.externalId}`;
    const existing = map.get(key);

    if (existing) {
      // Prevent duplicate identical origins
      const duplicateOrigin = existing.origins.some(
        (o) =>
          o.strategyType === dp.discovery.strategyType &&
          o.strategyValue === dp.discovery.strategyValue &&
          o.page === dp.discovery.page
      );
      if (!duplicateOrigin) {
        existing.origins.push(dp.discovery);
      }

      // Merge discovery contexts
      if (dp.product.discoveryContexts) {
        if (!existing.product.discoveryContexts) {
          existing.product.discoveryContexts = [];
        }
        for (const newCtx of dp.product.discoveryContexts) {
          const isDup = existing.product.discoveryContexts.some(
            c => c.categoryId === newCtx.categoryId && c.keyword === newCtx.keyword
          );
          if (!isDup) {
            existing.product.discoveryContexts.push(newCtx);
          }
        }
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

  const result = Array.from(map.values());
  for (const item of result) {
    if (item.product.discoveryContexts && item.product.discoveryContexts.length > 0) {
      item.product.primaryDiscoveryContext = computePrimaryDiscoveryContext(item.product.discoveryContexts);
    }
  }

  return result;
}
