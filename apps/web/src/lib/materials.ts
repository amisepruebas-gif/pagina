import { collection, getDocs, type DocumentData } from 'firebase/firestore';
import { db } from './firebase';
import type { Material, RawMaterialDoc } from '@/types/taxonomy';

function normalize(id: string, data: DocumentData): Material {
  const raw = data as RawMaterialDoc;
  return {
    id,
    name: raw.name ?? '',
    slug: raw.slug ?? id,
    description: raw.description,
    active: raw.active !== false,
    createdAt: raw.createdAt?.toDate(),
    updatedAt: raw.updatedAt?.toDate()
  };
}

export async function getMaterials(
  opts: { includeInactive?: boolean } = {}
): Promise<Material[]> {
  const snap = await getDocs(collection(db, 'materials'));
  let items = snap.docs.map((d) => normalize(d.id, d.data()));
  if (!opts.includeInactive) items = items.filter((m) => m.active);
  items.sort((a, b) => a.name.localeCompare(b.name));
  return items;
}
