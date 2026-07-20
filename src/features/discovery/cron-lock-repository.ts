import 'server-only';
import { getSupabaseServerClient } from '@/lib/supabase';

export interface ICronLockRepository {
  tryAcquire(lockKey: string, ownerId: string, ttlSeconds: number): Promise<boolean>;
  release(lockKey: string, ownerId: string): Promise<boolean>;
}

export class SupabaseCronLockRepository implements ICronLockRepository {
  async tryAcquire(lockKey: string, ownerId: string, ttlSeconds: number): Promise<boolean> {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase.rpc('try_acquire_cron_lock', {
      p_lock_key: lockKey,
      p_owner_id: ownerId,
      p_ttl_seconds: ttlSeconds,
    });

    if (error) {
      throw new Error(`Failed to acquire lock via RPC: ${error.message}`);
    }

    return !!data;
  }

  async release(lockKey: string, ownerId: string): Promise<boolean> {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase.rpc('release_cron_lock', {
      p_lock_key: lockKey,
      p_owner_id: ownerId,
    });

    if (error) {
      throw new Error(`Failed to release lock via RPC: ${error.message}`);
    }

    return !!data;
  }
}
