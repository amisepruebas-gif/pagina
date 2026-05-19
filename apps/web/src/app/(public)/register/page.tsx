import RegisterForm from '@/components/auth/RegisterForm';

export const metadata = {
  title: 'Crear cuenta · pagina'
};

export default function RegisterPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-12 md:py-20">
      <h1 className="font-display text-3xl font-bold text-gray-900 text-center">
        Crear cuenta
      </h1>
      <p className="mt-2 text-sm text-center text-gray-600">
        Regístrate para comprar más rápido.
      </p>
      <div className="mt-8">
        <RegisterForm />
      </div>
    </div>
  );
}
