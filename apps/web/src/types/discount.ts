import type { Timestamp } from 'firebase/firestore';

export type DiscountType = 'global' | 'category' | 'product';

export interface Discount {
  id: string;
  name: string;
  description?: string;
  code?: string;
  type: DiscountType;
  categoryId?: string;
  productId?: string;
  percentage: number;
  season?: string;
  validFrom?: Date;
  validUntil?: Date;
  active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface RawDiscountDoc {
  name?: string;
  description?: string;
  code?: string;
  type?: DiscountType;
  categoryId?: string;
  productId?: string;
  percentage?: number;
  season?: string;
  validFrom?: Timestamp;
  validUntil?: Timestamp;
  active?: boolean;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

/**
 * Aplica el mejor descuento aplicable al producto entre los activos.
 * - global aplica a todos
 * - category aplica si producto.categoryId == descuento.categoryId
 * - product aplica si producto.id == descuento.productId
 * Solo descuentos vigentes en la fecha actual.
 */
export function bestDiscountFor(
  product: { id: string; categoryId?: string },
  discounts: Discount[],
  now: Date = new Date()
): Discount | null {
  let best: Discount | null = null;
  for (const d of discounts) {
    if (!d.active) continue;
    if (d.validFrom && d.validFrom > now) continue;
    if (d.validUntil && d.validUntil < now) continue;
    if (d.type === 'category' && d.categoryId !== product.categoryId) continue;
    if (d.type === 'product' && d.productId !== product.id) continue;
    if (!best || d.percentage > best.percentage) best = d;
  }
  return best;
}
