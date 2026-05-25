import { Badge } from '@/components/ui';

/** Nivel de stock → tono del badge. */
export function stockTone(stock: number): 'error' | 'warning' | 'success' {
  if (stock <= 5) return 'error';
  if (stock <= 20) return 'warning';
  return 'success';
}

/**
 * StockBadge — verde / ámbar / rojo según el nivel de stock.
 * Reusable en la tabla de productos y en el detalle del admin.
 */
export function StockBadge({ stock }: { stock: number }) {
  const tone = stockTone(stock);
  const label =
    tone === 'error'
      ? `${stock} crítico`
      : tone === 'warning'
        ? `${stock} bajo`
        : `${stock}`;
  return (
    <Badge tone={tone} size="xs">
      {label}
    </Badge>
  );
}
