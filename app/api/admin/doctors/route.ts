import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import { requireAdmin } from '@/lib/auth-helpers';

const createSchema = z.object({
  slug: z.string().min(2).max(60).regex(/^[a-z0-9-]+$/),
  name: z.string().min(2).max(120),
  crm: z.string().max(40).optional().nullable(),
  specialty: z.string().max(80).optional().nullable(),
  bio: z.string().max(2000).optional().nullable(),
});

export async function POST(req: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;
  const { supabase } = auth;

  const body = await req.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success)
    return NextResponse.json({ ok: false, error: 'Dados inválidos', details: parsed.error.flatten() }, { status: 400 });

  const { data, error: insErr } = await supabase
    .from('doctors')
    .insert({
      slug: parsed.data.slug,
      name: parsed.data.name,
      crm: parsed.data.crm ?? null,
      specialty: parsed.data.specialty ?? null,
      bio: parsed.data.bio ?? null,
      active: true,
    })
    .select('id')
    .single();

  if (insErr) return NextResponse.json({ ok: false, error: insErr.message }, { status: 500 });
  return NextResponse.json({ ok: true, id: data.id });
}
