import type { Timestamp } from 'firebase/firestore';

/**
 * Tipo "limpio" del producto. Resultado de normalizar lo que vive en Firestore.
 * Usado por la UI.
 */
export interface Product {
  id: string;
  name: string;
  slug: string;
  sku?: string;
  description?: string;
  longDescription?: string;
  price: number;
  originalPrice?: number;
  currency: string;
  stock?: number;
  isNew?: boolean;
  isFeatured?: boolean;
  active: boolean;
  primaryImageUrl?: string;
  imageCount?: number;
  categoryId?: string;
  subcategoryId?: string;
  materialId?: string;
  tagIds: string[];
  bulkPricing?: Array<{ minQty: number; totalPrice: number; discountPct?: number }>;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Estructura "cruda" del doc Firestore. Tolerante a esquemas mixtos:
 * - price puede ser número plano (ej. 175) o anidado ({ sale, production }).
 * - imagen puede venir como primaryImageUrl, imageUrl o imagePrincipal.
 * - active=undefined se trata como true.
 * Esto permite al usuario crear docs en consola sin seguir un esquema estricto.
 */
export interface RawProductDoc {
  name?: string;
  slug?: string;
  sku?: string;
  description?: string;
  longDescription?: string;
  price?: number | { sale?: number; production?: number; currency?: string };
  originalPrice?: number;
  stock?: number;
  isNew?: boolean;
  isFeatured?: boolean;
  active?: boolean;
  primaryImageUrl?: string;
  imageUrl?: string;
  imagePrincipal?: string;
  imageCount?: number;
  categoryId?: string;
  subcategoryId?: string;
  materialId?: string;
  tagIds?: string[];
  bulkPricing?: Array<{ minQty: number; totalPrice: number; discountPct?: number }>;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}
