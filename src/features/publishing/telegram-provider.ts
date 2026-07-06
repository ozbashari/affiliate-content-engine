import { PublishInput, PublishResult } from './types';

export class TelegramPublisher {
  private botToken: string;
  private channelId: string;

  constructor() {
    this.botToken = process.env.TELEGRAM_BOT_TOKEN || '';
    // Support both TELEGRAM_CHANNEL_ID and TELEGRAM_CHAT_ID (for flexibility)
    this.channelId = process.env.TELEGRAM_CHANNEL_ID || process.env.TELEGRAM_CHAT_ID || '';
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

    try {
      const url = `https://api.telegram.org/bot${this.botToken}/sendMessage`;
      const payload = {
        chat_id: this.channelId,
        text: input.post.fullText,
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        const errorMsg = data?.description || response.statusText || 'Unknown Telegram API error';
        return {
          success: false,
          error: `Telegram API error: ${errorMsg}`,
        };
      }

      return {
        success: true,
        externalId: String(data?.result?.message_id || ''),
      };
    } catch (err: any) {
      return {
        success: false,
        error: err instanceof Error ? err.message : String(err),
      };
    }
  }
}
