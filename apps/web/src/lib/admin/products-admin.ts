import {
  collection,
  doc,
  addDoc,
  setDoc,
  updateDoc,
  getDocs,
  writeBatch,
  serverTimestamp,
  type DocumentReference
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { slugify as slug } from '@/lib/slugify';

export const slugify = slug;

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
  const ref: DocumentReference = await addDoc(collection(db, 'products'), data);
  console.log('[ADMIN] producto creado', ref.id);
  return ref.id;
}

export async function updateProduct(id: string, values: ProductFormValues): Promise<void> {
  const data = valuesToDoc(values, false);
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
