import LoginForm from '@/components/auth/LoginForm';

export const metadata = {
  title: 'Iniciar sesión · pagina'
};

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-12 md:py-20">
      <h1 className="font-display text-3xl font-bold text-gray-900 text-center">
        Iniciar sesión
      </h1>
      <p className="mt-2 text-sm text-center text-gray-600">
        Accede a tu cuenta para ver tus pedidos.
      </p>
      <div className="mt-8">
        <LoginForm />
      </div>
    </div>
  );
}
