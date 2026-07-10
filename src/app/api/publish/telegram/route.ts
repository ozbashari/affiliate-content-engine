import { NextResponse, NextRequest } from 'next/server';
import { TelegramPublisher } from '@/features/publishing/telegram-provider';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json();
    
    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { success: false, error: 'Invalid request body' },
        { status: 400 }
      );
    }

    const { post, imageUrl } = body as { post?: { fullText?: string; affiliateUrl?: string; title?: string; body?: string; hashtags?: string[]; cta?: string }; imageUrl?: string };

    if (!post || !post.fullText) {
      return NextResponse.json(
        { success: false, error: 'Missing required field: post' },
        { status: 400 }
      );
    }

    if (!imageUrl) {
      return NextResponse.json(
        { success: false, error: 'Missing required field: imageUrl' },
        { status: 400 }
      );
    }

    const publisher = new TelegramPublisher();
    const result = await publisher.publish({
      post: {
        title: post.title || '',
        body: post.body || '',
        hashtags: post.hashtags || [],
        cta: post.cta || '',
        affiliateUrl: post.affiliateUrl || '',
        fullText: post.fullText,
      },
      imageUrl,
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      messageId: result.externalId,
      publishType: result.publishType,
      photoMessageId: result.photoMessageId,
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
