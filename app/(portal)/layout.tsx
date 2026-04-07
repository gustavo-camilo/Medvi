import { redirect } from 'next/navigation';
import { createServerClient } from '@/lib/supabase/server';
import { TopBar } from '@/components/portal/TopBar';
import { BottomNav } from '@/components/portal/BottomNav';

export const dynamic = 'force-dynamic';

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/entrar?next=/portal');

  const { data: profile } = await supabase
    .from('profiles')
    .select('nome,role')
    .eq('id', user.id)
    .maybeSingle();

  return (
    <div className="flex min-h-screen flex-col bg-cream">
      <TopBar name={(profile?.nome as string | null) ?? 'Paciente'} />
      <main className="flex-1 pb-20 md:pb-0">
        <div className="container py-8">{children}</div>
      </main>
      <BottomNav />
    </div>
  );
}
