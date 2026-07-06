import { AliExpressConfig, getAliExpressConfig } from './config';
import { signRequest } from './signer';

export interface AliExpressRequestParams {
  [key: string]: string | number | boolean;
}

export function formatTimestamp(date: Date = new Date()): string {
  const pad = (num: number) => String(num).padStart(2, '0');
  const year = date.getUTCFullYear();
  const month = pad(date.getUTCMonth() + 1);
  const day = pad(date.getUTCDate());
  const hours = pad(date.getUTCHours());
  const minutes = pad(date.getUTCMinutes());
  const seconds = pad(date.getUTCSeconds());
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

export class AliExpressClient {
  private config: AliExpressConfig;

  constructor(customConfig?: Partial<AliExpressConfig>) {
    // Retrieve default config and merge with any custom values passed
    const defaultConfig = getAliExpressConfig();
    this.config = { ...defaultConfig, ...customConfig };
  }

  /**
   * Performs a signed request to the AliExpress Affiliate API.
   * @param method The API method name (e.g., 'aliexpress.affiliate.product.query')
   * @param methodParams Method-specific parameters (e.g., category_id)
   */
  async execute<T>(
    method: string,
    methodParams: AliExpressRequestParams = {}
  ): Promise<T> {
    const config = this.config;

    // Construct request parameters including system parameters
    const systemParams: Record<string, string | number | boolean> = {
      method,
      app_key: config.appKey,
      sign_method: 'md5',
      v: '2.0',
      format: 'json',
      timestamp: formatTimestamp(new Date()),
    };

    const allParams = { ...systemParams, ...methodParams };

    // Generate signature
    const signature = signRequest(allParams, config.appSecret);
    allParams.sign = signature;

    // Build urlencoded body
    const searchParams = new URLSearchParams();
    for (const [key, val] of Object.entries(allParams)) {
      searchParams.append(key, String(val));
    }

    const url = config.apiUrl;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
      body: searchParams.toString(),
    });

    if (!response.ok) {
      throw new Error(`AliExpress API HTTP error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data as T;
  }
}
