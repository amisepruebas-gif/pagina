import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  type DocumentData
} from 'firebase/firestore';
import { db } from './firebase';
import type { PageView, RawPageViewDoc } from '@/types/page-view';

function normalize(id: string, data: DocumentData): PageView {
  const raw = data as RawPageViewDoc;
  return {
    id,
    name: raw.name ?? 'Vista',
    slug: raw.slug ?? id,
    active: raw.active !== false,
    modules: Array.isArray(raw.modules) ? raw.modules : [],
    createdAt: raw.createdAt?.toDate(),
    updatedAt: raw.updatedAt?.toDate()
  };
}

export async function getPageViews(
  opts: { includeInactive?: boolean } = {}
): Promise<PageView[]> {
  const snap = await getDocs(collection(db, 'vistas'));
  let list = snap.docs.map((d) => normalize(d.id, d.data()));
  if (!opts.includeInactive) list = list.filter((v) => v.active);
  list.sort(
    (a, b) => (b.updatedAt?.getTime() ?? 0) - (a.updatedAt?.getTime() ?? 0)
  );
  return list;
}

/** Busca una vista por slug. Si hubiera colisión, prefiere la activa. */
export async function getPageViewBySlug(slug: string): Promise<PageView | null> {
  const q = query(collection(db, 'vistas'), where('slug', '==', slug));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const views = snap.docs.map((d) => normalize(d.id, d.data()));
  return views.find((v) => v.active) ?? views[0] ?? null;
}

export async function getPageViewById(id: string): Promise<PageView | null> {
  const snap = await getDoc(doc(db, 'vistas', id));
  if (!snap.exists()) return null;
  return normalize(snap.id, snap.data());
}
