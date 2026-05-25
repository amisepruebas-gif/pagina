import Link from 'next/link';
import type { ViewModule } from '@/types/page-view';
import type { Category } from '@/types/category';

/** Módulo "Compra por categoría" — todas las categorías activas. */
export default function ViewCategories({
  module,
  categories
}: {
  module: ViewModule;
  categories: Category[];
}) {
  if (categories.length === 0) return null;

  return (
    <section className="py-10 px-4 sm:px-6 bg-surface-2">
      <div className="mx-auto max-w-7xl">
        <h2 className="font-display text-2xl md:text-3xl font-bold tracking-[-0.02em]">
          {module.title || 'Compra por categoría'}
        </h2>
        {module.subtitle && (
          <p className="mt-1 text-sm text-text-muted">{module.subtitle}</p>
        )}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/shop?cat=${encodeURIComponent(c.id)}`}
              className="group relative aspect-square rounded-xl overflow-hidden border border-border shadow-sm transition duration-base ease-out hover:-translate-y-1 hover:shadow-lg flex items-end p-4"
              style={
                c.imageUrl
                  ? {
                      backgroundImage: `linear-gradient(rgba(0,0,0,0.25),rgba(0,0,0,0.55)), url(${c.imageUrl})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }
                  : undefined
              }
            >
              {!c.imageUrl && (
                <div
                  aria-hidden
                  className={`absolute inset-0 bg-gradient-to-br ${
                    c.gradient ?? 'from-brand-400 to-accent-2'
                  }`}
                />
              )}
              <span className="relative font-display text-lg font-bold text-white drop-shadow">
                {c.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
