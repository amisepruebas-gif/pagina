"use client";
import Link from "next/link";
import { Icon, ProductImage, Tag } from "@/components";
import type { CartItem } from "@/lib/sample-cart";
import { fmt } from "@/lib/sample-cart";
import { CartQtyStepper } from "./CartQtyStepper";

export interface CartLineProps {
  item: CartItem;
  onQtyChange: (item: CartItem, qty: number) => void;
  onRemove: (item: CartItem) => void;
  onSaveForLater?: (item: CartItem) => void;
}

/**
 * CartLine — fila de producto en la página del carrito.
 *
 * Layout: imagen 112×112 · info (marca, nombre, variantes, stepper, acciones) · precio.
 * En móvil colapsa a 2 col con precio + acciones debajo, separado por una línea punteada.
 */
export function CartLine({ item, onQtyChange, onRemove, onSaveForLater }: CartLineProps) {
  const sub = item.price * item.qty;
  return (
    <article
      className="grid gap-3 sm:gap-4 p-3.5 sm:p-[18px]
                 grid-cols-[92px_1fr] sm:grid-cols-[112px_1fr_auto]
                 bg-surface border border-border rounded-xl"
    >
      <Link href="#" className="size-[92px] sm:size-28 rounded-md overflow-hidden shrink-0 row-span-1 sm:row-auto">
        <ProductImage src={item.image} label={item.label} accent={item.accent} aspect="1/1" rounded="" />
      </Link>

      <div className="min-w-0 flex flex-col gap-1.5">
        <span className="font-mono text-[11px] tracking-[0.08em] uppercase text-text-soft">{item.brand}</span>
        <Link href="#" className="text-inherit no-underline">
          <h3 className="font-display font-semibold text-[15px] leading-snug line-clamp-2">{item.name}</h3>
        </Link>

        {(item.variant.size || item.variant.color) && (
          <div className="flex gap-2 flex-wrap mt-0.5">
            {item.variant.color && <Tag>Color: {item.variant.color}</Tag>}
            {item.variant.size && <Tag>Talla {item.variant.size}</Tag>}
          </div>
        )}

        <div className="mt-auto pt-2 flex items-center gap-3 flex-wrap">
          <CartQtyStepper value={item.qty} onChange={(v) => onQtyChange(item, v)} />
          <div className="flex gap-1 flex-col sm:flex-row items-start sm:items-center">
            {onSaveForLater && (
              <ActionBtn icon="heart" onClick={() => onSaveForLater(item)}>
                Mover a favoritos
              </ActionBtn>
            )}
            <ActionBtn icon="x" tone="error" onClick={() => onRemove(item)}>
              Eliminar
            </ActionBtn>
          </div>
        </div>
      </div>

      {/* Price column: spans full width on mobile (col-span-2), aligned right on desktop */}
      <div className="col-span-2 sm:col-span-1 flex sm:flex-col items-baseline sm:items-end gap-2.5 sm:gap-0.5
                      pt-2 sm:pt-0 border-t sm:border-t-0 border-dashed border-border min-w-[90px]">
        <div className="font-display font-bold text-lg tracking-[-0.015em]">{fmt(sub)}</div>
        {item.qty > 1 && <div className="text-xs text-text-soft">{fmt(item.price)} c/u</div>}
        {item.oldPrice && (
          <div className="text-xs text-text-soft line-through">{fmt(item.oldPrice * item.qty)}</div>
        )}
      </div>
    </article>
  );
}

function ActionBtn({
  icon, tone, onClick, children,
}: { icon: "heart" | "x"; tone?: "error"; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button" onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-2.5 py-2 min-h-9 rounded-sm
                  border-0 bg-transparent cursor-pointer font-display font-semibold text-xs
                  transition hover:bg-surface-2
                  ${tone === "error" ? "text-error" : "text-text-muted"}`}
    >
      <Icon name={icon} size={14} strokeWidth={2} />
      {children}
    </button>
  );
}
