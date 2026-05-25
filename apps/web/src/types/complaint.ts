import type { Timestamp } from 'firebase/firestore';

export type ComplaintStatus = 'open' | 'in_progress' | 'resolved' | 'rejected';

export const COMPLAINT_STATUSES: ComplaintStatus[] = [
  'open',
  'in_progress',
  'resolved',
  'rejected'
];

export const STATUS_LABEL: Record<ComplaintStatus, string> = {
  open: 'Abierta',
  in_progress: 'En proceso',
  resolved: 'Resuelta',
  rejected: 'Rechazada'
};

export const STATUS_COLORS: Record<ComplaintStatus, { bg: string; text: string }> = {
  open: { bg: 'bg-blue-100', text: 'text-blue-700' },
  in_progress: { bg: 'bg-amber-100', text: 'text-amber-700' },
  resolved: { bg: 'bg-green-100', text: 'text-green-700' },
  rejected: { bg: 'bg-gray-100', text: 'text-gray-500' }
};

export interface ComplaintType {
  id: string;
  name: string;
  description?: string;
  active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface RawComplaintTypeDoc {
  name?: string;
  description?: string;
  active?: boolean;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface Complaint {
  id: string;
  userId: string;
  userEmail?: string;
  userName?: string;
  orderId?: string;
  orderNumber?: string;
  typeId?: string;
  typeName?: string;
  description: string;
  status: ComplaintStatus;
  resolution?: string;
  refundAmount?: number;
  resolvedBy?: string;
  resolvedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface RawComplaintDoc {
  userId?: string;
  userEmail?: string;
  userName?: string;
  orderId?: string;
  orderNumber?: string;
  typeId?: string;
  typeName?: string;
  description?: string;
  status?: ComplaintStatus;
  resolution?: string;
  refundAmount?: number;
  resolvedBy?: string;
  resolvedAt?: Timestamp;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}
