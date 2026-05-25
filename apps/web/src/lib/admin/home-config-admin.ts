import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { HOME_CONFIG_DOC } from '@/lib/home-config';
import type { HomeConfig } from '@/types/home-config';

/**
 * Persiste la configuración completa del Home en `config/home`.
 * El editor siempre envía el objeto entero, así que se sobreescribe el
 * documento por completo.
 */
export async function saveHomeConfig(config: HomeConfig): Promise<void> {
  await setDoc(doc(db, HOME_CONFIG_DOC.collection, HOME_CONFIG_DOC.id), {
    ...config,
    updatedAt: serverTimestamp()
  });
  console.log('[HOME] configuración guardada');
}
