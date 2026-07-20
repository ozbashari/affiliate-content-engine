import { AliExpressClient, getAliExpressConfig, AliExpressRequestParams } from '@/lib/aliexpress';
import { mapToCatalogProduct } from '@/features/providers/aliexpress/mapper';
import { CatalogProduct } from '@/features/products/types';
import {
  DiscoveryStrategy,
  DiscoveredProduct
} from './discovery-types';
import { deduplicateProducts } from './discovery-deduplicator';
import { filterProducts, FilteringResult } from './discovery-filter';

interface RawProductResponseShape {
  error_response?: {
    msg: string;
    sub_msg?: string;
    sub_code?: string;
  };
  aliexpress_affiliate_product_query_response?: {
    resp_result?: {
      resp_code?: number;
      resp_msg?: string;
      result?: {
        products?: {
          product?: Record<string, unknown> | Array<Record<string, unknown>>;
        };
      };
    };
  };
}

export class DiscoveryService {
  private client: AliExpressClient;
  private requestDelayMs: number;

  constructor(options?: { requestDelayMs?: number }) {
    this.client = new AliExpressClient();
    this.requestDelayMs = options?.requestDelayMs ?? 0;
  }

  /**
   * Runs the provided discovery strategies, merges, deduplicates, and filters candidate products.
   */
  async discover(strategies: DiscoveryStrategy[]): Promise<{
    filteringResult: FilteringResult;
    stats: {
      strategiesExecuted: number;
      apiRequestsMade: number;
      rawProductsCollected: number;
      uniqueProductsAfterDeduplication: number;
      eligibleProductsCount: number;
      rejectedProductsCount: number;
      strategySummaries: {
        strategy: string;
        pagesRequested: number;
        productsCollected: number;
        uniqueProductsContributed: number;
      }[];
    };
  }> {
    const config = getAliExpressConfig();
    const discoveredProducts: DiscoveredProduct[] = [];
    let apiRequestsMade = 0;
    let strategiesExecuted = 0;
    
    const strategySummaries: {
      strategy: string;
      pagesRequested: number;
      productsCollected: number;
      uniqueProductsContributed: number;
    }[] = [];

    const fields = 'product_id,product_title,sale_price,original_price,discount,product_main_image_url,commission_rate,evaluate_rate,product_detail_url,lastest_volume';

    for (const strategy of strategies) {
      let pagesRequested = 0;
      let productsCollectedForStrategy = 0;
      const strategyLabel = strategy.type === 'keyword' 
        ? `keyword "${strategy.keyword}"` 
        : `category "${strategy.categoryId}"`;

      try {
        strategiesExecuted++;
        
        for (let page = 1; page <= strategy.pages; page++) {
          const apiParams: Record<string, string | number | boolean | undefined> = {
            page_no: page,
            page_size: strategy.pageSize,
            target_currency: 'USD',
            target_language: 'EN',
            fields,
            tracking_id: config.trackingId,
            sort: strategy.sort || undefined,
            keywords: strategy.type === 'keyword' ? strategy.keyword : undefined,
            category_ids: strategy.type === 'category' ? strategy.categoryId : undefined,
            ship_to_country: process.env.ALIEXPRESS_SHIP_TO_COUNTRY || undefined,
          };

          // Clean empty or undefined values (do not send empty strings for unused parameters)
          const cleanParams = Object.fromEntries(
            Object.entries(apiParams).filter(([, v]) => v !== undefined && v !== null && v !== '')
          ) as AliExpressRequestParams;

          console.log(`Executing strategy [${strategyLabel}] - Page ${page}...`);
          apiRequestsMade++;
          
          const response = await this.client.execute<RawProductResponseShape>(
            'aliexpress.affiliate.product.query',
            cleanParams
          );

          pagesRequested++;

          const errResp = response?.error_response;
          if (errResp) {
            throw new Error(`AliExpress API error: ${errResp.msg} (${errResp.sub_msg || errResp.sub_code || 'Unknown error'})`);
          }

          const rawProducts = response?.aliexpress_affiliate_product_query_response?.resp_result?.result?.products?.product;

          if (!rawProducts) {
            console.log(`[${strategyLabel}] Page ${page} returned no products. Stopping pagination.`);
            break;
          }

          const list = Array.isArray(rawProducts) ? rawProducts : [rawProducts];
          if (list.length === 0) {
            console.log(`[${strategyLabel}] Page ${page} returned empty list. Stopping pagination.`);
            break;
          }

          for (const rawItem of list) {
            try {
              const catalogProduct = mapToCatalogProduct(rawItem);
              discoveredProducts.push({
                product: catalogProduct,
                discovery: {
                  strategyType: strategy.type,
                  strategyValue: strategy.type === 'keyword' ? strategy.keyword : strategy.categoryId,
                  page,
                },
              });
              productsCollectedForStrategy++;
            } catch (mapError) {
              console.warn(`Failed to map product item on [${strategyLabel}] page ${page}:`, mapError);
              const mockProduct: CatalogProduct = {
                id: `aliexpress_${rawItem?.product_id || 'unknown'}`,
                source: 'aliexpress',
                externalId: String(rawItem?.product_id || ''),
                title: String(rawItem?.product_title || ''),
                imageUrl: String(rawItem?.product_main_image_url || ''),
                productUrl: String(rawItem?.product_detail_url || ''),
                affiliateUrl: String(rawItem?.promotion_link || ''),
                price: { amount: 0, currency: 'USD' },
                status: 'draft',
                createdAt: new Date(),
                updatedAt: new Date()
              };
              discoveredProducts.push({
                product: mockProduct,
                discovery: {
                  strategyType: strategy.type,
                  strategyValue: strategy.type === 'keyword' ? strategy.keyword : strategy.categoryId,
                  page,
                },
              });
            }
          }

          // Stop early if fewer products returned than requested page size
          if (list.length < strategy.pageSize) {
            console.log(`[${strategyLabel}] Page ${page} returned ${list.length} products (less than page size ${strategy.pageSize}). Stopping pagination.`);
            break;
          }

          // Optional delay between requests (defaults to 0)
          if (this.requestDelayMs > 0) {
            await new Promise((resolve) => setTimeout(resolve, this.requestDelayMs));
          }
        }

        strategySummaries.push({
          strategy: strategyLabel,
          pagesRequested,
          productsCollected: productsCollectedForStrategy,
          uniqueProductsContributed: 0,
        });

      } catch (error: unknown) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        console.error(`Strategy failed: [${strategyLabel}]: ${errorMsg}`);
        
        strategySummaries.push({
          strategy: strategyLabel,
          pagesRequested,
          productsCollected: productsCollectedForStrategy,
          uniqueProductsContributed: 0,
        });
      }
    }

