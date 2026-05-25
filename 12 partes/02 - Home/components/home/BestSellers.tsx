import { Button, ProductCard } from "@/components";
import { HOME_PRODUCTS } from "@/lib/sample-products";

/**
 * BestSellers — grid de productos en variante `quick-actions`
 * (tap-friendly: muestra "Agregar" siempre en touch).
 */
export function BestSellers() {
  return (
    <section className="py-12 sm:py-16">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
        <div className="flex flex-wrap justify-between items-end gap-4 mb-6 sm:mb-9">
          <div>
            <span className="font-mono text-[12px] tracking-widest uppercase text-text-soft
                             inline-flex items-center gap-2 before:content-[''] before:w-7 before:h-px before:bg-current before:opacity-60">
              Top de la comunidad
            </span>
            <h2 className="mt-3.5 font-display font-bold leading-none tracking-[-0.03em]
                           text-3xl sm:text-4xl lg:text-[clamp(32px,4.5vw,52px)]">
              Más <span className="bg-brand-grad bg-clip-text text-transparent">vendidos</span>
            </h2>
          </div>
          <Button variant="ghost" trailingIcon="arr-right">Ver ranking completo</Button>
        </div>

        <div className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-[repeat(auto-fill,minmax(250px,1fr))]">
          {HOME_PRODUCTS.slice(2, 6).map((p) => (
            <ProductCard key={p.id} variant="quick-actions" product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
