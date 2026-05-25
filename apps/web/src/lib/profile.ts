import { updateProfile, type User } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

export interface ProfileUpdate {
  displayName?: string;
  phone?: string;
}

export async function updateUserProfile(user: User, fields: ProfileUpdate): Promise<void> {
  // Sincronizar displayName con Firebase Auth (lo usan el avatar/email link, popups OAuth, etc.)
  if (fields.displayName !== undefined) {
    await updateProfile(user, { displayName: fields.displayName.trim() || null });
  }

  // Mirror al doc Firestore para que la UI lo lea desde profile
  const updates: Record<string, unknown> = { updatedAt: serverTimestamp() };
  if (fields.displayName !== undefined) updates.displayName = fields.displayName.trim();
  if (fields.phone !== undefined) updates.phone = fields.phone.trim() || null;
  await setDoc(doc(db, 'users', user.uid), updates, { merge: true });
  console.log('[PROFILE] actualizado');
}
