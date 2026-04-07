'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Calendar, ShoppingBag, MessageSquare, Activity } from 'lucide-react';
import { cn } from '@/lib/cn';

const items = [
  { href: '/portal', label: 'Início', icon: Home },
  { href: '/portal/agendamentos', label: 'Consultas', icon: Calendar },
  { href: '/portal/pedidos', label: 'Pedidos', icon: ShoppingBag },
  { href: '/portal/mensagens', label: 'Mensagens', icon: MessageSquare },
  { href: '/portal/saude', label: 'Saúde', icon: Activity },
];

export function BottomNav() {
  const pathname = usePathname() ?? '';
  return (
    <nav
      className="sticky bottom-0 z-40 border-t border-border bg-cream md:hidden"
      aria-label="Navegação do portal"
    >
      <ul className="grid grid-cols-5">
        {items.map((it) => {
          const Icon = it.icon;
          const active = pathname === it.href || (it.href !== '/portal' && pathname.startsWith(it.href));
          return (
            <li key={it.href}>
              <Link
                href={it.href}
                className={cn(
                  'flex flex-col items-center gap-1 py-2 text-xs',
                  active ? 'text-forest' : 'text-muted-foreground hover:text-forest',
                )}
              >
                <Icon className="h-5 w-5" aria-hidden />
                {it.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
