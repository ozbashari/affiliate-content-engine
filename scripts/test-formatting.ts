/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import assert from 'assert';
import { 
  escapeHtml, 
  buildTelegramHtmlPost, 
  stripTelegramHtml, 
  isTelegramHtmlParseError 
} from '../src/features/publishing/formatter';
import { TelegramPublisher } from '../src/features/publishing/telegram-provider';
import { GeneratedPost } from '../src/features/ai/types';
import { CatalogProduct } from '../src/features/products/types';

// Simple test runner helper
let testsRun = 0;
let testsPassed = 0;

function test(name: string, fn: () => void | Promise<void>) {
  testsRun++;
  console.log(`Running test: ${name}...`);
  try {
    const result = fn();
    if (result instanceof Promise) {
      // We will handle async tests sequentially below
    } else {
      testsPassed++;
      console.log(`✅ Passed: ${name}\n`);
    }
  } catch (err) {
    console.error(`❌ Failed: ${name}`);
    console.error(err);
    console.log();
  }
}

async function runAsyncTest(name: string, fn: () => Promise<void>) {
  testsRun++;
  console.log(`Running async test: ${name}...`);
  try {
    await fn();
    testsPassed++;
    console.log(`✅ Passed: ${name}\n`);
  } catch (err) {
    console.error(`❌ Failed: ${name}`);
    console.error(err);
    console.log();
  }
}

console.log('--- STARTING TELEGRAM FORMATTING TESTS ---\n');

// 1. Headline is bold
test('1. Headline is bold', () => {
  const post = buildTelegramHtmlPost({
    headline: 'Great Deal',
    body: 'Product description',
    cta: 'Buy Now',
    affiliateUrl: 'https://s.click.aliexpress.com/e/123',
    price: { amount: 69, currency: 'ILS' }
  });
  assert.ok(post.includes('<b>Great Deal</b>'), 'Headline must be wrapped in <b> tags');
});

// 2. Current price is bold
test('2. Current price is bold', () => {
  const post = buildTelegramHtmlPost({
    headline: 'Great Deal',
    body: 'Product description',
    cta: 'Buy Now',
    affiliateUrl: 'https://s.click.aliexpress.com/e/123',
    price: { amount: 69, currency: 'ILS' }
  });
  assert.ok(post.includes('<b>₪69</b>'), 'Current price must be wrapped in <b> tags');
});

// 3. Original price is strikethrough only when verified and formatted RTL-safe
test('3. Original price is strikethrough only when verified and formatted RTL-safe', () => {
  // Case: verified and valid original price (> sale price)
  const post = buildTelegramHtmlPost({
    headline: 'Great Deal',
    body: 'Product description',
    cta: 'Buy Now',
    affiliateUrl: 'https://s.click.aliexpress.com/e/123',
    price: { amount: 69, currency: 'ILS' },
    originalPrice: { amount: 119, currency: 'ILS' }
  });
  assert.ok(post.includes('<b>₪69</b>'), 'Current price must be wrapped in <b> tags');
  assert.ok(post.includes('<s>₪119</s>'), 'Original price must be wrapped in <s> tags');
  assert.ok(post.includes('במקום'), 'Hebrew "במקום" must appear in the discount price line');
  assert.ok(!post.includes('→'), 'No arrow character should exist in the discount price line');
  assert.ok(post.indexOf('<b>₪69</b>') < post.indexOf('<s>₪119</s>'), 'Current price must appear before original price');

  // Verify plain-text fallback renders correctly without HTML artifacts
  const plainText = stripTelegramHtml(post);
  assert.ok(plainText.includes('₪69 במקום ₪119'), 'Plain-text fallback should contain the correct discount statement');
  assert.ok(!plainText.includes('<'), 'Plain-text fallback must not contain HTML tags');

  // Case: different currencies (should omit original price)
  const postDiffCur = buildTelegramHtmlPost({
    headline: 'Great Deal',
    body: 'Product description',
    cta: 'Buy Now',
    affiliateUrl: 'https://s.click.aliexpress.com/e/123',
    price: { amount: 69, currency: 'ILS' },
    originalPrice: { amount: 119, currency: 'USD' }
  });
  assert.ok(!postDiffCur.includes('<s>'), 'Should omit original price when currencies do not match');
  assert.ok(postDiffCur.includes('💰 <b>₪69</b>'), 'Fallback normal price layout missing on currency mismatch');

  // Case: original price <= sale price (invalid discount, should not show original price)
  const postInvalid = buildTelegramHtmlPost({
    headline: 'Great Deal',
    body: 'Product description',
    cta: 'Buy Now',
    affiliateUrl: 'https://s.click.aliexpress.com/e/123',
    price: { amount: 69, currency: 'ILS' },
    originalPrice: { amount: 50, currency: 'ILS' }
  });
  assert.ok(!postInvalid.includes('<s>'), 'Should not show <s> for invalid lower original price');
  assert.ok(postInvalid.includes('💰 <b>₪69</b>'), 'Fallback normal price layout missing');
});

