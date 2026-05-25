interface StockBadgeProps {
  stock: number;
  inStock: boolean;
}

/**
 * StockBadge — punto coloreado + leyenda.
 *
 * - Sin stock: rojo
 * - ≤10: coral (urgencia, "Solo quedan N")
 * - >10: verde ("En stock · listo para enviar")
 */
export function StockBadge({ stock, inStock }: StockBadgeProps) {
  if (!inStock) {
    return (
      <span className="inline-flex items-center gap-1.5 text-error text-[13px] font-semibold">
        <span className="size-2 rounded-full bg-error" />
        Sin stock
      </span>
    );
  }
  if (stock <= 10) {
    return (
      <span className="inline-flex items-center gap-1.5 text-secondary-600 text-[13px] font-semibold">
        <span className="size-2 rounded-full bg-secondary" />
        Solo quedan {stock}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-success text-[13px] font-semibold">
      <span className="size-2 rounded-full bg-success" />
      En stock · listo para enviar
    </span>
  );
}
