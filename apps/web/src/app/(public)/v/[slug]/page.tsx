import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPageViewBySlug } from '@/lib/page-views';
import { getProducts } from '@/lib/products';
import { getCategories } from '@/lib/categories';
import DynamicView from '@/components/views/DynamicView';

export const revalidate = 300;

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const view = await getPageViewBySlug(slug);
  // No revelar el nombre de una vista inactiva (borrador no publicado).
  return {
    title: view && view.active ? `${view.name} · pagina` : 'Vista · pagina'
  };
}

export default async function ViewPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const view = await getPageViewBySlug(slug);
  if (!view || !view.active) notFound();

  const needsProducts = view.modules.some(
    (m) => m.type === 'products' || m.type === 'promo'
  );
  const needsCategories = view.modules.some((m) => m.type === 'categories');

  const [products, categories] = await Promise.all([
    needsProducts ? getProducts() : Promise.resolve([]),
    needsCategories ? getCategories() : Promise.resolve([])
  ]);

  return (
    <DynamicView view={view} products={products} categories={categories} />
  );
}
