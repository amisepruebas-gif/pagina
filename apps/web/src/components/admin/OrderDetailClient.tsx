'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  doc,
  onSnapshot,
  collection,
  query,
  orderBy,
  type DocumentData
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { setOrderStatus, setFulfillment } from '@/lib/admin/orders-admin';
import type {
  Order,
  OrderEvent,
  OrderStatus,
  PaymentStatus,
  RawOrderDoc,
  RawOrderEventDoc
} from '@/types/order';
import { ORDER_STATUSES, STATUS_LABELS } from '@/types/order';
import { AdminPageHeader } from './AdminPageHeader';
import { OrderTimeline } from './OrderTimeline';
import { Badge, Button, Icon, Input, Select } from '@/components/ui';

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

function normalizeEvent(id: string, data: DocumentData): OrderEvent {
  const raw = data as RawOrderEventDoc;
  return {
    id,
    type: raw.type ?? 'unknown',
    from: raw.from,
    to: raw.to,
    by: raw.by,
    meta: raw.meta,
    at: raw.at?.toDate()
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
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return src.slice(0, 2).toUpperCase();
}

function fmtMx(n: number): string {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    maximumFractionDigits: 2
  }).format(n);
}

export default function OrderDetailClient({ id }: { id: string }) {
  const { user } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [events, setEvents] = useState<OrderEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFoundError, setNotFoundError] = useState(false);
  const [busy, setBusy] = useState(false);
  const [carrier, setCarrier] = useState('');
  const [tracking, setTracking] = useState('');

  useEffect(() => {
    const unsubOrder = onSnapshot(
      doc(db, 'orders', id),
      (snap) => {
        if (!snap.exists()) {
          console.warn('[ORDER] doc no existe', id);
          setNotFoundError(true);
          setLoading(false);
          return;
        }
        const o = normalizeOrder(snap.id, snap.data());
        console.log('[ORDER] snapshot', o.orderNumber, o.status);
        setOrder(o);
        setCarrier(o.fulfillment.carrier ?? '');
        setTracking(o.fulfillment.trackingNumber ?? '');
        setLoading(false);
      },
      (err) => {
        console.error('[ORDER] snapshot error', err);
        setLoading(false);
      }
    );

    const unsubEvents = onSnapshot(
      query(collection(db, 'orders', id, 'events'), orderBy('at', 'desc')),
      (snap) => {
        const list = snap.docs.map((d) => normalizeEvent(d.id, d.data()));
        console.log('[ORDER] events snapshot', list.length);
        setEvents(list);
      },
      (err) => {
        console.error('[ORDER] events snapshot error', err);
      }
    );

    return () => {
      unsubOrder();
      unsubEvents();
    };
  }, [id]);

  async function changeStatus(s: OrderStatus) {
    if (!order || busy || !user) return;
    if (s === order.status) return;
    if (!window.confirm(`¿Cambiar estado a "${STATUS_LABELS[s]}"?`)) return;
    setBusy(true);
    try {
      await setOrderStatus(id, s, user.email ?? user.uid);
      console.log('[ORDER] estado cambiado a', s);
    } catch (err) {
      console.error('[ORDER] setStatus error', err);
      window.alert('Error al cambiar estado');
    } finally {
      setBusy(false);
    }
  }

  async function saveFulfillment() {
    if (!order || busy || !user) return;
    setBusy(true);
    try {
      await setFulfillment(
        id,
        { carrier: carrier.trim(), trackingNumber: tracking.trim() },
        user.email ?? user.uid
      );
      console.log('[ORDER] paquetería guardada', carrier, tracking);
    } catch (err) {
      console.error('[ORDER] setFulfillment error', err);
      window.alert('Error al guardar paquetería');
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return (
      <>
        <AdminPageHeader
          breadcrumb={[
            { label: 'Admin', href: '/admin' },
            { label: 'Pedidos', href: '/admin/pedidos' },
            { label: '…' }
          ]}
          title="Pedido"
          description="Cargando…"
        />
        <div className="p-6 text-[13px] text-text-soft">Cargando…</div>
      </>
    );
  }

  if (notFoundError || !order) {
    return (
      <>
        <AdminPageHeader
          breadcrumb={[
            { label: 'Admin', href: '/admin' },
            { label: 'Pedidos', href: '/admin/pedidos' },
            { label: 'No encontrado' }
          ]}
          title="Pedido no encontrado"
        />
        <div className="p-6">
          <div className="bg-surface border border-border rounded-lg py-14 px-5 text-center">
            <div className="inline-flex items-center justify-center size-14 rounded-full bg-surface-2 text-text-soft mb-3">
              <Icon name="err" size={24} strokeWidth={1.6} />
            </div>
            <div className="font-display font-semibold text-base">
              Pedido no encontrado
            </div>
            <div className="mt-1 text-text-muted text-[13px]">
              El pedido que buscas no existe o fue eliminado.
            </div>
            <div className="mt-4">
              <Link href="/admin/pedidos">
                <Button variant="secondary" size="sm" leadingIcon="arr-left">
                  Volver a pedidos
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  const discounted = order.discountTotal > 0;

  return (
    <>
      <AdminPageHeader
        breadcrumb={[
          { label: 'Admin', href: '/admin' },
          { label: 'Pedidos', href: '/admin/pedidos' },
          { label: order.orderNumber }
        ]}
        title={order.orderNumber}
        description={`Creado ${
          order.createdAt?.toLocaleString('es-MX', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }) ?? '—'
        }`}
        action={
          <div className="flex gap-2 items-center">
            <Badge tone={STATUS_TONE[order.status]} size="md">
              {STATUS_LABELS[order.status]}
            </Badge>
            <Link href="/admin/pedidos">
              <Button variant="secondary" leadingIcon="arr-left">
                Volver
              </Button>
            </Link>
          </div>
        }
      />

      <div className="p-6 grid gap-5 items-start xl:grid-cols-[1fr_360px]">
        {/* Columna principal */}
        <div className="flex flex-col gap-5 min-w-0">
          <Card>
            <CardHeader
              title="Productos"
              badge={`${order.items.length} ${
                order.items.length === 1 ? 'ítem' : 'ítems'
              }`}
            />
            <div>
              {order.items.length === 0 ? (
                <div className="py-5 text-center text-text-soft text-[13px]">
                  Sin productos registrados en este pedido.
                </div>
              ) : (
                order.items.map((item, i) => (
                  <div
                    key={i}
                    className={`grid grid-cols-[48px_1fr_auto] gap-3 p-3.5 items-center ${
                      i === 0 ? '' : 'border-t border-border'
                    }`}
                  >
                    <div className="size-12 rounded-sm bg-surface-2 overflow-hidden relative shrink-0">
                      {item.imageUrl ? (
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          fill
                          sizes="48px"
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-text-soft">
                          <Icon name="grid" size={16} />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="font-display font-semibold text-sm truncate">
                        {item.name}
                      </div>
                      <div className="text-[11px] text-text-soft font-mono">
                        {item.sku ? `${item.sku} · ` : ''}
                        {fmtMx(item.unitPrice)} × {item.qty}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-display font-bold tabular-nums">
                        {fmtMx(item.lineTotal)}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>

          <Card>
            <CardHeader title="Timeline" badge={`${events.length} eventos`} />
            <OrderTimeline events={events} />
          </Card>
        </div>

        {/* Columna lateral */}
        <div className="flex flex-col gap-3.5 min-w-0">
          <Card>
            <div className="p-3.5 flex justify-between items-center border-b border-border">
              <span className="font-mono text-[11px] tracking-[0.06em] uppercase text-text-soft">
                Estado actual
              </span>
              <Badge tone={STATUS_TONE[order.status]} size="sm">
                {STATUS_LABELS[order.status]}
              </Badge>
            </div>
            <div className="px-3.5 pb-3.5 pt-3.5 flex flex-col gap-2.5">
              <Select
                label="Cambiar estado"
                value={order.status}
                disabled={busy}
                onChange={(e) => changeStatus(e.target.value as OrderStatus)}
                options={ORDER_STATUSES.map((s) => ({
                  value: s,
                  label: STATUS_LABELS[s]
                }))}
              />
            </div>
          </Card>

          <Card>
            <CardHeader title="Paquetería" />
            <div className="p-3.5 flex flex-col gap-2.5">
              <Input
                label="Paquetería"
                placeholder="Skydropx, DHL, Estafeta…"
                value={carrier}
                disabled={busy}
                onChange={(e) => setCarrier(e.target.value)}
              />
              <Input
                label="Número de guía"
                placeholder="EST-9482-MX"
                value={tracking}
                disabled={busy}
                onChange={(e) => setTracking(e.target.value)}
                className="font-mono"
              />
              <Button
                size="sm"
                leadingIcon="check"
                loading={busy}
                onClick={saveFulfillment}
              >
                Guardar paquetería
              </Button>
            </div>
          </Card>

          <Card>
            <CardHeader title="Cliente" />
            <div className="p-3.5 flex items-center gap-3 border-b border-border">
              <span
                className="size-10 rounded-full shrink-0 bg-brand-grad text-white inline-flex
                           items-center justify-center font-display font-bold text-[13px]"
              >
                {initials(order.customer.name, order.customer.email)}
              </span>
              <div className="min-w-0">
                <div className="font-display font-semibold text-sm truncate">
                  {order.customer.name || '(sin nombre)'}{' '}
                  {order.customer.lastName ?? ''}
                </div>
                {order.customer.email && (
                  <a
                    href={`mailto:${order.customer.email}`}
                    className="text-xs text-text-soft hover:text-brand-500 transition break-all"
                  >
                    {order.customer.email}
                  </a>
                )}
              </div>
            </div>
            <div className="p-3.5 text-[13px] text-text-muted flex flex-col gap-1.5">
              {order.customer.phone && <div>{order.customer.phone}</div>}
              <div className="pt-1.5 border-t border-dashed border-border">
                <div className="font-display font-semibold text-xs text-text mb-0.5">
                  Dirección de envío
                </div>
                {order.shippingAddress.street}
                {order.shippingAddress.reference && (
                  <span className="block text-text-soft text-xs">
                    ({order.shippingAddress.reference})
                  </span>
                )}
                <span className="block">
                  {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                  {order.shippingAddress.zip}
                </span>
                <span className="block">{order.shippingAddress.country}</span>
              </div>
              {order.userId && (
                <div className="pt-1.5 border-t border-dashed border-border text-[11px] font-mono text-text-soft break-all">
                  uid: {order.userId}
                </div>
              )}
            </div>
          </Card>

          <Card>
            <CardHeader title="Pago" />
            <div className="p-3.5 flex flex-col gap-2 text-[13px]">
              <div className="flex justify-between items-center">
                <span className="text-text-muted">Método</span>
                <span className="font-display font-semibold">
                  {order.payment.method}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-muted">Estado</span>
                <Badge tone={PAYMENT_TONE[order.payment.status]} size="xs">
                  {order.payment.status}
                </Badge>
              </div>
              {order.payment.providerRef && (
                <div className="pt-1.5 border-t border-dashed border-border text-[11px] font-mono text-text-soft break-all">
                  ref: {order.payment.providerRef}
                </div>
              )}
            </div>
          </Card>

          <Card>
            <CardHeader title="Totales" />
            <div className="p-3.5 flex flex-col gap-2 text-[13px]">
              <Row label="Subtotal" value={fmtMx(order.subtotal)} />
              {discounted && (
                <Row
                  label="Descuento"
                  value={`− ${fmtMx(order.discountTotal)}`}
                  positive
                />
              )}
              <Row
                label="Envío"
                value={
                  order.shippingCost === 0
                    ? 'Gratis'
                    : fmtMx(order.shippingCost)
                }
              />
              <div className="flex justify-between items-baseline pt-2.5 border-t border-border">
                <span className="font-display font-semibold">Total</span>
                <span className="font-display font-bold text-lg tabular-nums">
                  {fmtMx(order.total)}{' '}
                  <span className="text-xs text-text-soft font-normal">
                    {order.currency}
                  </span>
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-surface border border-border rounded-lg">{children}</div>
  );
}

function CardHeader({ title, badge }: { title: string; badge?: string }) {
  return (
    <div className="px-3.5 py-3 flex justify-between items-center border-b border-border">
      <h3 className="font-display font-bold text-sm">{title}</h3>
      {badge && (
        <span className="text-[11px] text-text-soft font-mono">{badge}</span>
      )}
    </div>
  );
}

function Row({
  label,
  value,
  positive
}: {
  label: string;
  value: React.ReactNode;
  positive?: boolean;
}) {
  return (
    <div className="flex justify-between">
      <span className="text-text-muted">{label}</span>
      <span
        className={`font-display font-semibold tabular-nums ${
          positive ? 'text-success' : 'text-text'
        }`}
      >
        {value}
      </span>
    </div>
  );
}
