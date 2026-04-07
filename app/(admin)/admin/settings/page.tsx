import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { brand } from '@/lib/content';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl text-ink">Configurações</h1>
      <Card>
        <CardHeader>
          <CardTitle>Dados da clínica</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p><span className="text-muted-foreground">Nome:</span> {brand.name}</p>
          <p><span className="text-muted-foreground">Email:</span> {brand.email}</p>
          <p><span className="text-muted-foreground">Telefone:</span> {brand.phone}</p>
          <p><span className="text-muted-foreground">Endereço:</span> {brand.address}</p>
        </CardContent>
      </Card>
    </div>
  );
}
