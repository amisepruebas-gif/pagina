'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { Button, Icon, IconButton } from '@/components/ui';
import { CartQtyStepper } from './CartQtyStepper';

const money = (n: number) =>
  '$' + n.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function CartDrawer() {
  const { items, subtotal, count, drawerOpen, closeDrawer, setQty, remove } =
    useCart();

  useEffect(() => {
    if (!drawerOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeDrawer();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [drawerOpen, closeDrawer]);

  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [drawerOpen]);

  if (!drawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal aria-label="Carrito de compras">
      <button
        type="button"
        aria-label="Cerrar carrito"
        onClick={closeDrawer}
        className="absolute inset-0 bg-black/45 animate-[mm-fade_200ms_cubic-bezier(.22,1,.36,1)]"
      />

      <aside className="absolute top-0 right-0 bottom-0 w-96 max-w-[90vw] bg-surface shadow-lg flex flex-col animate-[mm-slide_280ms_cubic-bezier(.22,1,.36,1)]">
        <header className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="font-display text-lg font-bold">
            Tu carrito{count > 0 ? ` (${count})` : ''}
          </h2>
          <IconButton
            variant="ghost"
            icon="x"
            label="Cerrar"
            onClick={closeDrawer}
          />
        </header>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <span className="inline-flex items-center justify-center size-16 rounded-full bg-brand-grad text-white shadow-brand mb-4">
              <Icon name="cart" size={28} strokeWidth={1.8} />
            </span>
            <p className="font-display font-bold text-text">
              Tu carrito está vacío
            </p>
            <p className="mt-1 text-sm text-text-muted">
              Agrega productos para verlos aquí.
            </p>
            <Link href="/shop" onClick={closeDrawer} className="mt-5">
              <Button trailingIcon="arr-right">Ir a la tienda</Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {items.map((item) => (
                <div key={item.productId} className="flex gap-3">
                  <Link
                    href={`/producto/${item.slug}`}
                    onClick={closeDrawer}
                    className="relative size-16 rounded-md bg-surface-2 overflow-hidden shrink-0"
                  >
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    ) : null}
                  </Link>

                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/producto/${item.slug}`}
                      onClick={closeDrawer}
                      className="text-sm font-medium text-text line-clamp-2 hover:text-brand-600"
                    >
                      {item.name}
                    </Link>
                    <div className="mt-1.5 flex items-center justify-between gap-2">
                      <CartQtyStepper
                        value={item.qty}
                        onChange={(v) => setQty(item.productId, v)}
                        size="sm"
                      />
                      <span className="text-sm font-display font-bold tabular-nums">
                        {money(item.unitPrice * item.qty)}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => remove(item.productId)}
                    aria-label={`Eliminar ${item.name}`}
                    className="shrink-0 self-start text-text-soft hover:text-error transition"
                  >
                    <Icon name="x" size={16} strokeWidth={2} />
                  </button>
                </div>
              ))}
            </div>

            <footer className="border-t border-border p-4 space-y-3">
              <div className="flex items-baseline justify-between">
                <span className="text-sm text-text-muted">Subtotal</span>
                <span className="font-display font-bold text-lg tabular-nums">
                  {money(subtotal)}
                </span>
              </div>
              <p className="text-xs text-text-soft">
                Envío y descuentos se calculan en el carrito.
              </p>
              <Link href="/cart" onClick={closeDrawer} className="block">
                <Button fullWidth trailingIcon="arr-right">
                  Ir al carrito
                </Button>
              </Link>
              <Button variant="secondary" fullWidth onClick={closeDrawer}>
                Seguir comprando
              </Button>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}
