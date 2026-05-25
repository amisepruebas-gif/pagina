import { notFound } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import ProductForm from '@/components/admin/ProductForm';
import type { ProductFormValues } from '@/lib/admin/products-admin';
import type { RawProductDoc } from '@/types/product';
import { getProductImages } from '@/lib/products';
import { getCategories } from '@/lib/categories';
import { getSubcategories } from '@/lib/subcategories';
import { getMaterials } from '@/lib/materials';
import { getTags } from '@/lib/tags';

export const revalidate = 0;

export default async function EditProductPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [snap, categories, subcategories, materials, tags, images] =
    await Promise.all([
      getDoc(doc(db, 'products', id)),
      getCategories(),
      getSubcategories(),
      getMaterials(),
      getTags(),
      getProductImages(id)
    ]);
  if (!snap.exists()) notFound();

  const raw = snap.data() as RawProductDoc;
  // Flatten price si vino anidado.
  let price = 0;
  if (typeof raw.price === 'number') price = raw.price;
  else if (
    raw.price &&
    typeof raw.price === 'object' &&
    typeof raw.price.sale === 'number'
  ) {
    price = raw.price.sale;
  }

  const initial: Partial<ProductFormValues> & { id: string } = {
    id,
    name: raw.name ?? '',
    slug: raw.slug,
    sku: raw.sku,
    description: raw.description,
    longDescription: raw.longDescription,
    price,
    costPrice: raw.costPrice,
    originalPrice: raw.originalPrice,
    stock: raw.stock,
    isNew: !!raw.isNew,
    isFeatured: !!raw.isFeatured,
    active: raw.active !== false,
    primaryImageUrl: raw.primaryImageUrl ?? raw.imageUrl ?? raw.imagePrincipal,
    categoryId: raw.categoryId,
    subcategoryId: raw.subcategoryId,
    materialId: raw.materialId,
    tagIds: raw.tagIds ?? []
  };

  return (
    <ProductForm
      initial={initial}
      initialImages={images.map((img) => img.url)}
      categories={categories}
      subcategories={subcategories}
      materials={materials}
      tags={tags}
    />
  );
}
