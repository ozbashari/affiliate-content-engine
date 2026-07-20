import 'server-only';
import { getSupabaseServerClient } from '@/lib/supabase';

export interface DiscoveryRunRecord {
  id: string;
  runAt: string;
  categoryIds: string[];
  keywords: string[];
}

export interface IDiversityRepository {
  getRecentRunHistory(limit: number): Promise<DiscoveryRunRecord[]>;
  getLastPublishedCategory(): Promise<string | null>;
  saveDiscoveryRun(categoryIds: string[], keywords: string[]): Promise<void>;
  savePublishedDiversity(
    productId: string,
    categoryId: string,
    keyword: string,
    productType?: string
  ): Promise<void>;
}

export class SupabaseDiversityRepository implements IDiversityRepository {
  async getRecentRunHistory(limit: number): Promise<DiscoveryRunRecord[]> {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from('discovery_run_history')
      .select('id, run_at, category_ids, keywords')
      .order('run_at', { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error(`Failed to fetch recent runs: ${error.message}`);
    }

    return (data || []).map(row => ({
      id: row.id,
      runAt: row.run_at,
      categoryIds: row.category_ids || [],
      keywords: row.keywords || [],
    }));
  }

  async getLastPublishedCategory(): Promise<string | null> {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from('published_product_diversity')
      .select('category_id')
      .order('published_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      throw new Error(`Failed to fetch last published category: ${error.message}`);
    }

    return data?.category_id || null;
  }

  async saveDiscoveryRun(categoryIds: string[], keywords: string[]): Promise<void> {
    const supabase = getSupabaseServerClient();
    const { error } = await supabase
      .from('discovery_run_history')
      .insert([
        {
          category_ids: categoryIds,
          keywords,
          run_at: new Date().toISOString(),
        },
      ]);

    if (error) {
      throw new Error(`Failed to save discovery run: ${error.message}`);
    }
  }

  async savePublishedDiversity(
    productId: string,
    categoryId: string,
    keyword: string,
    productType?: string
  ): Promise<void> {
    const supabase = getSupabaseServerClient();
    const { error } = await supabase
      .from('published_product_diversity')
      .insert([
        {
          product_id: productId,
          category_id: categoryId,
          keyword,
          product_type: productType || null,
          published_at: new Date().toISOString(),
        },
      ]);

    if (error) {
      throw new Error(`Failed to save published diversity: ${error.message}`);
    }
  }
}
