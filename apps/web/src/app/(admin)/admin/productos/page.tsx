import { getProducts } from '@/lib/products';
import { getCategories } from '@/lib/categories';
import { getSubcategories } from '@/lib/subcategories';
import { getMaterials } from '@/lib/materials';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import ProductsTable from '@/components/admin/ProductsTable';
import ProductsHeaderActions from '@/components/admin/ProductsHeaderActions';

export const revalidate = 0;

export const metadata = { title: 'Productos · admin' };

export default async function AdminProductsPage() {
  const [all, categories, subcategories, materials] = await Promise.all([
    getProducts({ limit: 500 }),
    getCategories({ includeInactive: true }),
    getSubcategories({ includeInactive: true }),
    getMaterials({ includeInactive: true })
  ]);

  return (
    <>
      <AdminPageHeader
        breadcrumb={[{ label: 'Admin', href: '/admin' }, { label: 'Productos' }]}
        title="Productos"
        description={`${all.length} producto${
          all.length === 1 ? '' : 's'
        } en el catálogo`}
        action={
          <ProductsHeaderActions
            categories={categories}
            subcategories={subcategories}
            materials={materials}
          />
        }
      />
      <div className="p-6">
        <ProductsTable
          products={all}
          categories={categories}
          subcategories={subcategories}
        />
      </div>
    </>
  );
}
