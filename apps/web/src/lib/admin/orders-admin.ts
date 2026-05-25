import {
  doc,
  getDoc,
  updateDoc,
  collection,
  addDoc,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { FulfillmentStatus, OrderStatus, PaymentStatus } from '@/types/order';

async function appendEvent(
  orderId: string,
  type: string,
  payload: Record<string, unknown>
): Promise<void> {
  await addDoc(collection(db, 'orders', orderId, 'events'), {
    type,
    ...payload,
    at: serverTimestamp()
  });
}

export async function setOrderStatus(
  orderId: string,
  status: OrderStatus,
  by: string,
  note?: string
): Promise<void> {
  const snap = await getDoc(doc(db, 'orders', orderId));
  const fromStatus = (snap.data()?.status as OrderStatus | undefined) ?? null;

  await updateDoc(doc(db, 'orders', orderId), {
    status,
    updatedAt: serverTimestamp()
  });
  await appendEvent(orderId, 'status.changed', {
    from: fromStatus,
    to: status,
    by,
    meta: note ? { note } : null
  });
  console.log('[ORDERS]', orderId, fromStatus, '→', status);
}

export async function setFulfillment(
  orderId: string,
  fields: { carrier?: string; trackingNumber?: string; status?: FulfillmentStatus },
  by: string
): Promise<void> {
  const updates: Record<string, unknown> = { updatedAt: serverTimestamp() };
  if (fields.carrier !== undefined)
    updates['fulfillment.carrier'] = fields.carrier || null;
  if (fields.trackingNumber !== undefined)
    updates['fulfillment.trackingNumber'] = fields.trackingNumber || null;
  if (fields.status !== undefined) updates['fulfillment.status'] = fields.status;

  await updateDoc(doc(db, 'orders', orderId), updates);
  await appendEvent(orderId, 'fulfillment.updated', { by, meta: fields });
}

export async function setPaymentStatus(
  orderId: string,
  status: PaymentStatus,
  by: string
): Promise<void> {
  await updateDoc(doc(db, 'orders', orderId), {
    'payment.status': status,
    updatedAt: serverTimestamp()
  });
  await appendEvent(orderId, 'payment.status.changed', { to: status, by });
}
