import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import { requireUser } from '@/lib/auth-helpers';

const schema = z.object({
  nome: z.string().min(2).max(120).optional(),
  telefone: z.string().max(40).optional(),
  cpf: z.string().nullable().optional(),
  endereco: z
    .object({
      cep: z.string().optional(),
      logradouro: z.string().optional(),
      numero: z.string().optional(),
      cidade: z.string().optional(),
      uf: z.string().max(2).optional(),
    })
    .nullable()
    .optional(),
});

export async function PATCH(req: NextRequest) {
  const auth = await requireUser();
  if (!auth.ok) return auth.response;
  const { supabase, user } = auth;

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ ok: false, error: 'Dados inválidos' }, { status: 400 });

  const { error: updErr } = await supabase
    .from('profiles')
    .update({ ...parsed.data, updated_at: new Date().toISOString() })
    .eq('id', user.id);
  if (updErr) return NextResponse.json({ ok: false, error: updErr.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
