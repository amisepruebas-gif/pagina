import { Badge } from "@/components";
import { STOCK_TONE } from "@/lib/admin-catalog";

/**
 * StockBadge — verde / ámbar / rojo según el nivel de stock.
 * Reusable en la tabla de productos y en la PDP del admin.
 */
export function StockBadge({ stock }: { stock: number }) {
  const tone = STOCK_TONE(stock);
  const label = tone === "error" ? `${stock} crítico` : tone === "warning" ? `${stock} bajo` : `${stock}`;
  return <Badge tone={tone} size="xs">{label}</Badge>;
}
