import { createClient } from '@supabase/supabase-js';

/**
 * Browser Supabase client using the publishable key.
 * Use only in Client Components — safe to expose to the browser.
 *
 * Requires NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.
 * Add these to .env.local when you need client-side Supabase (e.g. Auth, Realtime).
 *
 * For database access, prefer server-side: createSupabaseAdmin() in Server Actions.
 *
 * @see https://supabase.com/docs/reference/javascript/introduction
 * @see https://supabase.com/docs/guides/auth/server-side/nextjs
 */
export function createSupabaseBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) {
    throw new Error(
      'Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY. ' +
        'Add them to .env.local for client-side Supabase (Auth, Realtime).'
    );
  }
  return createClient(url, key);
}
