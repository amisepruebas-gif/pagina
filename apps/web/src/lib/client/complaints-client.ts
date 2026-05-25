import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface CreateComplaintInput {
  userId: string;
  userEmail: string;
  userName: string;
  typeId?: string;
  typeName?: string;
  orderId?: string;
  orderNumber?: string;
  description: string;
}

export async function createComplaint(input: CreateComplaintInput): Promise<string> {
  const ref = await addDoc(collection(db, 'complaints'), {
    userId: input.userId,
    userEmail: input.userEmail,
    userName: input.userName,
    typeId: input.typeId ?? null,
    typeName: input.typeName ?? null,
    orderId: input.orderId ?? null,
    orderNumber: input.orderNumber ?? null,
    description: input.description.trim(),
    status: 'open',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  console.log('[COMPLAINT] creada', ref.id);
  return ref.id;
}
