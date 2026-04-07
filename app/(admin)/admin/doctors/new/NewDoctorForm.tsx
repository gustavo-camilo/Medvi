'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function NewDoctorForm() {
  const router = useRouter();
  const [form, setForm] = React.useState({ slug: '', name: '', crm: '', specialty: '', bio: '' });
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const res = await fetch('/api/admin/doctors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setError(j?.error ?? 'Erro ao criar');
      return;
    }
    const j = await res.json();
    router.push(`/admin/doctors/${j.id}`);
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Slug</Label>
          <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} required />
        </div>
        <div className="space-y-2">
          <Label>Nome</Label>
          <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        </div>
        <div className="space-y-2">
          <Label>CRM</Label>
          <Input value={form.crm} onChange={(e) => setForm({ ...form, crm: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>Especialidade</Label>
          <Input value={form.specialty} onChange={(e) => setForm({ ...form, specialty: e.target.value })} />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Bio</Label>
        <textarea
          value={form.bio}
          onChange={(e) => setForm({ ...form, bio: e.target.value })}
          rows={3}
          className="w-full rounded-xl border border-border bg-cream px-4 py-3 text-sm"
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <Button type="submit" disabled={saving}>
        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Criar médico'}
      </Button>
    </form>
  );
}
