'use client';

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
  type ReactNode
} from 'react';
import type { CartItem } from '@/types/cart';
import { readCart, writeCart, CART_STORAGE_KEY } from '@/lib/cart-storage';
import { getRemoteCart, saveRemoteCart, mergeCartItems } from '@/lib/carts-remote';
import { useAuth } from '@/context/AuthContext';

interface CartContextValue {
  items: CartItem[];
  count: number;
  subtotal: number;
  add: (item: Omit<CartItem, 'qty'>, qty: number) => void;
  setQty: (productId: string, qty: number) => void;
  remove: (productId: string) => void;
  clear: () => void;
  hydrated: boolean;
  drawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const REMOTE_WRITE_DEBOUNCE_MS = 800;

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  // Track del último uid hidratado para no re-mergear con cada cambio de items
  const hydratedForUidRef = useRef<string | null>(null);
  const remoteWriteTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 1) Hidratar desde localStorage al montar
  useEffect(() => {
    const c = readCart();
    setItems(c.items);
    setHydrated(true);
    console.log('[CART] hydrated', c.items.length, 'items desde localStorage');
  }, []);

  // 2) Cuando llega un user (login) o cambia el uid: mergear con remoto
  useEffect(() => {
    if (!hydrated) return;
    if (!user) {
      // Logout: dejamos de sincronizar pero no borramos local ni remoto.
      hydratedForUidRef.current = null;
      return;
    }
    if (hydratedForUidRef.current === user.uid) return; // ya merged para este uid

    let cancelled = false;
    (async () => {
      console.log('[CART] mergeando con remoto uid=' + user.uid);
      const remote = await getRemoteCart(user.uid);
      if (cancelled) return;
      if (remote && remote.length > 0) {
        setItems((current) => {
          const merged = mergeCartItems(current, remote);
          console.log(
            '[CART] merge:',
            current.length,
            'local +',
            remote.length,
            'remoto →',
            merged.length
          );
          return merged;
        });
      } else if (remote === null) {
        // No había doc remoto; subir el local (si existe)
        const current = readCart().items;
        if (current.length > 0) {
          await saveRemoteCart(user.uid, current);
        }
      }
      hydratedForUidRef.current = user.uid;
    })();

    return () => {
      cancelled = true;
    };
  }, [hydrated, user]);

  // 3) Persistir cambios a localStorage (siempre) + Firestore (si logueado, debounced)
  useEffect(() => {
    if (!hydrated) return;
    writeCart({ items, updatedAt: Date.now() });

    if (user && hydratedForUidRef.current === user.uid) {
      if (remoteWriteTimerRef.current) clearTimeout(remoteWriteTimerRef.current);
      remoteWriteTimerRef.current = setTimeout(() => {
        void saveRemoteCart(user.uid, items);
      }, REMOTE_WRITE_DEBOUNCE_MS);
    }
  }, [items, hydrated, user]);

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (remoteWriteTimerRef.current) clearTimeout(remoteWriteTimerRef.current);
    };
  }, []);

  // 4) Sync entre pestañas (misma device, misma sesión)
  useEffect(() => {
    function handleStorage(e: StorageEvent) {
      if (e.key !== CART_STORAGE_KEY) return;
      const c = readCart();
      setItems(c.items);
    }
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const add = useCallback((item: Omit<CartItem, 'qty'>, qty: number) => {
    if (qty <= 0) return;
    setItems((prev) => {
      const idx = prev.findIndex((i) => i.productId === item.productId);
      if (idx >= 0) {
        const next = [...prev];
        const existing = next[idx];
        if (existing) next[idx] = { ...existing, qty: existing.qty + qty };
        return next;
      }
      return [...prev, { ...item, qty }];
    });
    console.log('[CART] add', item.productId, 'qty=', qty);
  }, []);

  const setQty = useCallback((productId: string, qty: number) => {
    if (qty <= 0) {
      setItems((prev) => prev.filter((i) => i.productId !== productId));
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.productId === productId ? { ...i, qty } : i))
    );
  }, []);

  const remove = useCallback((productId: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
    console.log('[CART] remove', productId);
  }, []);

  const clear = useCallback(() => {
    setItems([]);
    console.log('[CART] cleared');
  }, []);

  const openDrawer = useCallback(() => setDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  const count = items.reduce((sum, i) => sum + i.qty, 0);
  const subtotal = items.reduce((sum, i) => sum + i.qty * i.unitPrice, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        count,
        subtotal,
        add,
        setQty,
        remove,
        clear,
        hydrated,
        drawerOpen,
        openDrawer,
        closeDrawer
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}
