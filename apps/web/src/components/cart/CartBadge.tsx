'use client';

import { useCart } from '@/context/CartContext';

export default function CartBadge() {
  const { count, hydrated } = useCart();
  // Antes de hidratar mostramos 0 para evitar mismatch SSR/cliente.
  const display = hydrated ? count : 0;
  if (display <= 0) return null;
  return (
    <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1.5 rounded-full bg-secondary text-white text-[10px] font-bold inline-flex items-center justify-center border-2 border-surface pointer-events-none">
      {display > 99 ? '99+' : display}
    </span>
  );
}
