import { AdminPageHeader, OrdersTable } from "@/components/admin";
import { Button } from "@/components";
import { ADMIN_ORDERS } from "@/lib/admin-ops";

export const metadata = { title: "Pedidos" };

export default function OrdersPage() {
  const processing = ADMIN_ORDERS.filter((o) => o.status === "processing").length;
  return (
    <>
      <AdminPageHeader
        breadcrumb={[{ label: "Admin", href: "/admin" }, { label: "Pedidos" }]}
        title="Pedidos"
        description={`${ADMIN_ORDERS.length} pedidos · ${processing} procesando`}
        action={<Button variant="secondary" leadingIcon="grid">Exportar</Button>}
      />
      <OrdersTable />
    </>
  );
}
