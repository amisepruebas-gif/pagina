import { getCategories } from '@/lib/categories';
import CategoriesTable from '@/components/admin/CategoriesTable';

export const revalidate = 0;

export const metadata = { title: 'Categorías · admin' };

export default async function AdminCategoriesPage() {
  const cats = await getCategories({ includeInactive: true });
  return <CategoriesTable categories={cats} />;
}
