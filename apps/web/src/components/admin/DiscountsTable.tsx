'use client';

import Link from 'next/link';
import type { Discount, DiscountType } from '@/types/discount';
import type { Category } from '@/types/category';
import type { Product } from '@/types/product';
import { Button, Badge } from '@/components/ui';
import { AdminPageHeader } from './AdminPageHeader';
import { DataTable } from './DataTable';
import DiscountsTableActions from './DiscountsTableActions';

function formatDate(d?: Date): string {
  if (!d) return '∞';
  return d.toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

const TYPE_TONE: Record<DiscountType, 'info' | 'secondary' | 'accent'> = {
  global: 'info',
  category: 'secondary',
  product: 'accent'
};

const TYPE_LABEL: Record<DiscountType, string> = {
  global: 'Global',
  category: 'Categoría',
  product: 'Producto'
};

export default function DiscountsTable({
  discounts,
  categories,
  products
}: {
  discounts: Discount[];
  categories: Category[];
  products: Product[];
}) {
  const catName = (id?: string) =>
    categories.find((c) => c.id === id)?.name ?? id ?? '—';
  const prodName = (id?: string) =>
    products.find((p) => p.id === id)?.name ?? id ?? '—';
  const activeCount = discounts.filter((d) => d.active).length;

  return (
    <>
      <AdminPageHeader
        breadcrumb={[{ label: 'Admin', href: '/admin' }, { label: 'Descuentos' }]}
        title="Descuentos"
        description={`${discounts.length} descuento${
          discounts.length === 1 ? '' : 's'
        } · ${activeCount} activo${activeCount === 1 ? '' : 's'}.`}
        action={
          <Link href="/admin/descuentos/nuevo">
            <Button leadingIcon="plus">Nuevo descuento</Button>
          </Link>
        }
      />
      <div className="p-6">
        <DataTable<Discount>
          rows={discounts}
          empty={{
            icon: 'tag',
            title: 'Aún no hay descuentos',
            body: 'Los descuentos se aplican al precio en el checkout. Usa "Nuevo descuento" para crear el primero.'
          }}
          columns={[
            {
              key: 'name',
              label: 'Nombre',
              render: (d) => (
                <div className={d.active ? '' : 'opacity-55'}>
                  <Link
                    href={`/admin/descuentos/${d.id}`}
                    className="font-display font-semibold hover:text-brand-500 transition"
                  >
                    {d.name}
                  </Link>
                  {d.code && (
                    <code className="ml-2 font-mono text-[11px] text-text-soft uppercase">
                      {d.code}
                    </code>
                  )}
                  {d.season && (
                    <div className="text-[11px] text-text-soft">{d.season}</div>
                  )}
                </div>
              )
            },
            {
              key: 'type',
              label: 'Aplicabilidad',
              render: (d) => (
                <div className="flex items-center gap-2">
                  <Badge tone={TYPE_TONE[d.type]} size="xs">
                    {TYPE_LABEL[d.type]}
                  </Badge>
                  {d.type === 'category' && (
                    <span className="text-xs text-text-muted">
                      {catName(d.categoryId)}
                    </span>
                  )}
                  {d.type === 'product' && (
                    <span className="text-xs text-text-muted">
                      {prodName(d.productId)}
                    </span>
                  )}
                </div>
              )
            },
            {
              key: 'percentage',
              label: 'Porcentaje',
              align: 'right',
              render: (d) => (
                <span className="font-display font-bold text-brand-600">
                  −{d.percentage}%
                </span>
              )
            },
            {
              key: 'range',
              label: 'Vigencia',
              render: (d) => (
                <span className="text-xs text-text-muted">
                  {formatDate(d.validFrom)} → {formatDate(d.validUntil)}
                </span>
              )
            },
            {
              key: 'active',
              label: 'Estado',
              render: (d) =>
                d.active ? (
                  <Badge tone="success" size="xs">
                    Activo
                  </Badge>
                ) : (
                  <Badge tone="neutral" size="xs">
                    Inactivo
                  </Badge>
                )
            },
            {
              key: 'actions',
              label: 'Acciones',
              align: 'right',
              width: '160px',
              render: (d) => <DiscountsTableActions id={d.id} active={d.active} />
            }
          ]}
        />
      </div>
    </>
  );
}
