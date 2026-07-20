import { NextResponse, NextRequest } from 'next/server';
import { generateAliExpressAffiliateLink } from '@/lib/aliexpress';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');

    if (!url) {
      return NextResponse.json(
        {
          success: false,
          error: 'Query parameter "url" is required.',
        },
        { status: 400 }
      );
    }

    const generatedAffiliateUrl = await generateAliExpressAffiliateLink(url);

    return NextResponse.json({
      sourceUrl: url,
      generatedAffiliateUrl,
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
