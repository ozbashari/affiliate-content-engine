import 'server-only';

export interface SupabaseConfig {
  supabaseUrl: string;
  supabaseKey: string;
}

export function getSupabaseConfig(): SupabaseConfig {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url) {
    throw new Error('Supabase configuration error: SUPABASE_URL is missing from environment.');
  }

  if (!key) {
    throw new Error('Supabase configuration error: Both SUPABASE_SECRET_KEY and SUPABASE_SERVICE_ROLE_KEY are missing from environment.');
  }

  return {
    supabaseUrl: url,
    supabaseKey: key,
  };
}
