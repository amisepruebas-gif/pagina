"use client";
import Link from "next/link";
import { useState } from "react";
import { Button, Icon, Input } from "@/components";
import { AuthLayout } from "./AuthLayout";
import { GoogleButton } from "./GoogleButton";
import { OrSeparator } from "./OrSeparator";
import { PasswordInput } from "./PasswordInput";

export interface LoginFormProps {
  onSubmit?: (data: { email: string; password: string; remember: boolean }) => Promise<void> | void;
  /** Si el server rechazó las credenciales, pásalo como prop */
  initialError?: string;
}

/**
 * LoginForm — "Bienvenido de vuelta".
 *
 * Google · separador · email + password (con show/hide) · remember + forgot
 * link · CTA "Entrar" · footer al registro · disclaimer T&C.
 */
export function LoginForm({ onSubmit, initialError }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState<string | null>(initialError ?? null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try { await onSubmit?.({ email, password, remember }); }
    catch (err: any) { setError(err?.message ?? "Correo o contraseña incorrectos."); }
    finally { setLoading(false); }
  };

  return (
    <AuthLayout
      title="Bienvenido de vuelta"
      subtitle="Inicia sesión para acceder a tus pedidos, favoritos y direcciones."
      footer={
        <span className="text-text-muted">
          ¿No tienes cuenta?{" "}
          <Link href="/register" className="text-brand-700 no-underline font-semibold font-display">
            Regístrate
          </Link>
        </span>
      }
    >
      <GoogleButton>Continuar con Google</GoogleButton>
      <OrSeparator>o con tu correo</OrSeparator>

      {error && (
        <div role="alert"
             className="px-3.5 py-3 rounded-md bg-error/[0.08] border border-error/25 text-error text-[13px] flex items-start gap-2">
          <Icon name="err" size={16} strokeWidth={2.4} className="shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={submit} className="flex flex-col gap-[18px]">
        <Input
          label="Correo electrónico"
          type="email" inputMode="email" autoComplete="email" required
          placeholder="tu@email.com"
          value={email} onChange={(e) => { setEmail(e.target.value); setError(null); }}
          leadingIcon="user"
        />
        <div>
          <PasswordInput
            label="Contraseña"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(null); }}
            autoComplete="current-password"
            required
          />
          <div className="mt-2.5 flex justify-between items-center gap-2.5 flex-wrap">
            <label className="inline-flex items-center gap-2 min-h-9 cursor-pointer">
              <input type="checkbox" checked={remember}
                     onChange={(e) => setRemember(e.target.checked)}
                     className="size-[18px] accent-brand-500" />
              <span className="text-[13px] text-text-muted">Mantener sesión iniciada</span>
            </label>
            <Link href="/forgot-password"
                  className="text-[13px] text-brand-700 no-underline font-semibold font-display px-1 py-1">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
        </div>

        <Button type="submit" size="lg" trailingIcon="arr-right" loading={loading}
                fullWidth className="!h-[54px]">
          Entrar
        </Button>
      </form>

      <p className="text-[11px] text-text-soft text-center leading-relaxed -mt-1">
        Al continuar aceptas nuestros{" "}
        <Link href="/terms" className="text-text-muted">Términos</Link> y la{" "}
        <Link href="/privacy" className="text-text-muted">Política de privacidad</Link>.
      </p>
    </AuthLayout>
  );
}
