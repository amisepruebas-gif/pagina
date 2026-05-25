"use client";
import { useEffect, useRef, useState, type RefObject } from "react";
import { Button, ProductImage } from "@/components";
import type { ProductDetail } from "@/lib/sample-product";
import type { BuySelection } from "./BuyPanel";

export interface StickyAddToCartProps {
  product: ProductDetail;
  state: BuySelection;
  /** Ref al `<BuyPanel/>`. La barra aparece cuando el panel sale de viewport. */
  anchorRef: RefObject<HTMLDivElement>;
  onAddToCart?: () => void;
}

/**
 * StickyAddToCart — barra fija en el bottom para móvil.
 *
 * Se muestra cuando el `<BuyPanel/>` sale de viewport (IntersectionObserver).
 * Se oculta en `≥lg`. Respeta safe-area-inset-bottom para iOS.
 */
export function StickyAddToCart({
  product, state, anchorRef, onAddToCart,
}: StickyAddToCartProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = anchorRef.current;
    if (!el) return;
    const ob = new IntersectionObserver(
      (entries) => { for (const e of entries) setShow(!e.isIntersecting); },
      { threshold: 0.05 },
    );
    ob.observe(el);
    return () => ob.disconnect();
  }, [anchorRef]);

  return (
    <div
      style={{ transform: show ? "translateY(0)" : "translateY(120%)" }}
      className="lg:hidden fixed left-0 right-0 bottom-0 z-50
                 bg-surface/95 backdrop-blur border-t border-border
                 shadow-[0_-8px_24px_-8px_rgba(0,0,0,0.12)]
                 px-4 py-2.5 flex items-center gap-3 transition-transform duration-base ease-out
                 pb-[max(10px,env(safe-area-inset-bottom))]"
    >
      <div className="size-12 rounded-md overflow-hidden shrink-0">
        <ProductImage label="" accent={product.images[0].accent} aspect="1/1" rounded="" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-xs text-text-soft truncate">{product.brand}</div>
        <div className="font-display font-bold text-base tracking-tight">
          ${product.price.toLocaleString("es-MX")}
        </div>
      </div>
      <Button size="md" leadingIcon="cart" disabled={!state.size} onClick={onAddToCart} className="shrink-0">
        {state.size ? "Agregar" : "Elegir talla"}
      </Button>
    </div>
  );
}
