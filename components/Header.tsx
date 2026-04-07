import { createServerClient } from '@/lib/supabase/server';
import { HeaderClient } from './HeaderClient';

export async function Header() {
  let isAuthed = false;
  let isAdmin = false;
  try {
    const supabase = await createServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      isAuthed = true;
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle();
      isAdmin = profile?.role === 'admin';
    }
  } catch {
    // Not configured — treat as anonymous
  }
  return <HeaderClient isAuthed={isAuthed} isAdmin={isAdmin} />;
}
