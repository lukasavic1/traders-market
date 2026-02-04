import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_TRADERS_MARKET_SUPABASE_URL!;
const supabaseServiceKey = process.env.TRADERS_MARKET_SUPABASE_SERVICE_ROLE_KEY!;

/**
 * Server-side Supabase client with service role key.
 * Use only in API routes / server components so the key is never exposed to the client.
 */
export function createSupabaseAdmin() {
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error(
      'Missing NEXT_PUBLIC_TRADERS_MARKET_SUPABASE_URL or TRADERS_MARKET_SUPABASE_SERVICE_ROLE_KEY'
    );
  }
  return createClient(supabaseUrl, supabaseServiceKey);
}

const BUCKET = 'ea-bots';

export const STORAGE = {
  BUCKET,
} as const;
