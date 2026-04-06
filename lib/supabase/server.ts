import { createClient } from '@supabase/supabase-js';

/**
 * Server-only Supabase client using the secret/service-role key.
 * Never import this from client components.
 *
 * Supports both new (`SUPABASE_SECRET_KEY`) and legacy
 * (`SUPABASE_SERVICE_ROLE_KEY`) env var names.
 */
export function supabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const secretKey =
    process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !secretKey) {
    throw new Error(
      'Supabase env vars missing: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY (or SUPABASE_SERVICE_ROLE_KEY)',
    );
  }

  return createClient(url, secretKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
