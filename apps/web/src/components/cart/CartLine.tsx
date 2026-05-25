'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { Icon } from '@/components/ui';
import type { CartItem } from '@/types/cart';
import { CartQtyStepper } from './CartQtyStepper';

const money = (n: number) =>
  '$' + n.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function CartLine({ item }: { item: CartItem }) {
  const { setQty, remove } = useCart();
  const sub = item.unitPrice * item.qty;
  const href = `/producto/${item.slug}`;
  const maxQty =
    typeof item.stockAtAdd === 'number' && item.stockAtAdd > 0
      ? item.stockAtAdd
      : 99;

  return (
    <article className="grid gap-3 sm:gap-4 p-3.5 sm:p-[18px] grid-cols-[92px_1fr] sm:grid-cols-[112px_1fr_auto] bg-surface border border-border rounded-xl">
      <Link
        href={href}
        className="relative size-[92px] sm:size-28 rounded-md overflow-hidden shrink-0 bg-surface-2"
      >
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            sizes="112px"
            className="object-cover"
          />
        ) : (
          <span className="absolute inset-0 flex items-center justify-center text-text-soft text-[10px]">
            sin imagen
          </span>
        )}
      </Link>

      <div className="min-w-0 flex flex-col gap-1.5">
        <Link href={href} className="text-inherit">
          <h3 className="font-display font-semibold text-[15px] leading-snug line-clamp-2">
            {item.name}
          </h3>
        </Link>
        <div className="text-sm text-text-muted">
          {money(item.unitPrice)}
          {item.originalPrice !== null &&
            item.originalPrice > item.unitPrice && (
              <span className="ml-2 text-xs text-text-soft line-through">
                {money(item.originalPrice)}
              </span>
            )}
          <span className="text-xs text-text-soft"> c/u</span>
        </div>

        <div className="mt-auto pt-2 flex items-center gap-3 flex-wrap">
          <CartQtyStepper
            value={item.qty}
            onChange={(v) => setQty(item.productId, v)}
            max={maxQty}
          />
          <button
            type="button"
            onClick={() => remove(item.productId)}
            className="inline-flex items-center gap-1.5 px-2.5 py-2 min-h-9 rounded-sm border-0 bg-transparent cursor-pointer font-display font-semibold text-xs text-error transition hover:bg-surface-2"
          >
            <Icon name="x" size={14} strokeWidth={2} />
            Eliminar
          </button>
        </div>
      </div>

      <div className="col-span-2 sm:col-span-1 flex sm:flex-col items-baseline sm:items-end gap-2.5 sm:gap-0.5 pt-2 sm:pt-0 border-t sm:border-t-0 border-dashed border-border min-w-[90px]">
        <div className="font-display font-bold text-lg tracking-[-0.015em]">
          {money(sub)}
        </div>
        {item.qty > 1 && (
          <div className="text-xs text-text-soft">{money(item.unitPrice)} c/u</div>
        )}
      </div>
    </article>
  );
}
