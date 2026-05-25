"use client";
import { Button } from "@/components";
import { ACCOUNT_ORDERS } from "@/lib/sample-account";
import { SectionHeader } from "./SectionHeader";
import { OrderCard } from "./OrderCard";
import { AccountEmptyState } from "./EmptyState";

/** OrdersTab — historial de pedidos. */
export function OrdersTab() {
  if (ACCOUNT_ORDERS.length === 0) {
    return (
      <AccountEmptyState
        icon="cart" title="Aún no tienes pedidos"
        body="Cuando hagas tu primera compra, la verás aquí."
        cta="Explorar tienda"
      />
    );
  }

  return (
    <div>
      <SectionHeader
        title="Tus pedidos"
        subtitle={`${ACCOUNT_ORDERS.length} pedidos en total`}
        action={<Button variant="ghost" leadingIcon="grid">Filtrar</Button>}
      />
      <div className="flex flex-col gap-3.5">
        {ACCOUNT_ORDERS.map((o) => <OrderCard key={o.id} order={o} />)}
      </div>
    </div>
  );
}
