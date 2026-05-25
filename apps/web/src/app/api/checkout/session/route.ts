import { NextResponse } from 'next/server';
import { stripe, STRIPE_CURRENCY } from '@/lib/stripe-server';
import { adminDb } from '@/lib/firebase-admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface IncomingLine {
  productId: string;
  qty: number;
}

interface IncomingBody {
  items: IncomingLine[];
  userId?: string | null;
  userEmail?: string | null;
  couponCode?: string | null;
}

/**
 * POST /api/checkout/session
 * Crea una Stripe Checkout Session a partir de los IDs del carrito.
 * Revalida precio + nombre + imagen desde Firestore (server-side, fuente de verdad).
 * Devuelve { url } para redirigir al cliente.
 */
export async function POST(req: Request) {
  let body: IncomingBody;
  try {
    body = (await req.json()) as IncomingBody;
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 });
  }

  const items = body.items ?? [];
  if (items.length === 0) {
    return NextResponse.json({ error: 'Carrito vacío' }, { status: 400 });
  }

  // Validar cantidades
  for (const i of items) {
    if (!i.productId || typeof i.qty !== 'number' || i.qty < 1 || i.qty > 99) {
      return NextResponse.json({ error: 'Item inválido' }, { status: 400 });
    }
  }

  console.log('[CHECKOUT] sesión solicitada', items.length, 'líneas, user:', body.userId);

  // Revalidar contra Firestore — el cliente NO decide el precio
  const db = adminDb();
  const productSnaps = await Promise.all(
    items.map((i) => db.collection('products').doc(i.productId).get())
  );

  const lineItems: Array<{
    price_data: {
      currency: string;
      unit_amount: number;
      product_data: { name: string; images?: string[]; metadata: Record<string, string> };
    };
    quantity: number;
  }> = [];

  const orderItems: Array<{
    productId: string;
    name: string;
    slug: string;
    imageUrl: string | null;
    unitPrice: number;
    qty: number;
    lineTotal: number;
  }> = [];

  // categoryId por producto — necesario para validar cupones de tipo 'category'
  const categoryByProduct = new Map<string, string>();

  for (let idx = 0; idx < items.length; idx += 1) {
    const incoming = items[idx];
    const snap = productSnaps[idx];
    if (!incoming || !snap || !snap.exists) {
      return NextResponse.json(
        { error: `Producto no encontrado: ${incoming?.productId}` },
        { status: 400 }
      );
    }
    const p = snap.data() ?? {};
    if (p.active === false) {
      return NextResponse.json(
        { error: `Producto inactivo: ${p.name ?? incoming.productId}` },
        { status: 400 }
      );
    }
    const unitPrice = Number(p.price ?? 0);
    if (!unitPrice || unitPrice <= 0) {
      return NextResponse.json(
        { error: `Producto sin precio válido: ${p.name ?? incoming.productId}` },
        { status: 400 }
      );
    }

    const name: string = p.name ?? 'Producto';
    const slug: string = p.slug ?? incoming.productId;
    const imageUrl: string | null =
      (typeof p.imageUrl === 'string' && p.imageUrl) ||
      (Array.isArray(p.images) && typeof p.images[0] === 'string' ? p.images[0] : null);

    lineItems.push({
      price_data: {
        currency: STRIPE_CURRENCY,
        unit_amount: Math.round(unitPrice * 100),
        product_data: {
          name,
          images: imageUrl ? [imageUrl] : undefined,
          metadata: { productId: incoming.productId, slug }
        }
      },
      quantity: incoming.qty
    });

    orderItems.push({
      productId: incoming.productId,
      name,
      slug,
      imageUrl,
      unitPrice,
      qty: incoming.qty,
      lineTotal: unitPrice * incoming.qty
    });

    if (typeof p.categoryId === 'string') {
      categoryByProduct.set(incoming.productId, p.categoryId);
    }
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ??
    new URL(req.url).origin ??
    'http://localhost:3030';

  // Envío — costo desde config/global, mismo cálculo que muestra el carrito.
  const subtotal = orderItems.reduce((s, i) => s + i.lineTotal, 0);
  const configSnap = await db.collection('config').doc('global').get();
  const shippingCfg = (configSnap.data()?.shipping ?? {}) as {
    freeFromMxn?: number;
    defaultCostMxn?: number;
  };
  const freeFrom = shippingCfg.freeFromMxn ?? 0;
  const baseCost = shippingCfg.defaultCostMxn ?? 0;
  const shippingIsFree = freeFrom > 0 && subtotal >= freeFrom;
  const shippingCost = shippingIsFree ? 0 : baseCost;

  // Cupón — re-validado server-side (el cliente NO decide el descuento).
  // Se calcula el monto exacto y se crea un coupon `amount_off` en Stripe,
  // correcto para descuentos global / product / category por igual.
  let stripeDiscounts: Array<{ coupon: string }> | undefined;
  if (body.couponCode) {
    const code = body.couponCode.trim().toLowerCase();
    const discountsSnap = await db.collection('discounts').get();
    const now = new Date();
    for (const docSnap of discountsSnap.docs) {
      const dd = docSnap.data();
      if (!dd.code || String(dd.code).trim().toLowerCase() !== code) continue;
      if (dd.active === false) break;
      const vf = dd.validFrom?.toDate?.();
      const vu = dd.validUntil?.toDate?.();
      if (vf && vf > now) break;
      if (vu && vu < now) break;
      const pct = Number(dd.percentage ?? 0) / 100;
      if (pct <= 0) break;

      let base = 0;
      if (dd.type === 'global') {
        base = subtotal;
      } else if (dd.type === 'product') {
        base = orderItems
          .filter((i) => i.productId === dd.productId)
          .reduce((s, i) => s + i.lineTotal, 0);
      } else if (dd.type === 'category') {
        base = orderItems
          .filter((i) => categoryByProduct.get(i.productId) === dd.categoryId)
          .reduce((s, i) => s + i.lineTotal, 0);
      }

      const amountOff = Math.round(base * pct * 100);
      if (amountOff > 0) {
        const coupon = await stripe.coupons.create({
          amount_off: amountOff,
          currency: STRIPE_CURRENCY,
          duration: 'once',
          name: `Cupón ${dd.code}`
        });
        stripeDiscounts = [{ coupon: coupon.id }];
        console.log('[CHECKOUT] cupón', dd.code, '-$' + amountOff / 100);
      }
      break;
    }
  }

  // Si el cliente pidió un cupón pero el server no pudo aplicarlo (inválido,
  // expirado, o ya no aplica a los productos del carrito), abortar — así no
  // se cobra sin el descuento que el carrito mostró.
  if (body.couponCode && !stripeDiscounts) {
    return NextResponse.json(
      {
        error:
          'El código de descuento no es válido o no aplica a los productos de tu carrito. Quítalo para continuar.'
      },
      { status: 400 }
    );
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    // OXXO: pago en efectivo en tienda (alta adopción en MX). Requiere que
    // OXXO esté habilitado en el dashboard de Stripe; sólo funciona con MXN.
    payment_method_types: STRIPE_CURRENCY === 'mxn' ? ['card', 'oxxo'] : ['card'],
    line_items: lineItems,
    discounts: stripeDiscounts,
    customer_email: body.userEmail ?? undefined,
    shipping_address_collection: {
      allowed_countries: ['MX']
    },
    shipping_options: [
      {
        shipping_rate_data: {
          type: 'fixed_amount',
          fixed_amount: {
            amount: Math.round(shippingCost * 100),
            currency: STRIPE_CURRENCY
          },
          display_name: shippingIsFree ? 'Envío gratis' : 'Envío estándar'
        }
      }
    ],
    phone_number_collection: { enabled: true },
    success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/cart?cancelled=1`,
    metadata: {
      userId: body.userId ?? ''
    }
  });

  // Los items NO se mandan en metadata: Stripe limita cada valor a 500 chars
  // y un carrito con imágenes lo excede. Se guardan SIEMPRE en
  // pendingCheckouts/{sessionId}; el webhook los lee de ahí.
  await db.collection('pendingCheckouts').doc(session.id).set({
    items: orderItems,
    userId: body.userId ?? null,
    createdAt: new Date()
  });

  console.log('[CHECKOUT] session creada', session.id);

  return NextResponse.json({ url: session.url, id: session.id });
}
