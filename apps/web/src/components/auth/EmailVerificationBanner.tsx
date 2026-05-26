'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { auth } from '@/lib/firebase';
import { describeAuthError, resendVerificationEmail } from '@/lib/auth';
import { Icon } from '@/components/ui';

type Feedback =
  | { kind: 'idle' }
  | { kind: 'resent' }
  | { kind: 'still-unverified' }
  | { kind: 'error'; message: string };

/**
 * Banner ámbar que avisa al usuario que su correo aún no está verificado.
 * Se renderiza solo cuando hay sesión y `emailVerified === false`. Cuentas
 * de Google llegan ya verificadas, así que naturalmente no lo ven.
 */
export function EmailVerificationBanner() {
  const { user, emailVerified, reloadUser } = useAuth();
  const [resending, setResending] = useState(false);
  const [checking, setChecking] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>({ kind: 'idle' });

  if (!user || emailVerified) return null;

  async function handleResend() {
    if (!user) return;
    setResending(true);
    setFeedback({ kind: 'idle' });
    try {
      await resendVerificationEmail(user);
      setFeedback({ kind: 'resent' });
    } catch (err) {
      console.error('[AUTH] resend verification error', err);
      setFeedback({ kind: 'error', message: describeAuthError(err) });
    } finally {
      setResending(false);
    }
  }

  async function handleCheck() {
    setChecking(true);
    setFeedback({ kind: 'idle' });
    try {
      await reloadUser();
      // El closure capturó el emailVerified antiguo; consultamos directo
      // a Firebase para decidir si mostrar el mensaje de "aún no aparece".
      // Si ya está verificado, el banner se desmonta solo en el render.
      if (auth.currentUser?.emailVerified !== true) {
        setFeedback({ kind: 'still-unverified' });
      }
    } catch (err) {
      console.error('[AUTH] reload user error', err);
      setFeedback({ kind: 'error', message: describeAuthError(err) });
    } finally {
      setChecking(false);
    }
  }

  return (
    <div
      role="status"
      className="mb-6 flex flex-col gap-3 rounded-lg border border-amber-300/60 bg-amber-50 px-4 py-3.5 text-amber-900 sm:flex-row sm:items-center sm:gap-4"
    >
      <Icon name="warn" size={20} className="shrink-0 text-amber-600" />
      <div className="min-w-0 flex-1 text-sm">
        <p className="font-display font-semibold">Verifica tu correo</p>
        <p className="text-amber-800/90">
          Te enviamos un enlace de verificación a{' '}
          <span className="font-mono break-all">{user.email}</span>. Revisa tu
          bandeja (o la carpeta de spam).
        </p>
        {feedback.kind === 'resent' && (
          <p className="mt-1.5 inline-flex items-center gap-1 text-success">
            <Icon name="check" size={14} /> Correo reenviado.
          </p>
        )}
        {feedback.kind === 'still-unverified' && (
          <p className="mt-1.5 text-amber-800/80">
            Aún no aparece como verificado. Haz click en el enlace del correo y
            vuelve a intentar.
          </p>
        )}
        {feedback.kind === 'error' && (
          <p className="mt-1.5 text-error">{feedback.message}</p>
        )}
      </div>
      <div className="flex shrink-0 gap-2">
        <button
          type="button"
          onClick={handleResend}
          disabled={resending || checking}
          className="rounded-md border border-amber-400 bg-white px-3 py-1.5 text-xs font-semibold text-amber-900 transition hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {resending ? 'Enviando…' : 'Reenviar correo'}
        </button>
        <button
          type="button"
          onClick={handleCheck}
          disabled={resending || checking}
          className="rounded-md bg-amber-500 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {checking ? 'Comprobando…' : 'Ya verifiqué'}
        </button>
      </div>
    </div>
  );
}

