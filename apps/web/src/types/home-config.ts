import type { IconName } from '@/components/ui';
import type { ViewModule } from '@/types/page-view';

/**
 * HomeConfig — contenido editable del Home ("vista principal").
 *
 * El Hero es fijo y va siempre arriba. Bajo él, el Home es modular: el
 * arreglo `layout` define qué bloques se muestran y en qué orden, mezclando
 * las secciones nativas del diseño con módulos agregados (`modules`).
 *
 * Se persiste como documento único `config/home` en Firestore. Cualquier
 * campo ausente cae al valor de `DEFAULT_HOME_CONFIG`.
 */

export interface CtaConfig {
  label: string;
  href: string;
}

export interface HeroStat {
  value: string;
  label: string;
}

export interface HeroCard {
  /** Imagen de la tarjeta. Si está vacía, se muestra un placeholder. */
  imageUrl?: string;
  /** Enlace al que navega la tarjeta al hacer clic. Opcional. */
  href?: string;
  /** Etiqueta del placeholder mientras no haya imagen. */
  label: string;
  /** Color de acento del placeholder. */
  accent: string;
}

/** Una imagen del slider de fondo del Hero. */
export interface HeroBackgroundImage {
  url: string;
}

/** Tono del texto del Hero, según el fondo que tenga detrás. */
export type HeroTextTone = 'dark' | 'light';

export interface TrustItem {
  icon: IconName;
  title: string;
  sub: string;
}

export interface HeroConfig {
  badge: string;
  /** Título: `{titlePre} <acento>{titleAccent}</acento>{titlePost}`. */
  titlePre: string;
  titleAccent: string;
  titlePost: string;
  paragraph: string;
  primaryCta: CtaConfig;
  secondaryCta: CtaConfig;
  stats: HeroStat[];
  cards: HeroCard[];
  /** Insignia circular: línea superior + valor (ej. "Hasta" / "-50%"). */
  discountTop: string;
  discountValue: string;
  /**
   * Slider de imágenes de fondo. Si está vacío, el Hero usa su gradiente
   * por defecto. Con varias imágenes, rotan automáticamente.
   */
  backgroundImages: HeroBackgroundImage[];
  /** Color de la capa que cubre las imágenes de fondo (para legibilidad). */
  overlayColor: string;
  /** Opacidad de esa capa, 0–100. */
  overlayOpacity: number;
  /** Tono del texto del Hero: oscuro (fondo claro) o claro (fondo oscuro). */
  textTone: HeroTextTone;
}

export interface TrustBarConfig {
  items: TrustItem[];
}

export interface CategoryGridConfig {
  eyebrow: string;
  titlePre: string;
  titleAccent: string;
  cta: CtaConfig;
  /** Categorías a mostrar (por id). Vacío = todas las categorías. */
  categoryIds: string[];
}

export interface FeaturedConfig {
  eyebrow: string;
  titlePre: string;
  titleAccent: string;
  paragraph: string;
  /** Productos elegidos para la sección (por id). */
  productIds: string[];
}

/** Tipo de capa de color sobre el banner: degradado entre 2 colores o sólido. */
export type PromoCoverType = 'gradient' | 'solid';

export interface PromoBannerConfig {
  badge: string;
  title: string;
  paragraph: string;
  primaryCta: CtaConfig;
  secondaryCta: CtaConfig;
  /** Tarjetas decorativas del banner (mismo formato que las del Hero). */
  cards: HeroCard[];
  /** Imagen de fondo opcional. */
  bgImageUrl?: string;
  /** Opacidad de la imagen, 0–100 (solo aplica si hay imagen). */
  bgImageOpacity: number;
  /**
   * Capa de color sobre el banner. Si hay imagen, va encima atenuándola; si
   * no hay imagen, ES el fondo. Solo se aplica un tipo a la vez (gradiente
   * o sólido), nunca los dos.
   */
  coverType: PromoCoverType;
  /** Color inicial del gradiente, o el color cuando `coverType='solid'`. */
  coverFrom: string;
  /** Color final del gradiente (se ignora si `coverType='solid'`). */
  coverTo: string;
  /** Opacidad de la capa, 0–100. */
  coverOpacity: number;
  /** Color del blob decorativo de la esquina superior derecha. */
  blob1Color: string;
  /** Color del blob decorativo inferior. */
  blob2Color: string;
}

