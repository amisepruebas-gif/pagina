'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { updateUserProfile } from '@/lib/profile';
import { logout } from '@/lib/auth';
import { Button } from '@/components/ui';

const inputCls =
  'w-full rounded-md border-[1.5px] border-border-strong bg-surface px-4 py-3 text-sm text-text focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/15 transition';

export default function PerfilTab() {
  const { user, profile } = useAuth();
  const router = useRouter();
  const [displayName, setDisplayName] = useState('');
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setDisplayName(profile?.displayName ?? user?.displayName ?? '');
    setPhone(
      (profile && 'phone' in profile
        ? (profile as { phone?: string }).phone
        : '') ?? ''
    );
  }, [profile, user]);

  if (!user) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);
    setError(null);
    setSuccess(false);
    try {
      await updateUserProfile(user, { displayName, phone });
      setSuccess(true);
    } catch (err) {
      console.error('[PROFILE] error:', err);
      setError(err instanceof Error ? err.message : 'Error al guardar');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
        <Field label="Correo (no editable)">
          <input
            type="email"
            value={user.email ?? ''}
            disabled
            className="w-full rounded-md border-[1.5px] border-border bg-surface-2 px-4 py-3 text-sm text-text-soft"
          />
        </Field>
        <Field label="Nombre">
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className={inputCls}
          />
        </Field>
        <Field label="Teléfono">
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="55 1234 5678"
            className={inputCls}
          />
        </Field>

        {error && (
          <div className="rounded-md bg-error/10 border border-error/30 text-error text-sm px-4 py-2">
            {error}
          </div>
        )}
        {success && !error && (
          <div className="rounded-md bg-success/10 border border-success/30 text-success text-sm px-4 py-2">
            Cambios guardados ✓
          </div>
        )}

        <Button type="submit" loading={submitting}>
          Guardar cambios
        </Button>
      </form>

      <div className="border-t border-border pt-6">
        <h3 className="font-display text-sm font-semibold">Cuenta</h3>
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm max-w-xl">
          <Row label="Rol" value={profile?.role ?? 'customer'} />
          <Row
            label="Vinculada con"
            value={(profile?.providers ?? []).join(', ') || '—'}
          />
          <Row label="UID" value={user.uid} mono />
        </div>
        <div className="mt-6">
          <Button
            variant="secondary"
            onClick={async () => {
              await logout();
              router.push('/');
            }}
          >
            Cerrar sesión
          </Button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block font-display text-[13px] font-semibold text-text mb-1.5">
        {label}
      </span>
      {children}
    </label>
  );
}

function Row({
  label,
  value,
  mono
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div>
      <div className="text-[10px] font-semibold text-text-soft uppercase tracking-wide">
        {label}
      </div>
      <div className={`text-text break-all ${mono ? 'font-mono text-xs' : ''}`}>
        {value}
      </div>
    </div>
  );
}
