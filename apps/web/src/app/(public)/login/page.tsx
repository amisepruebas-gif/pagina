import { Suspense } from 'react';
import LoginForm from '@/components/auth/LoginForm';

export const metadata = {
  title: 'Iniciar sesión · pagina'
};

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="py-20 text-center text-text-soft text-sm">Cargando…</div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
