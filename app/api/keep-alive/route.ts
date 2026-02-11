import { NextResponse } from 'next/server';
import { createSupabaseAdmin } from '@/lib/supabase';

/**
 * GET /api/keep-alive
 *
 * Performs a minimal read-only database query to keep the Supabase project active
 * (free tier pauses after 7 days of DB inactivity). Intended to be called by a
 * cron job every 3 days. No data is modified.
 */
export async function GET() {
  try {
    const supabase = createSupabaseAdmin();
    const { data, error } = await supabase.rpc('keepalive_ping');

    if (error) {
      console.error('[keep-alive]', error.message);
      return NextResponse.json(
        {
          ok: false,
          error: error.message,
          hint: 'Run the migration in supabase/migrations/20250211000000_keepalive_ping.sql in Supabase Dashboard → SQL Editor.',
        },
        { status: 503 }
      );
    }

    return NextResponse.json({ ok: true, ping: data });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[keep-alive]', message);
    return NextResponse.json({ ok: false, error: message }, { status: 503 });
  }
}
