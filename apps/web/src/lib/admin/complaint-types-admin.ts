import {
  collection,
  doc,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface ComplaintTypeInput {
  name: string;
  description?: string;
  active: boolean;
}

export async function createComplaintType(input: ComplaintTypeInput): Promise<string> {
  const ref = await addDoc(collection(db, 'complaintTypes'), {
    name: input.name.trim(),
    description: input.description?.trim() || null,
    active: input.active,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  return ref.id;
}

export async function updateComplaintType(
  id: string,
  input: ComplaintTypeInput
): Promise<void> {
  await setDoc(
    doc(db, 'complaintTypes', id),
    {
      name: input.name.trim(),
      description: input.description?.trim() || null,
      active: input.active,
      updatedAt: serverTimestamp()
    },
    { merge: true }
  );
}

export async function deleteComplaintType(id: string): Promise<void> {
  await deleteDoc(doc(db, 'complaintTypes', id));
}

export async function setComplaintTypeActive(
  id: string,
  active: boolean
): Promise<void> {
  await updateDoc(doc(db, 'complaintTypes', id), {
    active,
    updatedAt: serverTimestamp()
  });
}
