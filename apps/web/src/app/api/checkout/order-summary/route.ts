import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/checkout/order-summary?session_id=...
 * Lee la orden creada por el webhook y devuelve un resumen público mínimo.
 * Usa Admin SDK → funciona para compradores invitados (sin sesión Firebase),
 * que NO pueden leer `orders/{id}` directamente por las reglas.
 * El session_id es un identificador opaco que solo el comprador posee.
 */
export async function GET(req: Request) {
  const sessionId = new URL(req.url).searchParams.get('session_id');
  if (!sessionId) {
    return NextResponse.json({ error: 'session_id requerido' }, { status: 400 });
  }

  const snap = await adminDb().collection('orders').doc(sessionId).get();
  if (!snap.exists) {
    // El webhook aún no procesó — el cliente reintenta
    return NextResponse.json({ found: false }, { status: 200 });
  }

  const d = snap.data() ?? {};
  return NextResponse.json({
    found: true,
    orderNumber: d.orderNumber ?? null,
    total: typeof d.total === 'number' ? d.total : null,
    currency: d.currency ?? 'MXN',
    email: d.customer?.email ?? d.guestEmail ?? null
  });
}
