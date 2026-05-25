import type { SiteConfig } from '@/types/config';

export interface ShippingResult {
  cost: number;
  isFree: boolean;
  freeFrom: number;
  /** Cuánto falta para alcanzar el envío gratis (0 si ya es gratis o no hay umbral). */
  remainingForFree: number;
}

/**
 * Calcula el costo de envío para un subtotal dado.
 * - Si hay umbral de envío gratis y el subtotal lo alcanza → gratis.
 * - Si no → costo base configurado.
 */
export function computeShipping(
  subtotal: number,
  shipping: SiteConfig['shipping']
): ShippingResult {
  const freeFrom = shipping.freeFromMxn ?? 0;
  const base = shipping.defaultCostMxn ?? 0;
  const isFree = freeFrom > 0 && subtotal >= freeFrom;
  return {
    cost: isFree ? 0 : base,
    isFree,
    freeFrom,
    remainingForFree: freeFrom > 0 && !isFree ? freeFrom - subtotal : 0
  };
}
