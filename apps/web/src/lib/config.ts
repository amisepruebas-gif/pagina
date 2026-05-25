import { doc, getDoc, type DocumentData } from 'firebase/firestore';
import { db } from './firebase';
import {
  DEFAULT_CONFIG,
  type RawSiteConfigDoc,
  type SiteConfig
} from '@/types/config';

function merge(data: DocumentData): SiteConfig {
  const raw = data as RawSiteConfigDoc;
  return {
    shipping: { ...DEFAULT_CONFIG.shipping, ...(raw.shipping ?? {}) },
    branding: { ...DEFAULT_CONFIG.branding, ...(raw.branding ?? {}) },
    contact: { ...DEFAULT_CONFIG.contact, ...(raw.contact ?? {}) },
    social: { ...DEFAULT_CONFIG.social, ...(raw.social ?? {}) }
  };
}

/**
 * Devuelve la config global. Si el doc no existe, devuelve los defaults.
 * Si algunos campos faltan, los completa con los defaults (merge profundo).
 */
export async function getConfig(): Promise<SiteConfig> {
  try {
    const snap = await getDoc(doc(db, 'config', 'global'));
    if (!snap.exists()) return DEFAULT_CONFIG;
    return merge(snap.data());
  } catch (err) {
    console.error('[CONFIG] error fetching, usando defaults:', err);
    return DEFAULT_CONFIG;
  }
}
