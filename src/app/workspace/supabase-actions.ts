'use server';

import { createSupabaseAdmin } from '@/lib/supabase-server';

function getConnectionHint(error: { message?: string; code?: string }): string | null {
  const msg = (error?.message ?? '').toLowerCase();
  if (msg.includes('invalid api key') || msg.includes('jwt') || msg.includes('apikey')) {
    return 'Use SUPABASE_SERVICE_ROLE_KEY (secret key), not the publishable key. Dashboard → Settings → API.';
  }
  if (msg.includes('relation') && msg.includes('does not exist')) {
    return 'Run migrations: npx supabase db push --linked';
  }
  if (msg.includes('new row violates row-level security') || msg.includes('rls')) {
    return 'Use SUPABASE_SERVICE_ROLE_KEY (bypasses RLS), not the publishable key.';
  }
  return null;
}

export type SupabaseTestResult =
  | { ok: true; id: string }
  | { ok: false; error: string };

/**
 * Test Supabase connection: insert a row into uploads and return its id.
 * Requires uploads table and env vars SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY.
 */
export async function testSupabaseConnection(): Promise<SupabaseTestResult> {
  try {
    const supabase = createSupabaseAdmin();
    const sessionId = crypto.randomUUID();
    const { data, error } = await supabase
      .from('uploads')
      .insert({
        session_id: sessionId,
        filename: 'connection-test.txt',
        extracted_text: 'Test row from Next.js',
        language: 'en',
      })
      .select('id')
      .single();

    if (error) {
      console.error('[testSupabaseConnection] Supabase error:', error);
      const hint = getConnectionHint(error);
      return {
        ok: false,
        error: hint ? `${error.message} — ${hint}` : error.message,
      };
    }

    return { ok: true, id: data?.id ?? 'unknown' };
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    console.error('[testSupabaseConnection] Error:', err);
    const hint =
      msg.includes('Missing SUPABASE') || msg.includes('SUPABASE_SERVICE_ROLE_KEY')
        ? 'Add SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to .env.local, then restart dev server.'
        : null;
    return { ok: false, error: hint ? `${msg} — ${hint}` : msg };
  }
}
