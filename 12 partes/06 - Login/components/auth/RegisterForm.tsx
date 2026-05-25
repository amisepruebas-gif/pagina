"use client";
import Link from "next/link";
import { useState } from "react";
import { Button, Icon, Input } from "@/components";
import { AuthLayout } from "./AuthLayout";
import { GoogleButton } from "./GoogleButton";
import { OrSeparator } from "./OrSeparator";
import { PasswordInput } from "./PasswordInput";
import { PasswordStrength } from "./PasswordStrength";

export interface RegisterFormProps {
  onSubmit?: (data: { name: string; email: string; password: string }) => Promise<void> | void;
}

/**
 * RegisterForm — "Crea tu cuenta".
 *
 * Google · separador · nombre (opcional) · email · password (con strength meter)
 * · checkbox T&C · CTA "Crear cuenta" · footer a login.
 */
export function RegisterForm({ onSubmit }: RegisterFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accept, setAccept] = useState(false);
  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err: Record<string, string | null> = {};
    if (!email) err.email = "Ingresa tu correo";
    if (password.length < 6) err.password = "Mínimo 6 caracteres";
    if (!accept) err.accept = "Acepta los términos para continuar";
    setErrors(err);
    if (Object.keys(err).length > 0) return;
    setLoading(true);
    try { await onSubmit?.({ name, email, password }); }
    finally { setLoading(false); }
  };

  return (
    <AuthLayout
      title="Crea tu cuenta"
      subtitle="Te tomará menos de un minuto. Sin spam, cancela cuando quieras."
      footer={
        <span className="text-text-muted">
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="text-brand-700 no-underline font-semibold font-display">
            Inicia sesión
          </Link>
        </span>
      }
    >
      <GoogleButton>Registrarse con Google</GoogleButton>
      <OrSeparator>o con tu correo</OrSeparator>

      <form onSubmit={submit} className="flex flex-col gap-[18px]">
        <Input
          label="Nombre" autoComplete="name" placeholder="¿Cómo te llamamos?"
          value={name} onChange={(e) => setName(e.target.value)}
          hint="Opcional · puedes editarlo después."
        />
        <Input
          label="Correo electrónico"
          type="email" inputMode="email" autoComplete="email" required
          placeholder="tu@email.com"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setErrors((x) => ({ ...x, email: null })); }}
          leadingIcon="user"
          error={errors.email ?? undefined}
        />
        <div>
          <PasswordInput
            label="Contraseña"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setErrors((x) => ({ ...x, password: null })); }}
            autoComplete="new-password" required
            placeholder="Crea una contraseña"
            hint={!errors.password ? "Mínimo 6 caracteres." : undefined}
            error={errors.password ?? undefined}
          />
          <PasswordStrength password={password} />
        </div>

        <label className="flex items-start gap-2.5 cursor-pointer pt-1">
          <input type="checkbox" checked={accept}
                 onChange={(e) => { setAccept(e.target.checked); setErrors((x) => ({ ...x, accept: null })); }}
                 aria-invalid={!!errors.accept}
                 className="size-[18px] mt-0.5 accent-brand-500 shrink-0" />
          <span className="text-[13px] text-text-muted leading-relaxed">
            Acepto los{" "}
            <Link href="/terms" className="text-text font-medium">Términos</Link> y la{" "}
            <Link href="/privacy" className="text-text font-medium">Política de privacidad</Link>.
          </span>
        </label>
        {errors.accept && (
          <div role="alert" className="text-xs text-error inline-flex items-center gap-1 -mt-2.5">
            <Icon name="err" size={13} strokeWidth={2} /> {errors.accept}
          </div>
        )}

        <Button type="submit" size="lg" trailingIcon="arr-right" loading={loading}
                fullWidth className="!h-[54px]">
          Crear cuenta
        </Button>
      </form>
    </AuthLayout>
  );
}
