'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Trash2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const DOWS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

type Rule = { dayOfWeek: number; startTime: string; endTime: string; slotDurationMinutes: number };

type Profile = {
  name: string;
  crm: string;
  specialty: string;
  bio: string;
  active: boolean;
};

export function DoctorEditor({
  doctorId,
  initial,
  initialRules,
}: {
  doctorId: string;
  initial: Profile;
  initialRules: Rule[];
}) {
  const router = useRouter();
  const [profile, setProfile] = React.useState<Profile>(initial);
  const [rules, setRules] = React.useState<Rule[]>(initialRules);
  const [saving, setSaving] = React.useState(false);
  const [msg, setMsg] = React.useState<string | null>(null);

  const saveProfile = async () => {
    setSaving(true);
    setMsg(null);
    const res = await fetch(`/api/admin/doctors/${doctorId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile),
    });
    setSaving(false);
    if (res.ok) {
      setMsg('Salvo.');
      router.refresh();
    } else {
      setMsg('Erro ao salvar.');
    }
  };

  const saveRules = async () => {
    setSaving(true);
    setMsg(null);
    const res = await fetch(`/api/admin/doctors/${doctorId}/availability`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rules }),
    });
    setSaving(false);
    if (res.ok) {
      setMsg('Disponibilidade salva.');
      router.refresh();
    } else {
      setMsg('Erro ao salvar disponibilidade.');
    }
  };

  const addRule = () => {
    setRules((r) => [
      ...r,
      { dayOfWeek: 1, startTime: '09:00', endTime: '18:00', slotDurationMinutes: 30 },
    ]);
  };

  const updateRule = (i: number, patch: Partial<Rule>) => {
    setRules((r) => r.map((x, idx) => (idx === i ? { ...x, ...patch } : x)));
  };

  const removeRule = (i: number) => {
    setRules((r) => r.filter((_, idx) => idx !== i));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Perfil</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Nome</Label>
              <Input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>CRM</Label>
              <Input value={profile.crm} onChange={(e) => setProfile({ ...profile, crm: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Especialidade</Label>
              <Input value={profile.specialty} onChange={(e) => setProfile({ ...profile, specialty: e.target.value })} />
            </div>
            <div className="flex items-end gap-2">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={profile.active}
                  onChange={(e) => setProfile({ ...profile, active: e.target.checked })}
                />
                Ativo
              </label>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Bio</Label>
            <textarea
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              rows={3}
              className="w-full rounded-xl border border-border bg-cream px-4 py-3 text-sm"
            />
          </div>
          <Button onClick={saveProfile} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Salvar perfil'}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Disponibilidade semanal</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {rules.map((r, i) => (
            <div key={i} className="grid grid-cols-12 gap-2">
              <select
                value={r.dayOfWeek}
                onChange={(e) => updateRule(i, { dayOfWeek: parseInt(e.target.value, 10) })}
                className="col-span-3 rounded-xl border border-border bg-cream px-2 py-2 text-sm"
              >
                {DOWS.map((d, idx) => (
                  <option key={idx} value={idx}>
                    {d}
                  </option>
                ))}
              </select>
              <Input
                type="time"
                value={r.startTime}
                onChange={(e) => updateRule(i, { startTime: e.target.value })}
                className="col-span-3"
              />
              <Input
                type="time"
                value={r.endTime}
                onChange={(e) => updateRule(i, { endTime: e.target.value })}
                className="col-span-3"
              />
              <Input
                type="number"
                min={10}
                max={240}
                value={r.slotDurationMinutes}
                onChange={(e) => updateRule(i, { slotDurationMinutes: parseInt(e.target.value, 10) || 30 })}
                className="col-span-2"
              />
              <Button variant="ghost" size="sm" onClick={() => removeRule(i)} className="col-span-1">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={addRule}>
              <Plus className="h-4 w-4" /> Adicionar
            </Button>
            <Button onClick={saveRules} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Salvar disponibilidade'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {msg && <p className="text-sm text-muted-foreground">{msg}</p>}
    </div>
  );
}
