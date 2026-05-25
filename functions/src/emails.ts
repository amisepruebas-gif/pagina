import { Resend } from 'resend';
import { defineSecret } from 'firebase-functions/params';
import { logger } from 'firebase-functions/v2';

// Secrets (configurar con `firebase functions:secrets:set RESEND_API_KEY`)
export const RESEND_API_KEY = defineSecret('RESEND_API_KEY');
export const EMAIL_FROM = defineSecret('EMAIL_FROM'); // ej "pagina <pedidos@tu-dominio.com>"

/** Lazy: instancia el cliente Resend en cada invocación (functions reciclan procesos). */
function client(): Resend {
  return new Resend(RESEND_API_KEY.value());
}

interface OrderItemLite {
  name: string;
  qty: number;
  unitPrice: number;
  lineTotal: number;
  imageUrl?: string | null;
}

interface OrderEmailData {
  to: string;
  orderNumber: string;
  total: number;
  currency: string;
  items: OrderItemLite[];
  shippingName?: string;
}

const peso = (n: number, currency: string) =>
  `$${n.toFixed(2)} ${currency.toUpperCase()}`;

function orderItemsHtml(items: OrderItemLite[], currency: string): string {
  return items
    .map(
      (i) => `
        <tr>
          <td style="padding:8px 0;border-bottom:1px solid #eee;">
            <strong>${escapeHtml(i.name)}</strong>
            <div style="color:#777;font-size:12px;">${i.qty} × ${peso(i.unitPrice, currency)}</div>
          </td>
          <td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right;font-weight:600;">
            ${peso(i.lineTotal, currency)}
          </td>
        </tr>`
    )
    .join('');
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Email de confirmación al crearse la orden (paid). */
export async function sendOrderConfirmation(data: OrderEmailData): Promise<void> {
  const html = `
    <div style="font-family:Inter,Arial,sans-serif;max-width:560px;margin:0 auto;color:#222;">
      <h1 style="font-size:24px;margin:0 0 8px;">¡Gracias por tu compra!</h1>
      <p style="color:#666;margin:0 0 24px;">
        Hola${data.shippingName ? ' ' + escapeHtml(data.shippingName) : ''},
        recibimos tu pedido <strong>${escapeHtml(data.orderNumber)}</strong>.
      </p>

      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        ${orderItemsHtml(data.items, data.currency)}
        <tr>
          <td style="padding-top:16px;font-weight:700;">Total</td>
          <td style="padding-top:16px;text-align:right;font-weight:700;font-size:16px;">
            ${peso(data.total, data.currency)}
          </td>
        </tr>
      </table>

      <p style="color:#666;font-size:13px;margin-top:32px;">
        Te avisaremos cuando tu pedido salga de envío.
      </p>
      <p style="color:#999;font-size:12px;margin-top:24px;">
        ¿Dudas? Responde este correo.
      </p>
    </div>
  `;

  const from = EMAIL_FROM.value();
  const r = await client().emails.send({
    from,
    to: data.to,
    subject: `Pedido ${data.orderNumber} confirmado · pagina`,
    html
  });
  if (r.error) {
    logger.error('[email] orderConfirmation falló', r.error);
    throw new Error(r.error.message);
  }
  logger.info('[email] orderConfirmation OK', { to: data.to, id: r.data?.id });
}

/** Email cuando el pedido cambia a `shipped` (con tracking opcional). */
export async function sendOrderShipped(args: {
  to: string;
  orderNumber: string;
  carrier?: string;
  trackingNumber?: string;
  shippingName?: string;
}): Promise<void> {
  const tracking =
    args.trackingNumber && args.carrier
      ? `<p>Paquetería: <strong>${escapeHtml(args.carrier)}</strong> · Guía: <strong>${escapeHtml(args.trackingNumber)}</strong></p>`
      : args.trackingNumber
        ? `<p>Guía: <strong>${escapeHtml(args.trackingNumber)}</strong></p>`
        : '';

  const html = `
    <div style="font-family:Inter,Arial,sans-serif;max-width:560px;margin:0 auto;color:#222;">
      <h1 style="font-size:24px;margin:0 0 8px;">Tu pedido está en camino</h1>
      <p style="color:#666;">
        Hola${args.shippingName ? ' ' + escapeHtml(args.shippingName) : ''}, tu pedido
        <strong>${escapeHtml(args.orderNumber)}</strong> salió a entrega.
      </p>
      ${tracking}
    </div>
  `;

  const r = await client().emails.send({
    from: EMAIL_FROM.value(),
    to: args.to,
    subject: `Pedido ${args.orderNumber} en camino · pagina`,
    html
  });
  if (r.error) {
    logger.error('[email] orderShipped falló', r.error);
    throw new Error(r.error.message);
  }
  logger.info('[email] orderShipped OK', { to: args.to });
}

/** Email cuando el pedido cambia a `delivered`. */
export async function sendOrderDelivered(args: {
  to: string;
  orderNumber: string;
  shippingName?: string;
}): Promise<void> {
  const html = `
    <div style="font-family:Inter,Arial,sans-serif;max-width:560px;margin:0 auto;color:#222;">
      <h1 style="font-size:24px;margin:0 0 8px;">¡Tu pedido fue entregado!</h1>
      <p style="color:#666;">
        Hola${args.shippingName ? ' ' + escapeHtml(args.shippingName) : ''},
        confirmamos la entrega de tu pedido
        <strong>${escapeHtml(args.orderNumber)}</strong>.
      </p>
      <p style="color:#666;font-size:13px;margin-top:32px;">
        Si algo no salió bien, abre una queja desde tu cuenta — te ayudamos.
      </p>
    </div>
  `;

  const r = await client().emails.send({
    from: EMAIL_FROM.value(),
    to: args.to,
    subject: `Pedido ${args.orderNumber} entregado · pagina`,
    html
  });
  if (r.error) {
    logger.error('[email] orderDelivered falló', r.error);
    throw new Error(r.error.message);
  }
  logger.info('[email] orderDelivered OK', { to: args.to });
}
