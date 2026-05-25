"use client";
import { forwardRef, useState } from "react";
import { Badge, Button, Icon, Stars } from "@/components";
import type { ProductDetail } from "@/lib/sample-product";
import { VariantPicker } from "./VariantPicker";
import { QuantityStepper } from "./QuantityStepper";
import { StockBadge } from "./StockBadge";
import { TrustSignals } from "./TrustSignals";

export interface BuySelection {
  color: string;
  size: string | null;
  qty: number;
  fav: boolean;
}

export interface BuyPanelProps {
  product: ProductDetail;
  state: BuySelection;
  setState: <K extends keyof BuySelection>(key: K, value: BuySelection[K]) => void;
  /** Callback al agregar al carrito */
  onAddToCart?: (state: BuySelection) => void;
}

/**
 * BuyPanel — panel de compra. Toma `forwardRef` para que
 * `StickyAddToCart` pueda observarlo con IntersectionObserver.
 */
export const BuyPanel = forwardRef<HTMLDivElement, BuyPanelProps>(function BuyPanel(
  { product, state, setState, onAddToCart }, ref) {
  const [added, setAdded] = useState(false);
  const discount = product.oldPrice
    ? Math.round((1 - product.price / product.oldPrice) * 100) : 0;

  const addToCart = () => {
    if (!state.size) return;
    onAddToCart?.(state);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div ref={ref} className="flex flex-col gap-5">
      <div>
        <div className="flex items-center gap-2.5 font-mono text-[11px] tracking-widest uppercase text-text-soft">
          {product.brand}
          <span className="opacity-50">·</span>
          <span>SKU {product.sku}</span>
        </div>
        <h1 className="mt-3 font-display font-bold leading-[1.1] tracking-[-0.025em]
                       text-[clamp(28px,4vw,40px)]">
          {product.name}
        </h1>
        {product.rating != null && (
          <a href="#reviews" className="mt-3 inline-flex items-center gap-2 text-inherit no-underline">
            <Stars value={product.rating} reviews={product.reviews} />
            <span className="text-[13px] text-brand-700 font-semibold">Ver reseñas</span>
          </a>
        )}
      </div>

      {/* price */}
      <div className="flex items-end gap-3.5 flex-wrap pb-5 border-b border-border">
        <span className="font-display font-bold leading-none tracking-[-0.03em]
                         text-[clamp(36px,5vw,48px)]">
          ${product.price.toLocaleString("es-MX")}
        </span>
        {product.oldPrice && (
          <span className="text-lg text-text-soft line-through mb-1">
            ${product.oldPrice.toLocaleString("es-MX")}
          </span>
        )}
        {discount > 0 && (
          <Badge tone="secondary" size="md" leadingIcon="bolt">-{discount}%</Badge>
        )}
      </div>

      <VariantPicker
        colors={product.colors}
        selectedColor={state.color}
        onColorChange={(v) => setState("color", v)}
        sizes={product.sizes}
        selectedSize={state.size}
        onSizeChange={(v) => setState("size", v)}
      />

      <StockBadge stock={product.stock ?? 0} inStock={product.inStock} />

      <div className="flex gap-3 items-center flex-wrap">
        <QuantityStepper value={state.qty} onChange={(v) => setState("qty", v)} max={product.stock ?? 99} />
        <Button
          size="lg"
          leadingIcon={added ? "check" : "cart"}
          onClick={addToCart}
          disabled={!state.size}
          className="flex-1 min-w-[200px] !h-[54px]"
        >
          {added ? "¡Agregado al carrito!" : state.size ? "Agregar al carrito" : "Selecciona una talla"}
        </Button>
      </div>

      <div className="flex gap-3">
        <Button variant="secondary"
                leadingIcon={state.fav ? "heart-filled" : "heart"}
                onClick={() => setState("fav", !state.fav)}
                fullWidth>
          {state.fav ? "Guardado" : "Guardar"}
        </Button>
        <Button variant="secondary" leadingIcon="bolt" fullWidth>
          Comprar ahora
        </Button>
      </div>

      <div className="flex items-center gap-3 p-4 bg-brand-50 rounded-md">
        <span className="shrink-0 size-9 rounded-full bg-white text-brand-700 inline-flex items-center justify-center shadow-xs">
          <Icon name="truck" size={18} strokeWidth={2} />
        </span>
        <div className="min-w-0">
          <div className="font-display font-semibold text-sm">
            Envío gratis · llega entre el 22 y 24 de mayo
          </div>
          <div className="text-xs text-text-muted mt-0.5">
            Entrega estimada en {product.shipsIn} · CP destino: 06700
          </div>
        </div>
      </div>

      <TrustSignals />
    </div>
  );
});
