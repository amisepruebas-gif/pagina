'use client';

import { useEffect, useRef, useState } from 'react';
import type { Product } from '@/types/product';
import type { SiteConfig } from '@/types/config';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { isFavorited, setFavorite } from '@/lib/favorites';
import { Badge, Button, Icon } from '@/components/ui';
import { QuantityStepper } from './QuantityStepper';
import { StockBadge } from './StockBadge';
import { TrustSignals } from './TrustSignals';

interface ProductBuyAreaProps {
  product: Product;
  shipping: SiteConfig['shipping'];
}

const money = (n: number) => '$' + n.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function ProductBuyArea({ product, shipping }: ProductBuyAreaProps) {
  const { add, openDrawer } = useCart();
  const { user } = useAuth();

  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [fav, setFav] = useState<boolean | null>(null);
  const [favBusy, setFavBusy] = useState(false);
  const [showSticky, setShowSticky] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const stockKnown = typeof product.stock === 'number';
  const maxQty = stockKnown ? Math.max(1, product.stock as number) : 99;
  const outOfStock = stockKnown && (product.stock as number) <= 0;
  const discount =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round((1 - product.price / product.originalPrice) * 100)
      : 0;

  useEffect(() => {
    if (!user) {
      setFav(false);
      return;
    }
    let cancelled = false;
    isFavorited(user.uid, product.id)
      .then((v) => !cancelled && setFav(v))
      .catch(() => !cancelled && setFav(false));
    return () => {
      cancelled = true;
    };
  }, [user, product.id]);

  useEffect(() => {
    const el = panelRef.current;
    if (!el) return;
    const ob = new IntersectionObserver(
      (entries) => {
        for (const e of entries) setShowSticky(!e.isIntersecting);
      },
      { threshold: 0 }
    );
    ob.observe(el);
    return () => ob.disconnect();
  }, []);

  function handleAdd() {
    if (outOfStock) return;
    add(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        imageUrl: product.primaryImageUrl ?? null,
        unitPrice: product.price,
        originalPrice: product.originalPrice ?? null,
        stockAtAdd: product.stock ?? null
      },
      qty
    );
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
    openDrawer();
  }

  async function toggleFav() {
    if (!user || favBusy || fav === null) return;
    setFavBusy(true);
    const next = !fav;
    try {
      await setFavorite(user.uid, product.id, next);
      setFav(next);
    } catch (err) {
      console.error('[FAV] error', err);
    } finally {
      setFavBusy(false);
    }
  }

  const base = shipping.defaultCostMxn ?? 0;
  const free = shipping.freeFromMxn ?? 0;

  return (
    <>
      <div ref={panelRef} className="flex flex-col gap-5">
        <div>
          {product.sku && (
            <div className="font-mono text-[11px] tracking-widest uppercase text-text-soft">
              SKU {product.sku}
            </div>
          )}
          <h1 className="mt-2 font-display font-bold leading-[1.1] tracking-[-0.025em] text-[clamp(28px,4vw,40px)]">
            {product.name}
          </h1>
        </div>

        <div className="flex items-end gap-3.5 flex-wrap pb-5 border-b border-border">
          <span className="font-display font-bold leading-none tracking-[-0.03em] text-[clamp(34px,5vw,46px)]">
            {money(product.price)}
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-lg text-text-soft line-through mb-1">
              {money(product.originalPrice)}
            </span>
          )}
          {discount > 0 && (
            <Badge tone="secondary" size="md" leadingIcon="bolt">
              -{discount}%
            </Badge>
          )}
          <span className="text-sm text-text-soft mb-1">{product.currency}</span>
        </div>

        {product.description && (
          <p className="text-text-muted leading-relaxed">{product.description}</p>
        )}

        <StockBadge stock={product.stock ?? null} />

        <div className="flex gap-3 items-center flex-wrap">
          <QuantityStepper value={qty} onChange={setQty} max={maxQty} />
          <Button
            size="lg"
            leadingIcon={added ? 'check' : 'cart'}
            onClick={handleAdd}
            disabled={outOfStock}
            className="flex-1 min-w-[200px]"
          >
            {outOfStock
              ? 'Sin stock'
              : added
                ? '¡Agregado al carrito!'
                : 'Agregar al carrito'}
          </Button>
        </div>

        {user && fav !== null && (
          <Button
            variant="secondary"
            leadingIcon={fav ? 'heart-filled' : 'heart'}
            onClick={toggleFav}
            disabled={favBusy}
            fullWidth
          >
            {fav ? 'Guardado en favoritos' : 'Guardar en favoritos'}
          </Button>
        )}

        <div className="flex items-center gap-3 p-4 bg-brand-50 rounded-md">
          <span className="shrink-0 size-9 rounded-full bg-white text-brand-700 inline-flex items-center justify-center shadow-xs">
            <Icon name="truck" size={18} strokeWidth={2} />
          </span>
          <div className="min-w-0 text-sm">
            <div className="font-display font-semibold">
              {base > 0 ? `Envío ${money(base)} MXN` : 'Envío a todo México'}
            </div>
            {free > 0 && (
              <div className="text-xs text-text-muted mt-0.5">
                Gratis en compras desde {money(free)}
              </div>
            )}
          </div>
        </div>

        <TrustSignals />
      </div>

      {/* Barra sticky móvil */}
      <div
        style={{ transform: showSticky ? 'translateY(0)' : 'translateY(120%)' }}
        className="lg:hidden fixed left-0 right-0 bottom-0 z-40 bg-surface/95 backdrop-blur border-t border-border shadow-[0_-8px_24px_-8px_rgba(0,0,0,0.12)] px-4 py-2.5 flex items-center gap-3 transition-transform duration-base ease-out pb-[max(10px,env(safe-area-inset-bottom))]"
      >
        <div className="flex-1 min-w-0">
          <div className="text-xs text-text-soft truncate">{product.name}</div>
          <div className="font-display font-bold text-base tracking-tight">
            {money(product.price)}
          </div>
        </div>
        <Button
          size="md"
          leadingIcon={added ? 'check' : 'cart'}
          onClick={handleAdd}
          disabled={outOfStock}
          className="shrink-0"
        >
          {outOfStock ? 'Sin stock' : added ? 'Agregado' : 'Agregar'}
        </Button>
      </div>
    </>
  );
}
