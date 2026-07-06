import { NextResponse, NextRequest } from 'next/server';
import { AliExpressClient, getAliExpressConfig } from '@/lib/aliexpress';

export const dynamic = 'force-dynamic';

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

    const debugInfo = {
      method: 'aliexpress.affiliate.product.query',
      params: {
        category_ids: categoryIds,
        page_size: pageSize,
        page_no: pageNo,
        target_currency: targetCurrency,
        target_language: targetLanguage,
        fields: fields,
        tracking_id: config.trackingId,
      }
    };

    const response = await client.execute<unknown>(
      'aliexpress.affiliate.product.query',
      apiParams
    );

    return NextResponse.json({
      debug: debugInfo,
      response
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
