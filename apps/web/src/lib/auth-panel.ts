import { doc, getDoc, setDoc, type DocumentData } from 'firebase/firestore';
import { db } from './firebase';
import {
  DEFAULT_AUTH_PANEL_CONFIG,
  type AuthPanelConfig
} from '@/types/auth-panel';

export const AUTH_PANEL_DOC = { collection: 'config', id: 'authPanel' } as const;

/** Combina raw doc + defaults. Tolera campos faltantes en docs viejos. */
export function mergeAuthPanelConfig(raw: DocumentData | undefined): AuthPanelConfig {
  if (!raw) return DEFAULT_AUTH_PANEL_CONFIG;
  return { ...DEFAULT_AUTH_PANEL_CONFIG, ...(raw as Partial<AuthPanelConfig>) };
}

/** Lectura SSR — usado por /login, /register, /forgot-password. */
export async function getAuthPanelConfig(): Promise<AuthPanelConfig> {
  const snap = await getDoc(doc(db, AUTH_PANEL_DOC.collection, AUTH_PANEL_DOC.id));
  if (!snap.exists()) return DEFAULT_AUTH_PANEL_CONFIG;
  return mergeAuthPanelConfig(snap.data());
}

/** Escritura desde el admin. Las rules ya restringen a `isAdmin()`. */
export async function saveAuthPanelConfig(config: AuthPanelConfig): Promise<void> {
  await setDoc(
    doc(db, AUTH_PANEL_DOC.collection, AUTH_PANEL_DOC.id),
    config,
    { merge: true }
  );
}
