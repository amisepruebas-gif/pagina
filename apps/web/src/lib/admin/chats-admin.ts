import {
  collection,
  doc,
  addDoc,
  updateDoc,
  serverTimestamp,
  increment
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { ChatStatus } from '@/types/chat';

export async function sendStaffMessage(
  chatId: string,
  text: string,
  staffUid: string
): Promise<void> {
  const trimmed = text.trim();
  if (!trimmed) return;
  await addDoc(collection(db, 'chats', chatId, 'messages'), {
    from: 'staff',
    uid: staffUid,
    text: trimmed,
    createdAt: serverTimestamp()
  });
  await updateDoc(doc(db, 'chats', chatId), {
    lastMessageAt: serverTimestamp(),
    lastMessagePreview: trimmed.slice(0, 120),
    unreadCustomer: increment(1),
    unreadStaff: 0,
    assignedTo: staffUid
  });
  console.log('[CHAT] staff reply', chatId);
}

export async function markChatReadByStaff(chatId: string): Promise<void> {
  await updateDoc(doc(db, 'chats', chatId), { unreadStaff: 0 });
}

export async function setChatStatus(
  chatId: string,
  status: ChatStatus
): Promise<void> {
  await updateDoc(doc(db, 'chats', chatId), { status });
  console.log('[CHAT]', chatId, 'status →', status);
}
