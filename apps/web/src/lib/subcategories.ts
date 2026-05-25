import { collection, getDocs, type DocumentData } from 'firebase/firestore';
import { db } from './firebase';
import type { Subcategory, RawSubcategoryDoc } from '@/types/taxonomy';

function normalize(id: string, data: DocumentData): Subcategory {
  const raw = data as RawSubcategoryDoc;
  return {
    id,
    name: raw.name ?? '',
    slug: raw.slug ?? id,
    categoryId: raw.categoryId ?? '',
    description: raw.description,
    order: raw.order ?? 0,
    active: raw.active !== false,
    createdAt: raw.createdAt?.toDate(),
    updatedAt: raw.updatedAt?.toDate()
  };
}

interface FetchOpts {
  includeInactive?: boolean;
  categoryId?: string;
}

export async function getSubcategories(opts: FetchOpts = {}): Promise<Subcategory[]> {
  const snap = await getDocs(collection(db, 'subcategories'));
  let items = snap.docs.map((d) => normalize(d.id, d.data()));
  if (!opts.includeInactive) items = items.filter((s) => s.active);
  if (opts.categoryId) items = items.filter((s) => s.categoryId === opts.categoryId);
  items.sort((a, b) => {
    if (a.order !== b.order) return a.order - b.order;
    return a.name.localeCompare(b.name);
  });
  return items;
}
