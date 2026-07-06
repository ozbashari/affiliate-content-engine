import { CatalogProduct } from '@/features/products/types';

export type ProductProviderName = 'aliexpress';

export interface ProductScanFilters {
  minRating?: number;
  minSalesCount?: number;
  minDiscountPercent?: number;
  minCommissionRate?: number;
}

export interface ProductScanInput {
  categoryId: string;
  limit?: number;
  filters?: ProductScanFilters;
}

export interface ProductScanResult {
  products: CatalogProduct[];
  scannedAt: Date;
  provider: ProductProviderName;
}

export interface ProductProvider {
  name: ProductProviderName;
  scanByCategory(input: ProductScanInput): Promise<ProductScanResult>;
}
