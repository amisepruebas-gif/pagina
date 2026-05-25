"use client";
import { Button, Select } from "@/components";
import { AdminPageHeader } from "./AdminPageHeader";
import { StatCard } from "./StatCard";
import { SalesChart } from "./SalesChart";
import { DataTable } from "./DataTable";
import { REPORT_TOP_PRODUCTS, REPORT_STATUS_BREAKDOWN, type ReportTopProduct } from "@/lib/admin-rest";
import { fmtMx } from "@/lib/admin-catalog";
import { cn } from "@/lib/cn";

/** ReportsView — panel de métricas del negocio. */
export function ReportsView() {
  return (
    <>
      <AdminPageHeader
        breadcrumb={[{ label: "Admin", href: "/admin" }, { label: "Reportes" }]}
        title="Reportes"
        description="Métricas del negocio en los últimos 30 días."
        action={
          <div className="flex gap-2">
            <Select options={["Últimos 30 días", "Últimos 90 días", "Año en curso"]} className="!h-10 !w-[180px]" />
            <Button variant="secondary" leadingIcon="grid">Exportar PDF</Button>
          </div>
        }
      />
      <div className="p-6 flex flex-col gap-[18px]">
        <div className="grid gap-3.5 grid-cols-[repeat(auto-fit,minmax(220px,1fr))]">
          <StatCard label="Ingresos"        value="$684,219" change={12.4} icon="bolt"  tone="brand" />
          <StatCard label="Ticket promedio" value="$548"     change={4.1}  icon="spark" tone="accent" />
          <StatCard label="Pedidos"         value="1,248"    change={8.2}  icon="cart"  tone="secondary" />
          <StatCard label="Clientes nuevos" value="312"      change={-2.4} icon="user"  tone="info" />
        </div>

        <SalesChart days={30} />

        <div className="grid gap-3.5 grid-cols-1 xl:grid-cols-[1.4fr_1fr]">
          <section>
            <div className="flex justify-between items-baseline mb-2.5">
              <h3 className="font-display font-bold text-base">Productos más vendidos</h3>
              <span className="text-xs text-text-soft">top 5</span>
            </div>
            <DataTable<ReportTopProduct>
              columns={[
                { key: "rank", label: "#", align: "center", width: "44px",
                  render: (r) => <span className="font-mono font-bold">{r.id}</span> },
                { key: "name", label: "Producto", render: (r) => (
                  <div>
                    <div className="font-display font-semibold">{r.name}</div>
                    <code className="font-mono text-[11px] text-text-soft">{r.sku}</code>
                  </div>
                )},
                { key: "sold", label: "Unidades", align: "right",
                  render: (r) => <span className="font-display font-bold">{r.sold}</span> },
                { key: "revenue", label: "Ingresos", align: "right",
                  render: (r) => <span className="font-display font-bold text-brand-700">{fmtMx(r.revenue)}</span> },
              ]}
              rows={REPORT_TOP_PRODUCTS}
            />
          </section>

          <section>
            <div className="flex justify-between items-baseline mb-2.5">
              <h3 className="font-display font-bold text-base">Pedidos por estado</h3>
              <span className="text-xs text-text-soft">1,248 totales</span>
            </div>
            <div className="bg-surface border border-border rounded-lg p-4 flex flex-col gap-3">
              {REPORT_STATUS_BREAKDOWN.map((s) => (
                <div key={s.status}>
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="font-display font-semibold text-[13px] inline-flex items-center gap-1.5">
                      <span className={cn("size-2.5 rounded-full", toneToBg(s.tone))} />
                      {s.label}
                    </span>
                    <span className="text-xs text-text-soft tabular-nums">{s.count} · {s.pct}%</span>
                  </div>
                  <div className="h-1.5 bg-surface-2 rounded-full overflow-hidden">
                    <div className={cn("h-full rounded-full", toneToBg(s.tone))} style={{ width: `${s.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

function toneToBg(tone: string) {
  switch (tone) {
    case "success": return "bg-success";
    case "info":    return "bg-info";
    case "warning": return "bg-warning";
    case "error":   return "bg-error";
    default:        return "bg-text-soft";
  }
}
