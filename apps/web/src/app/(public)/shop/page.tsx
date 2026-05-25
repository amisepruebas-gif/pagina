import type { Metadata } from 'next';
import { getProducts } from '@/lib/products';
import { getCategories } from '@/lib/categories';
import { getSubcategories } from '@/lib/subcategories';
import { getMaterials } from '@/lib/materials';
import { maxPriceOf } from '@/lib/shop-filters';
import { ShopClient } from '@/components/shop';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Tienda',
  description: 'Explora el catálogo completo de productos.',
  // Cualquier variante con filtros (?cat=, ?sale=) apunta al listado base
  // para que Google no compita el listado contra sí mismo.
  alternates: { canonical: '/shop' }
};

interface ShopSearchParams {
  cat?: string;
  sale?: string;
}

export default async function ShopPage({
  searchParams
}: {
  searchParams: Promise<ShopSearchParams>;
}) {
  const params = await searchParams;
  const onlySale = params.sale === 'true';

  const [products, categories, subcategories, materials] = await Promise.all([
    getProducts(onlySale ? { onlySale: true } : {}),
    getCategories(),
    getSubcategories(),
    getMaterials()
  ]);

  return (
    <ShopClient
      mode="catalog"
      products={products}
      categories={categories}
      subcategories={subcategories}
      materials={materials}
      maxPrice={maxPriceOf(products)}
      initialCategory={params.cat ?? null}
      catalogTitle={onlySale ? 'Ofertas' : undefined}
    />
  );
}
