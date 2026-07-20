import { CatalogProduct } from '@/features/products/types';

export type KeywordDiscoveryStrategy = {
  type: 'keyword';
  keyword: string;
  pages: number;
  pageSize: number;
  sort?: string;
};

export type CategoryDiscoveryStrategy = {
  type: 'category';
  categoryId: string;
  label?: string;
  pages: number;
  pageSize: number;
  sort?: string;
};

export type DiscoveryStrategy = KeywordDiscoveryStrategy | CategoryDiscoveryStrategy;

export interface DiscoveryOrigin {
  strategyType: 'keyword' | 'category';
  strategyValue: string;
  page: number;
}

export interface DiscoveredProduct {
  product: CatalogProduct;
  discovery: DiscoveryOrigin;
}

export interface UniqueDiscoveredProduct {
  product: CatalogProduct;
  origins: DiscoveryOrigin[];
}

export interface DiscoveryConfig {
  strategies: DiscoveryStrategy[];
}
