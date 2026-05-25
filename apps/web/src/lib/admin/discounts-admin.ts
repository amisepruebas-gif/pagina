import {
  collection,
  doc,
  addDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  Timestamp,
  type DocumentReference
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { DiscountType } from '@/types/discount';

export interface DiscountFormValues {
  name: string;
  description?: string;
  code?: string;
  type: DiscountType;
  categoryId?: string;
  productId?: string;
  percentage: number;
  season?: string;
  validFrom?: string; // YYYY-MM-DD del input date
  validUntil?: string;
  active: boolean;
}

function parseDate(s?: string): Timestamp | null {
  if (!s) return null;
  const d = new Date(s + 'T00:00:00');
  if (isNaN(d.getTime())) return null;
  return Timestamp.fromDate(d);
}

function valuesToDoc(values: DiscountFormValues, isCreate: boolean) {
  const data: Record<string, unknown> = {
    name: values.name.trim(),
    type: values.type,
    percentage: values.percentage,
    active: values.active,
    updatedAt: serverTimestamp()
  };
  if (isCreate) data.createdAt = serverTimestamp();
  data.description = values.description?.trim() || null;
  data.code = values.code?.trim().toUpperCase() || null;
  data.categoryId = values.type === 'category' ? values.categoryId ?? null : null;
  data.productId = values.type === 'product' ? values.productId ?? null : null;
  data.season = values.season?.trim() || null;
  data.validFrom = parseDate(values.validFrom);
  data.validUntil = parseDate(values.validUntil);
  return data;
}

export async function createDiscount(values: DiscountFormValues): Promise<string> {
  const ref: DocumentReference = await addDoc(
    collection(db, 'discounts'),
    valuesToDoc(values, true)
  );
  console.log('[ADMIN] descuento creado', ref.id);
  return ref.id;
}

export async function updateDiscount(
  id: string,
  values: DiscountFormValues
): Promise<void> {
  await setDoc(doc(db, 'discounts', id), valuesToDoc(values, false), {
    merge: true
  });
  console.log('[ADMIN] descuento actualizado', id);
}

export async function setDiscountActive(id: string, active: boolean): Promise<void> {
  await updateDoc(doc(db, 'discounts', id), {
    active,
    updatedAt: serverTimestamp()
  });
  console.log('[ADMIN] descuento', id, 'active=', active);
}
