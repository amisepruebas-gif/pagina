import { getDiscounts } from '@/lib/discounts';
import { getCategories } from '@/lib/categories';
import { getProducts } from '@/lib/products';
import DiscountsTable from '@/components/admin/DiscountsTable';

export const revalidate = 0;

export const metadata = { title: 'Descuentos · admin' };

export default async function AdminDiscountsPage() {
  const [discounts, categories, products] = await Promise.all([
    getDiscounts({ includeInactive: true }),
    getCategories({ includeInactive: true }),
    getProducts({ limit: 500 })
  ]);

  return (
    <DiscountsTable
      discounts={discounts}
      categories={categories}
      products={products}
    />
  );
}
