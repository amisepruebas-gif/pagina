import type { Timestamp } from 'firebase/firestore';

export type UserRole = 'customer' | 'staff' | 'admin';

export interface AdminUser {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  active: boolean;
  providers: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface RawUserDoc {
  email?: string;
  displayName?: string;
  role?: UserRole;
  active?: boolean;
  providers?: string[];
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}
