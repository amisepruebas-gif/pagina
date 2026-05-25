import type { CartItem } from '@/types/cart';

export const CART_STORAGE_KEY = 'pagina_cart_v1';

export interface StoredCart {
  items: CartItem[];
  updatedAt: number;
}

const EMPTY: StoredCart = { items: [], updatedAt: 0 };

export function readCart(): StoredCart {
  if (typeof window === 'undefined') return EMPTY;
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw) as StoredCart;
    if (!parsed || !Array.isArray(parsed.items)) return EMPTY;
    return {
      items: parsed.items.filter(
        (i): i is CartItem =>
          !!i &&
          typeof i.productId === 'string' &&
          typeof i.qty === 'number' &&
          typeof i.unitPrice === 'number'
      ),
      updatedAt: typeof parsed.updatedAt === 'number' ? parsed.updatedAt : 0
    };
  } catch {
    return EMPTY;
  }
}

export function writeCart(c: StoredCart): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(c));
  } catch (err) {
    console.error('[CART] localStorage write failed:', err);
  }
}

export function clearStoredCart(): void {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(CART_STORAGE_KEY);
}
