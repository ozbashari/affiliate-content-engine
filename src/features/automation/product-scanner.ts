import 'server-only';
import { AliExpressClient, getAliExpressConfig, AliExpressHTTPError } from '@/lib/aliexpress';
import { mapToCatalogProduct } from '@/features/providers/aliexpress/mapper';
import { getPublishedExternalIds } from '@/features/publishing/published-products-repository';
import { CatalogProduct } from '@/features/products/types';

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

function isRetryableError(error: unknown): boolean {
  if (error instanceof AliExpressHTTPError) {
    const status = error.status;
    return [429, 500, 502, 503, 504].includes(status);
  }

  if (error instanceof Error) {
    if (error.name === 'AbortError') {
      return true;
    }
    const message = error.message.toLowerCase();
    if (
      message.includes('fetch failed') ||
      message.includes('network') ||
      message.includes('econnreset') ||
      message.includes('etimedout') ||
      message.includes('econnrefused') ||
      message.includes('enotfound')
    ) {
      return true;
    }
  }

  return false;
}

export async function scanUnpublishedProducts(input: {
  categoryId: string;
  pageSize: number;
}): Promise<CatalogProduct[]> {
  const config = getAliExpressConfig();
  const client = new AliExpressClient();

  const fields = 'product_id,product_title,sale_price,original_price,discount,product_main_image_url,commission_rate,evaluate_rate,product_detail_url,lastest_volume';

  const apiParams = {
    category_ids: input.categoryId,
    page_size: input.pageSize,
    page_no: '1',
    target_currency: 'ILS',
    target_language: 'EN',
    fields,
    tracking_id: config.trackingId,
  };

  const maxAttempts = 3;
  const delays = [2000, 5000];
  let lastError: unknown;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const response = await client.execute<RawProductResponseShape>(
        'aliexpress.affiliate.product.query',
        apiParams
      );

      if (attempt > 1) {
        console.log(`AliExpress scan succeeded on attempt ${attempt}/${maxAttempts}.`);
      }

      const errResp = response?.error_response;
      if (errResp) {
        throw new Error(`AliExpress API error: ${errResp.msg} (${errResp.sub_msg || errResp.sub_code || 'Unknown error'})`);
      }

      const rawProducts = response?.aliexpress_affiliate_product_query_response?.resp_result?.result?.products?.product;

      const allScannedProducts: CatalogProduct[] = [];
      if (rawProducts) {
        const list = Array.isArray(rawProducts) ? rawProducts : [rawProducts];
        for (const item of list) {
          try {
            if (item && typeof item === 'object') {
              const mapped = mapToCatalogProduct(item);
              allScannedProducts.push(mapped);
            }
          } catch (mapError) {
            console.warn('Failed to map AliExpress raw product during scan:', mapError);
          }
        }
      }

      if (allScannedProducts.length === 0) {
        return [];
      }

      const externalIds = allScannedProducts.map((p) => p.externalId);
      const publishedIds = await getPublishedExternalIds('aliexpress', externalIds);

      return allScannedProducts.filter((p) => !publishedIds.has(p.externalId));

    } catch (error: unknown) {
      lastError = error;
      const errorMessage = error instanceof Error ? error.message : String(error);

      if (attempt < maxAttempts && isRetryableError(error)) {
        const delay = delays[attempt - 1] || 2000;
        console.log(`AliExpress scan attempt ${attempt}/${maxAttempts} failed: ${errorMessage}`);
        console.log(`Retrying in ${delay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      } else {
        throw error;
      }
    }
  }

  throw lastError || new Error('Unknown error during AliExpress product query');
}
