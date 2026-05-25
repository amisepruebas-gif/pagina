import Link from "next/link";
import { Button } from "@/components";
import { AdminPageHeader, SiteContentTable } from "@/components/admin";

export const metadata = { title: "Contenido" };

export default function ContentPage() {
  return (
    <>
      <AdminPageHeader
        breadcrumb={[{ label: "Admin", href: "/admin" }, { label: "Contenido" }]}
        title="Contenido del sitio"
        description="Bloques editables del storefront — hero, banners promocionales y mensajes de topbar."
        action={
          <Link href="/admin/contenido/nuevo">
            <Button leadingIcon="plus">Nuevo bloque</Button>
          </Link>
        }
      />
      <SiteContentTable />
    </>
  );
}
