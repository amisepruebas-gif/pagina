import Link from 'next/link';
import type { Product } from '@/types/product';
import { Badge, Icon, ProductImage } from '@/components/ui';
import { toUiProduct, productHref } from '@/lib/ui-adapters';

const fmt = (n: number) =>
  '$' + n.toLocaleString('es-MX', { maximumFractionDigits: 0 });

interface ProductRowProps {
  product: Product;
  index?: number;
}

/** ProductRow — vista lista del catálogo. Toda la fila es un enlace. */
export function ProductRow({ product: p, index = 0 }: ProductRowProps) {
  const ui = toUiProduct(p, index);
  const discount = ui.oldPrice
    ? Math.round((1 - ui.price / ui.oldPrice) * 100)
    : 0;

  return (
    <Link
      href={productHref(p)}
      className="flex gap-3 sm:gap-4 p-3 sm:p-4 bg-surface border border-border rounded-xl transition duration-base ease-out hover:-translate-y-0.5 hover:shadow-md hover:border-brand-200"
    >
      <div className="w-24 sm:w-36 shrink-0">
        <ProductImage
          src={ui.image}
          label={ui.label}
          accent={ui.accent}
          aspect="1/1"
          rounded="rounded-md"
        />
      </div>

      <div className="flex-1 min-w-0 flex flex-col gap-1.5">
        {discount > 0 ? (
          <div>
            <Badge tone="secondary" size="xs" leadingIcon="bolt">
              -{discount}%
            </Badge>
          </div>
        ) : ui.tag ? (
          <div>
            <Badge tone="accent" size="xs">
              {ui.tag}
            </Badge>
          </div>
        ) : null}
        <h3 className="font-display font-semibold text-sm sm:text-base leading-snug line-clamp-2">
          {p.name}
        </h3>
        {p.description && (
          <p className="text-[13px] text-text-soft line-clamp-2 hidden sm:block">
            {p.description}
          </p>
        )}
        <div className="flex items-baseline gap-2 mt-auto">
          <span className="font-display font-bold text-lg sm:text-xl">
            {fmt(ui.price)}
          </span>
          {ui.oldPrice && (
            <span className="text-[13px] text-text-soft line-through">
              {fmt(ui.oldPrice)}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center shrink-0">
        <span className="size-9 rounded-full bg-surface-2 text-text-soft inline-flex items-center justify-center">
          <Icon name="arr-right" size={16} strokeWidth={2} />
        </span>
      </div>
    </Link>
  );
}
