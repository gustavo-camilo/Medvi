import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { NewDoctorForm } from './NewDoctorForm';

export default function NewDoctorPage() {
  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/doctors" className="text-sm text-forest hover:underline">
          ← Voltar
        </Link>
        <h1 className="mt-1 font-display text-3xl text-ink">Novo médico</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Dados iniciais</CardTitle>
        </CardHeader>
        <CardContent>
          <NewDoctorForm />
        </CardContent>
      </Card>
    </div>
  );
}
