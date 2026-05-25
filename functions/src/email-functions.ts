// ============================================================================
// EMAIL TRANSACCIONAL (Resend)
// ============================================================================
// Estas Cloud Functions están SEPARADAS del entry point (index.ts) porque
// dependen de los secrets RESEND_API_KEY / EMAIL_FROM. Mientras la línea
// `export { ... } from './email-functions'` esté comentada en index.ts, este
// módulo no se importa → defineSecret() no corre → el deploy no exige secrets.
//
// PARA ACTIVAR:
//   1. firebase functions:secrets:set RESEND_API_KEY
//   2. firebase functions:secrets:set EMAIL_FROM   (ej "pagina <onboarding@resend.dev>")
//   3. Descomentar la línea de export en index.ts
//   4. firebase deploy --only functions
// ============================================================================

import { onDocumentCreated, onDocumentUpdated } from 'firebase-functions/v2/firestore';
import { logger } from 'firebase-functions/v2';
import {
  RESEND_API_KEY,
  EMAIL_FROM,
  sendOrderConfirmation,
  sendOrderShipped,
  sendOrderDelivered
} from './emails';

interface OrderDocShape {
  orderNumber?: string;
  customer?: { email?: string; name?: string };
  guestEmail?: string;
  total?: number;
  currency?: string;
  items?: Array<{
    name?: string;
    qty?: number;
    unitPrice?: number;
    lineTotal?: number;
    imageUrl?: string | null;
  }>;
  status?: string;
  fulfillment?: {
    status?: string;
    carrier?: string;
    trackingNumber?: string;
  };
}

function recipientFrom(order: OrderDocShape): string | null {
  return order.customer?.email || order.guestEmail || null;
}

/** Al crearse `orders/{id}`: enviar confirmación. */
export const onOrderCreated = onDocumentCreated(
  { document: 'orders/{id}', secrets: [RESEND_API_KEY, EMAIL_FROM] },
  async (event) => {
    const order = event.data?.data() as OrderDocShape | undefined;
    if (!order) return;
    const to = recipientFrom(order);
    if (!to) {
      logger.warn('[onOrderCreated] sin email destinatario', event.params.id);
      return;
    }
    try {
      await sendOrderConfirmation({
        to,
        orderNumber: order.orderNumber ?? event.params.id,
        total: order.total ?? 0,
        currency: order.currency ?? 'MXN',
        shippingName: order.customer?.name,
        items: (order.items ?? []).map((i) => ({
          name: i.name ?? 'Producto',
          qty: i.qty ?? 1,
          unitPrice: i.unitPrice ?? 0,
          lineTotal: i.lineTotal ?? 0,
          imageUrl: i.imageUrl ?? null
        }))
      });
    } catch (err) {
      logger.error('[onOrderCreated] email falló', err);
    }
  }
);

/** Al actualizarse `orders/{id}`: notificar shipped/delivered si transicionó. */
export const onOrderStatusChanged = onDocumentUpdated(
  { document: 'orders/{id}', secrets: [RESEND_API_KEY, EMAIL_FROM] },
  async (event) => {
    const before = event.data?.before.data() as OrderDocShape | undefined;
    const after = event.data?.after.data() as OrderDocShape | undefined;
    if (!before || !after) return;

    const beforeStatus = before.fulfillment?.status ?? before.status;
    const afterStatus = after.fulfillment?.status ?? after.status;
    if (beforeStatus === afterStatus) return;

    const to = recipientFrom(after);
    if (!to) return;

    const orderNumber = after.orderNumber ?? event.params.id;
    const shippingName = after.customer?.name;

    try {
      if (afterStatus === 'shipped') {
        await sendOrderShipped({
          to,
          orderNumber,
          shippingName,
          carrier: after.fulfillment?.carrier,
          trackingNumber: after.fulfillment?.trackingNumber
        });
      } else if (afterStatus === 'delivered') {
        await sendOrderDelivered({ to, orderNumber, shippingName });
      }
    } catch (err) {
      logger.error('[onOrderStatusChanged] email falló', err);
    }
  }
);
