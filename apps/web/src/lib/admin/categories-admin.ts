import {
  collection,
  doc,
  addDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  type DocumentReference
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { slugify } from '@/lib/slugify';

export interface CategoryFormValues {
  name: string;
  slug?: string;
  description?: string;
  imageUrl?: string;
  gradient?: string;
  order: number;
  active: boolean;
}

function valuesToDoc(values: CategoryFormValues, isCreate: boolean) {
  const slug = values.slug?.trim() || slugify(values.name);
  const data: Record<string, unknown> = {
    name: values.name.trim(),
    slug,
    order: values.order,
    active: values.active,
    updatedAt: serverTimestamp()
  };
  if (isCreate) data.createdAt = serverTimestamp();
  if (values.description !== undefined) data.description = values.description || null;
  if (values.imageUrl !== undefined) data.imageUrl = values.imageUrl || null;
  if (values.gradient !== undefined) data.gradient = values.gradient || null;
  return data;
}

export async function createCategory(values: CategoryFormValues): Promise<string> {
  const data = valuesToDoc(values, true);
  const ref: DocumentReference = await addDoc(collection(db, 'categories'), data);
  console.log('[ADMIN] categoría creada', ref.id);
  return ref.id;
}

export async function updateCategory(id: string, values: CategoryFormValues): Promise<void> {
  const data = valuesToDoc(values, false);
  await setDoc(doc(db, 'categories', id), data, { merge: true });
  console.log('[ADMIN] categoría actualizada', id);
}

export async function setCategoryActive(id: string, active: boolean): Promise<void> {
  await updateDoc(doc(db, 'categories', id), {
    active,
    updatedAt: serverTimestamp()
  });
  console.log('[ADMIN] categoría', id, 'active=', active);
}
