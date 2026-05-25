import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { db, functions, auth } from '@/lib/firebase';
import type { UserRole } from '@/types/admin-user';

/**
 * Cambia el rol de un usuario.
 *
 * Llama a la Cloud Function `setUserRole` (que setea el custom claim Y escribe
 * users/{uid}.role). Si la CF falla por cualquier razón (no deployada aún,
 * red, etc.) cae al fallback: escritura directa al doc, confiando en el
 * trigger `syncRoleClaim` para que propague el claim eventualmente.
 *
 * Si el admin se cambia el rol a SÍ MISMO, refresca su propio token para
 * que las nuevas reglas lo vean de inmediato.
 */
export async function setUserRole(uid: string, role: UserRole): Promise<void> {
  let viaCloudFunction = false;
  try {
    const fn = httpsCallable<{ uid: string; role: UserRole }, { ok: boolean }>(
      functions,
      'setUserRole'
    );
    await fn({ uid, role });
    viaCloudFunction = true;
    console.log('[ADMIN] setUserRole via CF', uid, 'role=', role);
  } catch (err) {
    console.warn('[ADMIN] CF setUserRole falló, usando fallback doc:', err);
    await updateDoc(doc(db, 'users', uid), {
      role,
      updatedAt: serverTimestamp()
    });
  }

  // Si el admin se cambió a sí mismo (o si la CF tuvo éxito), refresca el ID
  // token para que el nuevo claim aparezca en futuras llamadas.
  if (viaCloudFunction && auth.currentUser?.uid === uid) {
    await auth.currentUser.getIdToken(true);
    console.log('[ADMIN] token refrescado tras cambio de rol propio');
  }
}

export async function setUserActive(uid: string, active: boolean): Promise<void> {
  await updateDoc(doc(db, 'users', uid), {
    active,
    updatedAt: serverTimestamp()
  });
  console.log('[ADMIN] user', uid, 'active=', active);
}
