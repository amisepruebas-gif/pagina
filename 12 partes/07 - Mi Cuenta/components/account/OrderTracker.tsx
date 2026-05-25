import { Icon } from "@/components";
import { type OrderStatus } from "@/lib/sample-account";

interface OrderTrackerProps {
  status: OrderStatus;
  courier?: string | null;
  tracking?: string | null;
}

const STEPS = [
  { value: "processing", label: "Procesando" },
  { value: "shipped",    label: "Enviado" },
  { value: "delivered",  label: "Entregado" },
] as const;

/**
 * OrderTracker — stepper embebido de 3 pasos con conectores entre cada uno.
 * Si `courier` está presente muestra una fila con el número de guía.
 */
export function OrderTracker({ status, courier, tracking }: OrderTrackerProps) {
  const idx = STEPS.findIndex((s) => s.value === status);

  return (
    <div>
      <div className="grid grid-cols-3 relative py-3">
        {STEPS.map((step, i) => {
          const done = i <= idx;
          const current = i === idx;
          return (
            <div key={step.value} className="flex flex-col items-center gap-2 relative">
              {i > 0 && (
                <span
                  className={`absolute top-3.5 h-[3px] rounded-full transition-colors duration-base ease-out
                              ${i <= idx ? "bg-gradient-to-r from-brand-400 to-brand-500" : "bg-surface-2"}`}
                  style={{ left: "calc(-50% + 14px)", right: "calc(50% + 14px)" }}
                />
              )}
              <span
                className={`size-7 rounded-full shrink-0 relative inline-flex items-center justify-center
                            transition-all duration-base ease-out
                            ${done
                              ? "bg-brand-500 text-white border-0"
                              : "bg-surface text-text-soft border-2 border-border-strong"}
                            ${current ? "ring-[6px] ring-brand-500/20" : ""}`}
              >
                {done ? <Icon name="check" size={14} strokeWidth={3} /> :
                  <span className="font-mono text-[11px] font-bold">{i + 1}</span>}
              </span>
              <span className={`font-display text-xs text-center
                                ${current ? "font-bold" : "font-medium"}
                                ${done ? "text-text" : "text-text-soft"}`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
      {courier && (
        <div className="mt-2 px-3.5 py-2.5 rounded-sm bg-surface-2 flex items-center gap-2.5 flex-wrap">
          <Icon name="truck" size={14} strokeWidth={2} className="text-brand-700" />
          <span className="text-xs text-text-muted">{courier} · guía</span>
          <span className="font-mono text-xs text-text font-semibold">{tracking}</span>
          <a href="#" className="ml-auto text-xs text-brand-700 no-underline font-semibold font-display">
            Rastrear →
          </a>
        </div>
      )}
    </div>
  );
}
