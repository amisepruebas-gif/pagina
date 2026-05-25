import {
  collection,
  doc,
  getDocs,
  addDoc,
  setDoc,
  deleteDoc,
  serverTimestamp,
  writeBatch,
  type DocumentData
} from 'firebase/firestore';
import { db } from './firebase';
import type { Address, RawAddressDoc } from '@/types/address';

function normalize(id: string, data: DocumentData): Address {
  const raw = data as RawAddressDoc;
  return {
    id,
    alias: raw.alias ?? '',
    fullName: raw.fullName ?? '',
    phone: raw.phone,
    street: raw.street ?? '',
    reference: raw.reference,
    city: raw.city ?? '',
    state: raw.state ?? '',
    zip: raw.zip ?? '',
    country: raw.country ?? 'México',
    isDefault: !!raw.isDefault,
    createdAt: raw.createdAt?.toDate(),
    updatedAt: raw.updatedAt?.toDate()
  };
}

async function clearOtherDefaults(uid: string, exceptId?: string): Promise<void> {
  const snap = await getDocs(collection(db, 'users', uid, 'addresses'));
  const batch = writeBatch(db);
  let count = 0;
  for (const d of snap.docs) {
    if (d.id === exceptId) continue;
    if ((d.data() as RawAddressDoc).isDefault) {
      batch.update(d.ref, { isDefault: false });
      count++;
    }
  }
  if (count > 0) await batch.commit();
}

export async function listAddresses(uid: string): Promise<Address[]> {
  const snap = await getDocs(collection(db, 'users', uid, 'addresses'));
  const items = snap.docs.map((d) => normalize(d.id, d.data()));
  items.sort((a, b) => {
    if (a.isDefault !== b.isDefault) return a.isDefault ? -1 : 1;
    return (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0);
  });
  return items;
}

export interface AddressInput {
  alias: string;
  fullName: string;
  phone?: string;
  street: string;
  reference?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  isDefault: boolean;
}

export async function createAddress(uid: string, data: AddressInput): Promise<string> {
  if (data.isDefault) await clearOtherDefaults(uid);
  const payload: Record<string, unknown> = {
    alias: data.alias,
    fullName: data.fullName,
    phone: data.phone || null,
    street: data.street,
    reference: data.reference || null,
    city: data.city,
    state: data.state,
    zip: data.zip,
    country: data.country,
    isDefault: data.isDefault,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };
  const ref = await addDoc(collection(db, 'users', uid, 'addresses'), payload);
  console.log('[ADDR] creada', ref.id);
  return ref.id;
}

export async function updateAddress(
  uid: string,
  id: string,
  data: AddressInput
): Promise<void> {
  if (data.isDefault) await clearOtherDefaults(uid, id);
  const payload: Record<string, unknown> = {
    alias: data.alias,
    fullName: data.fullName,
    phone: data.phone || null,
    street: data.street,
    reference: data.reference || null,
    city: data.city,
    state: data.state,
    zip: data.zip,
    country: data.country,
    isDefault: data.isDefault,
    updatedAt: serverTimestamp()
  };
  await setDoc(doc(db, 'users', uid, 'addresses', id), payload, { merge: true });
  console.log('[ADDR] actualizada', id);
}

export async function deleteAddress(uid: string, id: string): Promise<void> {
  await deleteDoc(doc(db, 'users', uid, 'addresses', id));
  console.log('[ADDR] eliminada', id);
}

export async function setDefaultAddress(uid: string, id: string): Promise<void> {
  await clearOtherDefaults(uid, id);
  await setDoc(
    doc(db, 'users', uid, 'addresses', id),
    { isDefault: true, updatedAt: serverTimestamp() },
    { merge: true }
  );
  console.log('[ADDR] default →', id);
}