// 4. No original price -> no <s> tag
test('4. No original price -> no <s> tag', () => {
  const post = buildTelegramHtmlPost({
    headline: 'Great Deal',
    body: 'Product description',
    cta: 'Buy Now',
    affiliateUrl: 'https://s.click.aliexpress.com/e/123',
    price: { amount: 69, currency: 'ILS' }
  });
  assert.ok(!post.includes('<s>'), 'Post should not contain <s> tag');
  assert.ok(post.includes('💰 <b>₪69</b>'), 'Post should contain 💰 emoji and bold price');
});

// 5. Product/model text containing &, < or > is escaped safely
test('5. Product/model text containing &, < or > is escaped safely', () => {
  const post = buildTelegramHtmlPost({
    headline: 'Phone & Charger < Best > Deal',
    body: 'Text with <tag> & other things > than expected',
    cta: 'Click & Buy',
    affiliateUrl: 'https://s.click.aliexpress.com/e/123',
    price: { amount: 69, currency: 'ILS' }
  });
  
  // Tags generated by our formatter should be intact, but values should be escaped
  assert.ok(post.includes('<b>Phone &amp; Charger &lt; Best &gt; Deal</b>'), 'Headline characters not escaped correctly');
  assert.ok(post.includes('Text with &lt;tag&gt; &amp; other things &gt; than expected'), 'Body characters not escaped correctly');
  assert.ok(post.includes('Click &amp; Buy'), 'CTA characters not escaped correctly');
});

// 6. Affiliate URL remains raw and final
test('6. Affiliate URL remains raw and final', () => {
  const affiliateUrl = 'https://s.click.aliexpress.com/e/123';
  const post = buildTelegramHtmlPost({
    headline: 'Deal',
    body: 'Desc',
    cta: 'Buy',
    affiliateUrl,
    price: { amount: 69, currency: 'ILS' }
  });
  
  const lines = post.split('\n');
  const lastLine = lines[lines.length - 1];
  assert.strictEqual(lastLine, affiliateUrl, 'Affiliate URL must be the exact raw string on the last line');
});

// 7. Gemini output containing literal HTML-like text cannot inject Telegram tags
test('7. Gemini output containing literal HTML-like text cannot inject Telegram tags', () => {
  const post = buildTelegramHtmlPost({
    headline: 'Headline <b>Inject</b>',
    body: 'Body <s class="malicious">inject</s>',
    cta: 'CTA',
    affiliateUrl: 'https://s.click.aliexpress.com/e/123',
    price: { amount: 69, currency: 'ILS' }
  });

  // The <b> and <s> tags written by Gemini must be escaped to &lt; and &gt;
  assert.ok(post.includes('Headline &lt;b&gt;Inject&lt;/b&gt;'), 'Gemini literal HTML tags in headline not escaped');
  assert.ok(post.includes('Body &lt;s class="malicious"&gt;inject&lt;/s&gt;'), 'Gemini literal HTML tags in body not escaped');
  
  // The outer headline bold tag generated by our application should still be valid HTML
  assert.ok(post.startsWith('<b>Headline &lt;b&gt;Inject&lt;/b&gt;</b>'), 'Outer formatter tag corrupted or missing');
});

