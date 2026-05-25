import { cert, getApp, getApps, initializeApp, type App } from 'firebase-admin/app';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';

// Inicializa el Admin SDK (server-only).
// Requiere FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY en .env.local
// Lanza si faltan — los errores aparecen al primer request al webhook / API.
function loadAdminApp(): App {
  if (getApps().length > 0) return getApp();

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const rawKey = process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId || !clientEmail || !rawKey) {
    throw new Error(
      '[firebase-admin] faltan envs FIREBASE_PROJECT_ID / FIREBASE_CLIENT_EMAIL / FIREBASE_PRIVATE_KEY'
    );
  }

  const privateKey = rawKey.replace(/\\n/g, '\n');

  return initializeApp({
    credential: cert({ projectId, clientEmail, privateKey })
  });
}

let _db: Firestore | null = null;
export function adminDb(): Firestore {
  if (_db) return _db;
  _db = getFirestore(loadAdminApp());
  return _db;
}
