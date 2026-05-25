'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  collection,
  onSnapshot,
  type DocumentData
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Order, OrderStatus, RawOrderDoc } from '@/types/order';
import { STATUS_LABELS } from '@/types/order';
import { AdminPageHeader } from './AdminPageHeader';
import { StatCard } from './StatCard';
import { DataTable } from './DataTable';
import { Icon } from '@/components/ui';
import { cn } from '@/lib/cn';

function normalizeOrder(id: string, data: DocumentData): Order {
  const raw = data as RawOrderDoc;
  return {
    id,
    orderNumber: raw.orderNumber ?? id,
    userId: raw.userId,
    guestEmail: raw.guestEmail,
    customer: {
      name: raw.customer?.name ?? '',
      lastName: raw.customer?.lastName,
      email: raw.customer?.email ?? '',
      phone: raw.customer?.phone
    },
    shippingAddress: {
      street: raw.shippingAddress?.street ?? '',
      reference: raw.shippingAddress?.reference,
      city: raw.shippingAddress?.city ?? '',
      state: raw.shippingAddress?.state ?? '',
      zip: raw.shippingAddress?.zip ?? '',
      country: raw.shippingAddress?.country ?? 'México'
    },
    items: raw.items ?? [],
    subtotal: raw.subtotal ?? 0,
    discountTotal: raw.discountTotal ?? 0,
    shippingCost: raw.shippingCost ?? 0,
    total: raw.total ?? 0,
    currency: raw.currency ?? 'MXN',
    payment: {
      method: raw.payment?.method ?? 'other',
      status: raw.payment?.status ?? 'pending',
      providerRef: raw.payment?.providerRef,
      paidAt: raw.payment?.paidAt?.toDate()
    },
    fulfillment: {
      carrier: raw.fulfillment?.carrier,
      trackingNumber: raw.fulfillment?.trackingNumber,
      status: raw.fulfillment?.status ?? 'processing'
    },
    status: raw.status ?? 'processing',
    createdAt: raw.createdAt?.toDate(),
    updatedAt: raw.updatedAt?.toDate()
  };
}

interface ProductLite {
  id: string;
  name: string;
  active: boolean;
  isFeatured: boolean;
  stock?: number;
}

interface UserLite {
  uid: string;
  role: string;
  active: boolean;
  createdAt?: Date;
}

const NOW = () => new Date();
const DAY_MS = 24 * 60 * 60 * 1000;

function toDateKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function fmtMx(n: number): string {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    maximumFractionDigits: 2
  }).format(n);
}

/** Tono de barra por estado de pedido, usando tokens del design system. */
const STATUS_BAR: Record<OrderStatus, string> = {
  processing: 'bg-info',
  shipped: 'bg-warning',
  delivered: 'bg-success',
  cancelled: 'bg-text-soft',
  refunded: 'bg-error'
};

type TopProduct = {
  id: string;
  rank: number;
  name: string;
  qty: number;
  revenue: number;
};

