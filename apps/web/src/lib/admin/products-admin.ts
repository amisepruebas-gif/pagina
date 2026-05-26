import {
  collection,
  doc,
  addDoc,
  setDoc,
  updateDoc,
  getDocs,
  query,
  where,
  limit as fsLimit,
  writeBatch,
  serverTimestamp,
  type DocumentReference
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { slugify as slug } from '@/lib/slugify';

export const slugify = slug;

/**
 * Error tipado para colisiones en campos únicos. El form lo captura para
 * mostrar el nombre del producto en conflicto + un slug/SKU libre sugerido.
 */
export class DuplicateFieldError extends Error {
  readonly field: 'slug' | 'sku';
  readonly conflictingName: string;
  readonly suggestion: string;
  constructor(
    field: 'slug' | 'sku',
    conflictingName: string,
    suggestion: string
  ) {
    super(`Duplicate ${field}: conflicts with "${conflictingName}"`);
    this.name = 'DuplicateFieldError';
    this.field = field;
    this.conflictingName = conflictingName;
    this.suggestion = suggestion;
  }
}

/**
 * Busca otro producto con el mismo valor en `field`. Si excludeId está
 * presente (modo edición), ignora el propio doc.
 */
async function findFieldConflict(
  field: 'slug' | 'sku',
  value: string,
  excludeId?: string
): Promise<{ id: string; name: string } | null> {
  // limit(2) en vez de 1 para no devolver al propio doc cuando excludeId.
  const q = query(
    collection(db, 'products'),
    where(field, '==', value),
    fsLimit(2)
  );
  const snap = await getDocs(q);
  for (const d of snap.docs) {
    if (excludeId && d.id === excludeId) continue;
    const name = (d.data().name as string | undefined) ?? d.id;
    return { id: d.id, name };
  }
  return null;
}

/** Devuelve un slug/SKU libre: `base-2`, `base-3`… Cota 50 + fallback. */
async function suggestFreeValue(
  field: 'slug' | 'sku',
  base: string,
  excludeId?: string
): Promise<string> {
  for (let n = 2; n < 50; n++) {
    const candidate = `${base}-${n}`;
    const conflict = await findFieldConflict(field, candidate, excludeId);
    if (!conflict) return candidate;
  }
  return `${base}-${Date.now().toString(36).slice(-4)}`;
}

async function assertUniqueFields(
  data: Record<string, unknown>,
  excludeId?: string
): Promise<void> {
  const finalSlug = data.slug as string;
  const slugConflict = await findFieldConflict('slug', finalSlug, excludeId);
  if (slugConflict) {
    const suggestion = await suggestFreeValue('slug', finalSlug, excludeId);
    throw new DuplicateFieldError('slug', slugConflict.name, suggestion);
  }
  const finalSku = data.sku as string | null | undefined;
  if (finalSku) {
    const skuConflict = await findFieldConflict('sku', finalSku, excludeId);
    if (skuConflict) {
      const suggestion = await suggestFreeValue('sku', finalSku, excludeId);
      throw new DuplicateFieldError('sku', skuConflict.name, suggestion);
    }
  }
}

export interface ProductFormValues {
  name: string;
  slug?: string;
  sku?: string;
  description?: string;
  longDescription?: string;
  price: number;
  costPrice?: number;
  originalPrice?: number;
  stock?: number;
  isNew: boolean;
  isFeatured: boolean;
  active: boolean;
  primaryImageUrl?: string;
  categoryId?: string;
  subcategoryId?: string;
  materialId?: string;
  tagIds: string[];
}

function valuesToDoc(values: ProductFormValues, isCreate: boolean) {
  const slug = values.slug?.trim() || slugify(values.name);
  const data: Record<string, unknown> = {
    name: values.name.trim(),
    slug,
    price: values.price,
    isNew: values.isNew,
    isFeatured: values.isFeatured,
    active: values.active,
    tagIds: values.tagIds,
    updatedAt: serverTimestamp()
  };
  if (isCreate) data.createdAt = serverTimestamp();
  if (values.sku !== undefined) data.sku = values.sku || null;
  if (values.description !== undefined) data.description = values.description || null;
  if (values.longDescription !== undefined) data.longDescription = values.longDescription || null;
  if (values.costPrice !== undefined) data.costPrice = values.costPrice || null;
  if (values.originalPrice !== undefined) data.originalPrice = values.originalPrice || null;
  if (values.stock !== undefined) data.stock = values.stock;
  if (values.primaryImageUrl !== undefined) data.primaryImageUrl = values.primaryImageUrl || null;
  if (values.categoryId !== undefined) data.categoryId = values.categoryId || null;
  if (values.subcategoryId !== undefined) data.subcategoryId = values.subcategoryId || null;
  if (values.materialId !== undefined) data.materialId = values.materialId || null;
  return data;
}

export async function createProduct(values: ProductFormValues): Promise<string> {
  const data = valuesToDoc(values, true);
  await assertUniqueFields(data);
  const ref: DocumentReference = await addDoc(collection(db, 'products'), data);
  console.log('[ADMIN] producto creado', ref.id);
  return ref.id;
}

export async function updateProduct(id: string, values: ProductFormValues): Promise<void> {
  const data = valuesToDoc(values, false);
  await assertUniqueFields(data, id);
  await setDoc(doc(db, 'products', id), data, { merge: true });
  console.log('[ADMIN] producto actualizado', id);
}

export async function setProductActive(id: string, active: boolean): Promise<void> {
  await updateDoc(doc(db, 'products', id), {
    active,
    updatedAt: serverTimestamp()
  });
  console.log('[ADMIN] producto', id, 'active=', active);
}

/**
 * Sincroniza las imágenes adicionales (galería) del producto.
 * Reemplaza por completo la subcolección `products/{id}/images` con la lista
 * de URLs dada — cada una con su `order` por índice — y actualiza `imageCount`.
 */
export async function syncProductImages(
  productId: string,
  urls: string[]
): Promise<void> {
  const imagesCol = collection(db, 'products', productId, 'images');
  const existing = await getDocs(imagesCol);
  const batch = writeBatch(db);

  for (const d of existing.docs) batch.delete(d.ref);
  urls.forEach((url, i) => {
    batch.set(doc(imagesCol), { url, alt: '', order: i });
  });
  batch.update(doc(db, 'products', productId), {
    imageCount: urls.length,
    updatedAt: serverTimestamp()
  });

  await batch.commit();
  console.log('[ADMIN] imágenes del producto sincronizadas', productId, urls.length);
}
