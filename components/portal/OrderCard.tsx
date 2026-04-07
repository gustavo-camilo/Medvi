import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { formatBRL } from '@/lib/format';
import { Package } from 'lucide-react';

export function OrderCard({
  id,
  status,
  total,
  createdAt,
}: {
  id: string;
  status: string;
  total: number;
  createdAt: string;
}) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between p-6">
        <div className="flex items-center gap-4">
          <div className="rounded-full bg-forest-50 p-3 text-forest">
            <Package className="h-5 w-5" aria-hidden />
          </div>
          <div>
            <p className="font-mono text-xs text-muted-foreground">{id.slice(0, 8)}</p>
            <p className="font-display text-base text-ink">{formatBRL(total)}</p>
            <p className="text-xs text-muted-foreground">
              {new Date(createdAt).toLocaleDateString('pt-BR')} — {status}
            </p>
          </div>
        </div>
        <Link href={`/portal/pedidos/${id}`} className="text-sm text-forest hover:underline">
          Ver detalhes
        </Link>
      </CardContent>
    </Card>
  );
}
