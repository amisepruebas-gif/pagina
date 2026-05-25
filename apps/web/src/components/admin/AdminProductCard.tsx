'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import { Badge, Icon } from '@/components/ui';
import type { Product } from '@/types/product';
import { StockBadge } from './StockBadge';
import ProductsTableActions from './ProductsTableActions';

/** AdminProductCard — tarjeta de un producto para la vista en cuadrícula. */
export function AdminProductCard({
  product,
  onEdit
}: {
  product: Product;
  /** Si se pasa, hace que tanto la imagen como el nombre abran el modal. */
  onEdit?: (productId: string) => void;
}) {
  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-border bg-surface">
      <ClickWrap product={product} onEdit={onEdit} className="relative block aspect-square bg-surface-2">
        {product.primaryImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.primaryImageUrl}
            alt=""
            className="size-full object-cover"
          />
        ) : (
          <span className="flex size-full items-center justify-center text-text-soft">
            <Icon name="grid" size={28} strokeWidth={1.6} />
          </span>
        )}
        {!product.active && (
          <span className="absolute left-2 top-2">
            <Badge tone="neutral" size="xs">
              Inactivo
            </Badge>
          </span>
        )}
      </ClickWrap>

      <div className="flex flex-1 flex-col gap-1.5 p-3">
        <ClickWrap
          product={product}
          onEdit={onEdit}
          className="line-clamp-2 font-display text-sm font-semibold leading-tight transition hover:text-brand-700"
        >
          {product.name}
        </ClickWrap>

        {(product.isFeatured || product.isNew) && (
          <div className="flex flex-wrap items-center gap-1.5">
            {product.isFeatured && (
              <Badge tone="brand" size="xs">
                Destacado
              </Badge>
            )}
            {product.isNew && (
              <Badge tone="accent" size="xs">
                Nuevo
              </Badge>
            )}
          </div>
        )}

        <div className="mt-auto flex items-end justify-between gap-2 pt-1">
          <div>
            <div className="font-display font-bold">
              ${product.price.toFixed(2)}
            </div>
            {typeof product.originalPrice === 'number' && (
              <div className="text-[11px] text-text-soft line-through">
                ${product.originalPrice.toFixed(2)}
              </div>
            )}
          </div>
          {typeof product.stock === 'number' && (
            <StockBadge stock={product.stock} />
          )}
        </div>

        <div className="mt-1 flex justify-end border-t border-border pt-2">
          <ProductsTableActions
            productId={product.id}
            active={product.active}
            onEdit={onEdit}
          />
        </div>
      </div>
    </div>
  );
}

/**
 * Wrap clickable estable — definido a nivel de módulo para no redefinirse
 * en cada render del padre. Botón cuando hay `onEdit`, Link si no.
 */
function ClickWrap({
  product,
  onEdit,
  className,
  children
}: {
  product: Product;
  onEdit?: (productId: string) => void;
  className?: string;
  children: ReactNode;
}) {
  if (onEdit) {
    return (
      <button
        type="button"
        onClick={() => onEdit(product.id)}
        className={`${className ?? ''} text-left`}
      >
        {children}
      </button>
    );
  }
  return (
    <Link href={`/admin/productos/${product.id}`} className={className}>
      {children}
    </Link>
  );
}
