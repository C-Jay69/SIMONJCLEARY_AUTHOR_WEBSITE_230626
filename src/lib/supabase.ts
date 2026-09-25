import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Supabase client for subscriber sync.
 *
 * Set these in .env to enable cloud sync of newsletter signups:
 *   SUPABASE_URL=https://your-project.supabase.co
 *   SUPABASE_ANON_KEY=your-anon-key
 *
 * If not set, the client is null and the app falls back to local SQLite only.
 * Subscribers are ALWAYS saved to the local SQLite database regardless.
 */

const url = process.env.SUPABASE_URL;
const anonKey = process.env.SUPABASE_ANON_KEY;

export const supabase: SupabaseClient | null =
  url && anonKey ? createClient(url, anonKey) : null;

export const isSupabaseConfigured = Boolean(url && anonKey);

/**
 * Server-side Supabase client using the service_role key.
 *
 * Used only by admin routes (podcast upload staging / cleanup) so storage
 * writes bypass RLS policies. Throws when SUPABASE_URL or
 * SUPABASE_SERVICE_ROLE_KEY is missing, so routes can return a clean error.
 *
 * Never import this from a client component — the service_role key must stay
 * server-only.
 */
export function createServerSupabase(): SupabaseClient {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) {
    throw new Error(
      "Supabase storage is not configured (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY missing)."
    );
  }
  return createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/** Storage bucket for podcast audio files. */
export function getStorageBucket(): string {
  return process.env.SUPABASE_STORAGE_BUCKET || "simonjcleary-assets";
}

/**
 * SQL to run in the Supabase SQL Editor to create the subscribers table:
 *
 *   create table if not exists public.subscribers (
 *     id uuid primary key default gen_random_uuid(),
 *     email text unique not null,
 *     name text,
 *     source text default 'website',
 *     created_at timestamptz default now()
 *   );
 *
 *   -- Enable Row Level Security
 *   alter table public.subscribers enable row level security;
 *
 *   -- Allow anonymous inserts (for the newsletter signup)
 *   create policy "Allow anon inserts" on public.subscribers
 *     for insert to anon with check (true);
 *
 *   -- Allow anon to read only their own email (for dedup check)
 *   create policy "Allow anon select" on public.subscribers
 *     for select to anon using (true);
 */
