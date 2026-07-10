import { PublishInput, PublishResult } from './types';

interface TelegramErrorResponse {
  ok: boolean;
  description?: string;
  error_code?: number;
}

interface TelegramMessageResult {
  message_id: number;
}

interface TelegramSuccessResponse {
  ok: boolean;
  result: TelegramMessageResult;
}

export class TelegramPublisher {
  private botToken: string;
  private channelId: string;

  constructor() {
    this.botToken = process.env.TELEGRAM_BOT_TOKEN || '';
    // Support both TELEGRAM_CHANNEL_ID and TELEGRAM_CHAT_ID (for flexibility)
    this.channelId = process.env.TELEGRAM_CHANNEL_ID || process.env.TELEGRAM_CHAT_ID || '';
  }

  /**
   * Helper to perform typed requests to the Telegram Bot API.
   */
  private async sendRequest<T>(methodName: string, payload: Record<string, unknown>): Promise<{ success: boolean; data?: T; error?: string }> {
    const url = `https://api.telegram.org/bot${this.botToken}/${methodName}`;
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data: unknown = await response.json();
      
      if (!response.ok || (data && typeof data === 'object' && 'ok' in data && !(data as { ok: boolean }).ok)) {
        const errorDesc = (data as TelegramErrorResponse)?.description || response.statusText || 'Unknown error';
        return { success: false, error: errorDesc };
      }

      return { success: true, data: data as T };
    } catch (err: unknown) {
      return { success: false, error: err instanceof Error ? err.message : String(err) };
    }
  }

  /**
   * Publishes the generated post text to the target Telegram channel.
   */
  async publish(input: PublishInput): Promise<PublishResult> {
    if (!this.botToken) {
      return { success: false, error: 'Telegram configuration error: Missing TELEGRAM_BOT_TOKEN' };
    }
    if (!this.channelId) {
      return { success: false, error: 'Telegram configuration error: Missing TELEGRAM_CHANNEL_ID' };
    }

    // Validate inputs are non-empty
    if (!input.imageUrl.trim()) {
      return { success: false, error: 'Publishing error: imageUrl is empty' };
    }
    if (!input.post.fullText.trim()) {
      return { success: false, error: 'Publishing error: post.fullText is empty' };
    }
    if (!input.post.affiliateUrl.trim()) {
      return { success: false, error: 'Publishing error: post.affiliateUrl is empty' };
    }

    const inlineKeyboard = {
      inline_keyboard: [
        [
          {
            text: '🛒 לרכישה',
            url: input.post.affiliateUrl,
          },
        ],
      ],
    };

    const isOverLimit = input.post.fullText.length > 1024;

    if (isOverLimit) {
      // Case B: Oversized caption
      // 1. Send the photo first without caption and without inline keyboard.
      const photoResult = await this.sendRequest<TelegramSuccessResponse>('sendPhoto', {
        chat_id: this.channelId,
        photo: input.imageUrl,
      });

      if (!photoResult.success) {
        console.warn(`sendPhoto failed in oversized mode: ${photoResult.error || 'Unknown error'}. Falling back to text-only.`);
        
        // Fall back to sendMessage only (text-fallback)
        const textResult = await this.sendRequest<TelegramSuccessResponse>('sendMessage', {
          chat_id: this.channelId,
          text: input.post.fullText,
          reply_markup: inlineKeyboard,
        });

        if (!textResult.success) {
          return {
            success: false,
            error: `Photo send failed (${photoResult.error || 'unknown error'}) and fallback text send failed: ${textResult.error || 'unknown error'}`,
          };
        }

        return {
          success: true,
          externalId: String(textResult.data?.result.message_id || ''),
          publishType: 'text-fallback',
        };
      }

      // 2. Then send the full text as a separate sendMessage.
      // Attach the inline purchase button only to the text message.
      const textResult = await this.sendRequest<TelegramSuccessResponse>('sendMessage', {
        chat_id: this.channelId,
        text: input.post.fullText,
        reply_markup: inlineKeyboard,
      });

      if (!textResult.success) {
        return {
          success: false,
          error: `Photo sent successfully, but separate text message failed to publish: ${textResult.error || 'unknown error'}`,
        };
      }

      // Return the message ID of the text message as the primary publish result.
      // The photo message ID is returned separately as photoMessageId.
      return {
        success: true,
        externalId: String(textResult.data?.result.message_id || ''),
        photoMessageId: String(photoResult.data?.result.message_id || ''),
        publishType: 'photo-with-text',
      };
    } else {
      // Case A: Normal caption (fits in 1024 limit)
      // Attach the inline purchase button to the photo message.
      const photoResult = await this.sendRequest<TelegramSuccessResponse>('sendPhoto', {
        chat_id: this.channelId,
        photo: input.imageUrl,
        caption: input.post.fullText,
        reply_markup: inlineKeyboard,
      });

      if (!photoResult.success) {
        console.warn(`sendPhoto failed in normal mode: ${photoResult.error || 'Unknown error'}. Falling back to text-only.`);

        // Fall back to sendMessage
        const textResult = await this.sendRequest<TelegramSuccessResponse>('sendMessage', {
          chat_id: this.channelId,
          text: input.post.fullText,
          reply_markup: inlineKeyboard,
        });

        if (!textResult.success) {
          return {
            success: false,
            error: `Photo send failed (${photoResult.error || 'unknown error'}) and fallback text send failed: ${textResult.error || 'unknown error'}`,
          };
        }

        return {
          success: true,
          externalId: String(textResult.data?.result.message_id || ''),
          publishType: 'text-fallback',
        };
      }

      return {
        success: true,
        externalId: String(photoResult.data?.result.message_id || ''),
        publishType: 'photo',
      };
    }
  }
}
