import { setGlobalOptions } from 'firebase-functions/v2';
import { onCall } from 'firebase-functions/v2/https';
import { initializeApp } from 'firebase-admin/app';

initializeApp();

setGlobalOptions({
  region: 'us-central1',
  maxInstances: 10
});

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
