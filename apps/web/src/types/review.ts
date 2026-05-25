import type { Timestamp } from 'firebase/firestore';

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number; // 1-5
  text: string;
  hidden: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface RawReviewDoc {
  productId?: string;
  userId?: string;
  userName?: string;
  rating?: number;
  text?: string;
  hidden?: boolean;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

/** Promedio de rating de un conjunto de reseñas (0 si no hay). */
export function averageRating(reviews: { rating: number }[]): number {
  if (reviews.length === 0) return 0;
  const sum = reviews.reduce((s, r) => s + r.rating, 0);
  return Math.round((sum / reviews.length) * 10) / 10;
}
