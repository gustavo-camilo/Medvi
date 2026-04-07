'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatPhone, formatCPF } from '@/lib/validators';

type Endereco = { cep?: string; logradouro?: string; numero?: string; cidade?: string; uf?: string } | null;

export function ProfileForm({
  initial,
}: {
  initial: { nome: string; telefone: string; cpf: string; endereco: Endereco };
}) {
  const router = useRouter();
  const [nome, setNome] = React.useState(initial.nome);
  const [telefone, setTelefone] = React.useState(initial.telefone);
  const [cpf, setCpf] = React.useState(initial.cpf);
  const [cep, setCep] = React.useState(initial.endereco?.cep ?? '');
  const [logradouro, setLogradouro] = React.useState(initial.endereco?.logradouro ?? '');
  const [numero, setNumero] = React.useState(initial.endereco?.numero ?? '');
  const [cidade, setCidade] = React.useState(initial.endereco?.cidade ?? '');
  const [uf, setUf] = React.useState(initial.endereco?.uf ?? '');
  const [saving, setSaving] = React.useState(false);
  const [msg, setMsg] = React.useState<string | null>(null);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    const res = await fetch('/api/portal/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nome,
        telefone,
        cpf: cpf || null,
        endereco: { cep, logradouro, numero, cidade, uf },
      }),
    });
    setSaving(false);
    if (res.ok) {
      setMsg('Salvo.');
      router.refresh();
    } else {
      setMsg('Erro ao salvar.');
    }
  };

  return (
    <form onSubmit={save} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Nome</Label>
          <Input value={nome} onChange={(e) => setNome(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Telefone</Label>
          <Input value={telefone} onChange={(e) => setTelefone(formatPhone(e.target.value))} />
        </div>
        <div className="space-y-2">
          <Label>CPF</Label>
          <Input value={cpf} onChange={(e) => setCpf(formatCPF(e.target.value))} />
        </div>
        <div className="space-y-2">
          <Label>CEP</Label>
          <Input value={cep} onChange={(e) => setCep(e.target.value)} />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label>Logradouro</Label>
          <Input value={logradouro} onChange={(e) => setLogradouro(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Número</Label>
          <Input value={numero} onChange={(e) => setNumero(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Cidade</Label>
          <Input value={cidade} onChange={(e) => setCidade(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>UF</Label>
          <Input value={uf} onChange={(e) => setUf(e.target.value)} maxLength={2} />
        </div>
      </div>
      {msg && <p className="text-sm text-muted-foreground">{msg}</p>}
      <Button type="submit" disabled={saving}>
        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Salvar perfil'}
      </Button>
    </form>
  );
}