export interface NewArrivalsConfig {
  eyebrow: string;
  titlePre: string;
  titleAccent: string;
  /** Productos elegidos para la sección (por id). */
  productIds: string[];
}

export interface FlashSaleConfig {
  badge: string;
  title: string;
  /** Semilla del contador regresivo. */
  countdownHours: number;
  countdownMinutes: number;
  countdownSeconds: number;
  /** Productos elegidos para la sección (por id). */
  productIds: string[];
  /** Imagen de fondo opcional. */
  bgImageUrl?: string;
  /** Opacidad de la imagen, 0–100 (solo aplica si hay imagen). */
  bgImageOpacity: number;
  /**
   * Capa de color sobre el banner. Si hay imagen, va encima atenuándola;
   * si no, ES el fondo. Solo se aplica un tipo a la vez.
   */
  coverType: PromoCoverType;
  coverFrom: string;
  coverTo: string;
  /** Opacidad de la capa, 0–100. */
  coverOpacity: number;
  /** Color de la mancha decorativa (esquina superior izquierda). */
  blob1Color: string;
}

export interface BestSellersConfig {
  eyebrow: string;
  titlePre: string;
  titleAccent: string;
  cta: CtaConfig;
  /** Productos elegidos para la sección (por id). */
  productIds: string[];
}

export interface NewsletterConfig {
  title: string;
  paragraph: string;
  placeholder: string;
  ctaLabel: string;
  note: string;
}

/**
 * Una entrada del `layout`: referencia a un bloque y su visibilidad.
 * `ref` es el id de una sección nativa (`trustBar`, `categoryGrid`, …) o
 * el id de un módulo dentro de `HomeConfig.modules`.
 */
export interface HomeLayoutEntry {
  ref: string;
  visible: boolean;
}

export interface HomeConfig {
  hero: HeroConfig;
  trustBar: TrustBarConfig;
  categoryGrid: CategoryGridConfig;
  featured: FeaturedConfig;
  promoBanner: PromoBannerConfig;
  newArrivals: NewArrivalsConfig;
  flashSale: FlashSaleConfig;
  bestSellers: BestSellersConfig;
  newsletter: NewsletterConfig;
  /** Módulos agregados (tipo "vista"): products, promo, banners, video. */
  modules: ViewModule[];
  /** Orden y visibilidad de los bloques que van debajo del Hero. */
  layout: HomeLayoutEntry[];
}

/** Identificador de una sección nativa del Home (incluye el Hero). */
export type HomeSectionId =
  | 'hero'
  | 'trustBar'
  | 'categoryGrid'
  | 'featured'
  | 'promoBanner'
  | 'newArrivals'
  | 'flashSale'
  | 'bestSellers'
  | 'newsletter';

/** Secciones nativas reordenables (todas menos el Hero), en su orden base. */
export const HOME_NATIVE_BLOCKS: Exclude<HomeSectionId, 'hero'>[] = [
  'trustBar',
  'categoryGrid',
  'featured',
  'promoBanner',
  'newArrivals',
  'flashSale',
  'bestSellers',
  'newsletter'
];

/** ¿Es `ref` una sección nativa (vs. un módulo agregado)? */
export function isNativeBlock(
  ref: string
): ref is Exclude<HomeSectionId, 'hero'> {
  return (HOME_NATIVE_BLOCKS as string[]).includes(ref);
}

/**
 * Valores por defecto: réplica de los textos originales del Home.
 * Las secciones de productos nacen sin productos elegidos (`productIds: []`)
 * y `categoryGrid` sin filtro (`categoryIds: []` = todas las categorías).
 */
