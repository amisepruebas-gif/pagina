import { notFound } from 'next/navigation';
import { getDiscountById } from '@/lib/discounts';
import { getCategories } from '@/lib/categories';
import { getProducts } from '@/lib/products';
import DiscountForm from '@/components/admin/DiscountForm';
import type { DiscountFormValues } from '@/lib/admin/discounts-admin';

export const revalidate = 0;

function toDateInputStr(d?: Date): string {
  if (!d) return '';
  return d.toISOString().slice(0, 10);
}

export default async function EditDiscountPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [discount, categories, products] = await Promise.all([
    getDiscountById(id),
    getCategories(),
    getProducts({ limit: 500 })
  ]);
  if (!discount) notFound();

  const initial: Partial<DiscountFormValues> & { id: string } = {
    id,
    name: discount.name,
    description: discount.description,
    code: discount.code,
    type: discount.type,
    categoryId: discount.categoryId,
    productId: discount.productId,
    percentage: discount.percentage,
    season: discount.season,
    validFrom: toDateInputStr(discount.validFrom),
    validUntil: toDateInputStr(discount.validUntil),
    active: discount.active
  };

  return (
    <DiscountForm
      initial={initial}
      categories={categories}
      products={products}
    />
  );
}
