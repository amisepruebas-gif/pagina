import { Button, ProductCard } from "@/components";
import type { Product } from "@/lib/types";

export interface ViewProductsProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  products: Product[];
  cta?: string;
}

/** ViewProducts — header + grid de `<ProductCard variant="canonical"/>`. */
export function ViewProducts({ eyebrow, title, subtitle, products, cta }: ViewProductsProps) {
  return (
    <section className="py-12">
      <div className="flex justify-between items-end flex-wrap gap-3 mb-6">
        <div>
          {eyebrow && (
            <span className="font-mono text-[12px] tracking-widest uppercase text-text-soft
                             inline-flex items-center gap-2 before:content-[''] before:w-7 before:h-px before:bg-current before:opacity-60">
              {eyebrow}
            </span>
          )}
          <h2 className={`${eyebrow ? "mt-3" : ""} font-display font-bold leading-[1.05] tracking-[-0.03em]
                          text-3xl sm:text-4xl lg:text-[clamp(28px,4vw,44px)]`}>
            {title}
          </h2>
          {subtitle && <p className="mt-2 text-text-muted max-w-xl">{subtitle}</p>}
        </div>
        {cta && <Button variant="ghost" trailingIcon="arr-right">{cta}</Button>}
      </div>
      <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-[repeat(auto-fill,minmax(230px,1fr))]">
        {products.map((p) => <ProductCard key={p.id} variant="canonical" product={p} />)}
      </div>
    </section>
  );
}
