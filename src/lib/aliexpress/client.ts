import { AliExpressConfig, getAliExpressConfig } from './config';
import { signRequest } from './signer';

export interface AliExpressRequestParams {
  [key: string]: string | number | boolean | undefined;
}

export interface AliExpressProductQueryParams extends AliExpressRequestParams {
  category_ids?: string;
  keywords?: string;
  page_no?: string | number;
  page_size?: string | number;
  sort?: string;
  target_currency?: string;
  target_language?: string;
  ship_to_country?: string;
  tracking_id?: string;
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

export class AliExpressHTTPError extends Error {
  status: number;
  statusText: string;

  constructor(status: number, statusText: string) {
    super(`AliExpress API HTTP error: ${status} ${statusText}`);
    this.status = status;
    this.statusText = statusText;
    this.name = 'AliExpressHTTPError';
  }
}

export class AliExpressClient {
  private config: AliExpressConfig;

  constructor(customConfig?: Partial<AliExpressConfig>) {
    // Retrieve default config and merge with any custom values passed.
    // If required environment variables are missing, this will throw.
    const defaultConfig = getAliExpressConfig();
    this.config = { ...defaultConfig, ...customConfig };
  }

  /**
   * Validates the client configuration. Confirms that:
   * - Configuration is loaded.
   * - Required credentials exist.
   * - The client was initialized successfully.
   * Does NOT call the AliExpress API.
   */
  healthCheck(): { status: 'ok' | 'error'; message: string; config?: Omit<AliExpressConfig, 'appSecret'> } {
    try {
      // Confirm required credentials exist in the loaded configuration
      if (!this.config.appKey || !this.config.appSecret || !this.config.trackingId) {
        throw new Error('AliExpress client configuration is missing required credentials.');
      }

      return {
        status: 'ok',
        message: 'AliExpress client is configured correctly and initialized successfully.',
        config: {
          appKey: this.config.appKey,
          trackingId: this.config.trackingId,
          apiUrl: this.config.apiUrl,
        },
      };
    } catch (error: unknown) {
      return {
        status: 'error',
        message: error instanceof Error ? error.message : String(error),
      };
    }
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

    const allParams: Record<string, string | number | boolean> = {};
    for (const [key, val] of Object.entries({ ...systemParams, ...methodParams })) {
      if (val !== undefined && val !== null) {
        allParams[key] = val;
      }
    }

    // Generate signature
    const signature = signRequest(allParams, config.appSecret);
    allParams.sign = signature;

    // Build urlencoded body
    const searchParams = new URLSearchParams();
    for (const [key, val] of Object.entries(allParams)) {
      searchParams.append(key, String(val));
    }

    const url = config.apiUrl;

    const timeoutSecondsStr = process.env.ALIEXPRESS_REQUEST_TIMEOUT_SECONDS;
    const timeoutSeconds = timeoutSecondsStr ? parseInt(timeoutSecondsStr, 10) : 30;
    const timeoutMs = (isNaN(timeoutSeconds) || timeoutSeconds <= 0 ? 30 : timeoutSeconds) * 1000;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, timeoutMs);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
        },
        body: searchParams.toString(),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new AliExpressHTTPError(response.status, response.statusText);
      }

      const data = await response.json();
      return data as T;
    } catch (error: unknown) {
      clearTimeout(timeoutId);
      throw error;
    }
  }
}
