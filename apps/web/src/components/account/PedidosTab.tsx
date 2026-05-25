'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  collection,
  onSnapshot,
  query,
  where,
  type DocumentData
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import type { Order, RawOrderDoc } from '@/types/order';
import { STATUS_LABELS, STATUS_COLORS } from '@/types/order';
import { Button } from '@/components/ui';
import OrderTracker from './OrderTracker';

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

export default function PedidosTab() {
  const { user } = useAuth();
  const { add, openDrawer } = useCart();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  function reorder(order: Order) {
    for (const it of order.items) {
      add(
        {
          productId: it.productId,
          slug: it.slug ?? it.productId,
          name: it.name,
          imageUrl: it.imageUrl ?? null,
          unitPrice: it.unitPrice,
          originalPrice: null,
          stockAtAdd: null
        },
        it.qty
      );
    }
    console.log('[PEDIDOS] re-ordenado', order.orderNumber, order.items.length, 'items');
    openDrawer();
  }

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'orders'), where('userId', '==', user.uid));
    const unsub = onSnapshot(
      q,
      (snap) => {
        const list = snap.docs.map((d) => normalize(d.id, d.data()));
        list.sort((a, b) => {
          const ad = a.createdAt?.getTime() ?? 0;
          const bd = b.createdAt?.getTime() ?? 0;
          return bd - ad;
        });
        setOrders(list);
        setLoading(false);
        console.log('[PEDIDOS] cliente', list.length);
      },
      (err) => {
        console.error('[PEDIDOS] error:', err);
        setLoading(false);
      }
    );
    return () => unsub();
  }, [user]);

  if (loading) {
    return (
      <div className="rounded-xl border border-border bg-surface px-6 py-16 text-center text-sm text-text-soft">
        Cargando pedidos…
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="rounded-xl border-2 border-dashed border-border bg-surface px-6 py-16 text-center">
        <p className="font-display font-bold text-text">
          Aún no tienes pedidos.
        </p>
        <p className="mt-2 text-sm text-text-muted">
          Los pedidos aparecerán aquí cuando completes una compra.
        </p>
        <Link href="/shop" className="mt-6 inline-block">
          <Button trailingIcon="arr-right">Explorar tienda</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((o) => {
        const colors = STATUS_COLORS[o.status];
        return (
          <article
            key={o.id}
            className="rounded-xl border border-border bg-surface p-5"
          >
            <header className="flex items-start justify-between gap-3 flex-wrap">
              <div>
                <h3 className="font-display text-lg font-bold">
                  Pedido {o.orderNumber}
                </h3>
                <p className="text-xs text-text-soft mt-0.5">
                  {o.createdAt
                    ? o.createdAt.toLocaleDateString('es-MX', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })
                    : '—'}
                  {' · '}
                  {o.items.length}{' '}
                  {o.items.length === 1 ? 'producto' : 'productos'}
                </p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${colors.bg} ${colors.text}`}
              >
                {STATUS_LABELS[o.status]}
              </span>
            </header>

            <div className="mt-4 flex items-center gap-3 overflow-x-auto pb-1">
              {o.items.slice(0, 5).map((it) => (
                <div
                  key={`${o.id}-${it.productId}`}
                  className="flex-shrink-0 w-14 h-14 rounded-md bg-surface-2 overflow-hidden"
                  title={`${it.name} · ${it.qty}x`}
                >
                  {it.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={it.imageUrl}
                      alt={it.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[10px] text-text-soft">
                      {it.qty}x
                    </div>
                  )}
                </div>
              ))}
              {o.items.length > 5 && (
                <span className="text-xs text-text-soft">
                  +{o.items.length - 5}
                </span>
              )}
            </div>

            <div className="mt-5">
              <OrderTracker order={o} />
            </div>

            <footer className="mt-5 flex items-center justify-between gap-3 pt-3 border-t border-border">
              <span className="text-xs text-text-soft">
                {o.payment.status === 'paid' ? 'Pagado' : o.payment.status}
              </span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => reorder(o)}
                  className="rounded-pill border border-border-strong px-4 py-1.5 text-xs font-display font-semibold text-text hover:border-brand-500 transition-colors"
                >
                  Re-ordenar
                </button>
                <span className="font-display font-bold text-lg tabular-nums">
                  ${o.total.toFixed(2)} {o.currency}
                </span>
              </div>
            </footer>
          </article>
        );
      })}
    </div>
  );
}
