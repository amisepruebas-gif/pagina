import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile,
  signOut as fbSignOut,
  sendPasswordResetEmail,
  type User
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebase';

export interface UserProfile {
  email: string;
  displayName: string;
  role: 'customer' | 'staff' | 'admin';
  active: boolean;
  providers: string[];
}

/**
 * Crea el doc users/{uid} si todavía no existe. Idempotente: si el usuario
 * ya entró antes, no sobreescribe nada.
 */
async function ensureUserDoc(user: User): Promise<void> {
  const ref = doc(db, 'users', user.uid);
  const snap = await getDoc(ref);
  if (snap.exists()) return;

  await setDoc(ref, {
    email: user.email ?? '',
    displayName: user.displayName ?? '',
    role: 'customer',
    active: true,
    providers: user.providerData.map((p) => p.providerId),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  console.log('[AUTH] users/', user.uid, 'creado');
}

export async function registerWithEmail(
  email: string,
  password: string,
  displayName?: string
) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  if (displayName && displayName.trim()) {
    await updateProfile(cred.user, { displayName: displayName.trim() });
  }
  await ensureUserDoc(cred.user);
  return cred.user;
}

export async function loginWithEmail(email: string, password: string) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  // Si el usuario fue creado en consola y no tiene doc Firestore, lo creamos.
  await ensureUserDoc(cred.user);
  return cred.user;
}

export async function loginWithGoogle() {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  const cred = await signInWithPopup(auth, provider);
  await ensureUserDoc(cred.user);
  return cred.user;
}

export async function logout() {
  await fbSignOut(auth);
  console.log('[AUTH] logout');
}

export async function sendPasswordReset(email: string) {
  await sendPasswordResetEmail(auth, email.trim());
  console.log('[AUTH] reset email sent');
}

export function describeAuthError(err: unknown): string {
  if (err && typeof err === 'object' && 'code' in err) {
    const code = (err as { code: string }).code;
    switch (code) {
      case 'auth/email-already-in-use':
        return 'Ese correo ya está registrado. Prueba iniciar sesión.';
      case 'auth/invalid-email':
        return 'El correo no es válido.';
      case 'auth/weak-password':
        return 'La contraseña debe tener al menos 6 caracteres.';
      case 'auth/missing-password':
        return 'Falta la contraseña.';
      case 'auth/invalid-credential':
      case 'auth/wrong-password':
      case 'auth/user-not-found':
        return 'Correo o contraseña incorrectos.';
      case 'auth/popup-closed-by-user':
        return 'Cerraste la ventana antes de terminar.';
      case 'auth/popup-blocked':
        return 'Tu navegador bloqueó la ventana emergente. Permítela y reintenta.';
      case 'auth/cancelled-popup-request':
        return 'Cancelaste el inicio de sesión.';
      case 'auth/network-request-failed':
        return 'Sin conexión. Revisa tu internet.';
      case 'auth/too-many-requests':
        return 'Demasiados intentos. Intenta más tarde.';
      default:
        return `Error: ${code}`;
    }
  }
  return 'Ocurrió un error inesperado.';
}
