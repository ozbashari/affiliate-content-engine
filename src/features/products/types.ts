export type ProductSource = 'aliexpress';

export type ProductStatus = 'draft' | 'ready' | 'published' | 'failed';

export interface Money {
  amount: number;
  currency: string;
}

export interface CatalogProduct {
  id: string;
  source: ProductSource;
  externalId: string;
  title: string;
  description?: string;
  imageUrl: string;
  productUrl: string;
  affiliateUrl: string;
  price: Money;
  originalPrice?: Money;
  discountPercent?: number;
  rating?: number;
  salesCount?: number;
  status: ProductStatus;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
}

export type CreateCatalogProductInput = Omit<
  CatalogProduct,
  'id' | 'status' | 'createdAt' | 'updatedAt' | 'publishedAt'
>;
