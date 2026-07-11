import { NextResponse, NextRequest } from 'next/server';
import { GeminiProvider } from '@/features/ai/gemini-provider';
import { generateAliExpressAffiliateLink } from '@/lib/aliexpress';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const product = body?.product;

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Missing required field: product' },
        { status: 400 }
      );
    }

    // Generate short affiliate link once. Fall back to existing if it fails.
    if (product.productUrl) {
      try {
        const shortUrl = await generateAliExpressAffiliateLink(product.productUrl);
        product.affiliateUrl = shortUrl;
      } catch (err) {
        console.warn('Failed to generate AliExpress affiliate link, falling back to original URL:', err);
      }
    }

    const provider = new GeminiProvider();
    const result = await provider.generateTelegramPost({ product });

    return NextResponse.json({
      success: true,
      post: result.post,
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
