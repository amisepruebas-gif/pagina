import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './firebase';

export async function isFavorited(uid: string, productId: string): Promise<boolean> {
  const snap = await getDoc(doc(db, 'users', uid, 'favorites', productId));
  return snap.exists();
}

export async function setFavorite(uid: string, productId: string, fav: boolean): Promise<void> {
  const ref = doc(db, 'users', uid, 'favorites', productId);
  if (fav) {
    await setDoc(ref, { productId, createdAt: serverTimestamp() });
  } else {
    await deleteDoc(ref);
  }
  console.log('[FAV]', productId, fav ? 'agregado' : 'removido');
}

export async function getFavoriteProductIds(uid: string): Promise<string[]> {
  const snap = await getDocs(collection(db, 'users', uid, 'favorites'));
  return snap.docs.map((d) => d.id);
}
