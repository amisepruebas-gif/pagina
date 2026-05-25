"use client";
import { useState } from "react";
import type { Product } from "@/lib/types";
import { Badge, Button, Icon, ProductImage, Stars } from "@/components";

interface ProductRowProps {
  product: Product;
  onAddToCart?: (p: Product, size?: string) => void;
  onToggleFav?: (p: Product, fav: boolean) => void;
}

const fmt = (n: number) =>
  "$" + n.toLocaleString("es-MX", { maximumFractionDigits: 0 });

/**
 * ProductRow — vista lista del catálogo. Layout horizontal con imagen
 * a la izquierda y CTAs a la derecha.
 */
export function ProductRow({ product: p, onAddToCart, onToggleFav }: ProductRowProps) {
  const [fav, setFav] = useState(p.fav ?? false);
  const discount = p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : 0;

  return (
    <article className="flex gap-3 sm:gap-4 p-3 sm:p-4 bg-surface
                        border border-border rounded-xl
                        transition duration-base ease-out hover:-translate-y-0.5 hover:shadow-md">
      <div className="w-24 sm:w-36 shrink-0">
        <ProductImage src={p.image} label={p.label} accent={p.accent} aspect="1/1" rounded="rounded-md" />
      </div>

      <div className="flex-1 min-w-0 flex flex-col gap-1.5">
        <div className="flex gap-2 items-center justify-between">
          <span className="font-mono text-[11px] tracking-[0.08em] uppercase text-text-soft truncate">
            {p.brand}
          </span>
          {discount > 0 && <Badge tone="secondary" size="xs" leadingIcon="bolt">-{discount}%</Badge>}
        </div>
        <h3 className="font-display font-semibold text-sm sm:text-base leading-snug line-clamp-2">
          {p.name}
        </h3>
        {p.rating != null && <Stars value={p.rating} reviews={p.reviews} />}
        <div className="flex items-baseline gap-2 mt-auto">
          <span className="font-display font-bold text-lg sm:text-xl">{fmt(p.price)}</span>
          {p.oldPrice && <span className="text-[13px] text-text-soft line-through">{fmt(p.oldPrice)}</span>}
        </div>
      </div>

      <div className="flex flex-col gap-2 justify-between items-end shrink-0">
        <button
          type="button"
          onClick={() => { setFav(!fav); onToggleFav?.(p, !fav); }}
          aria-label={fav ? "Quitar de favoritos" : "Agregar a favoritos"}
          className={`touch-target size-9 rounded-full inline-flex items-center justify-center
                      bg-surface-2 hover:bg-surface-2 transition
                      ${fav ? "text-secondary-600" : "text-text"}`}
        >
          <Icon name={fav ? "heart-filled" : "heart"} size={18} strokeWidth={2} />
        </button>
        <Button size="sm" leadingIcon="cart" onClick={() => onAddToCart?.(p)}>
          <span className="hidden sm:inline">Agregar</span>
          <span className="sm:hidden" aria-hidden>＋</span>
        </Button>
      </div>
    </article>
  );
}
