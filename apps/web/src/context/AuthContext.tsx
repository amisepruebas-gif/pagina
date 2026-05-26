'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode
} from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import type { UserProfile } from '@/lib/auth';

interface AuthContextValue {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  /**
   * Espejo reactivo de `user.emailVerified`. onAuthStateChanged no se
   * dispara cuando llamamos a user.reload(), así que lo exponemos como
   * estado separado para que los consumidores re-rendericen al refrescar.
   */
  emailVerified: boolean;
  reloadUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  profile: null,
  loading: true,
  emailVerified: false,
  reloadUser: async () => {}
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [emailVerified, setEmailVerified] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setEmailVerified(u?.emailVerified ?? false);
      setLoading(false);
      console.log('[AUTH] state changed:', u ? u.uid : 'signed out');
    });
    return () => unsub();
  }, []);

  const reloadUser = useCallback(async () => {
    if (!auth.currentUser) return;
    await auth.currentUser.reload();
    setEmailVerified(auth.currentUser.emailVerified);
  }, []);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      return;
    }
    const ref = doc(db, 'users', user.uid);
    const unsub = onSnapshot(ref, (snap) => {
      if (snap.exists()) {
        const d = snap.data();
        setProfile({
          email: (d.email as string) ?? '',
          displayName: (d.displayName as string) ?? '',
          role: (d.role as UserProfile['role']) ?? 'customer',
          active: d.active !== false,
          providers: (d.providers as string[]) ?? []
        });
      } else {
        setProfile(null);
      }
    });
    return () => unsub();
  }, [user]);

  return (
    <AuthContext.Provider
      value={{ user, profile, loading, emailVerified, reloadUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
