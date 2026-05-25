import { Button } from "@/components";
import { AdminPageHeader, ProductsTable } from "@/components/admin";
import Link from "next/link";
import { ADMIN_PRODUCTS } from "@/lib/admin-catalog";

export const metadata = { title: "Productos" };

/** /admin/productos — Lista de productos. */
export default function ProductsPage() {
  return (
    <>
      <AdminPageHeader
        breadcrumb={[{ label: "Admin", href: "/admin" }, { label: "Productos" }]}
        title="Productos"
        description={`${ADMIN_PRODUCTS.length} productos en el catálogo`}
        action={
          <div className="flex gap-2">
            <Button variant="secondary" leadingIcon="grid">Importar CSV</Button>
            <Link href="/admin/productos/nuevo">
              <Button leadingIcon="plus">Nuevo producto</Button>
            </Link>
          </div>
        }
      />
      <ProductsTable />
    </>
  );
}
