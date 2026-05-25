import Link from 'next/link';
import { getProducts } from '@/lib/products';
import type { Product } from '@/types/product';
import { ProductCard } from '@/components/ui';
import { toUiProduct, productHref } from '@/lib/ui-adapters';
import { SectionTitle } from './SectionTitle';

interface Props {
  current: Product;
  max?: number;
}

/**
 * Sección "También te puede gustar".
 * Heurística: misma categoría → mismo material → catálogo reciente.
 */
export default async function RelatedProducts({ current, max = 8 }: Props) {
  const candidates: Product[] = [];
  const seen = new Set<string>([current.id]);

  function pushUnique(items: Product[]) {
    for (const p of items) {
      if (seen.has(p.id)) continue;
      candidates.push(p);
      seen.add(p.id);
      if (candidates.length >= max) return;
    }
  }

  try {
    if (current.categoryId) {
      pushUnique(
        await getProducts({ categoryId: current.categoryId, limit: max + 1 })
      );
    }
    if (candidates.length < max && current.materialId) {
      pushUnique(
        await getProducts({ materialId: current.materialId, limit: max + 1 })
      );
    }
    if (candidates.length < max) {
      pushUnique(await getProducts({ limit: max + 1 }));
    }
  } catch (err) {
    console.error('[RelatedProducts] error:', err);
    return null;
  }

  if (candidates.length === 0) return null;

  return (
    <section className="py-12 pb-16 border-t border-border">
      <SectionTitle eyebrow="Te puede interesar">
        También te puede gustar
      </SectionTitle>
      <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-[repeat(auto-fill,minmax(230px,1fr))]">
        {candidates.map((p, i) => (
          <Link key={p.id} href={productHref(p)} className="block">
            <ProductCard variant="canonical" product={toUiProduct(p, i)} />
          </Link>
        ))}
      </div>
    </section>
  );
}
