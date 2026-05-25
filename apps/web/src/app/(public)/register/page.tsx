import { Suspense } from 'react';
import RegisterForm from '@/components/auth/RegisterForm';

export const metadata = {
  title: 'Crear cuenta · pagina'
};

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="py-20 text-center text-text-soft text-sm">Cargando…</div>
      }
    >
      <RegisterForm />
    </Suspense>
  );
}
