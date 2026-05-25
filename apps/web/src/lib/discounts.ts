import {
  collection,
  doc,
  getDoc,
  getDocs,
  type DocumentData
} from 'firebase/firestore';
import { db } from './firebase';
import type { Discount, RawDiscountDoc } from '@/types/discount';

function normalize(id: string, data: DocumentData): Discount {
  const raw = data as RawDiscountDoc;
  return {
    id,
    name: raw.name ?? '',
    description: raw.description,
    code: raw.code,
    type: raw.type ?? 'global',
    categoryId: raw.categoryId,
    productId: raw.productId,
    percentage: raw.percentage ?? 0,
    season: raw.season,
    validFrom: raw.validFrom?.toDate(),
    validUntil: raw.validUntil?.toDate(),
    active: raw.active !== false,
    createdAt: raw.createdAt?.toDate(),
    updatedAt: raw.updatedAt?.toDate()
  };
}

interface FetchOpts {
  includeInactive?: boolean;
  onlyValid?: boolean; // dentro de validFrom..validUntil
}

export async function getDiscounts(opts: FetchOpts = {}): Promise<Discount[]> {
  const snap = await getDocs(collection(db, 'discounts'));
  let items = snap.docs.map((d) => normalize(d.id, d.data()));

  if (!opts.includeInactive) items = items.filter((d) => d.active);
  if (opts.onlyValid) {
    const now = new Date();
    items = items.filter((d) => {
      if (d.validFrom && d.validFrom > now) return false;
      if (d.validUntil && d.validUntil < now) return false;
      return true;
    });
  }

  items.sort((a, b) => b.percentage - a.percentage);
  return items;
}

export async function getDiscountById(id: string): Promise<Discount | null> {
  const snap = await getDoc(doc(db, 'discounts', id));
  if (!snap.exists()) return null;
  return normalize(snap.id, snap.data());
}
