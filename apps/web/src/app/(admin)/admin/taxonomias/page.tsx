import { getCategories } from '@/lib/categories';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import TaxonomiesTabs from '@/components/admin/TaxonomiesTabs';

export const revalidate = 0;
export const metadata = {
  title: 'Taxonomías · admin'
};

export default async function AdminTaxonomiesPage() {
  const categories = await getCategories({ includeInactive: true });
  return (
    <>
      <AdminPageHeader
        breadcrumb={[{ label: 'Admin', href: '/admin' }, { label: 'Taxonomías' }]}
        title="Taxonomías"
        description="Etiquetas, materiales y subcategorías. Edición inline estilo spreadsheet."
      />
      <TaxonomiesTabs categories={categories} />
    </>
  );
}
