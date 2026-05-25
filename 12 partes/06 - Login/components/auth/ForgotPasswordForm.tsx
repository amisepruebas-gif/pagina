"use client";
import Link from "next/link";
import { useState } from "react";
import { Button, Icon, Input } from "@/components";
import { AuthLayout } from "./AuthLayout";

export interface ForgotPasswordFormProps {
  onSubmit?: (email: string) => Promise<void> | void;
}

/**
 * ForgotPasswordForm — "Recuperar contraseña".
 *
 * Estado inicial: formulario con solo el campo email.
 * Tras enviar: pantalla "Revisa tu correo" con check destacado, email recordado
 * y botón para reenviar o volver a login.
 */
export function ForgotPasswordForm({ onSubmit }: ForgotPasswordFormProps) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try { await onSubmit?.(email); setSent(true); }
    finally { setLoading(false); }
  };

  if (sent) {
    return (
      <AuthLayout
        title="Revisa tu correo"
        subtitle={<>Te enviamos un enlace para restablecer tu contraseña a <strong className="text-text">{email}</strong>.</>}
        footer={
          <span className="text-text-muted">
            ¿No te llegó?{" "}
            <button type="button" onClick={() => setSent(false)}
                    className="border-0 bg-transparent p-0 text-brand-700 no-underline font-semibold font-display cursor-pointer text-sm">
              Reenviar
            </button>
          </span>
        }
      >
        <div className="p-8 text-center bg-brand-50 border border-brand-200 rounded-xl">
          <span className="inline-flex items-center justify-center size-[72px] rounded-full mb-4
                           text-white shadow-brand bg-brand-grad">
            <Icon name="check" size={32} strokeWidth={2.4} />
          </span>
          <div className="font-display font-bold text-lg text-brand-700">¡Enlace enviado!</div>
          <div className="mt-2 text-[13px] text-text-muted leading-relaxed">
            El enlace expira en 30 minutos. Si no lo encuentras, revisa la carpeta de spam.
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
      title="Recuperar contraseña"
      subtitle="Ingresa tu correo y te enviamos un enlace para restablecer tu contraseña."
      footer={
        <span className="text-text-muted">
          ¿Lo recordaste?{" "}
          <Link href="/login" className="text-brand-700 no-underline font-semibold font-display">Inicia sesión</Link>
        </span>
      }
    >
      <form onSubmit={submit} className="flex flex-col gap-[18px]">
        <Input
          label="Correo electrónico"
          type="email" inputMode="email" autoComplete="email" required
          placeholder="tu@email.com"
          value={email} onChange={(e) => setEmail(e.target.value)}
          leadingIcon="user"
        />
        <Button type="submit" size="lg" trailingIcon="arr-right" loading={loading}
                fullWidth className="!h-[54px]">
          Enviar enlace
        </Button>
      </form>
    </AuthLayout>
  );
}
