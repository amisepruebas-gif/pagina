import Link from "next/link";
import { Button } from "@/components";
import { AdminPageHeader, ViewsTable } from "@/components/admin";
import { ADMIN_VIEWS } from "@/lib/admin-rest";

export const metadata = { title: "Vistas" };

export default function ViewsListPage() {
  return (
    <>
      <AdminPageHeader
        breadcrumb={[{ label: "Admin", href: "/admin" }, { label: "Vistas" }]}
        title="Vistas dinámicas"
        description={`${ADMIN_VIEWS.length} landings configurables · accesibles en /v/[slug]`}
        action={
          <Link href="/admin/vistas/nueva">
            <Button leadingIcon="plus">Nueva vista</Button>
          </Link>
        }
      />
      <ViewsTable />
    </>
  );
}
