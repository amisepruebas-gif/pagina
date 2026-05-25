import {
  collection,
  doc,
  addDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  Timestamp,
  type DocumentReference
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { SiteContentKind } from '@/types/site-content';

export interface SiteContentFormValues {
  kind: SiteContentKind;
  name: string;
  page: string;
  order: number;
  active: boolean;
  validFrom?: string;
  validUntil?: string;
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
}

function parseDate(s?: string): Timestamp | null {
  if (!s) return null;
  const d = new Date(s + 'T00:00:00');
  if (isNaN(d.getTime())) return null;
  return Timestamp.fromDate(d);
}

function valuesToDoc(values: SiteContentFormValues, isCreate: boolean) {
  const data: Record<string, unknown> = {
    kind: values.kind,
    name: values.name.trim(),
    page: values.page.trim() || '/',
    order: values.order,
    active: values.active,
    validFrom: parseDate(values.validFrom),
    validUntil: parseDate(values.validUntil),
    updatedAt: serverTimestamp()
  };
  if (isCreate) data.createdAt = serverTimestamp();

  // Solo escribir campos relevantes por kind para mantener el doc limpio
  if (values.kind === 'hero' || values.kind === 'promo-banner') {
    data.title = values.title?.trim() ?? '';
    data.subtitle = values.subtitle?.trim() || null;
    data.imageUrl = values.imageUrl?.trim() || null;
    data.gradient = values.gradient?.trim() || null;
  }
  if (values.kind === 'hero') {
    data.ctaText = values.ctaText?.trim() || null;
    data.ctaHref = values.ctaHref?.trim() || null;
  }
  if (values.kind === 'promo-banner') {
    data.href = values.href?.trim() || '/';
  }
  if (values.kind === 'topbar') {
    data.message = values.message?.trim() ?? '';
    data.backgroundColor = values.backgroundColor?.trim() || null;
    data.textColor = values.textColor?.trim() || null;
  }

  return data;
}

export async function createSiteContent(values: SiteContentFormValues): Promise<string> {
  const ref: DocumentReference = await addDoc(
    collection(db, 'siteContent'),
    valuesToDoc(values, true)
  );
  console.log('[ADMIN] siteContent creado', ref.id);
  return ref.id;
}

export async function updateSiteContent(
  id: string,
  values: SiteContentFormValues
): Promise<void> {
  await setDoc(doc(db, 'siteContent', id), valuesToDoc(values, false), {
    merge: true
  });
  console.log('[ADMIN] siteContent actualizado', id);
}

export async function setSiteContentActive(id: string, active: boolean): Promise<void> {
  await updateDoc(doc(db, 'siteContent', id), {
    active,
    updatedAt: serverTimestamp()
  });
  console.log('[ADMIN] siteContent', id, 'active=', active);
}
