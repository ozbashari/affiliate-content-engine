import 'server-only';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { getSupabaseConfig } from './config';

let clientInstance: SupabaseClient | null = null;

export function getSupabaseServerClient(): SupabaseClient {
  if (clientInstance) {
    return clientInstance;
  }

  const { supabaseUrl, supabaseKey } = getSupabaseConfig();

  clientInstance = createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });

  return clientInstance;
}
