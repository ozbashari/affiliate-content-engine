import { NextResponse, NextRequest } from 'next/server';
import { TelegramPublisher } from '@/features/publishing/telegram-provider';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const post = body?.post;

    if (!post || !post.fullText) {
      return NextResponse.json(
        { success: false, error: 'Missing required field: post' },
        { status: 400 }
      );
    }

    const publisher = new TelegramPublisher();
    const result = await publisher.publish({ post });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      messageId: result.externalId,
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
