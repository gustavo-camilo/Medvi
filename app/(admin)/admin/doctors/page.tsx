import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { createServerClient } from '@/lib/supabase/server';
import { Plus } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function DoctorsListPage() {
  const supabase = await createServerClient();
  const { data: doctors } = await supabase
    .from('doctors')
    .select('id,slug,name,specialty,crm,active')
    .order('name');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-ink">Médicos</h1>
          <p className="text-sm text-muted-foreground">Gerencie equipe clínica e disponibilidade.</p>
        </div>
        <Button asChild>
          <Link href="/admin/doctors/new">
            <Plus className="h-4 w-4" aria-hidden /> Novo médico
          </Link>
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {(doctors ?? []).map((d) => (
          <Card key={d.id as string}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display text-lg text-ink">{d.name as string}</h2>
                  <p className="text-sm text-forest">{d.specialty as string}</p>
                  <p className="text-xs text-muted-foreground">{d.crm as string}</p>
                </div>
                <span
                  className={
                    (d.active as boolean)
                      ? 'rounded-full bg-forest-50 px-3 py-1 text-xs text-forest'
                      : 'rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground'
                  }
                >
                  {(d.active as boolean) ? 'Ativo' : 'Inativo'}
                </span>
              </div>
              <div className="mt-4">
                <Button asChild variant="secondary" size="sm">
                  <Link href={`/admin/doctors/${d.id}`}>Editar</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
