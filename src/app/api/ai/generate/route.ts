import { NextResponse, NextRequest } from 'next/server';
import { GeminiProvider } from '@/features/ai/gemini-provider';

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