export const DEFAULT_HOME_CONFIG: HomeConfig = {
  hero: {
    badge: 'Temporada 2026',
    titlePre: 'Encuentra ',
    titleAccent: 'lo que sea',
    titlePost: ', en un solo lugar.',
    paragraph:
      'Miles de productos curados de todas las categorías. Envío rápido, devoluciones fáciles y la mejor relación calidad-precio.',
    primaryCta: { label: 'Explorar catálogo', href: '/shop' },
    secondaryCta: { label: 'Ver ofertas del día', href: '/shop?sale=true' },
    stats: [
      { value: 'Curados', label: 'Selección' },
      { value: '24–48h', label: 'Envío' },
      { value: '30 días', label: 'Devoluciones' }
    ],
    cards: [
      { label: 'HERO · A', accent: '#00D97A' },
      { label: 'HERO · B', accent: '#FF5C8A' },
      { label: 'HERO · C', accent: '#FFD23F' }
    ],
    discountTop: 'Hasta',
    discountValue: '-50%',
    backgroundImages: [],
    overlayColor: '#FFFFFF',
    overlayOpacity: 40,
    textTone: 'dark'
  },
  trustBar: {
    items: [
      { icon: 'truck', title: 'Envío rápido', sub: '24–48h en ciudades principales' },
      { icon: 'shield', title: 'Pago seguro', sub: 'Encriptación bancaria SSL' },
      { icon: 'refresh', title: 'Devoluciones', sub: '30 días sin preguntas' },
      { icon: 'spark', title: 'Soporte', sub: 'Chat y correo' }
    ]
  },
  categoryGrid: {
    eyebrow: 'Categorías',
    titlePre: 'Comprar por ',
    titleAccent: 'categoría',
    cta: { label: 'Ver todas', href: '/shop' },
    categoryIds: []
  },
  featured: {
    eyebrow: 'Selección',
    titlePre: 'Productos ',
    titleAccent: 'destacados',
    paragraph: 'Lo mejor del catálogo, seleccionado para ti.',
    productIds: []
  },
  promoBanner: {
    badge: 'Ofertas de temporada',
    title: 'Descuentos en productos seleccionados.',
    paragraph:
      'Explora el catálogo y encuentra las mejores ofertas del momento.',
    primaryCta: { label: 'Comprar ahora', href: '/shop?sale=true' },
    secondaryCta: { label: 'Términos', href: '/terminos' },
    cards: [
      { label: 'PROMO · A', accent: '#FFD23F' },
      { label: 'PROMO · B', accent: '#FF5C8A' }
    ],
    bgImageOpacity: 100,
    coverType: 'gradient',
    coverFrom: '#FF5C8A',
    coverTo: '#7C3AED',
    coverOpacity: 100,
    blob1Color: '#FFD23F',
    blob2Color: '#FF5C8A'
  },
  newArrivals: {
    eyebrow: 'Esta semana',
    titlePre: 'Recién ',
    titleAccent: 'llegados',
    productIds: []
  },
  flashSale: {
    badge: 'Oferta relámpago',
    title: 'Termina en…',
    countdownHours: 6,
    countdownMinutes: 42,
    countdownSeconds: 18,
    productIds: [],
    bgImageOpacity: 100,
    coverType: 'gradient',
    coverFrom: '#FF5C8A',
    coverTo: '#7C3AED',
    coverOpacity: 100,
    blob1Color: '#FFD23F'
  },
  bestSellers: {
    eyebrow: 'Catálogo',
    titlePre: 'Lo más ',
    titleAccent: 'reciente',
    cta: { label: 'Ver todo el catálogo', href: '/shop' },
    productIds: []
  },
  newsletter: {
    title: 'Antes que nadie.',
    paragraph:
      'Suscríbete y recibe primero las ofertas y novedades del catálogo.',
    placeholder: 'tu@email.com',
    ctaLabel: 'Suscribirme',
    note: 'Sin spam. Cancela cuando quieras.'
  },
  modules: [],
  layout: HOME_NATIVE_BLOCKS.map((ref) => ({ ref, visible: true }))
};

/** Etiquetas legibles de cada sección nativa — para el editor. */
export const HOME_SECTION_LABELS: Record<HomeSectionId, string> = {
  hero: 'Encabezado (Hero)',
  trustBar: 'Barra de confianza',
  categoryGrid: 'Categorías',
  featured: 'Productos destacados',
  promoBanner: 'Banner promocional',
  newArrivals: 'Recién llegados',
  flashSale: 'Oferta relámpago',
  bestSellers: 'Lo más reciente',
  newsletter: 'Newsletter'
};
