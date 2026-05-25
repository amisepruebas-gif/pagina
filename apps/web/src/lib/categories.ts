import { collection, getDocs, doc, getDoc, type DocumentData } from 'firebase/firestore';
import { db } from './firebase';
import type { Category, RawCategoryDoc } from '@/types/category';

function normalize(id: string, data: DocumentData): Category {
  const raw = data as RawCategoryDoc;
  return {
    id,
    name: raw.name ?? 'Categoría',
    slug: raw.slug ?? id,
    description: raw.description,
    imageUrl: raw.imageUrl,
    gradient: raw.gradient,
    order: raw.order ?? 0,
    active: raw.active !== false,
    createdAt: raw.createdAt?.toDate(),
    updatedAt: raw.updatedAt?.toDate()
  };
}

interface FetchOpts {
  includeInactive?: boolean;
}

export async function getCategories(opts: FetchOpts = {}): Promise<Category[]> {
  const snap = await getDocs(collection(db, 'categories'));
  let cats = snap.docs.map((d) => normalize(d.id, d.data()));
  if (!opts.includeInactive) cats = cats.filter((c) => c.active);
  cats.sort((a, b) => {
    if (a.order !== b.order) return a.order - b.order;
    return a.name.localeCompare(b.name);
  });
  return cats;
}

export async function getCategoryById(id: string): Promise<Category | null> {
  const snap = await getDoc(doc(db, 'categories', id));
  if (!snap.exists()) return null;
  return normalize(snap.id, snap.data());
}
