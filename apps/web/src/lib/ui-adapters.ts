import type { Product as RealProduct } from '@/types/product';
import type { Product as UiProduct } from '@/lib/ui-types';

/** Acentos rotativos para el placeholder de productos sin imagen. */
const ACCENTS = ['#00D97A', '#FF5C8A', '#FFD23F', '#7C3AED', '#00BFFF', '#FF6B35'];

/**
 * Convierte un Producto de Firestore al shape que esperan los componentes
 * del sistema de diseño (`ProductCard`, etc.).
 */
export function toUiProduct(p: RealProduct, index = 0): UiProduct {
  const onSale = p.originalPrice !== undefined && p.price < p.originalPrice;
  return {
    id: p.id,
    brand: '',
    name: p.name,
    image: p.primaryImageUrl,
    price: p.price,
    oldPrice: onSale ? p.originalPrice : undefined,
    tag: p.isNew ? 'Nuevo' : p.isFeatured ? 'Top' : undefined,
    stock: p.stock,
    accent: ACCENTS[index % ACCENTS.length]
  };
}

/** Ruta canónica de la página de producto. */
export function productHref(p: RealProduct): string {
  return `/producto/${p.slug}`;
}
