'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { logout } from '@/lib/auth';

export default function MiCuentaPage() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center text-gray-500">
        Cargando…
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 md:py-14">
      <header className="border-b border-gray-200 pb-6 mb-6">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-gray-900">
          Mi cuenta
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Hola{profile?.displayName ? `, ${profile.displayName}` : ''}.
        </p>
      </header>

      <section className="space-y-4">
        <Row label="Correo" value={user.email ?? '—'} />
        <Row label="Nombre" value={profile?.displayName || user.displayName || '—'} />
        <Row label="Rol" value={profile?.role ?? 'customer'} />
        <Row
          label="Cuenta vinculada con"
          value={(profile?.providers ?? []).join(', ') || '—'}
        />
        <Row label="UID" value={user.uid} mono />
      </section>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link
          href="/shop"
          className="rounded-full border border-gray-300 px-5 py-2 text-sm font-semibold text-gray-700 hover:border-accent hover:text-accent"
        >
          Seguir comprando
        </Link>
        <button
          type="button"
          onClick={async () => {
            await logout();
            router.push('/');
          }}
          className="rounded-full bg-gray-900 text-white px-5 py-2 text-sm font-semibold hover:bg-gray-700"
        >
          Cerrar sesión
        </button>
      </div>

      <p className="mt-10 text-xs text-gray-400">
        Tabs (pedidos, favoritos, direcciones) llegan en próximas fases.
      </p>
    </div>
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
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
        {label}
      </span>
      <span
        className={`sm:col-span-2 text-sm text-gray-900 break-all ${
          mono ? 'font-mono text-xs' : ''
        }`}
      >
        {value}
      </span>
    </div>
  );
}
