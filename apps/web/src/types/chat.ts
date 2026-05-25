import type { Timestamp } from 'firebase/firestore';

export type ChatStatus = 'open' | 'closed';
export type MessageFrom = 'customer' | 'staff';

export interface Chat {
  id: string;
  userId?: string;
  guestName?: string;
  guestEmail?: string;
  subject: string;
  status: ChatStatus;
  assignedTo?: string;
  lastMessageAt?: Date;
  lastMessagePreview?: string;
  unreadStaff: number;
  unreadCustomer: number;
  createdAt?: Date;
}

export interface RawChatDoc {
  userId?: string;
  guestName?: string;
  guestEmail?: string;
  subject?: string;
  status?: ChatStatus;
  assignedTo?: string;
  lastMessageAt?: Timestamp;
  lastMessagePreview?: string;
  unreadStaff?: number;
  unreadCustomer?: number;
  createdAt?: Timestamp;
}

export interface ChatMessage {
  id: string;
  from: MessageFrom;
  uid?: string;
  text: string;
  createdAt?: Date;
}

export interface RawChatMessageDoc {
  from?: MessageFrom;
  uid?: string;
  text?: string;
  createdAt?: Timestamp;
}
