import Link from "next/link";
import { Badge, Button, Icon, IconButton } from "@/components";
import {
  AdminPageHeader, StatCard, DataTable, SalesChart,
} from "@/components/admin";
import {
  RECENT_ORDERS, LOW_STOCK, QUICK_LINKS, STATUS_TONE,
  type DashboardOrder,
} from "@/lib/admin-dashboard";

export const metadata = { title: "Dashboard" };

/** /admin — Dashboard del back-office. */
export default function AdminDashboardPage() {
  return (
    <>
      <AdminPageHeader
        breadcrumb={[{ label: "Admin", href: "/admin" }, { label: "Dashboard" }]}
        title="Dashboard"
        description="Vista general de tu tienda — ingresos, pedidos y stock en un vistazo."
        action={
          <div className="flex gap-2">
            <Button variant="secondary" leadingIcon="grid">Exportar</Button>
            <Button leadingIcon="plus">Nuevo pedido</Button>
          </div>
        }
      />

      <div className="p-6 flex flex-col gap-5">
        {/* KPIs */}
        <div className="grid gap-3.5 grid-cols-[repeat(auto-fit,minmax(220px,1fr))]">
          <StatCard label="Ingresos"        value="$684,219" change={12.4} icon="bolt"  tone="brand" />
          <StatCard label="Pedidos"         value="1,248"    change={8.2}  icon="cart"  tone="secondary" />
          <StatCard label="Clientes nuevos" value="312"      change={-2.4} icon="user"  tone="info" />
          <StatCard label="Ticket promedio" value="$548"     change={4.1}  icon="spark" tone="accent" />
        </div>

        <SalesChart days={30} />

        {/* 2-col: recent orders + low stock + quick links */}
        <div className="grid gap-3.5 grid-cols-1 xl:grid-cols-[1.6fr_1fr]">
          <section className="min-w-0">
            <div className="flex justify-between items-baseline mb-2.5">
              <h3 className="font-display font-bold text-base">Pedidos recientes</h3>
              <Link href="/admin/pedidos" className="text-[13px] text-brand-700 no-underline font-display font-semibold">
                Ver todos →
              </Link>
            </div>
            <DataTable<DashboardOrder>
              columns={[
                { key: "id", label: "Pedido", render: (r) => <code className="font-mono font-semibold">{r.id}</code> },
                { key: "customer", label: "Cliente" },
                { key: "date", label: "Fecha", render: (r) => <span className="text-text-soft">{r.date}</span> },
                { key: "status", label: "Estado", render: (r) => {
                  const st = STATUS_TONE[r.status]; return <Badge tone={st.tone} size="xs">{st.label}</Badge>;
                }},
                { key: "total", label: "Total", align: "right",
                  render: (r) => <span className="font-display font-bold">${r.total.toLocaleString("es-MX")}</span> },
              ]}
              rows={RECENT_ORDERS}
            />
          </section>

          <section className="min-w-0">
            <div className="flex justify-between items-baseline mb-2.5">
              <h3 className="font-display font-bold text-base">Stock bajo</h3>
              <Link href="/admin/productos" className="text-[13px] text-brand-700 no-underline font-display font-semibold">
                Ver inventario →
              </Link>
            </div>
            <div className="bg-surface border border-border rounded-lg overflow-hidden flex flex-col">
              {LOW_STOCK.map((p, i) => (
                <div key={p.id} className={`flex items-center gap-3 px-3.5 py-3
                                              ${i === 0 ? "" : "border-t border-border"}`}>
                  <span className={`size-9 rounded-sm inline-flex items-center justify-center shrink-0
                                     font-display font-bold text-[13px]
                                     ${p.stock <= 2
                                       ? "bg-error/[0.12] text-error"
                                       : "bg-warning/[0.12] text-warning"}`}>
                    {p.stock}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="font-display font-semibold text-[13px] truncate">{p.name}</div>
                    <div className="text-[11px] text-text-soft font-mono">{p.brand} · {p.sku}</div>
                  </div>
                  <IconButton variant="ghost" icon="plus" label="Reabastecer" size="sm" />
                </div>
              ))}
            </div>

            <div className="mt-3.5 p-4 rounded-lg border border-border
                            bg-[linear-gradient(120deg,var(--brand-50),#FFF9E6)]">
              <div className="font-display font-bold text-sm mb-2">Accesos rápidos</div>
              <div className="flex flex-col gap-1.5">
                {QUICK_LINKS.map((q) => (
                  <Link key={q.href} href={q.href}
                        className="flex items-center gap-2.5 px-2.5 py-2 rounded-sm bg-surface border border-border
                                   no-underline text-text font-display font-medium text-[13px]">
                    <Icon name={q.icon} size={14} strokeWidth={2} className="text-brand-700" />
                    <span className="flex-1">{q.label}</span>
                    {q.badge != null && <Badge tone="secondary" size="xs">{q.badge}</Badge>}
                    <Icon name="chev-right" size={12} strokeWidth={2.4} className="text-text-soft" />
                  </Link>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
