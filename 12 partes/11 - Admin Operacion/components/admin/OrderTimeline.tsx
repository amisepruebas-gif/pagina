import type { AdminOrderEvent } from "@/lib/admin-ops";

export interface OrderTimelineProps { events: AdminOrderEvent[] }

/**
 * OrderTimeline — eventos cronológicos del pedido como lista vertical
 * con conectores y dot pulse en el último (estado actual).
 */
export function OrderTimeline({ events }: OrderTimelineProps) {
  if (!events || events.length === 0) {
    return (
      <div className="p-5 text-center text-text-soft text-[13px]">
        Aún no hay eventos para este pedido.
      </div>
    );
  }
  return (
    <ol className="list-none p-0 my-3 relative">
      <span aria-hidden className="absolute left-[15px] top-4 bottom-4 w-0.5 bg-border" />
      {events.map((e, i) => {
        const isLast = i === events.length - 1;
        return (
          <li key={e.id} className="relative py-2.5 pl-11">
            <span
              className={`absolute left-2 top-3 size-4 rounded-full border-2 border-brand-500
                          ${isLast ? "bg-brand-500 ring-4 ring-brand-500/20" : "bg-surface"}`}
            />
            <div className="font-display font-semibold text-[13px]">{e.text}</div>
            <div className="mt-0.5 text-[11px] text-text-soft font-mono">{e.at} · {e.actor}</div>
          </li>
        );
      })}
    </ol>
  );
}
