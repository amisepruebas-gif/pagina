'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import AccountTabs, { type AccountTab } from '@/components/account/AccountTabs';
import PerfilTab from '@/components/account/PerfilTab';
import PedidosTab from '@/components/account/PedidosTab';
import FavoritosTab from '@/components/account/FavoritosTab';
import DireccionesTab from '@/components/account/DireccionesTab';
import QuejasTab from '@/components/account/QuejasTab';
import { EmailVerificationBanner } from '@/components/auth/EmailVerificationBanner';

const VALID_TABS: AccountTab[] = ['perfil', 'pedidos', 'favoritos', 'direcciones', 'quejas'];

export default function MiCuentaPage() {
  return (
    <Suspense fallback={<Loading />}>
      <MiCuentaInner />
    </Suspense>
  );
}

function MiCuentaInner() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const tabParam = params.get('tab');
  const tab: AccountTab = (VALID_TABS as string[]).includes(tabParam ?? '')
    ? (tabParam as AccountTab)
    : 'perfil';

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [loading, user, router]);

  if (loading || !user) {
    return <Loading />;
  }

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-10 md:py-14">
      <header className="mb-6">
        <h1 className="font-display font-bold tracking-[-0.03em] text-3xl md:text-4xl">
          Mi cuenta
        </h1>
        <p className="mt-2 text-sm text-text-muted">
          Hola{profile?.displayName ? `, ${profile.displayName}` : ''}.
        </p>
      </header>

      <EmailVerificationBanner />

      <AccountTabs current={tab} />

      <div className="mt-6">
        {tab === 'perfil' && <PerfilTab />}
        {tab === 'pedidos' && <PedidosTab />}
        {tab === 'favoritos' && <FavoritosTab />}
        {tab === 'direcciones' && <DireccionesTab />}
        {tab === 'quejas' && <QuejasTab />}
      </div>
    </div>
  );
}

function Loading() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 text-center text-text-soft text-sm">
      Cargando…
    </div>
  );
}
