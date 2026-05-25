import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { SiteConfig } from '@/types/config';

export async function saveConfig(config: SiteConfig): Promise<void> {
  await setDoc(
    doc(db, 'config', 'global'),
    {
      ...config,
      updatedAt: serverTimestamp()
    },
    { merge: true }
  );
  console.log('[CONFIG] guardado');
}
