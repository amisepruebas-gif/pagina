import type { OrderEvent } from '@/types/order';

export interface OrderTimelineProps {
  events: OrderEvent[];
}

const EVENT_LABELS: Record<string, string> = {
  'status.changed': 'Estado del pedido actualizado',
  'fulfillment.updated': 'Datos de paquetería actualizados',
  'payment.status.changed': 'Estado de pago actualizado',
  'order.created': 'Pedido creado',
  unknown: 'Evento'
};

function eventText(e: OrderEvent): string {
  const base = EVENT_LABELS[e.type] ?? e.type;
  if (e.type === 'status.changed' && e.from && e.to) {
    return `${base}: ${e.from} -> ${e.to}`;
  }
  if (e.to && e.type !== 'status.changed') {
    return `${base}: ${e.to}`;
  }
  return base;
}

/**
 * OrderTimeline — eventos cronológicos del pedido como lista vertical
 * con conectores y dot pulse en el primero (evento más reciente).
 * Recibe eventos ordenados por fecha descendente (más reciente primero).
 */
export function OrderTimeline({ events }: OrderTimelineProps) {
  if (!events || events.length === 0) {
    return (
      <div className="p-5 text-center text-text-soft text-[13px]">
        Sin eventos registrados aún.
      </div>
    );
  }
  return (
    <ol className="list-none p-0 my-3 relative">
      <span
        aria-hidden
        className="absolute left-[15px] top-4 bottom-4 w-0.5 bg-border"
      />
      {events.map((e, i) => {
        const isFirst = i === 0;
        return (
          <li key={e.id} className="relative py-2.5 pl-11">
            <span
              className={`absolute left-2 top-3 size-4 rounded-full border-2 border-brand-500 ${
                isFirst ? 'bg-brand-500 ring-4 ring-brand-500/20' : 'bg-surface'
              }`}
            />
            <div className="font-display font-semibold text-[13px]">
              {eventText(e)}
            </div>
            <div className="mt-0.5 text-[11px] text-text-soft font-mono">
              {e.at
                ? e.at.toLocaleString('es-MX', {
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit'
                  })
                : '—'}
              {e.by && ` · ${e.by}`}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