    // Deduplicate
    const uniqueProducts = deduplicateProducts(discoveredProducts);

    // Calculate unique products contributed per strategy
    for (const summary of strategySummaries) {
      let contributed = 0;
      for (const item of uniqueProducts) {
        const matchingOrigin = item.origins.some((o) => {
          const typeMatch = o.strategyType === (summary.strategy.startsWith('keyword') ? 'keyword' : 'category');
          return typeMatch && summary.strategy.includes(o.strategyValue);
        });
        if (matchingOrigin) {
          contributed++;
        }
      }
      summary.uniqueProductsContributed = contributed;
    }

    // Filter malformed products
    const filteringResult = filterProducts(uniqueProducts);

    // Fail only if all strategies failed or no eligible products remain
    const hasSuccessfulStrategy = strategySummaries.some((s) => s.productsCollected > 0);
    if (!hasSuccessfulStrategy) {
      throw new Error('Discovery failed: All strategies failed or returned no raw candidates.');
    }
    if (filteringResult.eligible.length === 0) {
      throw new Error('Discovery failed: No eligible candidates remain after filtering.');
    }

    return {
      filteringResult,
      stats: {
        strategiesExecuted,
        apiRequestsMade,
        rawProductsCollected: discoveredProducts.length,
        uniqueProductsAfterDeduplication: uniqueProducts.length,
        eligibleProductsCount: filteringResult.eligible.length,
        rejectedProductsCount: filteringResult.rejected.length,
        strategySummaries,
      },
    };
  }
}
