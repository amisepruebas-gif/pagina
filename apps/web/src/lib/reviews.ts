import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  type DocumentData
} from 'firebase/firestore';
import { db } from './firebase';
import type { Review, RawReviewDoc } from '@/types/review';

/** ID determinístico: una reseña por usuario por producto (evita duplicados). */
export function reviewId(productId: string, userId: string): string {
  return `${productId}_${userId}`;
}

export function normalizeReview(id: string, data: DocumentData): Review {
  const raw = data as RawReviewDoc;
  return {
    id,
    productId: raw.productId ?? '',
    userId: raw.userId ?? '',
    userName: raw.userName ?? 'Cliente',
    rating: typeof raw.rating === 'number' ? raw.rating : 0,
    text: raw.text ?? '',
    hidden: raw.hidden === true,
    createdAt: raw.createdAt?.toDate(),
    updatedAt: raw.updatedAt?.toDate()
  };
}

/**
 * Crea o actualiza la reseña de un usuario para un producto.
 * Usa ID determinístico → re-reseñar sobreescribe la anterior.
 * Preserva `createdAt` original en ediciones.
 */
export async function submitReview(args: {
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  text: string;
}): Promise<void> {
  const id = reviewId(args.productId, args.userId);
  const ref = doc(db, 'reviews', id);
  const existing = await getDoc(ref);

  await setDoc(
    ref,
    {
      productId: args.productId,
      userId: args.userId,
      userName: args.userName,
      rating: args.rating,
      text: args.text.trim(),
      hidden: false,
      updatedAt: serverTimestamp(),
      ...(existing.exists() ? {} : { createdAt: serverTimestamp() })
    },
    { merge: true }
  );
  console.log('[REVIEWS] reseña enviada', id, 'rating=', args.rating);
}
