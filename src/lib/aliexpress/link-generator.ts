import { AliExpressClient } from './client';
import { getAliExpressConfig } from './config';

export interface AliExpressLinkGenerateResponse {
  aliexpress_affiliate_link_generate_response?: {
    resp_result?: {
      resp_code?: number;
      resp_msg?: string;
      result?: {
        total_count?: number;
        promotion_links?: {
          promotion_link?: Array<{
            promotion_link?: string;
            source_value: string;
            message?: string;
          }>;
        };
      };
    };
  };
}

/**
 * Generates an AliExpress affiliate link for a given product URL.
 * Uses method: aliexpress.affiliate.link.generate
 * 
 * @param productUrl The original AliExpress product URL to convert
 * @returns The generated affiliate URL
 */
export async function generateAliExpressAffiliateLink(productUrl: string): Promise<string> {
  const config = getAliExpressConfig();
  const client = new AliExpressClient();

  const response = await client.execute<AliExpressLinkGenerateResponse>(
    'aliexpress.affiliate.link.generate',
    {
      source_values: productUrl,
      promotion_link_type: '0',
      tracking_id: config.trackingId,
    }
  );

  const resultObj = response.aliexpress_affiliate_link_generate_response?.resp_result;
  
  if (!resultObj) {
    throw new Error('AliExpress Affiliate Link generation returned an empty response.');
  }

  if (resultObj.resp_code !== 200) {
    throw new Error(
      `AliExpress Affiliate Link generation failed (code ${resultObj.resp_code}): ${resultObj.resp_msg || 'Unknown error'}`
    );
  }

  const links = resultObj.result?.promotion_links?.promotion_link;
  if (!links || links.length === 0) {
    throw new Error('No promotion links returned by AliExpress.');
  }

  const linkInfo = links[0];
  if (!linkInfo.promotion_link) {
    throw new Error(
      `AliExpress failed to generate affiliate link: ${linkInfo.message || 'Product is restricted or invalid.'}`
    );
  }

  return linkInfo.promotion_link;
}
