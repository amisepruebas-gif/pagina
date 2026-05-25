'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import CartLine from '@/components/cart/CartLine';
import { Button, Icon, Input } from '@/components/ui';
import { getConfig } from '@/lib/config';
import { computeShipping } from '@/lib/shipping';
import { validateCoupon, computeCartDiscountAmount } from '@/lib/discounts-apply';
import type { SiteConfig } from '@/types/config';
import type { Discount } from '@/types/discount';

interface AppliedCoupon {
  discount: Discount;
  amount: number;
}

const money = (n: number) =>
  '$' + n.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const PAYMENTS = ['VISA', 'MC', 'AMEX', 'OXXO', 'MP'];

export default function CartPageInner() {
  const { items, subtotal, clear, hydrated } = useCart();
  const { user, profile } = useAuth();
  const params = useSearchParams();
  const cancelled = params.get('cancelled') === '1';

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shippingCfg, setShippingCfg] = useState<SiteConfig['shipping'] | null>(
    null
  );

  const [couponExpanded, setCouponExpanded] = useState(false);
  const [couponInput, setCouponInput] = useState('');
  const [coupon, setCoupon] = useState<AppliedCoupon | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponBusy, setCouponBusy] = useState(false);

  useEffect(() => {
    getConfig()
      .then((c) => setShippingCfg(c.shipping))
      .catch((err) => console.error('[CART] config error', err));
  }, []);

  useEffect(() => {
    if (!coupon) return;
    if (items.length === 0) {
      setCoupon(null);
      return;
    }
    let cancelledEffect = false;
    computeCartDiscountAmount(items, coupon.discount)
      .then((amount) => {
        if (cancelledEffect) return;
        if (amount <= 0) setCoupon(null);
        else setCoupon((c) => (c ? { ...c, amount } : null));
      })
      .catch((err) => console.error('[CART] recálculo cupón', err));
    return () => {
      cancelledEffect = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  const ship = shippingCfg ? computeShipping(subtotal, shippingCfg) : null;
  const discountAmount = coupon?.amount ?? 0;
  const total = Math.max(0, subtotal - discountAmount) + (ship?.cost ?? 0);

  async function applyCoupon() {
    setCouponError(null);
    setCouponBusy(true);
    try {
      const { discount, error: vErr } = await validateCoupon(couponInput);
      if (!discount) {
        setCouponError(vErr ?? 'Código no válido.');
        return;
      }
      const amount = await computeCartDiscountAmount(items, discount);
      if (amount <= 0) {
        setCouponError('Este código no aplica a los productos de tu carrito.');
        return;
      }
      setCoupon({ discount, amount });
      setCouponInput('');
      setCouponExpanded(false);
      console.log('[CART] cupón aplicado', discount.code, '-$' + amount);
    } catch (err) {
      console.error('[CART] error aplicando cupón', err);
      setCouponError('No se pudo validar el código. Intenta de nuevo.');
    } finally {
      setCouponBusy(false);
    }
  }

  function removeCoupon() {
    setCoupon(null);
    setCouponError(null);
    console.log('[CART] cupón quitado');
  }

  async function handleCheckout() {
    if (items.length === 0) return;
    setError(null);
    setSubmitting(true);
    try {
      console.log(
        '[CHECKOUT] POST /api/checkout/session',
        items.length,
        'líneas, invitado:',
        !user,
        'cupón:',
        coupon?.discount.code ?? '—'
      );
      const res = await fetch('/api/checkout/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((i) => ({ productId: i.productId, qty: i.qty })),
          userId: user?.uid ?? null,
          userEmail: user ? (profile?.email ?? user.email ?? null) : null,
          couponCode: coupon?.discount.code ?? null
        })
      });
      const raw = await res.text();
      let data: { url?: string; error?: string } = {};
      try {
        data = raw ? (JSON.parse(raw) as typeof data) : {};
      } catch {
        // Respuesta no-JSON (HTML de error genérico, body vacío, etc.).
      }
      if (!res.ok || !data.url) {
        throw new Error(
          data.error ?? `No se pudo iniciar el pago (HTTP ${res.status})`
        );
      }
      console.log('[CHECKOUT] redirigiendo a Stripe');
      window.location.href = data.url;
    } catch (err) {
      console.error('[CHECKOUT] error', err);
      setError(err instanceof Error ? err.message : 'Error inesperado');
      setSubmitting(false);
    }
  }

  if (!hydrated) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center text-text-soft text-sm">
        Cargando…
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 sm:py-14">
        <div className="relative overflow-hidden text-center bg-surface border-2 border-dashed border-border rounded-xl py-20 px-6">
          <span
            aria-hidden
            className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 size-80 rounded-full opacity-55 blur-[60px]"
            style={{ background: 'var(--grad-from)' }}
          />
          <div className="relative inline-flex items-center justify-center size-[88px] rounded-full text-white shadow-brand mb-6 bg-brand-grad">
            <Icon name="cart" size={36} strokeWidth={1.8} />
          </div>
          <h1 className="relative font-display font-bold tracking-[-0.025em] mb-2.5 text-3xl sm:text-4xl">
            Tu carrito está vacío.
          </h1>
          {cancelled && (
            <p className="relative mt-2 mb-2 text-sm text-warning">
              Cancelaste el pago. Tu carrito se mantuvo intacto.
            </p>
          )}
          <p className="relative text-text-muted max-w-md mx-auto mb-7 text-base leading-relaxed">
            Cuando agregues algo, lo verás aquí. Mientras tanto, echa un vistazo
            al catálogo.
          </p>
          <div className="relative inline-flex gap-2.5 flex-wrap justify-center">
            <Link href="/shop">
              <Button size="lg" trailingIcon="arr-right">
                Explorar la tienda
              </Button>
            </Link>
            <Link href="/shop?sale=true">
              <Button size="lg" variant="secondary">
                Ver ofertas
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 pb-16">
      <div className="pt-6 pb-2">
        <h1 className="font-display font-bold leading-none tracking-[-0.035em] text-3xl sm:text-5xl lg:text-[clamp(32px,5vw,56px)]">
          Tu carrito
        </h1>
        <p className="mt-2 text-text-soft text-sm">
          {items.length} {items.length === 1 ? 'producto' : 'productos'} ·{' '}
          {items.reduce((s, i) => s + i.qty, 0)} piezas
        </p>
      </div>

      {cancelled && (
        <div className="mt-4 rounded-md bg-warning/10 border border-warning/30 text-text text-sm px-4 py-3">
          Cancelaste el pago. Cuando estés listo, puedes intentarlo de nuevo.
        </div>
      )}

      <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px] items-start">
        <div className="flex flex-col gap-3">
          {items.map((item) => (
            <CartLine key={item.productId} item={item} />
          ))}
          <button
            type="button"
            onClick={() => {
              if (window.confirm('¿Vaciar el carrito completo?')) clear();
            }}
            className="mt-1 self-start text-xs font-semibold text-text-soft hover:text-error transition"
          >
            Vaciar carrito
          </button>
        </div>

        <aside className="bg-surface border border-border rounded-xl p-6 flex flex-col gap-[18px] lg:sticky lg:top-24">
          <h2 className="font-display font-bold text-xl tracking-[-0.015em]">
            Resumen del pedido
          </h2>

          {/* Cupón */}
          {coupon ? (
            <div className="flex items-center gap-2.5 px-4 py-3 rounded-md bg-brand-50 border border-brand-200">
              <span className="size-7 rounded-full shrink-0 bg-brand-500 text-white inline-flex items-center justify-center">
                <Icon name="check" size={16} strokeWidth={3} />
              </span>
              <div className="flex-1 min-w-0 font-display font-semibold text-[13px]">
                Cupón <span className="text-brand-700">{coupon.discount.code}</span>{' '}
                aplicado
              </div>
              <button
                type="button"
                onClick={removeCoupon}
                aria-label="Quitar cupón"
                className="text-text-soft hover:text-error transition"
              >
                <Icon name="x" size={16} strokeWidth={2} />
              </button>
            </div>
          ) : couponExpanded ? (
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <div className="flex-1 min-w-0">
                  <Input
                    placeholder="Tu código"
                    leadingIcon="tag"
                    value={couponInput}
                    onChange={(e) => {
                      setCouponInput(e.target.value);
                      setCouponError(null);
                    }}
                    error={couponError ?? undefined}
                  />
                </div>
                <Button
                  type="button"
                  onClick={applyCoupon}
                  disabled={couponBusy || !couponInput.trim()}
                >
                  {couponBusy ? '…' : 'Aplicar'}
                </Button>
              </div>
              <button
                type="button"
                onClick={() => {
                  setCouponExpanded(false);
                  setCouponInput('');
                  setCouponError(null);
                }}
                className="self-start text-text-soft text-xs font-medium px-1.5 py-1"
              >
                Cancelar
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setCouponExpanded(true)}
              className="flex items-center gap-2 w-full px-4 py-3 min-h-12 bg-surface-2 border border-dashed border-border-strong rounded-md text-text font-display font-semibold text-sm cursor-pointer hover:border-brand-500 transition"
            >
              <Icon name="tag" size={16} strokeWidth={2} className="text-brand-700" />
              ¿Tienes un código de descuento?
            </button>
          )}

          {/* Filas */}
          <div className="flex flex-col gap-2.5">
            <Row label="Subtotal" value={money(subtotal)} />
            {coupon && (
              <Row
                label={`Cupón (${coupon.discount.code})`}
                value={`− ${money(coupon.amount)}`}
                positive
              />
            )}
            <Row
              label="Envío"
              value={
                !ship ? (
                  'Calculando…'
                ) : ship.isFree ? (
                  <span className="text-success font-semibold">Gratis</span>
                ) : (
                  money(ship.cost)
                )
              }
            />
            {ship && ship.remainingForFree > 0 && (
              <div className="px-3 py-2.5 rounded-sm bg-brand-50 text-brand-700 text-xs leading-relaxed flex items-center gap-2">
                <Icon name="truck" size={14} strokeWidth={2} />
                Agrega{' '}
                <strong className="font-bold">
                  {money(ship.remainingForFree)}
                </strong>{' '}
                más y tu envío es gratis.
              </div>
            )}
          </div>

          <div className="flex justify-between items-baseline pt-4 border-t border-border">
            <span className="font-display font-semibold text-sm text-text-muted">
              Total
            </span>
            <span className="font-display font-bold text-3xl tracking-[-0.025em]">
              {money(total)}
            </span>
          </div>

          {error && (
            <div className="rounded-md bg-error/10 border border-error/30 text-error text-xs px-3 py-2">
              {error}
            </div>
          )}

          <Button
            size="lg"
            trailingIcon="arr-right"
            onClick={handleCheckout}
            disabled={submitting}
            fullWidth
          >
            {submitting ? 'Conectando con Stripe…' : 'Continuar al pago'}
          </Button>

          {!user && (
            <p className="text-xs text-text-soft text-center">
              Puedes pagar como invitado.{' '}
              <Link
                href="/login?next=/cart"
                className="text-brand-600 font-semibold hover:underline"
              >
                Iniciar sesión
              </Link>
            </p>
          )}

          <div className="flex flex-col gap-2 pt-4 border-t border-border">
            <div className="flex items-center gap-2 text-xs text-text-muted">
              <Icon
                name="shield"
                size={14}
                strokeWidth={2}
                className="text-brand-700"
              />
              Pago seguro con encriptación SSL
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              {PAYMENTS.map((p) => (
                <span
                  key={p}
                  className="px-2 py-1 rounded-xs border border-border font-mono text-[10px] font-semibold text-text-soft tracking-wider"
                >
                  {p}
                </span>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  positive
}: {
  label: string;
  value: React.ReactNode;
  positive?: boolean;
}) {
  return (
    <div className="flex justify-between items-baseline gap-2 text-sm">
      <span className="text-text-muted">{label}</span>
      <span
        className={`font-display font-semibold tabular-nums ${
          positive ? 'text-success' : 'text-text'
        }`}
      >
        {value}
      </span>
    </div>
  );
}
