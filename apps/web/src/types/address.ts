import type { Timestamp } from 'firebase/firestore';

export interface Address {
  id: string;
  alias: string;          // "Casa", "Oficina"
  fullName: string;       // destinatario
  phone?: string;
  street: string;
  reference?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  isDefault: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface RawAddressDoc {
  alias?: string;
  fullName?: string;
  phone?: string;
  street?: string;
  reference?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  isDefault?: boolean;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}
