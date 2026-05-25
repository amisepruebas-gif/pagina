import { Suspense } from 'react';
import LoginForm from '@/components/auth/LoginForm';
import { getAuthPanelConfig } from '@/lib/auth-panel';

export const metadata = {
  title: 'Iniciar sesión · pagina'
};

// ISR — el admin propaga cambios del panel lateral en ≤ 5 min.
export const revalidate = 300;

export default async function LoginPage() {
  const panel = await getAuthPanelConfig();
  return (
    <Suspense
      fallback={
        <div className="py-20 text-center text-text-soft text-sm">Cargando…</div>
      }
    >
      <LoginForm panel={panel} />
    </Suspense>
  );
}
