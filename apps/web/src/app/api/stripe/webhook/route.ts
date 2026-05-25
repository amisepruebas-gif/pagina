import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe-server';
import { adminDb } from '@/lib/firebase-admin';
import { FieldValue, type Firestore } from 'firebase-admin/firestore';
import type Stripe from 'stripe';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * POST /api/stripe/webhook
 * Eventos firmados de Stripe:
 *  - checkout.session.completed         → crea orders/{id}
 *  - checkout.session.async_payment_*   → confirma/cancela órdenes OXXO
 *
 * Local: `stripe listen --forward-to localhost:3030/api/stripe/webhook`
 */

interface OrderItem {
  productId: string;
  name: string;
  slug: string;
  imageUrl: string | null;
  unitPrice: number;
  qty: number;
  lineTotal: number;
}

/**
 * Crea `orders/{sessionId}` a partir de una Checkout Session.
 * El caller debe verificar antes que la orden no exista (idempotencia).
 */
async function createOrderFromSession(
  db: Firestore,
  session: Stripe.Checkout.Session
): Promise<{ orderNumber: string; total: number }> {
  const sessionId = session.id;
  const userId = session.metadata?.userId || null;
  const isPaid = session.payment_status === 'paid';

  // Items: SIEMPRE desde pendingCheckouts/{sessionId}. Fallback a Stripe si falta.
  let orderItems: OrderItem[] = [];
  let needsReview = false;
  const pendingSnap = await db
    .collection('pendingCheckouts')
    .doc(sessionId)
    .get();
  if (pendingSnap.exists) {
    const d = pendingSnap.data();
    orderItems = Array.isArray(d?.items) ? (d!.items as OrderItem[]) : [];
  }
  if (orderItems.length === 0) {
    // Fallback: reconstruir desde Stripe (sin productId/slug/imagen).
    // La orden se marca needsReview para que el admin la revise a mano.
    const full = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items']
    });
    const li = full.line_items?.data ?? [];
    orderItems = li.map((l) => ({
      productId: '',
      name: l.description ?? 'Item',
      slug: '',
      imageUrl: null,
      unitPrice: (l.price?.unit_amount ?? 0) / 100,
      qty: l.quantity ?? 1,
      lineTotal: ((l.price?.unit_amount ?? 0) * (l.quantity ?? 1)) / 100
    }));
    needsReview = true;
    console.warn(
      '[STRIPE webhook] items reconstruidos desde Stripe — needsReview',
      sessionId
    );
  }

  // Desglose real desde Stripe.
  const itemsSubtotal = orderItems.reduce((s, i) => s + i.lineTotal, 0);
  const td = session.total_details;
  const subtotal =
    typeof session.amount_subtotal === 'number'
      ? session.amount_subtotal / 100
      : itemsSubtotal;
  const discountTotal = (td?.amount_discount ?? 0) / 100;
  const shippingCost = (td?.amount_shipping ?? 0) / 100;
  const total = (session.amount_total ?? Math.round(subtotal * 100)) / 100;
  const currency = (session.currency ?? 'mxn').toUpperCase();

  const shipping = session.collected_information?.shipping_details ?? null;
  const customerDetails = session.customer_details;
  const orderNumber = `P-${Date.now().toString(36).toUpperCase()}`;

  const orderDoc = {
    orderNumber,
    userId: userId || null,
    guestEmail: userId ? null : customerDetails?.email ?? null,
    customer: {
      name: shipping?.name ?? customerDetails?.name ?? '',
      email: customerDetails?.email ?? '',
      phone: customerDetails?.phone ?? ''
    },
    shippingAddress: shipping?.address
      ? {
          street: [shipping.address.line1, shipping.address.line2]
            .filter(Boolean)
            .join(' '),
          city: shipping.address.city ?? '',
          state: shipping.address.state ?? '',
          zip: shipping.address.postal_code ?? '',
          country: shipping.address.country ?? 'MX'
        }
      : null,
    items: orderItems,
    subtotal,
    discountTotal,
    shippingCost,
    total,
    currency,
    needsReview,
    payment: {
      method: 'stripe',
      status: isPaid ? 'paid' : 'pending',
      providerRef: (session.payment_intent as string | null) ?? null,
      ...(isPaid ? { paidAt: FieldValue.serverTimestamp() } : {})
    },
    fulfillment: {
      status: 'processing'
    },
    status: 'processing',
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp()
  };

  await db.collection('orders').doc(sessionId).set(orderDoc);
  await db
    .collection('orders')
    .doc(sessionId)
    .collection('events')
    .add({
      type: 'order.created',
      by: 'stripe-webhook',
      meta: { sessionId, paymentIntent: session.payment_intent },
      at: FieldValue.serverTimestamp()
    });
  await db
    .collection('pendingCheckouts')
    .doc(sessionId)
    .delete()
    .catch(() => undefined);

  console.log(
    '[STRIPE webhook] orden creada',
    sessionId,
    orderNumber,
    '$' + total
  );
  return { orderNumber, total };
}

