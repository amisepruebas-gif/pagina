'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Button, Icon } from '@/components/ui';

/**
 * Bloquea acceso visual a /admin/* si el usuario no tiene role=admin o staff.
 * La seguridad real la dan las Security Rules — esto es solo UX.
 */
export default function AdminGate({ children }: { children: React.ReactNode }) {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-text-soft text-sm bg-bg">
        Cargando…
      </div>
    );
  }

  if (!user) {
    return (
      <Denied
        title="Inicia sesión para entrar al admin"
        body="Esta área es solo para administradores autorizados."
        cta="login"
      />
    );
  }

  const role = profile?.role ?? 'customer';
  if (role !== 'admin' && role !== 'staff') {
    return (
      <Denied
        title="Acceso restringido"
        body={`Tu rol actual es "${role}". Para acceder al admin necesitas rol de administrador.`}
        cta="home"
      />
    );
  }

  return <>{children}</>;
}

function Denied({
  title,
  body,
  cta
}: {
  title: string;
  body?: string;
  cta: 'login' | 'home';
}) {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-bg">
      <div className="max-w-md w-full bg-surface border border-border rounded-xl p-8 text-center shadow-md">
        <span className="size-16 rounded-full inline-flex items-center justify-center mb-4 bg-error/[0.12] text-error">
          <Icon name="shield" size={28} strokeWidth={2} />
        </span>
        <h2 className="font-display font-bold text-[22px] tracking-[-0.02em]">
          {title}
        </h2>
        {body && (
          <p className="mt-2 text-text-muted text-sm leading-relaxed">{body}</p>
        )}
        <div className="mt-5 flex gap-2.5 justify-center flex-wrap">
          <Link href="/">
            <Button variant="secondary" leadingIcon="arr-left">
              Volver a la tienda
            </Button>
          </Link>
          {cta === 'login' && (
            <Link href="/login">
              <Button>Iniciar sesión</Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
