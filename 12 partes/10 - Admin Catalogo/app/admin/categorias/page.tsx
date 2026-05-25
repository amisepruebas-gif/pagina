import Link from "next/link";
import { Button } from "@/components";
import { AdminPageHeader, CategoriesTable } from "@/components/admin";
import { ADMIN_CATEGORIES } from "@/lib/admin-catalog";

export const metadata = { title: "Categorías" };

export default function CategoriesPage() {
  return (
    <>
      <AdminPageHeader
        breadcrumb={[{ label: "Admin", href: "/admin" }, { label: "Categorías" }]}
        title="Categorías"
        description={`${ADMIN_CATEGORIES.length} categorías · cambia el orden arrastrando o editando.`}
        action={
          <Link href="/admin/categorias/nueva">
            <Button leadingIcon="plus">Nueva categoría</Button>
          </Link>
        }
      />
      <CategoriesTable />
    </>
  );
}
