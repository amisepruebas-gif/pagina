import Stripe from 'stripe';

const key = process.env.STRIPE_SECRET_KEY;
if (!key) {
  // No throw en build — solo cuando un endpoint intenta usarlo.
  console.warn('[stripe] STRIPE_SECRET_KEY no está definido');
}

export const stripe = new Stripe(key ?? 'sk_test_placeholder', {
  apiVersion: '2026-04-22.dahlia',
  typescript: true
});

export const STRIPE_CURRENCY = (process.env.STRIPE_CURRENCY ?? 'mxn').toLowerCase();
