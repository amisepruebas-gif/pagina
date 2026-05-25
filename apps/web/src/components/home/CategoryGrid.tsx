import Link from 'next/link';
import { Button, Icon, ProductImage } from '@/components/ui';
import type { Category } from '@/types/category';
import type { CategoryGridConfig } from '@/types/home-config';

const ACCENTS = ['#FF5C8A', '#00D97A', '#FFD23F', '#7C3AED', '#00BFFF', '#FF6B35'];

/** CategoryGrid — 2/3/6 columnas con las categorías reales. */
export function CategoryGrid({
  config,
  categories
}: {
  config: CategoryGridConfig;
  categories: Category[];
}) {
  if (categories.length === 0) return null;

  return (
    <section className="py-12 sm:py-16 lg:py-24">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
        <div className="flex flex-wrap justify-between items-end gap-4 mb-6 sm:mb-9">
          <div>
            <span className="font-mono text-[12px] tracking-widest uppercase text-text-soft inline-flex items-center gap-2 before:content-[''] before:w-7 before:h-px before:bg-current before:opacity-60">
              {config.eyebrow}
            </span>
            <h2 className="mt-3.5 font-display font-bold leading-none tracking-[-0.03em] text-3xl sm:text-4xl lg:text-[clamp(32px,4.5vw,52px)]">
              {config.titlePre}
              <span className="bg-brand-grad bg-clip-text text-transparent">
                {config.titleAccent}
              </span>
            </h2>
          </div>
          <Link href={config.cta.href}>
            <Button variant="ghost" trailingIcon="arr-right">
              {config.cta.label}
            </Button>
          </Link>
        </div>

        <div className="grid gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
          {categories.slice(0, 6).map((c, i) => (
            <Link
              key={c.id}
              href={`/shop?cat=${c.id}`}
              className="group relative aspect-[3/4] rounded-xl overflow-hidden border border-border transition duration-base ease-out hover:-translate-y-1.5 hover:shadow-lg min-h-11"
            >
              <ProductImage
                src={c.imageUrl}
                label={c.name.toUpperCase()}
                accent={ACCENTS[i % ACCENTS.length]}
                aspect="3/4"
                rounded=""
                className="absolute inset-0 !w-full !h-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-3 sm:p-5 text-white flex items-end justify-between gap-2">
                <h3 className="font-display font-bold text-base sm:text-xl leading-tight tracking-[-0.02em]">
                  {c.name}
                </h3>
                <span className="size-8 sm:size-9 rounded-full bg-white/95 text-text inline-flex items-center justify-center transition duration-base ease-out group-hover:bg-brand-500 group-hover:text-white shrink-0">
                  <Icon name="arr-right" size={14} strokeWidth={2} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
