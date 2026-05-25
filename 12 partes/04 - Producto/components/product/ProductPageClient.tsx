"use client";
import { useRef, useState } from "react";
import { Topbar, Header, CategoryNav, Footer } from "@/components";
import { Breadcrumbs } from "@/components/shop";
import {
  ProductGallery, BuyPanel, ProductDescription, SpecsTable, VolumePricing,
  ReviewsSection, RelatedProducts, StickyAddToCart, type BuySelection,
} from "./";
import type { ProductDetail } from "@/lib/sample-product";
import type { Product } from "@/lib/types";

export interface ProductPageClientProps {
  product: ProductDetail;
  related: Product[];
}

/**
 * ProductPageClient — composición de toda la PDP.
 *
 * Mantiene el estado de la selección (color · talla · cantidad · favorito) y
 * lo pasa al `<BuyPanel/>` y `<StickyAddToCart/>`. El ref al panel permite
 * detectar cuándo activar la barra sticky en móvil.
 */
export function ProductPageClient({ product, related }: ProductPageClientProps) {
  const [activeCat, setActiveCat] = useState("Calzado");
  const [state, setState] = useState<BuySelection>({
    color: product.colors[0]?.value ?? "",
    size:  null,
    qty:   1,
    fav:   false,
  });
  const set = <K extends keyof BuySelection>(key: K, value: BuySelection[K]) =>
    setState((s) => ({ ...s, [key]: value }));

  const buyRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <Topbar />
      <Header cartCount={3} />
      <CategoryNav active={activeCat} onChange={setActiveCat} />

      <main className="max-w-screen-xl mx-auto px-4 sm:px-6 pb-20">
        <Breadcrumbs items={[
          { label: "Inicio", href: "/" },
          { label: "Tienda", href: "/shop" },
          { label: product.category,    href: `/shop?category=${product.category.toLowerCase()}` },
          { label: product.subcategory },
          { label: product.name.slice(0, 28) + "…" },
        ]} />

        <div className="grid gap-8 lg:gap-12 lg:grid-cols-2 items-start pb-4">
          <ProductGallery images={product.images} name={product.name} />
          <BuyPanel ref={buyRef} product={product} state={state} setState={set} />
        </div>

        <ProductDescription description={product.description} bullets={product.bullets} />
        <SpecsTable specs={product.specs} />
        <VolumePricing volume={product.volume} />
        <ReviewsSection avg={product.rating ?? 0} total={product.reviews ?? 0} />
        <RelatedProducts products={related} />
      </main>

      <Footer />

      <StickyAddToCart product={product} state={state} anchorRef={buyRef} />
    </>
  );
}