export async function POST(req: Request) {
  const sig = req.headers.get('stripe-signature');
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!sig || !secret) {
    console.error('[STRIPE webhook] falta signature o secret');
    return NextResponse.json({ error: 'missing signature' }, { status: 400 });
  }

  const raw = await req.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(raw, sig, secret);
  } catch (err) {
    console.error('[STRIPE webhook] firma inválida', err);
    return NextResponse.json({ error: 'invalid signature' }, { status: 400 });
  }

  console.log('[STRIPE webhook] evento', event.type, event.id);
  const db = adminDb();

  // ---- Pago completado (tarjeta inmediata, o voucher OXXO generado) ----
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const existing = await db.collection('orders').doc(session.id).get();
    if (existing.exists) {
      console.log('[STRIPE webhook] orden ya existe, skip', session.id);
      return NextResponse.json({ received: true, idempotent: true });
    }
    const { orderNumber } = await createOrderFromSession(db, session);
    return NextResponse.json({
      received: true,
      orderId: session.id,
      orderNumber
    });
  }

  // ---- OXXO confirmado (horas/días después) ----
  if (event.type === 'checkout.session.async_payment_succeeded') {
    const session = event.data.object as Stripe.Checkout.Session;
    const ref = db.collection('orders').doc(session.id);
    const existing = await ref.get();
    if (existing.exists) {
      await ref.set(
        {
          payment: { status: 'paid', paidAt: FieldValue.serverTimestamp() },
          updatedAt: FieldValue.serverTimestamp()
        },
        { merge: true }
      );
      console.log('[STRIPE webhook] OXXO pagado', session.id);
    } else {
      // El evento async llegó antes que `completed` — crear la orden completa.
      await createOrderFromSession(db, session);
      console.log('[STRIPE webhook] OXXO pagado (orden creada por async)', session.id);
    }
    return NextResponse.json({ received: true, asyncPaid: session.id });
  }

  // ---- OXXO fallido / expirado ----
  if (event.type === 'checkout.session.async_payment_failed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const ref = db.collection('orders').doc(session.id);
    const existing = await ref.get();
    if (existing.exists) {
      await ref.set(
        {
          payment: { status: 'failed' },
          status: 'cancelled',
          updatedAt: FieldValue.serverTimestamp()
        },
        { merge: true }
      );
      console.log('[STRIPE webhook] OXXO falló', session.id);
    } else {
      // El pago falló antes de que se creara la orden — limpiar el pendiente.
      await db
        .collection('pendingCheckouts')
        .doc(session.id)
        .delete()
        .catch(() => undefined);
      console.log(
        '[STRIPE webhook] OXXO falló sin orden, pendiente limpiado',
        session.id
      );
    }
    return NextResponse.json({ received: true, asyncFailed: session.id });
  }

  return NextResponse.json({ received: true, ignored: event.type });
}
