import type { SupabaseClient } from '@supabase/supabase-js';

// The project's public URL and anon key, set in .env (see .env.example). The anon
// key is meant for browsers; what it may read or write is decided by Supabase's
// row level security, not by keeping it secret.
const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

/** False until the Supabase project details are set, so the account page can say so. */
export const accountsReady = Boolean(url && anonKey);

/** Where confirmation and password-reset emails send the visitor back to. */
export const accountUrl = () => `${window.location.origin}${import.meta.env.BASE_URL}account`;

let client: Promise<SupabaseClient> | null = null;

/** The Supabase client, loaded on first use so pages without accounts never download it. */
export function getSupabase() {
  if (!accountsReady) return Promise.reject(new Error('Supabase is not configured'));
  client ??= import('@supabase/supabase-js').then(({ createClient }) => createClient(url!, anonKey!));
  return client;
}
