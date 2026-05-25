import {
  collection,
  doc,
  addDoc,
  getDocs,
  updateDoc,
  serverTimestamp,
  increment,
  limit,
  query,
  where,
  type DocumentReference
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface CreateChatInput {
  uid: string;
  email: string;
  displayName: string;
  subject: string;
  firstMessage: string;
}

export async function createCustomerChat(input: CreateChatInput): Promise<string> {
  const trimmedMsg = input.firstMessage.trim();
  if (!trimmedMsg) {
    throw new Error('El mensaje no puede estar vacío.');
  }
  // Política: un solo chat abierto por usuario. La UI ya lo respeta, pero
  // bloqueamos a nivel de lib para que el script no pueda crear duplicados.
  const existing = await getDocs(
    query(
      collection(db, 'chats'),
      where('userId', '==', input.uid),
      where('status', '==', 'open'),
      limit(1)
    )
  );
  if (!existing.empty) {
    throw new Error('Ya tienes un chat abierto. Continúa esa conversación.');
  }

  const chatRef: DocumentReference = await addDoc(collection(db, 'chats'), {
    userId: input.uid,
    guestName: input.displayName,
    guestEmail: input.email,
    subject: input.subject.trim() || 'Sin asunto',
    status: 'open',
    lastMessageAt: serverTimestamp(),
    lastMessagePreview: trimmedMsg.slice(0, 120),
    unreadStaff: 1,
    unreadCustomer: 0,
    createdAt: serverTimestamp()
  });
  await addDoc(collection(db, 'chats', chatRef.id, 'messages'), {
    from: 'customer',
    uid: input.uid,
    text: trimmedMsg,
    createdAt: serverTimestamp()
  });
  console.log('[CHAT] customer created', chatRef.id);
  return chatRef.id;
}

export async function sendCustomerMessage(
  chatId: string,
  uid: string,
  text: string
): Promise<void> {
  const trimmed = text.trim();
  if (!trimmed) return;
  await addDoc(collection(db, 'chats', chatId, 'messages'), {
    from: 'customer',
    uid,
    text: trimmed,
    createdAt: serverTimestamp()
  });
  await updateDoc(doc(db, 'chats', chatId), {
    lastMessageAt: serverTimestamp(),
    lastMessagePreview: trimmed.slice(0, 120),
    unreadStaff: increment(1),
    unreadCustomer: 0
  });
  console.log('[CHAT] customer reply', chatId);
}

export async function markChatReadByCustomer(chatId: string): Promise<void> {
  await updateDoc(doc(db, 'chats', chatId), { unreadCustomer: 0 });
}
