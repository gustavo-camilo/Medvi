import { createClient } from '@supabase/supabase-js';

// Supabase introduced new key names in 2025: `publishable` (browser-safe)
// replaces `anon`, and `secret` replaces `service_role`. We accept both names
// for backwards compatibility.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const publishableKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  '';

export const supabaseBrowser = createClient(url, publishableKey, {
  auth: { persistSession: false },
});
