import type { Timestamp } from 'firebase/firestore';

export type OrderStatus =
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type FulfillmentStatus = 'processing' | 'shipped' | 'delivered';
export type PaymentMethod = 'stripe' | 'mercadopago' | 'cash' | 'other';

export interface OrderItem {
  productId: string;
  name: string;
  slug?: string;
  sku?: string;
  imageUrl?: string;
  unitPrice: number;
  qty: number;
  lineTotal: number;
  discountApplied?: { discountId: string; amount: number };
}

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string;
  guestEmail?: string;
  customer: {
    name: string;
    lastName?: string;
    email: string;
    phone?: string;
  };
  shippingAddress: {
    street: string;
    reference?: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  items: OrderItem[];
  subtotal: number;
  discountTotal: number;
  shippingCost: number;
  total: number;
  currency: string;
  payment: {
    method: PaymentMethod;
    status: PaymentStatus;
    providerRef?: string;
    paidAt?: Date;
  };
  fulfillment: {
    carrier?: string;
    trackingNumber?: string;
    status: FulfillmentStatus;
  };
  status: OrderStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface RawOrderDoc {
  orderNumber?: string;
  userId?: string;
  guestEmail?: string;
  customer?: Partial<Order['customer']>;
  shippingAddress?: Partial<Order['shippingAddress']>;
  items?: OrderItem[];
  subtotal?: number;
  discountTotal?: number;
  shippingCost?: number;
  total?: number;
  currency?: string;
  payment?: {
    method?: PaymentMethod;
    status?: PaymentStatus;
    providerRef?: string;
    paidAt?: Timestamp;
  };
  fulfillment?: {
    carrier?: string;
    trackingNumber?: string;
    status?: FulfillmentStatus;
  };
  status?: OrderStatus;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface OrderEvent {
  id: string;
  type: string;
  from?: string;
  to?: string;
  by?: string;
  meta?: Record<string, unknown>;
  at?: Date;
}

export interface RawOrderEventDoc {
  type?: string;
  from?: string;
  to?: string;
  by?: string;
  meta?: Record<string, unknown>;
  at?: Timestamp;
}

export const ORDER_STATUSES: OrderStatus[] = [
  'processing',
  'shipped',
  'delivered',
  'cancelled',
  'refunded'
];

export const STATUS_LABELS: Record<OrderStatus, string> = {
  processing: 'En proceso',
  shipped: 'Enviado',
  delivered: 'Entregado',
  cancelled: 'Cancelado',
  refunded: 'Reembolsado'
};

export const STATUS_COLORS: Record<OrderStatus, { bg: string; text: string }> = {
  processing: { bg: 'bg-blue-100', text: 'text-blue-700' },
  shipped: { bg: 'bg-amber-100', text: 'text-amber-700' },
  delivered: { bg: 'bg-green-100', text: 'text-green-700' },
  cancelled: { bg: 'bg-gray-100', text: 'text-gray-500' },
  refunded: { bg: 'bg-red-100', text: 'text-red-700' }
};
