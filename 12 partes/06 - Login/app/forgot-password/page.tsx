import { ForgotPasswordForm } from "@/components/auth";

export const metadata = {
  title: "Recuperar contraseña — página/",
  description: "Te enviamos un enlace para restablecer tu contraseña.",
};

/** /forgot-password — Recuperación de contraseña. */
export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
