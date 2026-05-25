import { collection, getDocs, type DocumentData } from 'firebase/firestore';
import { db } from './firebase';
import type { ComplaintType, RawComplaintTypeDoc } from '@/types/complaint';

function normalize(id: string, data: DocumentData): ComplaintType {
  const raw = data as RawComplaintTypeDoc;
  return {
    id,
    name: raw.name ?? '',
    description: raw.description,
    active: raw.active !== false,
    createdAt: raw.createdAt?.toDate(),
    updatedAt: raw.updatedAt?.toDate()
  };
}

export async function getComplaintTypes(
  opts: { includeInactive?: boolean } = {}
): Promise<ComplaintType[]> {
  const snap = await getDocs(collection(db, 'complaintTypes'));
  let items = snap.docs.map((d) => normalize(d.id, d.data()));
  if (!opts.includeInactive) items = items.filter((t) => t.active);
  items.sort((a, b) => a.name.localeCompare(b.name));
  return items;
}
