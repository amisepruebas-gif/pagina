import { AdminPageHeader, TaxonomyTabs } from "@/components/admin";

export const metadata = { title: "Taxonomías" };

export default function TaxonomiesPage() {
  return (
    <>
      <AdminPageHeader
        breadcrumb={[{ label: "Admin", href: "/admin" }, { label: "Taxonomías" }]}
        title="Taxonomías"
        description="Edita las opciones de clasificación que aparecen en el formulario de producto."
      />
      <TaxonomyTabs />
    </>
  );
}
