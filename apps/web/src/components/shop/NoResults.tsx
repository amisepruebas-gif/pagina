import Link from 'next/link';
import { Icon, ProductImage } from '@/components/ui';
import type { Category } from '@/types/category';

const ACCENTS = ['#00D97A', '#FF5C8A', '#FFD23F', '#7C3AED', '#00BFFF', '#FF6B35'];

interface NoResultsProps {
  query: string;
  categories: Category[];
}

/** NoResults — pantalla cuando la búsqueda no devuelve nada. */
export function NoResults({ query, categories }: NoResultsProps) {
  return (
    <div>
      <div className="py-12 sm:py-14 px-6 text-center border border-border rounded-xl bg-surface">
        <span className="inline-flex items-center justify-center size-[72px] rounded-full bg-brand-grad text-white shadow-brand mb-5">
          <Icon name="search" size={30} strokeWidth={1.6} />
        </span>
        <h3 className="font-display font-bold leading-tight tracking-[-0.025em] mb-2 text-2xl sm:text-3xl lg:text-[clamp(24px,3.5vw,30px)]">
          Nada coincide con{' '}
          <span className="bg-brand-grad bg-clip-text text-transparent">
            &ldquo;{query}&rdquo;
          </span>
          .
        </h3>
        <p className="text-text-muted max-w-md mx-auto mb-6 text-[15px] leading-relaxed">
          Revisa la ortografía, usa términos más generales o navega por una
          categoría.
        </p>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 h-11 px-6 rounded-pill bg-brand-grad text-on-brand shadow-brand font-display font-semibold text-sm"
        >
          Ver todo el catálogo
        </Link>
      </div>

      {categories.length > 0 && (
        <div className="mt-12">
          <h4 className="font-display font-bold text-lg mb-5">
            Categorías populares
          </h4>
          <div className="grid gap-3 grid-cols-[repeat(auto-fill,minmax(160px,1fr))]">
            {categories.slice(0, 6).map((c, i) => (
              <Link
                key={c.id}
                href={`/shop?cat=${encodeURIComponent(c.id)}`}
                className="relative aspect-[4/3] overflow-hidden rounded-lg border border-border block transition duration-base ease-out hover:-translate-y-1 hover:shadow-md"
              >
                <ProductImage
                  src={c.imageUrl}
                  label={c.name.toUpperCase()}
                  accent={ACCENTS[i % ACCENTS.length]}
                  aspect="4/3"
                  rounded=""
                  className="absolute inset-0 !w-full !h-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-3.5 text-white">
                  <div className="font-display font-bold text-base">
                    {c.name}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
