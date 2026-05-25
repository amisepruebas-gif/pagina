"use client";
import type { Product } from "@/lib/types";
import { ProductCard } from "@/components";
import { ProductRow } from "./ProductRow";
import type { ProductView } from "./Toolbar";

interface ProductGridProps {
  products: Product[];
  view?: ProductView;
  onSelect?: (p: Product) => void;
  onToggleFav?: (p: Product, fav: boolean) => void;
  onAddToCart?: (p: Product, size?: string) => void;
}

/**
 * ProductGrid — 2 columnas en móvil, 3-4 en desktop. Lista en `view="list"`.
 */
export function ProductGrid({
  products, view = "grid", onSelect, onToggleFav, onAddToCart,
}: ProductGridProps) {
  if (view === "list") {
    return (
      <div className="flex flex-col gap-3">
        {products.map((p) => (
          <ProductRow key={p.id} product={p} onAddToCart={onAddToCart} onToggleFav={onToggleFav} />
        ))}
      </div>
    );
  }
  return (
    <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-[repeat(auto-fill,minmax(230px,1fr))]">
      {products.map((p) => (
        <ProductCard
          key={p.id} variant="canonical" product={p}
          onSelect={onSelect} onToggleFav={onToggleFav}
        />
      ))}
    </div>
  );
}
