import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Browser Supabase client for the admin panel's direct-to-storage audio upload.
 *
 * The server mints a signed upload URL (service_role), then the browser PUTs the
 * file straight to Supabase Storage instead of proxying through a Next.js
 * serverless function — Vercel caps function request bodies at ~4.5MB, which
 * real podcast episodes easily exceed.
 *
 * Uses the public NEXT_PUBLIC_* anon key (safe to ship to the browser); the
 * upload is authorized by the signed URL token, not by this key.
 */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabaseBrowser: SupabaseClient | null =
  supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;
