import { AdminPageHeader, ComplaintsTable } from "@/components/admin";
import { ADMIN_COMPLAINTS } from "@/lib/admin-ops";

export const metadata = { title: "Quejas" };

export default function ComplaintsPage() {
  const open = ADMIN_COMPLAINTS.filter((c) => c.status === "open").length;
  return (
    <>
      <AdminPageHeader
        breadcrumb={[{ label: "Admin", href: "/admin" }, { label: "Quejas" }]}
        title="Quejas"
        description={`${ADMIN_COMPLAINTS.length} tickets · ${open} abiertos`}
      />
      <ComplaintsTable />
    </>
  );
}