// Mock environment for async Telegram publisher testing
const originalFetch = globalThis.fetch;

async function setupAsyncPublisherTests() {
  process.env.TELEGRAM_BOT_TOKEN = 'mock-bot-token';
  process.env.TELEGRAM_CHANNEL_ID = 'mock-channel-id';

  const mockProduct: CatalogProduct = {
    id: '123',
    source: 'aliexpress',
    externalId: 'ext-123',
    title: 'Test Product',
    imageUrl: 'https://example.com/image.jpg',
    productUrl: 'https://example.com/product',
    affiliateUrl: 'https://s.click.aliexpress.com/e/123',
    price: { amount: 69, currency: 'ILS' },
    status: 'ready',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  // 8. HTML parse failure triggers exactly one plain-text fallback
  await runAsyncTest('8. HTML parse failure triggers exactly one plain-text fallback', async () => {
    let callCount = 0;
    const payloadsSent: any[] = [];

    globalThis.fetch = async (url: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
      callCount++;
      const body = JSON.parse(init?.body as string);
      payloadsSent.push(body);

      if (callCount === 1) {
        // Return HTML parse error on first attempt
        return new Response(
          JSON.stringify({ ok: false, description: "Bad Request: can't parse entities: can't find end tag" }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
      // Return success on plain text fallback attempt
      return new Response(
        JSON.stringify({ ok: true, result: { message_id: 9999 } }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    };

    const publisher = new TelegramPublisher();
    const formattedPostText = buildTelegramHtmlPost({
      headline: 'Phone & Charger',
      body: 'Product description with <unclosed tag',
      cta: 'Buy Now',
      affiliateUrl: 'https://s.click.aliexpress.com/e/123',
      price: { amount: 69, currency: 'ILS' }
    });

    const result = await publisher.publish({
      imageUrl: mockProduct.imageUrl,
      post: {
        headline: 'Phone & Charger',
        body: 'Product description with <unclosed tag',
        cta: 'Buy Now',
        affiliateUrl: mockProduct.affiliateUrl,
        telegramPost: formattedPostText,
        fullText: formattedPostText
      }
    });

    assert.strictEqual(callCount, 2, 'Should have triggered exactly two API requests (initial HTML + plain text fallback)');
    assert.strictEqual(result.success, true, 'Fallback publish should report success');
    assert.strictEqual(result.externalId, '9999', 'Success externalId should match mocked second call');

    // First attempt payload checks
    assert.strictEqual(payloadsSent[0].parse_mode, 'HTML', 'First attempt must use HTML parse mode');
    assert.ok(payloadsSent[0].caption.includes('<b>Phone &amp; Charger</b>'), 'First attempt caption must have HTML tags');

    // Second attempt fallback payload checks
    assert.strictEqual(payloadsSent[1].parse_mode, undefined, 'Second attempt must not send parse_mode');
    assert.ok(!payloadsSent[1].caption.includes('<b>'), 'Second attempt caption must not have HTML tags');
    assert.ok(payloadsSent[1].caption.includes('Phone & Charger'), 'Second attempt must decode HTML entities back to raw text');
  });

  // 9. Non-HTML Telegram failure does not trigger duplicate send
  await runAsyncTest('9. Non-HTML Telegram failure does not trigger duplicate send', async () => {
    let callCount = 0;
    const payloadsSent: any[] = [];

    globalThis.fetch = async (url: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
      callCount++;
      const body = JSON.parse(init?.body as string);
      payloadsSent.push(body);
      return new Response(
        JSON.stringify({ ok: false, description: 'Bad Request: chat not found' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    };

    const publisher = new TelegramPublisher();
    const formattedPostText = buildTelegramHtmlPost({
      headline: 'Headline',
      body: 'Body',
      cta: 'CTA',
      affiliateUrl: 'https://s.click.aliexpress.com/e/123',
      price: { amount: 69, currency: 'ILS' }
    });

    const result = await publisher.publish({
      imageUrl: mockProduct.imageUrl,
      post: {
        headline: 'Headline',
        body: 'Body',
        cta: 'CTA',
        affiliateUrl: mockProduct.affiliateUrl,
        telegramPost: formattedPostText,
        fullText: formattedPostText
      }
    });

    // It will make 2 calls because sendPhoto fails, triggering fallback to sendMessage.
    // However, neither call should be a plain-text formatting retry (both must have parse_mode: 'HTML').
    assert.strictEqual(callCount, 2, 'Should have made exactly 2 first-attempt calls (sendPhoto and fallback sendMessage)');
    assert.strictEqual(payloadsSent[0].parse_mode, 'HTML', 'First sendPhoto attempt must use HTML parse_mode');
    assert.strictEqual(payloadsSent[1].parse_mode, 'HTML', 'Fallback sendMessage attempt must use HTML parse_mode');
    assert.strictEqual(result.success, false, 'Publish should report failure');
    assert.ok(result.error?.includes('chat not found'), 'Error description mismatch');
  });

  // 10. Photo and text publishing both use the same safe formatting behavior
  await runAsyncTest('10. Photo and text publishing both use the same safe formatting behavior', async () => {
    let callCount = 0;
    const payloadsSent: any[] = [];

    globalThis.fetch = async (url: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
      callCount++;
      const body = JSON.parse(init?.body as string);
      payloadsSent.push(body);

      // Trigger entity parse error for both photo and text message calls
      return new Response(
        JSON.stringify({ ok: false, description: "Bad Request: can't parse entities" }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    };

    const publisher = new TelegramPublisher();
    
    // Oversized post (> 1024 characters) to trigger Case B (photo first, then separate sendMessage text block)
    // We add "&" to the headline to verify HTML entity unescaping on retry
    const longBodyText = 'A'.repeat(1100);
    const longFormattedPost = buildTelegramHtmlPost({
      headline: 'Headline & Co',
      body: longBodyText,
      cta: 'CTA',
      affiliateUrl: 'https://s.click.aliexpress.com/e/123',
      price: { amount: 69, currency: 'ILS' }
    });

    const result = await publisher.publish({
      imageUrl: mockProduct.imageUrl,
      post: {
        headline: 'Headline & Co',
        body: longBodyText,
        cta: 'CTA',
        affiliateUrl: mockProduct.affiliateUrl,
        telegramPost: longFormattedPost,
        fullText: longFormattedPost
      }
    });

    // In Case B, we try sendPhoto first (no caption). It fails with entity error (mocked).
    // If sendPhoto fails, it falls back to text-only sendMessage (using HTML, which fails),
    // which then retries with plain text fallback.
    // Total calls = 3.
    assert.strictEqual(callCount, 3, 'Oversized text publish with entity errors should call API 3 times');
    assert.strictEqual(payloadsSent[1].parse_mode, 'HTML', 'Oversized text first attempt must be HTML');
    assert.strictEqual(payloadsSent[2].parse_mode, undefined, 'Oversized text retry must be plain text fallback');
    assert.ok(!payloadsSent[2].text.includes('<b>'), 'Oversized text retry must have tags stripped');
    assert.ok(payloadsSent[2].text.includes('&'), 'Oversized text retry must restore entities');
  });


  // Restore fetch
  globalThis.fetch = originalFetch;
}

setupAsyncPublisherTests().then(() => {
  console.log('--- TELEGRAM FORMATTING TESTS SUMMARY ---');
  console.log(`Total tests run: ${testsRun}`);
  console.log(`Passed: ${testsPassed}/${testsRun}`);
  if (testsPassed === testsRun) {
    console.log('🎉 ALL TESTS PASSED SUCCESSFULLY! 🎉');
    process.exit(0);
  } else {
    console.error('❌ SOME TESTS FAILED! ❌');
    process.exit(1);
  }
});
