import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  type DocumentData
} from 'firebase/firestore';
import { db } from './firebase';
import type { CartItem } from '@/types/cart';

interface RemoteCartDoc {
  items?: CartItem[];
  updatedAt?: { seconds: number };
}

/** Lee el carrito remoto del usuario. `null` si no hay doc todavía. */
export async function getRemoteCart(uid: string): Promise<CartItem[] | null> {
  try {
    const snap = await getDoc(doc(db, 'carts', uid));
    if (!snap.exists()) return null;
    const data = snap.data() as DocumentData as RemoteCartDoc;
    if (!Array.isArray(data.items)) return [];
    // Filtrar items con shape válido (defensivo si schema cambia)
    return data.items.filter(
      (i): i is CartItem =>
        !!i &&
        typeof i.productId === 'string' &&
        typeof i.qty === 'number' &&
        typeof i.unitPrice === 'number'
    );
  } catch (err) {
    console.error('[CART remote] getRemoteCart error:', err);
    return null;
  }
}

/** Pisa el carrito remoto. No-op si uid vacío. */
export async function saveRemoteCart(uid: string, items: CartItem[]): Promise<void> {
  if (!uid) return;
  try {
    await setDoc(doc(db, 'carts', uid), {
      items,
      updatedAt: serverTimestamp()
    });
    console.log('[CART remote] saved', items.length, 'items para uid=' + uid);
  } catch (err) {
    console.error('[CART remote] saveRemoteCart error:', err);
  }
}

/**
 * Merge cart local + remoto. Para colisión por productId:
 * - toma el qty MAYOR (más seguro UX: no pierdes items)
 * - prefiere snapshot de precio del remoto (más reciente que localStorage potencialmente viejo)
 */
export function mergeCartItems(
  local: CartItem[],
  remote: CartItem[]
): CartItem[] {
  const byId = new Map<string, CartItem>();
  for (const item of local) byId.set(item.productId, item);
  for (const item of remote) {
    const existing = byId.get(item.productId);
    if (!existing) {
      byId.set(item.productId, item);
    } else {
      byId.set(item.productId, {
        ...item, // preferir snapshot remoto (precio/imagen más recientes)
        qty: Math.max(existing.qty, item.qty)
      });
    }
  }
  return Array.from(byId.values());
}
