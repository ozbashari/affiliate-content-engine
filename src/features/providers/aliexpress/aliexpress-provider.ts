import { ProductProvider, ProductScanInput, ProductScanResult } from '../types';

export const aliExpressProvider: ProductProvider = {
  name: 'aliexpress',

  async scanByCategory(input: ProductScanInput): Promise<ProductScanResult> {
    throw new Error('AliExpress category scan is not implemented yet');
  }
};
