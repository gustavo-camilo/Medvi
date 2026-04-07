'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Calendar,
  Stethoscope,
  ShoppingBag,
  MessageSquare,
  Settings,
} from 'lucide-react';
import { cn } from '@/lib/cn';

const items = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/leads', label: 'Leads', icon: Users },
  { href: '/admin/agenda', label: 'Agenda', icon: Calendar },
  { href: '/admin/doctors', label: 'Médicos', icon: Stethoscope },
  { href: '/admin/orders', label: 'Pedidos', icon: ShoppingBag },
  { href: '/admin/messages', label: 'Mensagens', icon: MessageSquare },
  { href: '/admin/settings', label: 'Configurações', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname() ?? '';
  return (
    <aside className="hidden w-60 flex-shrink-0 border-r border-border bg-cream md:flex md:flex-col">
      <div className="px-6 py-6">
        <Link href="/admin" className="font-display text-2xl font-semibold text-forest">
          MEDVi
        </Link>
        <p className="text-xs text-muted-foreground">Painel administrativo</p>
      </div>
      <nav className="flex-1 space-y-1 px-3" aria-label="Menu admin">
        {items.map((it) => {
          const Icon = it.icon;
          const active =
            it.href === '/admin' ? pathname === '/admin' : pathname.startsWith(it.href);
          return (
            <Link
              key={it.href}
              href={it.href}
              className={cn(
                'flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors',
                active ? 'bg-forest text-cream' : 'text-ink hover:bg-forest-50',
              )}
            >
              <Icon className="h-4 w-4" aria-hidden />
              {it.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
