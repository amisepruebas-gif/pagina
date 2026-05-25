import { Suspense } from 'react';
import CheckoutSuccessClient from '@/components/checkout/CheckoutSuccessClient';

export const metadata = { title: 'Compra exitosa · pagina' };

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-2xl px-4 py-20 text-center text-gray-500 text-sm">
          Procesando…
        </div>
      }
    >
      <CheckoutSuccessClient />
    </Suspense>
  );
}
