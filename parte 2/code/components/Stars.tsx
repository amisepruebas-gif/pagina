import { cn } from "@/lib/cn";
import { Icon } from "./Icon";

export interface StarsProps {
  /** 0–total */
  value: number;
  total?: number;
  size?: number;
  /** Muestra el número junto a las estrellas */
  showValue?: boolean;
  /** Cantidad de reseñas a mostrar entre paréntesis */
  reviews?: number;
  className?: string;
}

/**
 * Stars — calificación con medio-rating.
 *
 * @example <Stars value={4.5} reviews={248} />
 */
export function Stars({ value, total = 5, size = 14, showValue = true, reviews, className }: StarsProps) {
  return (
    <span className={cn("inline-flex items-center gap-1 text-accent", className)}>
      <span className="inline-flex gap-px">
        {Array.from({ length: total }).map((_, i) => {
          const filled = i + 1 <= Math.floor(value);
          const half   = !filled && i + 0.5 < value;
          return (
            <Icon
              key={i}
              name={filled || half ? "star-filled" : "star"}
              size={size}
              strokeWidth={1.4}
              className={half ? "opacity-60" : undefined}
            />
          );
        })}
      </span>
      {showValue && <span className="text-xs font-semibold text-text ml-0.5">{value.toFixed(1)}</span>}
      {reviews != null && <span className="text-xs text-text-soft">({reviews})</span>}
    </span>
  );
}
