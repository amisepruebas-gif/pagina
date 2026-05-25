'use client';

import { useState } from 'react';
import Link from 'next/link';
import { sendPasswordReset, describeAuthError } from '@/lib/auth';
import { Button, Icon, Input } from '@/components/ui';
import type { AuthPanelConfig } from '@/types/auth-panel';
import { AuthLayout } from './AuthLayout';

export default function ForgotPasswordForm({ panel }: { panel?: AuthPanelConfig }) {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await sendPasswordReset(email);
      setSent(true);
    } catch (err) {
      console.error('[AUTH] reset error:', err);
      setError(describeAuthError(err));
    } finally {
      setSubmitting(false);
    }
  }

  if (sent) {
    return (
      <AuthLayout
        panel={panel}
        title="Revisa tu correo"
        subtitle={
          <>
            Si <strong className="text-text">{email}</strong> está registrado,
            te enviamos un enlace para restablecer tu contraseña.
          </>
        }
        footer={
          <span className="text-text-muted">
            ¿No te llegó?{' '}
            <button
              type="button"
              onClick={() => setSent(false)}
              className="border-0 bg-transparent p-0 text-brand-700 font-semibold font-display cursor-pointer text-sm"
            >
              Reenviar
            </button>
          </span>
        }
      >
        <div className="p-8 text-center bg-brand-50 border border-brand-200 rounded-xl">
          <span className="inline-flex items-center justify-center size-[72px] rounded-full mb-4 text-white shadow-brand bg-brand-grad">
            <Icon name="check" size={32} strokeWidth={2.4} />
          </span>
          <div className="font-display font-bold text-lg text-brand-700">
            ¡Enlace enviado!
          </div>
          <div className="mt-2 text-[13px] text-text-muted leading-relaxed">
            Revisa también la carpeta de spam.
          </div>
        </div>

        <Link href="/login">
          <Button variant="secondary" size="lg" leadingIcon="arr-left" fullWidth>
            Volver a iniciar sesión
          </Button>
        </Link>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      panel={panel}
      title="Recuperar contraseña"
      subtitle="Ingresa tu correo y te enviamos un enlace para restablecer tu contraseña."
      footer={
        <span className="text-text-muted">
          ¿Lo recordaste?{' '}
          <Link href="/login" className="text-brand-700 font-semibold font-display">
            Inicia sesión
          </Link>
        </span>
      }
    >
      {error && (
        <div
          role="alert"
          className="px-3.5 py-3 rounded-md bg-error/[0.08] border border-error/25 text-error text-[13px] flex items-start gap-2"
        >
          <Icon name="err" size={16} strokeWidth={2.4} className="shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-[18px]">
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
        <Button
          type="submit"
          size="lg"
          trailingIcon="arr-right"
          loading={submitting}
          fullWidth
        >
          Enviar enlace
        </Button>
      </form>
    </AuthLayout>
  );
}
