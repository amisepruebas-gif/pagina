import { HomeBlocks } from '@/components/home/HomeBlocks';
import JsonLd from '@/components/JsonLd';
import { getProductsByIds } from '@/lib/products';
import { getCategories } from '@/lib/categories';
import { getHomeConfig } from '@/lib/home-config';

// ISR: el editor del admin propaga cambios en ≤ 1 min, y entre visitas
// el HTML se sirve del edge cache de Vercel sin tocar Firestore.
export const revalidate = 60;

const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '') ?? 'http://localhost:3030';

function HomeJsonLd() {
  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'pagina',
          url: APP_URL
        }}
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          url: APP_URL,
          potentialAction: {
            '@type': 'SearchAction',
            target: `${APP_URL}/search?q={search_term_string}`,
            'query-input': 'required name=search_term_string'
          }
        }}
      />
    </>
  );
}

/**
 * Home ("vista principal"). El Hero es fijo; el resto de bloques se recorren
 * desde `config.layout` (orden + visibilidad). Solo se cargan los productos
 * y categorías que los bloques visibles realmente referencian.
 */
export default async function HomePage() {
  const config = await getHomeConfig();

  const visibleRefs = new Set(
    config.layout.filter((e) => e.visible).map((e) => e.ref)
  );

  // Junta los productos referenciados por las secciones/módulos visibles.
  const productIds = new Set<string>();
  const addIds = (ids: string[]) => ids.forEach((id) => productIds.add(id));
  if (visibleRefs.has('featured')) addIds(config.featured.productIds);
  if (visibleRefs.has('newArrivals')) addIds(config.newArrivals.productIds);
  if (visibleRefs.has('flashSale')) addIds(config.flashSale.productIds);
  if (visibleRefs.has('bestSellers')) addIds(config.bestSellers.productIds);
  for (const m of config.modules) {
    if (
      visibleRefs.has(m.id) &&
      (m.type === 'products' || m.type === 'promo')
    ) {
      addIds(m.productIds ?? []);
    }
  }

  const needsCategories = visibleRefs.has('categoryGrid');

  const [products, categories] = await Promise.all([
    productIds.size > 0
      ? getProductsByIds([...productIds])
      : Promise.resolve([]),
    needsCategories ? getCategories() : Promise.resolve([])
  ]);

  return (
    <>
      <HomeJsonLd />
      <HomeBlocks config={config} data={{ products, categories }} />
    </>
  );
}
