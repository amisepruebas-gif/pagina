import type { Order } from '@/types/order';

const STEPS: { key: string; label: string }[] = [
  { key: 'processing', label: 'En proceso' },
  { key: 'shipped', label: 'Enviado' },
  { key: 'delivered', label: 'Entregado' }
];

/** Tracking embebido del pedido. */
export default function OrderTracker({ order }: { order: Order }) {
  if (order.status === 'cancelled') {
    return (
      <div className="rounded-md bg-surface-2 text-text-muted text-xs font-semibold px-3 py-2">
        Este pedido fue cancelado.
      </div>
    );
  }
  if (order.status === 'refunded') {
    return (
      <div className="rounded-md bg-error/10 text-error text-xs font-semibold px-3 py-2">
        Este pedido fue reembolsado.
      </div>
    );
  }

  const fStatus = order.fulfillment.status;
  const currentIdx = Math.max(
    0,
    STEPS.findIndex((s) => s.key === fStatus)
  );

  return (
    <div>
      <ol className="flex items-center">
        {STEPS.map((step, idx) => {
          const done = idx <= currentIdx;
          const isLast = idx === STEPS.length - 1;
          return (
            <li
              key={step.key}
              className={`flex items-center ${isLast ? '' : 'flex-1'}`}
            >
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold ${
                    done
                      ? 'bg-brand-500 text-white'
                      : 'bg-surface-2 text-text-soft'
                  }`}
                >
                  {done ? '✓' : idx + 1}
                </div>
                <span
                  className={`mt-1 text-[10px] ${
                    done ? 'text-text font-semibold' : 'text-text-soft'
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {!isLast && (
                <div
                  className={`mx-1 h-0.5 flex-1 ${
                    idx < currentIdx ? 'bg-brand-500' : 'bg-surface-2'
                  }`}
                />
              )}
            </li>
          );
        })}
      </ol>

      {order.fulfillment.trackingNumber && (
        <p className="mt-3 text-xs text-text-muted">
          {order.fulfillment.carrier && (
            <>
              Paquetería:{' '}
              <span className="font-semibold text-text">
                {order.fulfillment.carrier}
              </span>{' '}
              ·{' '}
            </>
          )}
          Guía:{' '}
          <span className="font-semibold text-text">
            {order.fulfillment.trackingNumber}
          </span>
        </p>
      )}
    </div>
  );
}
