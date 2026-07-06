import crypto from 'crypto';

/**
 * Signs the request parameters for Taobao Open Platform / AliExpress Affiliate API.
 * The signature algorithm (MD5):
 * 1. Sort all parameter keys alphabetically.
 * 2. Concatenate key-value pairs without any separator: key1value1key2value2...
 * 3. Prepend and append the appSecret: appSecret + concatenatedString + appSecret
 * 4. Compute MD5 hash and convert to uppercase hex.
 */
export function signRequest(params: Record<string, string | number | boolean>, appSecret: string): string {
  const sortedKeys = Object.keys(params).sort();
  let parameterString = '';
  for (const key of sortedKeys) {
    const value = params[key];
    if (value !== undefined && value !== null) {
      parameterString += `${key}${value}`;
    }
  }

  const signString = `${appSecret}${parameterString}${appSecret}`;
  return crypto.createHash('md5').update(signString, 'utf8').digest('hex').toUpperCase();
}
