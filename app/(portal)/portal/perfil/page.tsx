import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createServerClient } from '@/lib/supabase/server';
import { ProfileForm } from './ProfileForm';

export const dynamic = 'force-dynamic';

export default async function PortalProfilePage() {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('nome,telefone,cpf,endereco')
    .eq('id', user.id)
    .maybeSingle();

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl text-ink">Meu perfil</h1>
      <Card>
        <CardHeader>
          <CardTitle>Dados pessoais</CardTitle>
        </CardHeader>
        <CardContent>
          <ProfileForm
            initial={{
              nome: (profile?.nome as string) ?? '',
              telefone: (profile?.telefone as string) ?? '',
              cpf: (profile?.cpf as string) ?? '',
              endereco: (profile?.endereco as Record<string, string> | null) ?? null,
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
