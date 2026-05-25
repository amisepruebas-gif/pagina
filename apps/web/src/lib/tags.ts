import { collection, getDocs, type DocumentData } from 'firebase/firestore';
import { db } from './firebase';
import type { Tag, RawTagDoc } from '@/types/taxonomy';

function normalize(id: string, data: DocumentData): Tag {
  const raw = data as RawTagDoc;
  return {
    id,
    name: raw.name ?? '',
    slug: raw.slug ?? id,
    color: raw.color,
    active: raw.active !== false,
    createdAt: raw.createdAt?.toDate(),
    updatedAt: raw.updatedAt?.toDate()
  };
}

export async function getTags(opts: { includeInactive?: boolean } = {}): Promise<Tag[]> {
  const snap = await getDocs(collection(db, 'tags'));
  let items = snap.docs.map((d) => normalize(d.id, d.data()));
  if (!opts.includeInactive) items = items.filter((t) => t.active);
  items.sort((a, b) => a.name.localeCompare(b.name));
  return items;
}
