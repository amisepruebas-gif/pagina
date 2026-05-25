'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { getFavoriteProductIds } from '@/lib/favorites';
import { getProductsByIds } from '@/lib/products';
import type { Product } from '@/types/product';
import { ProductCard, Button } from '@/components/ui';
import { toUiProduct, productHref } from '@/lib/ui-adapters';

export default function FavoritosTab() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!user) return;
      setLoading(true);
      try {
        const ids = await getFavoriteProductIds(user.uid);
        const prods = await getProductsByIds(ids);
        if (!cancelled) setProducts(prods);
      } catch (err) {
        console.error('[FAV] loading favorites failed:', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [user]);

  if (loading) {
    return (
      <p className="text-sm text-text-soft py-12 text-center">Cargando…</p>
    );
  }

  if (products.length === 0) {
    return (
      <div className="rounded-xl border-2 border-dashed border-border bg-surface px-6 py-16 text-center">
        <p className="font-display font-bold text-text">
          Aún no tienes favoritos.
        </p>
        <p className="mt-2 text-sm text-text-muted">
          Toca el corazón en cualquier producto para guardarlo aquí.
        </p>
        <Link href="/shop" className="mt-6 inline-block">
          <Button trailingIcon="arr-right">Explorar tienda</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((p, i) => (
        <Link key={p.id} href={productHref(p)} className="block">
          <ProductCard variant="canonical" product={toUiProduct(p, i)} />
        </Link>
      ))}
    </div>
  );
}
