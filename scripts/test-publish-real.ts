import fs from 'fs';
import path from 'path';
import { buildTelegramHtmlPost } from '../src/features/publishing/formatter';
import { TelegramPublisher } from '../src/features/publishing/telegram-provider';

// Load env files
function loadEnvFile(fileName: string): void {
  try {
    const envPath = path.join(process.cwd(), fileName);
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf-8');
      for (const line of content.split(/\r?\n/)) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const index = trimmed.indexOf('=');
        if (index > -1) {
          const key = trimmed.slice(0, index).trim();
          const val = trimmed.slice(index + 1).trim();
          const cleanVal = val.replace(/^["']|["']$/g, '');
          if (process.env[key] === undefined) {
            process.env[key] = cleanVal;
          }
        }
      }
    }
  } catch {}
}

loadEnvFile('.env.local');
loadEnvFile('.env');

async function testRealPublish() {
  console.log('--- STARTING REAL TELEGRAM PUBLISH TEST ---\n');
  
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const channelId = process.env.TELEGRAM_CHANNEL_ID || process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !channelId) {
    console.error('❌ Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHANNEL_ID in environment variables.');
    process.exit(1);
  }

  console.log(`Bot Token: ${botToken.substring(0, 10)}...`);
  console.log(`Channel ID: ${channelId}`);

  const affiliateUrl = 'https://s.click.aliexpress.com/e/_dY12345';
  
  // Format HTML post using the new buildTelegramHtmlPost helper
  const formattedPost = buildTelegramHtmlPost({
    headline: 'בדיקת עיצוב HTML לערוץ הטלגרם 🚀',
    body: 'הנה מוצר בדיקה המדגים את העיצוב החדש שלנו בערוץ. כותרת ומחירים מעוצבים כעת ישירות מהקוד באופן אמין!',
    cta: '🏷️ להזמנה בהנחה 👇',
    affiliateUrl,
    price: { amount: 69, currency: 'ILS' },
    originalPrice: { amount: 119, currency: 'ILS' }
  });

  console.log('\n--- Formatted HTML Post String ---');
  console.log(formattedPost);
  console.log('----------------------------------\n');

  console.log('Sending message to Telegram...');
  const publisher = new TelegramPublisher();
  const result = await publisher.publish({
    // Standard test image url
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
    post: {
      headline: 'בדיקת עיצוב HTML לערוץ הטלגרם 🚀',
      body: 'הנה מוצר בדיקה המדגים את העיצוב החדש שלנו בערוץ. כותרת ומחירים מעוצבים כעת ישירות מהקוד באופן אמין!',
      cta: '🏷️ להזמנה בהנחה 👇',
      affiliateUrl,
      telegramPost: formattedPost,
      fullText: formattedPost
    }
  });

  if (result.success) {
    console.log(`\n✅ Successfully published to Telegram!`);
    console.log(`Message ID: ${result.externalId}`);
    console.log(`Publish Type: ${result.publishType}`);
  } else {
    console.error(`\n❌ Failed to publish to Telegram: ${result.error}`);
    process.exit(1);
  }
}

testRealPublish().catch(err => {
  console.error('Fatal error during test:', err);
  process.exit(1);
});
