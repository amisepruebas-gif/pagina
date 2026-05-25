import { LoginForm } from "@/components/auth";

export const metadata = {
  title: "Iniciar sesión — página/",
  description: "Inicia sesión para acceder a tu cuenta de página/.",
};

/**
 * /login — Página de inicio de sesión.
 *
 * En producción conecta `onSubmit` a tu auth provider (NextAuth, Clerk,
 * Supabase). En éxito redirige a `/cuenta` o al `?returnTo=`.
 */
export default function LoginPage() {
  return <LoginForm />;
}
