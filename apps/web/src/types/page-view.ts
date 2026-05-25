import type { Timestamp } from 'firebase/firestore';

/**
 * "Vistas" — constructor de landing pages dinámicas. Cada vista tiene un slug
 * propio (`/v/{slug}`) y una lista ordenada de módulos configurables.
 */

export type ViewModuleType =
  | 'slider' // carrusel de banners
  | 'products' // grid de productos seleccionados
  | 'promo' // grid de productos con estilo promocional + countdown
  | 'banners' // banners estáticos en grid
  | 'categories' // todas las categorías activas (automático)
  | 'video'; // embed de video (YouTube / Vimeo)

export type BannerLinkType = 'producto' | 'categoria' | 'vista' | 'url';

export interface ViewBanner {
  id?: string; // id de instancia — key estable en el editor
  imageUrl: string;
  linkType?: BannerLinkType;
  /** slug de producto · id de categoría · slug de vista · URL externa */
  linkValue?: string;
}

/** Personalización visual de la sección promocional. */
export interface PromoConfig {
  bgColor?: string; // hex — fondo de la sección
  textColor?: string; // hex — color del título/subtítulo
  badgeText?: string; // ej. "OFERTA"
  badgeColor?: string; // hex — fondo del badge
  countdownEnd?: string; // ISO datetime — fin del contador regresivo
}

export interface ViewModule {
  id: string;
  type: ViewModuleType;
  visible: boolean;
  title?: string;
  subtitle?: string;
  productIds?: string[]; // products · promo
  banners?: ViewBanner[]; // slider · banners
  videoUrl?: string; // video
  promoConfig?: PromoConfig; // promo
}

export interface PageView {
  id: string;
  name: string;
  slug: string;
  active: boolean;
  modules: ViewModule[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface RawPageViewDoc {
  name?: string;
  slug?: string;
  active?: boolean;
  modules?: ViewModule[];
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export const MODULE_TYPES: ViewModuleType[] = [
  'slider',
  'products',
  'promo',
  'banners',
  'categories',
  'video'
];

export const MODULE_LABELS: Record<ViewModuleType, string> = {
  slider: 'Carrusel de banners',
  products: 'Sección de productos',
  promo: 'Sección promocional',
  banners: 'Banners',
  categories: 'Compra por categoría',
  video: 'Video'
};

export const BANNER_LINK_LABELS: Record<BannerLinkType, string> = {
  producto: 'Producto',
  categoria: 'Categoría',
  vista: 'Otra vista',
  url: 'URL externa'
};

/** Crea un módulo vacío del tipo dado, con un id único de instancia. */
export function emptyModule(type: ViewModuleType): ViewModule {
  const id = `${type}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  const base: ViewModule = { id, type, visible: true };
  if (type === 'slider' || type === 'banners') base.banners = [];
  if (type === 'products' || type === 'promo') base.productIds = [];
  if (type === 'promo') base.promoConfig = {};
  return base;
}

/** Resuelve el href de un banner según su tipo de link. */
export function bannerHref(banner: ViewBanner): string | null {
  if (!banner.linkType || !banner.linkValue) return null;
  switch (banner.linkType) {
    case 'producto':
      return `/producto/${banner.linkValue}`;
    case 'categoria':
      return `/shop?cat=${encodeURIComponent(banner.linkValue)}`;
    case 'vista':
      return `/v/${banner.linkValue}`;
    case 'url':
      return banner.linkValue;
    default:
      return null;
  }
}
