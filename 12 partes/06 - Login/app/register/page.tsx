import { RegisterForm } from "@/components/auth";

export const metadata = {
  title: "Crear cuenta — página/",
  description: "Crea tu cuenta de página/ y empieza a comprar.",
};

/** /register — Página de registro. */
export default function RegisterPage() {
  return <RegisterForm />;
}
