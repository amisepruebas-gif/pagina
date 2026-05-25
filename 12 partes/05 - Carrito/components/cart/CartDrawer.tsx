"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { Button, Icon, IconButton, ProductImage } from "@/components";
import { computeTotals, fmt, type CartItem } from "@/lib/sample-cart";
import { CartQtyStepper } from "./CartQtyStepper";

export interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
  items: CartItem[];
  onQtyChange: (item: CartItem, qty: number) => void;
  onRemove: (item: CartItem) => void;
}

/**
 * CartDrawer — mini-carrito lateral.
 *
 * - Slide-in desde la derecha, ~420px en desktop, ~94vw en móvil.
 * - Cerrable con backdrop, botón X o tecla Esc.
 * - Body scroll bloqueado mientras está abierto; foco al primer botón al abrir.
 * - Si está vacío, muestra estado neutro con CTA "Explorar tienda".
 */
export function CartDrawer({
  open, onClose, items, onQtyChange, onRemove,
}: CartDrawerProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    setTimeout(() => {
      const f = ref.current?.querySelector<HTMLElement>('button, a, input, [tabindex]:not([tabindex="-1"])');
      f?.focus();
    }, 100);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  const { subtotal, count } = computeTotals(items, null);

  return (
    <div role="dialog" aria-modal="true" aria-label="Mini-carrito" className="fixed inset-0 z-[110]">
      <button
        type="button" aria-label="Cerrar mini-carrito" onClick={onClose}
        className="absolute inset-0 bg-black/45 animate-[mm-fade_200ms_cubic-bezier(.22,1,.36,1)]"
      />
      <aside
        ref={ref}
        className="absolute top-0 right-0 bottom-0 w-[min(94vw,420px)]
                   bg-surface shadow-lg flex flex-col
                   animate-[mm-slide_280ms_cubic-bezier(.22,1,.36,1)]"
      >
        <div className="px-[18px] py-4 flex justify-between items-center border-b border-border">
          <div className="inline-flex items-baseline gap-2">
            <h2 className="font-display font-bold text-lg">Tu carrito</h2>
            <span className="text-[13px] text-text-soft">· {count} {count === 1 ? "ítem" : "ítems"}</span>
          </div>
          <IconButton variant="ghost" icon="x" label="Cerrar mini-carrito" onClick={onClose} />
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center gap-3.5">
            <span className="size-16 rounded-full bg-surface-2 inline-flex items-center justify-center text-text-soft">
              <Icon name="cart" size={28} strokeWidth={1.6} />
            </span>
            <div>
              <div className="font-display font-bold text-lg">Aún no hay nada aquí</div>
              <div className="mt-1.5 text-[13px] text-text-muted">Agrega un producto para verlo en este panel.</div>
            </div>
            <Button onClick={onClose} trailingIcon="arr-right">Explorar tienda</Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-3.5 flex flex-col gap-3">
              {items.map((it) => (
                <DrawerLine
                  key={it.id} item={it}
                  onQtyChange={(v) => onQtyChange(it, v)}
                  onRemove={() => onRemove(it)}
                />
              ))}
            </div>
            <div className="p-[18px] border-t border-border flex flex-col gap-3 bg-surface">
              <div className="flex justify-between items-baseline">
                <span className="font-display font-semibold text-sm text-text-muted">Subtotal</span>
                <span className="font-display font-bold text-[22px] tracking-[-0.02em]">{fmt(subtotal)}</span>
              </div>
              <div className="text-[11px] text-text-soft">
                Envío e impuestos se calculan en el checkout
              </div>
              <Link href="/cart">
                <Button size="lg" trailingIcon="arr-right" fullWidth className="!h-[52px]">
                  Ir al carrito
                </Button>
              </Link>
              <Button variant="secondary" onClick={onClose} fullWidth>Seguir comprando</Button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}

function DrawerLine({
  item, onQtyChange, onRemove,
}: { item: CartItem; onQtyChange: (n: number) => void; onRemove: () => void }) {
  return (
    <article className="grid gap-3 grid-cols-[72px_1fr] p-2.5 rounded-md bg-surface border border-border">
      <div className="size-[72px] rounded-sm overflow-hidden">
        <ProductImage src={item.image} label={item.label} accent={item.accent} aspect="1/1" rounded="" />
      </div>
      <div className="min-w-0 flex flex-col gap-1">
        <div className="flex justify-between gap-2">
          <span className="font-mono text-[10px] tracking-[0.08em] uppercase text-text-soft">{item.brand}</span>
          <button onClick={onRemove} aria-label="Quitar" type="button"
                  className="border-0 bg-transparent text-text-soft cursor-pointer p-0.5 min-h-6 inline-flex">
            <Icon name="x" size={14} strokeWidth={2.4} />
          </button>
        </div>
        <h4 className="font-display font-semibold text-[13px] leading-snug line-clamp-2">{item.name}</h4>
        {(item.variant.size || item.variant.color) && (
          <div className="text-[11px] text-text-soft">
            {[item.variant.color, item.variant.size && `Talla ${item.variant.size}`].filter(Boolean).join(" · ")}
          </div>
        )}
        <div className="mt-auto pt-1.5 flex items-center justify-between gap-2">
          <CartQtyStepper value={item.qty} onChange={onQtyChange} size="sm" />
          <span className="font-display font-bold text-sm">{fmt(item.price * item.qty)}</span>
        </div>
      </div>
    </article>
  );
}
