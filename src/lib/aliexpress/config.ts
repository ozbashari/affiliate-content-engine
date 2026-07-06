export interface AliExpressConfig {
  appKey: string;
  appSecret: string;
  trackingId: string;
  apiUrl: string;
}

export function getAliExpressConfig(): AliExpressConfig {
  const appKey = process.env.ALIEXPRESS_APP_KEY;
  const appSecret = process.env.ALIEXPRESS_APP_SECRET;
  const trackingId = process.env.ALIEXPRESS_TRACKING_ID;
  const apiUrl = process.env.ALIEXPRESS_API_URL || 'https://api-sg.aliexpress.com/sync';

  const missing: string[] = [];
  if (!appKey) missing.push('ALIEXPRESS_APP_KEY');
  if (!appSecret) missing.push('ALIEXPRESS_APP_SECRET');
  if (!trackingId) missing.push('ALIEXPRESS_TRACKING_ID');

  if (missing.length > 0) {
    throw new Error(
      `AliExpress configuration error: Missing required environment variables: ${missing.join(', ')}. ` +
      `Ensure these are defined in your environment (e.g. .env.local).`
    );
  }

  return {
    appKey: appKey!,
    appSecret: appSecret!,
    trackingId: trackingId!,
    apiUrl,
  };
}
