import 'server-only';
import { AliExpressClient, getAliExpressConfig } from '@/lib/aliexpress';
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
    target_currency: 'USD',
    target_language: 'EN',
    fields,
    tracking_id: config.trackingId,
  };

  const response = await client.execute<RawProductResponseShape>(
    'aliexpress.affiliate.product.query',
    apiParams
  );

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
}
