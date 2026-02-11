-- Keep-alive ping for Supabase free tier (prevents project pause after 7 days inactivity).
-- Read-only, no side effects. Run this once in Supabase Dashboard → SQL Editor, or via: supabase db push

create or replace function public.keepalive_ping()
returns int
language sql
security definer
set search_path = public
as $$
  select 1;
$$;

comment on function public.keepalive_ping() is 'Lightweight read-only ping for keep-alive; used by /api/keep-alive cron.';
