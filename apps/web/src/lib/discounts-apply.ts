import type { CartItem } from '@/types/cart';
import type { Discount } from '@/types/discount';
import { getDiscounts } from '@/lib/discounts';
import { getProductBySlug } from '@/lib/products';

export interface CouponResult {
  discount: Discount | null;
  error: string | null;
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

/**
 * Valida un código de cupón contra `discounts` (solo activos y vigentes).
 * Devuelve el descuento o un mensaje de error en español.
 */
export async function validateCoupon(code: string): Promise<CouponResult> {
  const clean = code.trim().toLowerCase();
  if (!clean) return { discount: null, error: 'Escribe un código.' };

  const all = await getDiscounts({ onlyValid: true });
  const match = all.find(
    (d) => d.code && d.code.trim().toLowerCase() === clean
  );
  if (!match) {
    return { discount: null, error: 'Código no válido o expirado.' };
  }
  if (match.percentage <= 0) {
    return { discount: null, error: 'Ese código no tiene descuento.' };
  }
  return { discount: match, error: null };
}

/**
 * Calcula el monto en MXN que descuenta un cupón sobre el carrito.
 * - global: % sobre todo el subtotal
 * - product: % sobre los items que coinciden con el productId
 * - category: % sobre los items cuyo producto pertenece a la categoría
 */
export async function computeCartDiscountAmount(
  items: CartItem[],
  discount: Discount
): Promise<number> {
  const pct = discount.percentage / 100;

  if (discount.type === 'global') {
    const subtotal = items.reduce((s, i) => s + i.unitPrice * i.qty, 0);
    return round2(subtotal * pct);
  }

  if (discount.type === 'product') {
    const base = items
      .filter((i) => i.productId === discount.productId)
      .reduce((s, i) => s + i.unitPrice * i.qty, 0);
    return round2(base * pct);
  }

  if (discount.type === 'category') {
    let base = 0;
    for (const i of items) {
      const p = await getProductBySlug(i.slug);
      if (p && p.categoryId === discount.categoryId) {
        base += i.unitPrice * i.qty;
      }
    }
    return round2(base * pct);
  }

  return 0;
}
