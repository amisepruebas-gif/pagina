'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { loginWithEmail, loginWithGoogle, describeAuthError } from '@/lib/auth';
import { Button, Icon, Input } from '@/components/ui';
import type { AuthPanelConfig } from '@/types/auth-panel';
import { AuthLayout } from './AuthLayout';
import { GoogleButton } from './GoogleButton';
import { OrSeparator } from './OrSeparator';
import { PasswordInput } from './PasswordInput';

export default function LoginForm({ panel }: { panel?: AuthPanelConfig }) {
  const router = useRouter();
  const params = useSearchParams();
  const rawNext = params.get('next');
  const next =
    rawNext && rawNext.startsWith('/') && !rawNext.startsWith('//')
      ? rawNext
      : '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleEmail(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await loginWithEmail(email, password);
      console.log('[AUTH] login email OK → next=', next);
      router.push(next);
      router.refresh();
    } catch (err) {
      console.error('[AUTH] login error:', err);
      setError(describeAuthError(err));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleGoogle() {
    setError(null);
    setSubmitting(true);
    try {
      await loginWithGoogle();
      console.log('[AUTH] google login OK → next=', next);
      router.push(next);
      router.refresh();
    } catch (err) {
      console.error('[AUTH] google error:', err);
      setError(describeAuthError(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout
      panel={panel}
      title="Bienvenido de vuelta"
      subtitle="Inicia sesión para acceder a tus pedidos, favoritos y direcciones."
      footer={
        <span className="text-text-muted">
          ¿No tienes cuenta?{' '}
          <Link
            href="/register"
            className="text-brand-700 font-semibold font-display"
          >
            Regístrate
          </Link>
        </span>
      }
    >
      <GoogleButton onClick={handleGoogle} disabled={submitting}>
        Continuar con Google
      </GoogleButton>
      <OrSeparator>o con tu correo</OrSeparator>

      {error && (
        <div
          role="alert"
          className="px-3.5 py-3 rounded-md bg-error/[0.08] border border-error/25 text-error text-[13px] flex items-start gap-2"
        >
          <Icon name="err" size={16} strokeWidth={2.4} className="shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleEmail} className="flex flex-col gap-[18px]">
        <Input
          label="Correo electrónico"
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          placeholder="tu@email.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError(null);
          }}
          leadingIcon="user"
        />
        <div>
          <PasswordInput
            label="Contraseña"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError(null);
            }}
            autoComplete="current-password"
            minLength={6}
            required
          />
          <div className="mt-2.5 text-right">
            <Link
              href="/forgot-password"
              className="text-[13px] text-brand-700 font-semibold font-display"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
        </div>

        <Button
          type="submit"
          size="lg"
          trailingIcon="arr-right"
          loading={submitting}
          fullWidth
        >
          Entrar
        </Button>
      </form>

      <p className="text-[11px] text-text-soft text-center leading-relaxed -mt-1">
        Al continuar aceptas nuestros{' '}
        <Link href="/terminos" className="text-text-muted">
          Términos
        </Link>{' '}
        y la{' '}
        <Link href="/privacidad" className="text-text-muted">
          Política de privacidad
        </Link>
        .
      </p>
    </AuthLayout>
  );
}
