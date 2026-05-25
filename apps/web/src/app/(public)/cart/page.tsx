'use client';

import { Suspense } from 'react';
import CartPageInner from '@/components/cart/CartPageInner';

export default function CartPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-4xl px-4 py-20 text-center text-gray-500 text-sm">
          Cargando…
        </div>
      }
    >
      <CartPageInner />
    </Suspense>
  );
}
