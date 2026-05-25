import {
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  query,
  where,
  getDocs
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { slugify } from '@/lib/slugify';
import type { ViewModule } from '@/types/page-view';

/**
 * Devuelve un slug normalizado y único entre las vistas.
 * Si choca, agrega sufijo `-2`, `-3`… `excludeId` permite que una vista
 * conserve su propio slug al editarse.
 */
async function uniqueSlug(base: string, excludeId?: string): Promise<string> {
  const root = slugify(base) || 'vista';
  let candidate = root;
  for (let n = 2; n < 100; n += 1) {
    const snap = await getDocs(
      query(collection(db, 'vistas'), where('slug', '==', candidate))
    );
    const collision = snap.docs.some((d) => d.id !== excludeId);
    if (!collision) return candidate;
    candidate = `${root}-${n}`;
  }
  return `${root}-${Date.now()}`;
}

/** Crea una vista nueva (inactiva, sin módulos) con slug único. Devuelve el id. */
export async function createPageView(name: string): Promise<string> {
  const slug = await uniqueSlug(name);
  const ref = await addDoc(collection(db, 'vistas'), {
    name: name.trim(),
    slug,
    active: false,
    modules: [],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  console.log('[VISTAS] creada', ref.id, slug);
  return ref.id;
}

export async function updatePageView(
  id: string,
  data: {
    name?: string;
    slug?: string;
    active?: boolean;
    modules?: ViewModule[];
  }
): Promise<void> {
  const patch: Record<string, unknown> = { ...data };
  // El slug del editor se normaliza y se garantiza único (excluyendo esta vista).
  if (typeof data.slug === 'string') {
    patch.slug = await uniqueSlug(data.slug, id);
  }
  await updateDoc(doc(db, 'vistas', id), {
    ...patch,
    updatedAt: serverTimestamp()
  });
  console.log('[VISTAS] actualizada', id);
}

export async function deletePageView(id: string): Promise<void> {
  await deleteDoc(doc(db, 'vistas', id));
  console.log('[VISTAS] eliminada', id);
}
