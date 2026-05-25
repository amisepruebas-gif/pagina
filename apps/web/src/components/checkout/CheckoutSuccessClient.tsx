'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { Button, Icon } from '@/components/ui';

interface OrderSummary {
  orderNumber: string | null;
  total: number | null;
  currency: string;
  email: string | null;
}

const POLL_INTERVAL_MS = 2500;
const MAX_POLLS = 10;

export default function CheckoutSuccessClient() {
  const params = useSearchParams();
  const sessionId = params.get('session_id');
  const { clear } = useCart();
  const { user } = useAuth();
  const [summary, setSummary] = useState<OrderSummary | null>(null);
  const [polling, setPolling] = useState(true);
  const clearedRef = useRef(false);

  useEffect(() => {
    if (clearedRef.current) return;
    clearedRef.current = true;
    clear();
    console.log('[CHECKOUT] success — carrito limpiado');
  }, [clear]);

  useEffect(() => {
    if (!sessionId) {
      setPolling(false);
      return;
    }
    let cancelled = false;
    let attempts = 0;

    async function poll() {
      attempts += 1;
      try {
        const res = await fetch(
          `/api/checkout/order-summary?session_id=${encodeURIComponent(sessionId!)}`
        );
        const data = await res.json();
        if (cancelled) return;
        if (data.found) {
          setSummary({
            orderNumber: data.orderNumber ?? null,
            total: typeof data.total === 'number' ? data.total : null,
            currency: data.currency ?? 'MXN',
            email: data.email ?? null
          });
          setPolling(false);
          console.log('[CHECKOUT] orden encontrada', data.orderNumber);
          return;
        }
      } catch (err) {
        console.error('[CHECKOUT] error poll order-summary:', err);
      }
      if (cancelled) return;
      if (attempts >= MAX_POLLS) {
        setPolling(false);
        console.warn('[CHECKOUT] orden no apareció tras', MAX_POLLS, 'intentos');
        return;
      }
      window.setTimeout(poll, POLL_INTERVAL_MS);
    }

    poll();
    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  return (
    <div className="mx-auto max-w-xl px-4 py-16 md:py-24 text-center">
      <div className="mx-auto inline-flex items-center justify-center size-20 rounded-full bg-brand-grad text-white shadow-brand">
        <Icon name="check" size={36} strokeWidth={3} />
      </div>

      <h1 className="mt-6 font-display font-bold tracking-[-0.03em] text-3xl md:text-4xl">
        ¡Gracias por tu compra!
      </h1>

      {summary?.orderNumber ? (
        <p className="mt-3 text-sm text-text-muted">
          Tu pedido{' '}
          <span className="font-bold text-text">{summary.orderNumber}</span>
          {summary.total !== null && (
            <>
              {' '}
              por{' '}
              <span className="font-bold text-text">
                ${summary.total.toFixed(2)} {summary.currency}
              </span>
            </>
          )}{' '}
          fue registrado.
        </p>
      ) : polling ? (
        <p className="mt-3 text-sm text-text-muted">
          Estamos registrando tu pedido. Esto toma unos segundos…
        </p>
      ) : (
        <p className="mt-3 text-sm text-text-muted">
          Tu pago fue procesado. En unos minutos recibirás la confirmación.
        </p>
      )}

      <p className="mt-2 text-xs text-text-soft">
        Te enviamos la confirmación al correo de la compra.
      </p>

      {!user && (
        <div className="mt-8 rounded-xl border border-brand-200 bg-brand-50 p-6 text-left">
          <h2 className="font-display text-lg font-bold">
            Crea tu cuenta y sigue tu pedido
          </h2>
          <p className="mt-1 text-sm text-text-muted">
            Con una cuenta puedes ver el estado de tu envío, tu historial de
            compras y comprar más rápido la próxima vez.
          </p>
          <Link
            href={
              summary?.email
                ? `/register?email=${encodeURIComponent(summary.email)}`
                : '/register'
            }
            className="mt-4 inline-block"
          >
            <Button>Crear cuenta</Button>
          </Link>
        </div>
      )}

      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
        {user && (
          <Link href="/mi-cuenta?tab=pedidos">
            <Button trailingIcon="arr-right">Ver mis pedidos</Button>
          </Link>
        )}
        <Link href="/shop">
          <Button variant="secondary">Seguir comprando</Button>
        </Link>
      </div>
    </div>
  );
}
