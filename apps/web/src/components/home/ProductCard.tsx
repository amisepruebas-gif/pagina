import Link from 'next/link';
import Image from 'next/image';
import type { Product } from '@/types/product';

function getBadge(product: Product): string | null {
  if (product.isNew) return 'Nuevo';
  if (product.originalPrice !== undefined && product.price < product.originalPrice) {
    const pct = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
    return `-${pct}%`;
  }
  return null;
}

export default function ProductCard({ product }: { product: Product }) {
  const badge = getBadge(product);
  const href = `/producto/${product.slug}`;

  return (
    <Link href={href} className="group block">
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-gray-100 shadow-sm group-hover:shadow-lg transition-shadow">
        {badge && (
          <span className="absolute top-3 left-3 z-10 rounded-full bg-accent text-white text-[10px] font-bold px-2.5 py-1 uppercase tracking-wide shadow-sm">
            {badge}
          </span>
        )}
        {product.primaryImageUrl ? (
          <Image
            src={product.primaryImageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 text-gray-400 text-xs font-medium">
            (sin imagen)
          </div>
        )}
      </div>
      <div className="mt-3 px-1">
        <h3 className="text-sm font-medium text-gray-900 group-hover:text-accent transition-colors line-clamp-2 min-h-[2.5em]">
          {product.name}
        </h3>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-base font-bold text-gray-900">
            ${product.price.toFixed(2)}
          </span>
          {product.originalPrice !== undefined && product.originalPrice > product.price && (
            <span className="text-xs text-gray-400 line-through">
              ${product.originalPrice.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
