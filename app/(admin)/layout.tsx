import { redirect } from 'next/navigation';
import { createServerClient } from '@/lib/supabase/server';
import { Sidebar } from '@/components/admin/Sidebar';
import { Topbar } from '@/components/admin/Topbar';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/entrar?next=/admin');

  const { data: profile } = await supabase
    .from('profiles')
    .select('role,nome')
    .eq('id', user.id)
    .maybeSingle();

  if (!profile || profile.role !== 'admin') {
    redirect('/portal');
  }

  return (
    <div className="flex min-h-screen bg-muted">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar name={(profile.nome as string | null) ?? 'Admin'} />
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
