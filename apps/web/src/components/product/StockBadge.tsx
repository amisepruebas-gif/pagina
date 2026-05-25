interface StockBadgeProps {
  /** Stock conocido; null/undefined = no especificado. */
  stock?: number | null;
}

/** StockBadge — punto coloreado + leyenda de disponibilidad. */
export function StockBadge({ stock }: StockBadgeProps) {
  const known = typeof stock === 'number';
  const out = known && stock! <= 0;
  const low = known && stock! > 0 && stock! <= 10;

  if (out) {
    return (
      <span className="inline-flex items-center gap-1.5 text-error text-[13px] font-semibold">
        <span className="size-2 rounded-full bg-error" />
        Sin stock
      </span>
    );
  }
  if (low) {
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
