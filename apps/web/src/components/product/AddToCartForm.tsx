'use client';

import { useState } from 'react';
import type { Product } from '@/types/product';

export default function AddToCartForm({ product }: { product: Product }) {
  const stockKnown = typeof product.stock === 'number';
  const maxQty = stockKnown ? Math.max(0, product.stock!) : 99;
  const outOfStock = stockKnown && product.stock! <= 0;
  const lowStock = stockKnown && product.stock! > 0 && product.stock! <= 10;

  const [qty, setQty] = useState(1);

  function handleAdd() {
    console.log('[CART] add', { productId: product.id, slug: product.slug, qty });
    // Lógica real del carrito vive en Fase C — por ahora solo log + feedback visual.
  }

  return (
    <div>
      <div className="flex items-center gap-3">
        <div className="flex items-center border border-gray-300 rounded-full">
          <button
            type="button"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            disabled={qty <= 1}
            className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-accent disabled:opacity-30"
            aria-label="Disminuir cantidad"
          >
            −
          </button>
          <span className="w-10 text-center font-semibold tabular-nums">{qty}</span>
          <button
            type="button"
            onClick={() => setQty((q) => Math.min(maxQty, q + 1))}
            disabled={qty >= maxQty || outOfStock}
            className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-accent disabled:opacity-30"
            aria-label="Aumentar cantidad"
          >
            +
          </button>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          disabled={outOfStock}
          className="flex-1 rounded-full bg-accent text-white px-6 py-3 text-sm font-bold hover:bg-accent-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {outOfStock ? 'Sin stock' : 'Agregar al carrito'}
        </button>
      </div>
      {lowStock && (
        <p className="mt-3 text-xs text-amber-600">
          ¡Quedan solo {product.stock}!
        </p>
      )}
      {!stockKnown && (
        <p className="mt-3 text-xs text-gray-400">
          Stock no especificado. Agrega el campo <code className="rounded bg-gray-100 px-1">stock</code> en Firestore.
        </p>
      )}
    </div>
  );
}
