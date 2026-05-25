import { Button } from "@/components";
import { AdminPageHeader, UsersTable } from "@/components/admin";
import { ADMIN_USERS } from "@/lib/admin-rest";

export const metadata = { title: "Usuarios" };

export default function UsersPage() {
  const admins = ADMIN_USERS.filter((u) => u.role === "admin").length;
  const staff  = ADMIN_USERS.filter((u) => u.role === "staff").length;
  return (
    <>
      <AdminPageHeader
        breadcrumb={[{ label: "Admin", href: "/admin" }, { label: "Usuarios" }]}
        title="Usuarios"
        description={`${ADMIN_USERS.length} usuarios · ${admins} admins · ${staff} staff`}
        action={<Button leadingIcon="plus">Invitar usuario</Button>}
      />
      <UsersTable />
    </>
  );
}