export default function ReportesClient() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<ProductLite[]>([]);
  const [users, setUsers] = useState<UserLite[]>([]);
  const [loadedOrders, setLoadedOrders] = useState(false);
  const [loadedProducts, setLoadedProducts] = useState(false);
  const [loadedUsers, setLoadedUsers] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubO = onSnapshot(
      collection(db, 'orders'),
      (snap) => {
        const list = snap.docs.map((d) => normalizeOrder(d.id, d.data()));
        console.log('[REPORTES] orders snapshot', list.length, 'pedidos');
        setOrders(list);
        setLoadedOrders(true);
      },
      (err) => {
        console.error('[REPORTES] orders error', err);
        setError(err.message);
      }
    );
    const unsubP = onSnapshot(
      collection(db, 'products'),
      (snap) => {
        const list = snap.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            name: (data.name as string) ?? '',
            active: data.active !== false,
            isFeatured: !!data.isFeatured,
            stock: typeof data.stock === 'number' ? data.stock : undefined
          };
        });
        console.log('[REPORTES] products snapshot', list.length, 'productos');
        setProducts(list);
        setLoadedProducts(true);
      },
      (err) => console.error('[REPORTES] products error', err)
    );
    const unsubU = onSnapshot(
      collection(db, 'users'),
      (snap) => {
        const list = snap.docs.map((d) => {
          const data = d.data();
          return {
            uid: d.id,
            role: (data.role as string) ?? 'customer',
            active: data.active !== false,
            createdAt: data.createdAt?.toDate?.() ?? undefined
          };
        });
        console.log('[REPORTES] users snapshot', list.length, 'usuarios');
        setUsers(list);
        setLoadedUsers(true);
      },
      (err) => console.error('[REPORTES] users error', err)
    );
    return () => {
      unsubO();
      unsubP();
      unsubU();
    };
  }, []);

  const loading = !loadedOrders || !loadedProducts || !loadedUsers;

  const orderKpis = useMemo(() => {
    const paid = orders.filter(
      (o) => o.payment.status === 'paid' && o.status !== 'cancelled' && o.status !== 'refunded'
    );
    const revenue = paid.reduce((s, o) => s + o.total, 0);
    const aov = paid.length > 0 ? revenue / paid.length : 0;
    const now = NOW();
    const today = orders.filter(
      (o) => o.createdAt && toDateKey(o.createdAt) === toDateKey(now)
    ).length;
    const week = orders.filter(
      (o) => o.createdAt && now.getTime() - o.createdAt.getTime() < 7 * DAY_MS
    ).length;
    return {
      total: orders.length,
      revenue,
      aov,
      today,
      week,
      processing: orders.filter((o) => o.status === 'processing').length,
      shipped: orders.filter((o) => o.status === 'shipped').length,
      delivered: orders.filter((o) => o.status === 'delivered').length,
      cancelled: orders.filter((o) => o.status === 'cancelled').length,
      refunded: orders.filter((o) => o.status === 'refunded').length
    };
  }, [orders]);

  const productKpis = useMemo(() => {
    const active = products.filter((p) => p.active);
    return {
      totalActive: active.length,
      totalFeatured: active.filter((p) => p.isFeatured).length,
      lowStock: active.filter((p) => typeof p.stock === 'number' && p.stock <= 5).length,
      outOfStock: active.filter((p) => typeof p.stock === 'number' && p.stock === 0).length
    };
  }, [products]);

  const userKpis = useMemo(() => {
    const now = NOW();
    return {
      total: users.length,
      customers: users.filter((u) => u.role === 'customer').length,
      staffOrAdmin: users.filter((u) => u.role === 'staff' || u.role === 'admin').length,
      newThisWeek: users.filter(
        (u) => u.createdAt && now.getTime() - u.createdAt.getTime() < 7 * DAY_MS
      ).length
    };
  }, [users]);

  // Bar chart: orders per day, last 30 days
  const byDay = useMemo(() => {
    const now = NOW();
    const days: { key: string; count: number; revenue: number }[] = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now.getTime() - i * DAY_MS);
      days.push({ key: toDateKey(d), count: 0, revenue: 0 });
    }
    const map = new Map(days.map((d) => [d.key, d]));
    for (const o of orders) {
      if (!o.createdAt) continue;
      const bucket = map.get(toDateKey(o.createdAt));
      if (!bucket) continue;
      bucket.count++;
      if (o.payment.status === 'paid' && o.status !== 'cancelled' && o.status !== 'refunded') {
        bucket.revenue += o.total;
      }
    }
    return days;
  }, [orders]);

  const maxCount = useMemo(
    () => Math.max(1, ...byDay.map((d) => d.count)),
    [byDay]
  );

  // Top productos vendidos (qty + revenue) — solo de paid+entregable
  const topProducts = useMemo(() => {
    const map = new Map<string, { name: string; qty: number; revenue: number }>();
    for (const o of orders) {
      if (o.payment.status !== 'paid') continue;
      if (o.status === 'cancelled' || o.status === 'refunded') continue;
      for (const item of o.items) {
        const cur = map.get(item.productId) ?? {
          name: item.name,
          qty: 0,
          revenue: 0
        };
        cur.qty += item.qty;
        cur.revenue += item.lineTotal;
        map.set(item.productId, cur);
      }
    }
    return Array.from(map.entries())
      .map(([id, v]) => ({ id, ...v }))
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 10)
      .map((p, i) => ({ ...p, rank: i + 1 }));
  }, [orders]);

  // Desglose de estados con porcentaje (para barras de progreso)
  const statusBreakdown = useMemo(() => {
    const total = orderKpis.total || 1;
    return (['processing', 'shipped', 'delivered', 'cancelled', 'refunded'] as const).map(
      (s) => {
        const count = orderKpis[s];
        return {
          status: s,
          label: STATUS_LABELS[s],
          count,
          pct: Math.round((count / total) * 100)
        };
      }
    );
  }, [orderKpis]);

  return (
    <>
      <AdminPageHeader
        breadcrumb={[{ label: 'Admin', href: '/admin' }, { label: 'Reportes' }]}
        title="Reportes"
        description={
          loading
            ? 'Cargando…'
            : 'Dashboard vivo. Se actualiza en tiempo real cuando llegan nuevos datos.'
        }
      />

      <div className="p-6 flex flex-col gap-[18px]">
        {error && (
          <div className="rounded-lg bg-error/10 border border-error/30 text-error text-[13px] px-4 py-3 flex items-center gap-2">
            <Icon name="err" size={16} className="shrink-0" />
            Error al cargar: {error}
          </div>
        )}

        {/* KPIs principales */}
        <div className="grid gap-3.5 grid-cols-[repeat(auto-fit,minmax(220px,1fr))]">
          <StatCard
            label="Ingreso cobrado"
            value={fmtMx(orderKpis.revenue)}
            icon="bolt"
            tone="brand"
          />
          <StatCard
            label="Ticket promedio"
            value={fmtMx(orderKpis.aov)}
            icon="spark"
            tone="accent"
          />
          <StatCard
            label="Pedidos totales"
            value={orderKpis.total.toLocaleString('es-MX')}
            icon="cart"
            tone="secondary"
          />
          <StatCard
            label="Clientes registrados"
            value={userKpis.customers.toLocaleString('es-MX')}
            icon="user"
            tone="info"
          />
        </div>

        {/* Chart 30 días — barras CSS */}
        <section className="bg-surface border border-border rounded-lg p-4 md:p-6">
          <div className="flex justify-between items-baseline mb-4 flex-wrap gap-2">
            <h3 className="font-display font-bold text-base">
              Pedidos por día
            </h3>
            <span className="text-xs text-text-soft">
              {orderKpis.today} hoy · {orderKpis.week} esta semana · últimos 30 días
            </span>
          </div>
          {orderKpis.total === 0 ? (
            <p className="text-[13px] text-text-muted py-8 text-center">
              Sin pedidos aún. La gráfica se llenará cuando lleguen.
            </p>
          ) : (
            <div className="flex items-end gap-1 h-32 sm:h-44">
              {byDay.map((d) => {
                const heightPct = (d.count / maxCount) * 100;
                const label = d.key.slice(5); // MM-DD
                return (
                  <div
                    key={d.key}
                    className="flex-1 flex flex-col items-center justify-end group relative min-w-0"
                    title={`${d.key}: ${d.count} pedidos · ${fmtMx(d.revenue)}`}
                  >
                    <div
                      className={cn(
                        'w-full rounded-t-sm transition-colors duration-fast ease-out',
                        d.count > 0
                          ? 'bg-brand-500 group-hover:bg-brand-700'
                          : 'bg-surface-2'
                      )}
                      style={{ height: `${Math.max(2, heightPct)}%` }}
                    />
                    <span className="hidden md:block text-[8px] text-text-soft mt-1 rotate-45 origin-bottom-left whitespace-nowrap">
                      {label}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Grid de secciones */}
        <div className="grid gap-3.5 grid-cols-1 lg:grid-cols-3">
          {/* Productos */}
          <ReportCard title="Catálogo" href="/admin/productos" cta="Ver productos">
            <MetricRow label="Productos activos" value={productKpis.totalActive} />
            <MetricRow label="Destacados" value={productKpis.totalFeatured} />
            <MetricRow
              label="Stock bajo (≤5)"
              value={productKpis.lowStock}
              tone={productKpis.lowStock > 0 ? 'warning' : undefined}
            />
            <MetricRow
              label="Sin stock"
              value={productKpis.outOfStock}
              tone={productKpis.outOfStock > 0 ? 'error' : undefined}
            />
          </ReportCard>

          {/* Pedidos por estado — barras de progreso */}
          <ReportCard
            title="Pedidos por estado"
            href="/admin/pedidos"
            cta="Ver pedidos"
          >
            <div className="flex flex-col gap-3">
              {statusBreakdown.map((s) => (
                <div key={s.status}>
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="font-display font-semibold text-[13px] inline-flex items-center gap-1.5">
                      <span
                        className={cn(
                          'size-2.5 rounded-full',
                          STATUS_BAR[s.status]
                        )}
                      />
                      {s.label}
                    </span>
                    <span className="text-xs text-text-soft tabular-nums">
                      {s.count} · {s.pct}%
                    </span>
                  </div>
                  <div className="h-1.5 bg-surface-2 rounded-full overflow-hidden">
                    <div
                      className={cn(
                        'h-full rounded-full transition-[width] duration-fast ease-out',
                        STATUS_BAR[s.status]
                      )}
                      style={{ width: `${s.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </ReportCard>

          {/* Usuarios */}
          <ReportCard title="Usuarios" href="/admin/usuarios" cta="Ver usuarios">
            <MetricRow label="Total registrados" value={userKpis.total} />
            <MetricRow label="Clientes" value={userKpis.customers} />
            <MetricRow label="Staff + admin" value={userKpis.staffOrAdmin} />
            <MetricRow
              label="Nuevos (7 días)"
              value={userKpis.newThisWeek}
              tone={userKpis.newThisWeek > 0 ? 'brand' : undefined}
            />
          </ReportCard>
        </div>

        {/* Top productos */}
        <section>
          <div className="flex justify-between items-baseline mb-2.5">
            <h3 className="font-display font-bold text-base">
              Productos más vendidos
            </h3>
            <span className="text-xs text-text-soft">top 10</span>
          </div>
          <DataTable<TopProduct>
            columns={[
              {
                key: 'rank',
                label: '#',
                align: 'center',
                width: '44px',
                render: (r) => (
                  <span className="font-mono font-bold text-text-soft">
                    {r.rank}
                  </span>
                )
              },
              {
                key: 'name',
                label: 'Producto',
                render: (r) => (
                  <Link
                    href={`/admin/productos/${r.id}`}
                    className="font-display font-semibold text-text hover:text-brand-500 transition"
                  >
                    {r.name}
                  </Link>
                )
              },
              {
                key: 'qty',
                label: 'Unidades',
                align: 'right',
                render: (r) => (
                  <span className="font-display font-bold tabular-nums">
                    {r.qty}
                  </span>
                )
              },
              {
                key: 'revenue',
                label: 'Ingresos',
                align: 'right',
                render: (r) => (
                  <span className="font-display font-bold text-brand-700 tabular-nums">
                    {fmtMx(r.revenue)}
                  </span>
                )
              }
            ]}
            rows={topProducts}
            empty={{
              icon: 'tag',
              title: loading ? 'Cargando…' : 'Sin ventas registradas',
              body: loading
                ? 'Consultando Firestore…'
                : 'Cuando haya pedidos pagados, aparecerán aquí los más vendidos.'
            }}
          />
        </section>
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Subcomponentes internos                                            */
/* ------------------------------------------------------------------ */

function ReportCard({
  title,
  href,
  cta,
  children
}: {
  title: string;
  href: string;
  cta: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-surface border border-border rounded-lg p-4 md:p-5 flex flex-col">
      <h3 className="font-display font-bold text-base mb-3">{title}</h3>
      <div className="flex-1 flex flex-col gap-2">{children}</div>
      <Link
        href={href}
        className="mt-4 inline-flex items-center gap-1 text-xs font-display font-semibold text-brand-700 hover:text-brand-500 transition"
      >
        {cta}
        <Icon name="arr-right" size={13} strokeWidth={2.4} />
      </Link>
    </div>
  );
}

function MetricRow({
  label,
  value,
  tone
}: {
  label: string;
  value: number;
  tone?: 'brand' | 'warning' | 'error';
}) {
  const valueCls =
    tone === 'brand'
      ? 'text-brand-700'
      : tone === 'warning'
        ? 'text-warning'
        : tone === 'error'
          ? 'text-error'
          : 'text-text';
  return (
    <div className="flex items-baseline justify-between text-[13px]">
      <span className="text-text-muted">{label}</span>
      <span className={cn('font-display font-bold tabular-nums', valueCls)}>
        {value.toLocaleString('es-MX')}
      </span>
    </div>
  );
}
