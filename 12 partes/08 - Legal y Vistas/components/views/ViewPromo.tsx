import { Button, Icon, ProductCard } from "@/components";
import type { Product } from "@/lib/types";
import { PromoCountdown } from "./PromoCountdown";

export interface ViewPromoProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  /** CSS background (gradiente, sólido, etc.) */
  bg?: string;
  products: Product[];
  /** ISO date string para el countdown */
  endsAt?: string;
  cta?: string;
}

/**
 * ViewPromo — bloque promocional con fondo configurable + countdown opcional +
 * grid de `<ProductCard variant="discount"/>`.
 */
export function ViewPromo({ eyebrow, title, subtitle, bg, products, endsAt, cta }: ViewPromoProps) {
  return (
    <section className="py-8">
      <div
        style={{ background: bg ?? "linear-gradient(120deg, var(--secondary), var(--accent-2))" }}
        className="relative overflow-hidden rounded-2xl p-[clamp(28px,5vw,48px)] text-white"
      >
        <span aria-hidden className="pointer-events-none absolute -top-24 -right-16 size-80 rounded-full opacity-40 blur-[60px]"
              style={{ background: "var(--accent)" }} />

        <div className="relative flex justify-between items-end flex-wrap gap-5 mb-6">
          <div>
            {eyebrow && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full
                               bg-black/20 text-accent font-mono text-[11px] tracking-widest uppercase font-bold">
                <Icon name="bolt" size={12} strokeWidth={2.4} />
                {eyebrow}
              </span>
            )}
            <h2 className="mt-3.5 font-display font-bold leading-none tracking-[-0.035em] text-white
                           text-3xl sm:text-4xl lg:text-[clamp(28px,4.5vw,48px)]">
              {title}
            </h2>
            {subtitle && <p className="mt-2.5 text-[15px] opacity-90 max-w-md">{subtitle}</p>}
          </div>
          {endsAt && <PromoCountdown endsAt={endsAt} />}
        </div>

        <div className="relative grid gap-3.5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-[repeat(auto-fit,minmax(220px,1fr))]">
          {products.map((p) => <ProductCard key={p.id} variant="discount" product={p} />)}
        </div>

        {cta && (
          <div className="relative mt-6 text-center">
            <Button size="lg" variant="secondary" trailingIcon="arr-right">{cta}</Button>
          </div>
        )}
      </div>
    </section>
  );
}
