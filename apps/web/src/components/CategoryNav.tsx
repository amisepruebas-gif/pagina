import Link from 'next/link';
import { getCategories } from '@/lib/categories';

const PILL =
  'shrink-0 inline-flex items-center gap-1.5 h-9 px-4 rounded-pill font-display text-sm font-medium whitespace-nowrap border transition duration-base ease-out';

/**
 * Barra de categorías navegables (desktop). Cada categoría es clickeable
 * y lleva al listado filtrado. En mobile las categorías viven en el drawer.
 */
export default async function CategoryNav() {
  let categories;
  try {
    categories = await getCategories();
  } catch (err) {
    console.error('[CategoryNav] error cargando categorías', err);
    return null;
  }
  if (categories.length === 0) return null;

  return (
    <nav
      aria-label="Categorías"
      className="hidden md:block border-t border-border bg-surface"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="h-14 flex items-center gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <Link
            href="/shop"
            className={`${PILL} border-border text-text hover:border-brand-500 hover:bg-surface-2`}
          >
            Todo
          </Link>
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/shop?cat=${encodeURIComponent(c.id)}`}
              className={`${PILL} border-border text-text hover:border-brand-500 hover:bg-surface-2`}
            >
              {c.name}
            </Link>
          ))}
          <Link
            href="/shop?sale=true"
            className={`${PILL} border-transparent bg-secondary text-white hover:brightness-105`}
          >
            Ofertas
          </Link>
        </div>
      </div>
    </nav>
  );
}
