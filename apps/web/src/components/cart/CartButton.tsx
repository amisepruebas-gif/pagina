'use client';

import { useCart } from '@/context/CartContext';
import { Icon } from '@/components/ui';
import CartBadge from './CartBadge';

export default function CartButton() {
  const { openDrawer } = useCart();
  return (
    <button
      type="button"
      onClick={openDrawer}
      aria-label="Mi bolsa"
      className="relative inline-flex items-center justify-center size-11 rounded-pill text-text hover:bg-surface-2 transition duration-base ease-out"
    >
      <Icon name="cart" size={20} />
      <CartBadge />
    </button>
  );
}
