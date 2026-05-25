import {
  collection,
  doc,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  type DocumentReference
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { slugify } from '@/lib/slugify';

/* ============ TAGS ============ */

export interface TagInput {
  name: string;
  slug?: string;
  color?: string;
  active: boolean;
}

export async function createTag(input: TagInput): Promise<string> {
  const slug = input.slug?.trim() || slugify(input.name);
  const data = {
    name: input.name.trim(),
    slug,
    color: input.color?.trim() || null,
    active: input.active,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };
  const ref: DocumentReference = await addDoc(collection(db, 'tags'), data);
  return ref.id;
}

export async function updateTag(id: string, input: TagInput): Promise<void> {
  const slug = input.slug?.trim() || slugify(input.name);
  await setDoc(
    doc(db, 'tags', id),
    {
      name: input.name.trim(),
      slug,
      color: input.color?.trim() || null,
      active: input.active,
      updatedAt: serverTimestamp()
    },
    { merge: true }
  );
}

export async function deleteTag(id: string): Promise<void> {
  await deleteDoc(doc(db, 'tags', id));
}

/* ============ MATERIALS ============ */

export interface MaterialInput {
  name: string;
  slug?: string;
  description?: string;
  active: boolean;
}

export async function createMaterial(input: MaterialInput): Promise<string> {
  const slug = input.slug?.trim() || slugify(input.name);
  const data = {
    name: input.name.trim(),
    slug,
    description: input.description?.trim() || null,
    active: input.active,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };
  const ref: DocumentReference = await addDoc(collection(db, 'materials'), data);
  return ref.id;
}

export async function updateMaterial(id: string, input: MaterialInput): Promise<void> {
  const slug = input.slug?.trim() || slugify(input.name);
  await setDoc(
    doc(db, 'materials', id),
    {
      name: input.name.trim(),
      slug,
      description: input.description?.trim() || null,
      active: input.active,
      updatedAt: serverTimestamp()
    },
    { merge: true }
  );
}

export async function deleteMaterial(id: string): Promise<void> {
  await deleteDoc(doc(db, 'materials', id));
}

/* ============ SUBCATEGORIES ============ */

export interface SubcategoryInput {
  name: string;
  slug?: string;
  categoryId: string;
  description?: string;
  order: number;
  active: boolean;
}

export async function createSubcategory(input: SubcategoryInput): Promise<string> {
  const slug = input.slug?.trim() || slugify(input.name);
  const data = {
    name: input.name.trim(),
    slug,
    categoryId: input.categoryId,
    description: input.description?.trim() || null,
    order: input.order,
    active: input.active,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };
  const ref: DocumentReference = await addDoc(collection(db, 'subcategories'), data);
  return ref.id;
}

export async function updateSubcategory(id: string, input: SubcategoryInput): Promise<void> {
  const slug = input.slug?.trim() || slugify(input.name);
  await setDoc(
    doc(db, 'subcategories', id),
    {
      name: input.name.trim(),
      slug,
      categoryId: input.categoryId,
      description: input.description?.trim() || null,
      order: input.order,
      active: input.active,
      updatedAt: serverTimestamp()
    },
    { merge: true }
  );
}

export async function deleteSubcategory(id: string): Promise<void> {
  await deleteDoc(doc(db, 'subcategories', id));
}

/* ============ shared toggle ============ */

export async function setActiveOn(
  collectionName: 'tags' | 'materials' | 'subcategories',
  id: string,
  active: boolean
): Promise<void> {
  await updateDoc(doc(db, collectionName, id), {
    active,
    updatedAt: serverTimestamp()
  });
}
