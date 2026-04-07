import Link from 'next/link';
import { brand } from '@/lib/content';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-screen flex-col bg-cream">
      <header className="container flex h-16 items-center">
        <Link
          href="/"
          className="font-display text-2xl font-semibold tracking-tight text-forest"
          aria-label={`${brand.name} — Página inicial`}
        >
          {brand.shortName}
        </Link>
      </header>
      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </main>
  );
}
