import { setGlobalOptions } from 'firebase-functions/v2';
import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { onDocumentWritten } from 'firebase-functions/v2/firestore';
import { initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { logger } from 'firebase-functions/v2';

export { scheduledFirestoreExport } from './backup';
export { sweepOrphanImages } from './sweep-images';

// Email transaccional — DESACTIVADO hasta configurar los secrets de Resend.
// Para activar: ver instrucciones en email-functions.ts, luego descomentar:
// export { onOrderCreated, onOrderStatusChanged } from './email-functions';

initializeApp();

setGlobalOptions({
  region: 'us-central1',
  maxInstances: 10
});

type Role = 'admin' | 'staff' | 'customer';
const ROLES: Role[] = ['admin', 'staff', 'customer'];

/**
 * Callable de salud. Útil para verificar deploy + App Check + emuladores.
 * Cliente: const ping = httpsCallable(functions, 'ping'); await ping();
 */
export const ping = onCall((request) => {
  return {
    pong: true,
    at: new Date().toISOString(),
    auth: request.auth?.uid ?? null
  };
});

/**
 * Callable que setea el custom claim `role` en el Auth user destino.
 * Solo admins pueden invocarla.
 *
 * Después de llamar, el cliente debe hacer `user.getIdToken(true)` para
 * refrescar el token y que las rules vean el claim nuevo.
 *
 * También escribe `users/{uid}.role` para que la UI vea el cambio de inmediato
 * (las rules tienen fallback al doc si el claim aún no propagó).
 */
export const setUserRole = onCall<{ uid: string; role: Role }>(async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'Inicia sesión');
  }

  // Caller debe ser admin (vía claim o vía doc)
  const callerClaims = (request.auth.token ?? {}) as Record<string, unknown>;
  const callerClaimRole = typeof callerClaims.role === 'string' ? callerClaims.role : '';
  let isAdmin = callerClaimRole === 'admin';
  if (!isAdmin) {
    const callerDoc = await getFirestore().doc(`users/${request.auth.uid}`).get();
    isAdmin = callerDoc.exists && callerDoc.get('role') === 'admin';
  }
  if (!isAdmin) {
    throw new HttpsError('permission-denied', 'Solo admins');
  }

  const { uid, role } = request.data ?? {};
  if (typeof uid !== 'string' || !uid) {
    throw new HttpsError('invalid-argument', 'uid requerido');
  }
  if (!ROLES.includes(role)) {
    throw new HttpsError('invalid-argument', `role inválido (${role})`);
  }

  // Setea claim — NO sobreescribe otros claims existentes
  const targetUser = await getAuth().getUser(uid);
  const existingClaims = targetUser.customClaims ?? {};
  await getAuth().setCustomUserClaims(uid, { ...existingClaims, role });

  // Espejo en Firestore para UI inmediata + fallback en rules
  await getFirestore().doc(`users/${uid}`).set(
    { role, updatedAt: new Date() },
    { merge: true }
  );

  logger.info('[setUserRole]', {
    by: request.auth.uid,
    target: uid,
    role
  });

  return { ok: true, uid, role };
});

/**
 * Trigger: cuando users/{uid}.role cambia en Firestore, sincroniza el custom claim.
 * Esto cubre dos casos:
 *  1) Bootstrap inicial: el primer admin se setea editando el doc a mano en
 *     consola (no hay admin previo para llamar setUserRole) → este trigger
 *     promueve el claim automáticamente.
 *  2) Drift safety: si alguien (CF, admin SDK, script) cambia el doc, el claim
 *     queda alineado sin requerir llamada explícita.
 *
 * Skip si role no cambió (idempotente).
 */
export const syncRoleClaim = onDocumentWritten('users/{uid}', async (event) => {
  const before = event.data?.before.data();
  const after = event.data?.after.data();
  const uid = event.params.uid;

  const beforeRole = (before?.role as string | undefined) ?? null;
  const afterRole = (after?.role as string | undefined) ?? null;

  if (beforeRole === afterRole) return;
  if (!afterRole) return; // doc borrado o role nuleado — dejamos el claim como está

  if (!ROLES.includes(afterRole as Role)) {
    logger.warn('[syncRoleClaim] role inválido, skip', { uid, afterRole });
    return;
  }

  try {
    const targetUser = await getAuth().getUser(uid);
    const existingClaims = targetUser.customClaims ?? {};
    if (existingClaims.role === afterRole) return; // ya alineado

    await getAuth().setCustomUserClaims(uid, { ...existingClaims, role: afterRole });
    logger.info('[syncRoleClaim] claim alineado', { uid, role: afterRole });
  } catch (err) {
    logger.error('[syncRoleClaim] error', { uid, afterRole, err });
  }
});
