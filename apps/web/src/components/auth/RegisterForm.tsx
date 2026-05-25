'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  registerWithEmail,
  loginWithGoogle,
  describeAuthError
} from '@/lib/auth';
import { Button, Icon, Input } from '@/components/ui';
import type { AuthPanelConfig } from '@/types/auth-panel';
import { AuthLayout } from './AuthLayout';
import { GoogleButton } from './GoogleButton';
import { OrSeparator } from './OrSeparator';
import { PasswordInput } from './PasswordInput';
import { PasswordStrength } from './PasswordStrength';

export default function RegisterForm({ panel }: { panel?: AuthPanelConfig }) {
  const router = useRouter();
  const params = useSearchParams();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState(params.get('email') ?? '');
  const [password, setPassword] = useState('');
  const [accept, setAccept] = useState(false);
  const [acceptError, setAcceptError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleEmail(e: React.FormEvent) {
    e.preventDefault();
    if (!accept) {
      setAcceptError('Acepta los términos para continuar.');
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      await registerWithEmail(email, password, displayName);
      console.log('[AUTH] register OK');
      router.push('/');
      router.refresh();
    } catch (err) {
      console.error('[AUTH] register error:', err);
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
      console.log('[AUTH] google register/login OK');
      router.push('/');
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
      title="Crea tu cuenta"
      subtitle="Te tomará menos de un minuto. Sin spam, cancela cuando quieras."
      footer={
        <span className="text-text-muted">
          ¿Ya tienes cuenta?{' '}
          <Link href="/login" className="text-brand-700 font-semibold font-display">
            Inicia sesión
          </Link>
        </span>
      }
    >
      <GoogleButton onClick={handleGoogle} disabled={submitting}>
        Registrarse con Google
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
          label="Nombre"
          autoComplete="name"
          placeholder="¿Cómo te llamamos?"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          hint="Opcional · puedes editarlo después."
        />
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
            autoComplete="new-password"
            minLength={6}
            required
            placeholder="Crea una contraseña"
            hint="Mínimo 6 caracteres."
          />
          <PasswordStrength password={password} />
        </div>

        <label className="flex items-start gap-2.5 cursor-pointer pt-1">
          <input
            type="checkbox"
            checked={accept}
            onChange={(e) => {
              setAccept(e.target.checked);
              setAcceptError(null);
            }}
            className="size-[18px] mt-0.5 accent-brand-500 shrink-0"
          />
          <span className="text-[13px] text-text-muted leading-relaxed">
            Acepto los{' '}
            <Link href="/terminos" className="text-text font-medium">
              Términos
            </Link>{' '}
            y la{' '}
            <Link href="/privacidad" className="text-text font-medium">
              Política de privacidad
            </Link>
            .
          </span>
        </label>
        {acceptError && (
          <div className="text-xs text-error inline-flex items-center gap-1 -mt-2.5">
            <Icon name="err" size={13} strokeWidth={2} /> {acceptError}
          </div>
        )}

        <Button
          type="submit"
          size="lg"
          trailingIcon="arr-right"
          loading={submitting}
          fullWidth
        >
          Crear cuenta
        </Button>
      </form>
    </AuthLayout>
  );
}
