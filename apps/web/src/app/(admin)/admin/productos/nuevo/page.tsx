import ProductForm from '@/components/admin/ProductForm';
import { getCategories } from '@/lib/categories';
import { getSubcategories } from '@/lib/subcategories';
import { getMaterials } from '@/lib/materials';
import { getTags } from '@/lib/tags';

export const revalidate = 0;
export const metadata = {
  title: 'Nuevo producto · admin'
};

export default async function NewProductPage() {
  const [categories, subcategories, materials, tags] = await Promise.all([
    getCategories(),
    getSubcategories(),
    getMaterials(),
    getTags()
  ]);
  return (
    <ProductForm
      categories={categories}
      subcategories={subcategories}
      materials={materials}
      tags={tags}
    />
  );
}
