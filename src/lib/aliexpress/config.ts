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

  if (!appKey || !appSecret || !trackingId) {
    throw new Error(
      `AliExpress configuration error: Missing required environment variables. ` +
      `Ensure ALIEXPRESS_APP_KEY, ALIEXPRESS_APP_SECRET, and ALIEXPRESS_TRACKING_ID are defined.`
    );
  }

  return {
    appKey,
    appSecret,
    trackingId,
    apiUrl,
  };
}
