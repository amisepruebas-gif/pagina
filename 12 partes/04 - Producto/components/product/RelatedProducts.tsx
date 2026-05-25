import { Button, ProductCard } from "@/components";
import type { Product } from "@/lib/types";
import { SectionTitle } from "./SectionTitle";

interface RelatedProductsProps {
  products: Product[];
}

/**
 * RelatedProducts — grid de 4 `<ProductCard variant="canonical"/>`.
 * En móvil: 2 columnas.
 */
export function RelatedProducts({ products }: RelatedProductsProps) {
  return (
    <section className="py-12 pb-16 border-t border-border">
      <div className="flex justify-between items-end flex-wrap gap-3 mb-6">
        <SectionTitle eyebrow="05 / Te puede interesar">También te puede gustar</SectionTitle>
        <Button variant="ghost" trailingIcon="arr-right">Ver más</Button>
      </div>
      <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-[repeat(auto-fill,minmax(230px,1fr))]">
        {products.map((p) => (
          <ProductCard key={p.id} variant="canonical" product={p} />
        ))}
      </div>
    </section>
  );
}
