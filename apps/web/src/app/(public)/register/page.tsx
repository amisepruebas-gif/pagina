import { Suspense } from 'react';
import RegisterForm from '@/components/auth/RegisterForm';
import { getAuthPanelConfig } from '@/lib/auth-panel';

export const metadata = {
  title: 'Crear cuenta · pagina'
};

export const revalidate = 300;

export default async function RegisterPage() {
  const panel = await getAuthPanelConfig();
  return (
    <Suspense
      fallback={
        <div className="py-20 text-center text-text-soft text-sm">Cargando…</div>
      }
    >
      <RegisterForm panel={panel} />
    </Suspense>
  );
}
