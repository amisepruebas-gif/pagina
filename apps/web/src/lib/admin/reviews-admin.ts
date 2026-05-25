import { doc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

/** Oculta o muestra una reseña (moderación). */
export async function setReviewHidden(id: string, hidden: boolean): Promise<void> {
  await updateDoc(doc(db, 'reviews', id), {
    hidden,
    updatedAt: serverTimestamp()
  });
  console.log('[ADMIN] review', id, 'hidden=', hidden);
}

/** Elimina una reseña definitivamente. */
export async function deleteReview(id: string): Promise<void> {
  await deleteDoc(doc(db, 'reviews', id));
  console.log('[ADMIN] review eliminada', id);
}
