import { NextResponse } from 'next/server';
import type { SupabaseClient, User } from '@supabase/supabase-js';
import { createServerClient } from '@/lib/supabase/server';

export type AuthResult =
  | { ok: true; supabase: SupabaseClient; user: User }
  | { ok: false; response: NextResponse };

export async function requireAdmin(): Promise<AuthResult> {
  const supabase = (await createServerClient()) as unknown as SupabaseClient;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { ok: false, response: NextResponse.json({ ok: false, error: 'Não autenticado' }, { status: 401 }) };
  }
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle();
  if (profile?.role !== 'admin') {
    return { ok: false, response: NextResponse.json({ ok: false, error: 'Acesso negado' }, { status: 403 }) };
  }
  return { ok: true, supabase, user };
}

export async function requireUser(): Promise<AuthResult> {
  const supabase = (await createServerClient()) as unknown as SupabaseClient;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { ok: false, response: NextResponse.json({ ok: false, error: 'Não autenticado' }, { status: 401 }) };
  }
  return { ok: true, supabase, user };
}
