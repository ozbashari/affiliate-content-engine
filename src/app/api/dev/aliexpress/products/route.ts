import { NextResponse, NextRequest } from 'next/server';
import { AliExpressClient, getAliExpressConfig } from '@/lib/aliexpress';
import { mapToCatalogProduct } from '@/features/providers/aliexpress/mapper';
import { getPublishedExternalIds } from '@/features/publishing/published-products-repository';
import { CatalogProduct } from '@/features/products/types';

export const dynamic = 'force-dynamic';

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

export async function GET(request: NextRequest) {
  try {
    // Load config to check variables and fetch tracking ID
    const config = getAliExpressConfig();
    const client = new AliExpressClient();

    // Support query overrides or fall back to defaults
    const { searchParams } = new URL(request.url);
    const categoryIds = searchParams.get('category_ids') || '509';
    const pageSize = searchParams.get('page_size') || '10';
    const pageNo = searchParams.get('page_no') || '1';
    const targetCurrency = searchParams.get('target_currency') || 'USD';
    const targetLanguage = searchParams.get('target_language') || 'EN';

    const fields = 'product_id,product_title,sale_price,original_price,discount,product_main_image_url,commission_rate,evaluate_rate,product_detail_url,lastest_volume';

    const apiParams = {
      category_ids: categoryIds,
      page_size: pageSize,
      page_no: pageNo,
      target_currency: targetCurrency,
      target_language: targetLanguage,
      fields: fields,
      tracking_id: config.trackingId,
    };

    const response = await client.execute<RawProductResponseShape>(
      'aliexpress.affiliate.product.query',
      apiParams
    );

    // 1. Check for error_response from AliExpress API.
    const errResp = response?.error_response;
    if (errResp) {
      return NextResponse.json(
        {
          success: false,
          error: `AliExpress API error: ${errResp.msg} (${errResp.sub_msg || errResp.sub_code || 'Unknown error'})`,
        },
        { status: 500 }
      );
    }

    // Extract products
    const rawProducts = response?.aliexpress_affiliate_product_query_response?.resp_result?.result?.products?.product;
    
    let allScannedProducts: CatalogProduct[] = [];
    let mappingFailedCount = 0;

    if (rawProducts) {
      const list = Array.isArray(rawProducts) ? rawProducts : [rawProducts];
      for (const item of list) {
        try {
          if (item && typeof item === 'object') {
            const mapped = mapToCatalogProduct(item);
            allScannedProducts.push(mapped);
          } else {
            mappingFailedCount++;
          }
        } catch (mapError) {
          console.warn('Failed to map AliExpress raw product:', mapError);
          mappingFailedCount++;
        }
      }
    }

    const fetchedCount = allScannedProducts.length;

    // 2. Query published external IDs.
    const externalIds = allScannedProducts.map((p) => p.externalId);
    
    let publishedIds: Set<string>;
    try {
      publishedIds = await getPublishedExternalIds('aliexpress', externalIds);
    } catch (dbError: unknown) {
      const errorMessage = dbError instanceof Error ? dbError.message : String(dbError);
      return NextResponse.json(
        {
          success: false,
          code: 'PUBLISHED_PRODUCTS_LOOKUP_FAILED',
          error: `Failed to retrieve published products tracker: ${errorMessage}`,
        },
        { status: 500 }
      );
    }

    // 3. Filter out matching products.
    const filteredProducts = allScannedProducts.filter((p) => !publishedIds.has(p.externalId));
    
    const unpublishedCount = filteredProducts.length;
    const filteredPublishedCount = fetchedCount - unpublishedCount;

    return NextResponse.json({
      products: filteredProducts,
      meta: {
        fetchedCount,
        unpublishedCount,
        filteredPublishedCount,
        mappingFailedCount,
      },
    });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
