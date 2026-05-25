"use client";
import { useState } from "react";
import {
  Topbar, Header, CategoryNav, Footer, Button, Icon, ProductCard,
} from "@/components";
import {
  CartLine, OrderSummary, EmptyCart, MobileCheckoutBar, CartDrawer,
} from "./";
import {
  SAMPLE_CART_ITEMS, type CartItem, type AppliedCoupon,
} from "@/lib/sample-cart";
import type { Product } from "@/lib/types";

export interface CartPageClientProps {
  initialItems?: CartItem[];
  recommended?: Product[];
}

/**
 * CartPageClient — página completa del carrito.
 *
 * Layout: lista de líneas (`<CartLine/>`) + resumen sticky (`<OrderSummary/>`).
 * En móvil el resumen se oculta y aparece `<MobileCheckoutBar/>` al fondo.
 * Estado vacío usa `<EmptyCart/>`.
 */
export function CartPageClient({
  initialItems = SAMPLE_CART_ITEMS,
  recommended = [],
}: CartPageClientProps) {
  const [items, setItems] = useState<CartItem[]>(initialItems);
  const [coupon, setCoupon] = useState<AppliedCoupon | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeCat, setActiveCat] = useState("Novedades");

  const onQtyChange = (item: CartItem, qty: number) =>
    setItems((arr) => arr.map((i) => i.id === item.id ? { ...i, qty } : i));
  const onRemove = (item: CartItem) =>
    setItems((arr) => arr.filter((i) => i.id !== item.id));

  const count = items.reduce((n, i) => n + i.qty, 0);

  return (
    <>
      <Topbar />
      <Header cartCount={count} />
      <CategoryNav active={activeCat} onChange={setActiveCat} />

      {items.length === 0 ? (
        <main className="max-w-screen-xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <EmptyCart />
        </main>
      ) : (
        <main className="max-w-screen-xl mx-auto px-4 sm:px-6 pb-32 lg:pb-16">
          <div className="flex flex-wrap items-baseline justify-between gap-3 pt-6 pb-2">
            <div>
              <h1 className="font-display font-bold leading-none tracking-[-0.035em]
                             text-3xl sm:text-5xl lg:text-[clamp(32px,5vw,56px)]">
                Tu carrito
              </h1>
              <p className="mt-2 text-text-soft text-sm">
                {count} {count === 1 ? "artículo en tu carrito" : "artículos en tu carrito"}
              </p>
            </div>
            <Button variant="ghost" leadingIcon="eye" onClick={() => setDrawerOpen(true)}>
              Ver mini-carrito
            </Button>
          </div>

          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px] items-start">
            <div className="flex flex-col gap-3">
              {items.map((it) => (
                <CartLine key={it.id} item={it}
                  onQtyChange={onQtyChange}
                  onRemove={onRemove}
                  onSaveForLater={onRemove}
                />
              ))}

              <div className="mt-3 p-4 bg-surface-2 rounded-md flex items-center gap-3 flex-wrap">
                <Icon name="bolt" size={18} strokeWidth={2} className="text-accent-2" />
                <span className="flex-1 min-w-[220px] text-sm text-text-muted">
                  Tu carrito se reserva por <strong className="text-text">30 minutos</strong>.
                  Termina la compra para asegurar la disponibilidad.
                </span>
              </div>

              {recommended.length > 0 && (
                <section className="mt-10">
                  <h3 className="font-display font-bold text-xl mb-4 tracking-[-0.015em]">
                    También te puede gustar
                  </h3>
                  <div className="grid gap-3.5 grid-cols-2 sm:grid-cols-[repeat(auto-fill,minmax(180px,1fr))]">
                    {recommended.map((p) => (
                      <ProductCard key={p.id} variant="minimal" product={p} />
                    ))}
                  </div>
                </section>
              )}
            </div>

            <div className="hidden lg:block">
              <OrderSummary
                items={items}
                coupon={coupon}
                onApplyCoupon={setCoupon}
                onRemoveCoupon={() => setCoupon(null)}
              />
            </div>
          </div>
        </main>
      )}

      <Footer />

      {items.length > 0 && <MobileCheckoutBar items={items} coupon={coupon} />}

      <CartDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        items={items}
        onQtyChange={onQtyChange}
        onRemove={onRemove}
      />
    </>
  );
}
