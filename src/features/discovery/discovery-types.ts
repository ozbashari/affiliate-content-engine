import { CatalogProduct } from '@/features/products/types';

export type KeywordDiscoveryStrategy = {
  type: 'keyword';
  keyword: string;
  pages: number;
  pageSize: number;
  sort?: string;
  categoryId?: string;
  strategyOrder?: number;
};

export type CategoryDiscoveryStrategy = {
  type: 'category';
  categoryId: string;
  label?: string;
  pages: number;
  pageSize: number;
  sort?: string;
  strategyOrder?: number;
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

export interface DiscoveryCategory {
  id: string;
  displayName: string;
  hebrewLabel: string;
  emoji: string;
  description: string;
  weight: number;
  enabled: boolean;
  keywords: string[];
  pages?: number;
  pageSize?: number;
  keywordsPerRun?: number;
  tags?: string[];
}

export interface DiscoveryConfigV2 {
  categories: DiscoveryCategory[];
  categoriesPerRun: number;
  defaultKeywordsPerCategory: number;
}

export interface DiscoveryConfig {
  strategies: DiscoveryStrategy[];
  categories?: DiscoveryCategory[];
}
