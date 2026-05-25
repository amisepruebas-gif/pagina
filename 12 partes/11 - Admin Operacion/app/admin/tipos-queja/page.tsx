import { AdminPageHeader, ComplaintTypesEditor } from "@/components/admin";

export const metadata = { title: "Tipos de queja" };

export default function ComplaintTypesPage() {
  return (
    <>
      <AdminPageHeader
        breadcrumb={[{ label: "Admin", href: "/admin" }, { label: "Tipos de queja" }]}
        title="Tipos de queja"
        description="Catálogo que aparece en el formulario de quejas del cliente."
      />
      <ComplaintTypesEditor />
    </>
  );
}
