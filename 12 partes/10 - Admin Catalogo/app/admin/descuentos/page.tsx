import Link from "next/link";
import { Button } from "@/components";
import { AdminPageHeader, DiscountsTable } from "@/components/admin";
import { ADMIN_DISCOUNTS } from "@/lib/admin-catalog";

export const metadata = { title: "Descuentos" };

export default function DiscountsPage() {
  const active = ADMIN_DISCOUNTS.filter((d) => d.active).length;
  return (
    <>
      <AdminPageHeader
        breadcrumb={[{ label: "Admin", href: "/admin" }, { label: "Descuentos" }]}
        title="Descuentos"
        description={`${ADMIN_DISCOUNTS.length} descuentos · ${active} activos.`}
        action={
          <Link href="/admin/descuentos/nuevo">
            <Button leadingIcon="plus">Nuevo descuento</Button>
          </Link>
        }
      />
      <DiscountsTable />
    </>
  );
}
