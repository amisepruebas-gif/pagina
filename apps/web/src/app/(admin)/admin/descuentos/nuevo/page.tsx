import DiscountForm from '@/components/admin/DiscountForm';
import { getCategories } from '@/lib/categories';
import { getProducts } from '@/lib/products';

export const revalidate = 0;
export const metadata = {
  title: 'Nuevo descuento · admin'
};

export default async function NewDiscountPage() {
  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts({ limit: 500 })
  ]);

  return <DiscountForm categories={categories} products={products} />;
}
