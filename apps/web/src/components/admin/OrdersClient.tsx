'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { collection, onSnapshot, type DocumentData } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Order, OrderStatus, PaymentStatus, RawOrderDoc } from '@/types/order';
import { STATUS_LABELS } from '@/types/order';
import { AdminPageHeader } from './AdminPageHeader';
import { DataTable } from './DataTable';
import { Badge, Icon, IconButton, Input, Pill } from '@/components/ui';

function normalize(id: string, data: DocumentData): Order {
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

type BadgeTone = 'warning' | 'info' | 'success' | 'neutral' | 'error';

const STATUS_TONE: Record<OrderStatus, BadgeTone> = {
  processing: 'info',
  shipped: 'warning',
  delivered: 'success',
  cancelled: 'neutral',
  refunded: 'error'
};

const PAYMENT_TONE: Record<PaymentStatus, BadgeTone> = {
  paid: 'success',
  pending: 'warning',
  failed: 'error',
  refunded: 'neutral'
};

function initials(name: string, email: string): string {
  const src = name.trim() || email.trim();
  if (!src) return '?';
  const parts = src.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return src.slice(0, 2).toUpperCase();
}

function fmtMx(n: number): string {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    maximumFractionDigits: 2
  }).format(n);
}

type Filter = 'todos' | OrderStatus;

const FILTERS: Filter[] = [
  'todos',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
  'refunded'
];

export default function OrdersClient() {
  const [items, setItems] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>('todos');
  const [search, setSearch] = useState('');

  useEffect(() => {
    setLoading(true);
    const unsub = onSnapshot(
      collection(db, 'orders'),
      (snap) => {
        const list = snap.docs.map((d) => normalize(d.id, d.data()));
        list.sort(
          (a, b) =>
            (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0)
        );
        console.log('[ORDERS] snapshot', list.length, 'pedidos');
        setItems(list);
        setLoading(false);
      },
      (err) => {
        console.error('[ORDERS] snapshot error', err);
        setError(err.message);
        setLoading(false);
      }
    );
    return () => unsub();
  }, []);

  const filtered = useMemo(() => {
    let out = items;
    if (filter !== 'todos') out = out.filter((o) => o.status === filter);
    const s = search.trim().toLowerCase();
    if (s) {
      out = out.filter(
        (o) =>
          o.orderNumber.toLowerCase().includes(s) ||
          o.customer.email.toLowerCase().includes(s) ||
          o.customer.name.toLowerCase().includes(s)
      );
    }
    return out;
  }, [items, filter, search]);

  const stats = useMemo(() => {
    return {
      total: items.length,
      processing: items.filter((o) => o.status === 'processing').length,
      shipped: items.filter((o) => o.status === 'shipped').length,
      delivered: items.filter((o) => o.status === 'delivered').length,
      revenue: items
        .filter(
          (o) =>
            o.payment.status === 'paid' &&
            o.status !== 'cancelled' &&
            o.status !== 'refunded'
        )
        .reduce((s, o) => s + o.total, 0)
    };
  }, [items]);

  return (
    <>
      <AdminPageHeader
        breadcrumb={[{ label: 'Admin', href: '/admin' }, { label: 'Pedidos' }]}
        title="Pedidos"
        description={
          loading
            ? 'Cargando…'
            : `${stats.total} en total · ${stats.processing} en proceso · ${stats.shipped} enviados · ${stats.delivered} entregados · ${fmtMx(stats.revenue)} cobrado`
        }
      />

      <div className="p-6 flex flex-col gap-4">
        {error && (
          <div className="rounded-lg bg-error/10 border border-error/30 text-error text-[13px] px-4 py-3 flex items-center gap-2">
            <Icon name="err" size={16} />
            Error al cargar: {error}
          </div>
        )}

        {!loading && stats.total === 0 && !error && (
          <div className="rounded-lg bg-warning/10 border border-warning/30 text-text-muted text-[13px] px-4 py-3 flex items-center gap-2">
            <Icon name="info" size={16} className="text-warning shrink-0" />
            Aún no hay pedidos. Aparecerán aquí cuando se complete el primer
            checkout (Stripe pendiente).
          </div>
        )}

        <div className="flex gap-2.5 flex-wrap items-center">
          <div className="flex-1 min-w-[200px] max-w-[340px]">
            <Input
              leadingIcon="search"
              placeholder="Buscar por #orden, email o nombre…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="!h-9"
            />
          </div>
          <div className="inline-flex gap-1.5 flex-wrap">
            {FILTERS.map((f) => (
              <Pill
                key={f}
                active={filter === f}
                onClick={() => setFilter(f)}
              >
                {f === 'todos' ? 'Todos' : STATUS_LABELS[f]}
              </Pill>
            ))}
          </div>
        </div>

        <DataTable<Order>
          columns={[
            {
              key: 'orderNumber',
              label: '#Orden',
              render: (o) => (
                <Link
                  href={`/admin/pedidos/${o.id}`}
                  className="font-mono font-semibold text-text hover:text-brand-500 transition"
                >
                  {o.orderNumber}
                </Link>
              )
            },
            {
              key: 'customer',
              label: 'Cliente',
              render: (o) => (
                <div className="flex items-center gap-2">
                  <span
                    className="size-7 rounded-full shrink-0 bg-brand-grad text-white inline-flex
                               items-center justify-center font-display font-bold text-[11px]"
                  >
                    {initials(o.customer.name, o.customer.email)}
                  </span>
                  <div className="min-w-0">
                    <div className="font-semibold truncate">
                      {o.customer.name || '(sin nombre)'}
                    </div>
                    <div className="text-[11px] text-text-soft truncate">
                      {o.customer.email}
                    </div>
                  </div>
                </div>
              )
            },
            {
              key: 'date',
              label: 'Fecha',
              render: (o) => (
                <span className="text-text-soft">
                  {o.createdAt
                    ? o.createdAt.toLocaleDateString('es-MX', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })
                    : '—'}
                </span>
              )
            },
            {
              key: 'payment',
              label: 'Pago',
              align: 'center',
              render: (o) => (
                <Badge tone={PAYMENT_TONE[o.payment.status]} size="xs">
                  {o.payment.status}
                </Badge>
              )
            },
            {
              key: 'status',
              label: 'Estado',
              align: 'center',
              render: (o) => (
                <Badge tone={STATUS_TONE[o.status]} size="xs">
                  {STATUS_LABELS[o.status]}
                </Badge>
              )
            },
            {
              key: 'total',
              label: 'Total',
              align: 'right',
              render: (o) => (
                <span className="font-display font-bold tabular-nums">
                  {fmtMx(o.total)}
                </span>
              )
            },
            {
              key: 'actions',
              label: '',
              align: 'right',
              width: '64px',
              render: (o) => (
                <Link href={`/admin/pedidos/${o.id}`}>
                  <IconButton
                    variant="ghost"
                    icon="arr-right"
                    label="Abrir pedido"
                    size="sm"
                  />
                </Link>
              )
            }
          ]}
          rows={filtered}
          empty={{
            icon: 'cart',
            title: loading ? 'Cargando…' : 'Sin pedidos',
            body: loading
              ? 'Consultando Firestore…'
              : 'Ningún pedido coincide con el filtro.'
          }}
        />
      </div>
    </>
  );
}
