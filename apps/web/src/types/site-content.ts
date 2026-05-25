import type { Timestamp } from 'firebase/firestore';

export type SiteContentKind = 'hero' | 'promo-banner' | 'topbar';

interface SiteContentBase {
  id: string;
  kind: SiteContentKind;
  name: string;       // etiqueta interna admin
  page: string;       // ruta donde aplica, ej. "/" o "" (todas)
  order: number;
  active: boolean;
  validFrom?: Date;
  validUntil?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface HeroContent extends SiteContentBase {
  kind: 'hero';
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaHref?: string;
  imageUrl?: string;
  gradient?: string;
}

export interface PromoBannerContent extends SiteContentBase {
  kind: 'promo-banner';
  title: string;
  subtitle?: string;
  href: string;
  imageUrl?: string;
  gradient?: string;
}

export interface TopbarContent extends SiteContentBase {
  kind: 'topbar';
  message: string;
  backgroundColor?: string;
  textColor?: string;
}

export type SiteContent = HeroContent | PromoBannerContent | TopbarContent;

export interface RawSiteContentDoc {
  kind?: SiteContentKind;
  name?: string;
  page?: string;
  order?: number;
  active?: boolean;
  // Hero / promo-banner
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaHref?: string;
  imageUrl?: string;
  gradient?: string;
  href?: string;
  // Topbar
  message?: string;
  backgroundColor?: string;
  textColor?: string;
  // Schedule
  validFrom?: Timestamp;
  validUntil?: Timestamp;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

/**
 * Filtra contenidos que están actualmente vigentes según validFrom/validUntil.
 */
export function isCurrentlyValid(c: SiteContent, now: Date = new Date()): boolean {
  if (!c.active) return false;
  if (c.validFrom && c.validFrom > now) return false;
  if (c.validUntil && c.validUntil < now) return false;
  return true;
}
