import {
  collection,
  doc,
  getDoc,
  getDocs,
  type DocumentData
} from 'firebase/firestore';
import { db } from './firebase';
import type {
  HeroContent,
  PromoBannerContent,
  RawSiteContentDoc,
  SiteContent,
  SiteContentKind,
  TopbarContent
} from '@/types/site-content';
import { isCurrentlyValid } from '@/types/site-content';

function normalize(id: string, data: DocumentData): SiteContent | null {
  const raw = data as RawSiteContentDoc;
  const kind = raw.kind;
  if (kind !== 'hero' && kind !== 'promo-banner' && kind !== 'topbar') return null;

  const base = {
    id,
    name: raw.name ?? '',
    page: raw.page ?? '/',
    order: raw.order ?? 0,
    active: raw.active !== false,
    validFrom: raw.validFrom?.toDate(),
    validUntil: raw.validUntil?.toDate(),
    createdAt: raw.createdAt?.toDate(),
    updatedAt: raw.updatedAt?.toDate()
  };

  if (kind === 'hero') {
    const c: HeroContent = {
      ...base,
      kind: 'hero',
      title: raw.title ?? '',
      subtitle: raw.subtitle,
      ctaText: raw.ctaText,
      ctaHref: raw.ctaHref,
      imageUrl: raw.imageUrl,
      gradient: raw.gradient
    };
    return c;
  }
  if (kind === 'promo-banner') {
    const c: PromoBannerContent = {
      ...base,
      kind: 'promo-banner',
      title: raw.title ?? '',
      subtitle: raw.subtitle,
      href: raw.href ?? '/',
      imageUrl: raw.imageUrl,
      gradient: raw.gradient
    };
    return c;
  }
  const c: TopbarContent = {
    ...base,
    kind: 'topbar',
    message: raw.message ?? '',
    backgroundColor: raw.backgroundColor,
    textColor: raw.textColor
  };
  return c;
}

interface FetchOpts {
  kind?: SiteContentKind;
  page?: string;
  includeInactive?: boolean;
  onlyCurrentlyValid?: boolean;
}

export async function getSiteContents(opts: FetchOpts = {}): Promise<SiteContent[]> {
  const snap = await getDocs(collection(db, 'siteContent'));
  let items = snap.docs
    .map((d) => normalize(d.id, d.data()))
    .filter((c): c is SiteContent => c !== null);

  if (opts.kind) items = items.filter((c) => c.kind === opts.kind);
  if (opts.page !== undefined) items = items.filter((c) => c.page === opts.page);
  if (!opts.includeInactive) items = items.filter((c) => c.active);
  if (opts.onlyCurrentlyValid) items = items.filter((c) => isCurrentlyValid(c));

  items.sort((a, b) => a.order - b.order);
  return items;
}

export async function getSiteContentById(id: string): Promise<SiteContent | null> {
  const snap = await getDoc(doc(db, 'siteContent', id));
  if (!snap.exists()) return null;
  return normalize(snap.id, snap.data());
}

export async function getActiveHero(page = '/'): Promise<HeroContent | null> {
  const items = await getSiteContents({
    kind: 'hero',
    page,
    onlyCurrentlyValid: true
  });
  return (items[0] as HeroContent | undefined) ?? null;
}

export async function getActivePromoBanners(page = '/'): Promise<PromoBannerContent[]> {
  const items = await getSiteContents({
    kind: 'promo-banner',
    page,
    onlyCurrentlyValid: true
  });
  return items as PromoBannerContent[];
}

export async function getActiveTopbar(): Promise<TopbarContent | null> {
  // Topbar suele ser global; aceptamos page="" (todas) o "/" (home).
  const items = await getSiteContents({
    kind: 'topbar',
    onlyCurrentlyValid: true
  });
  return (items[0] as TopbarContent | undefined) ?? null;
}
