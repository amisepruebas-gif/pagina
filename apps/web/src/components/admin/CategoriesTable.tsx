'use client';

import Link from 'next/link';
import type { Category } from '@/types/category';
import { gradientFor } from '@/types/category';
import { Button, Badge } from '@/components/ui';
import { AdminPageHeader } from './AdminPageHeader';
import { DataTable } from './DataTable';
import CategoriesTableActions from './CategoriesTableActions';

export default function CategoriesTable({
  categories
}: {
  categories: Category[];
}) {
  return (
    <>
      <AdminPageHeader
        breadcrumb={[{ label: 'Admin', href: '/admin' }, { label: 'Categorías' }]}
        title="Categorías"
        description={`${categories.length} categoría${
          categories.length === 1 ? '' : 's'
        } en total · agrupan productos y aparecen en la navegación.`}
        action={
          <Link href="/admin/categorias/nuevo">
            <Button leadingIcon="plus">Nueva categoría</Button>
          </Link>
        }
      />

      <div className="p-6">
        <DataTable<Category>
          rows={categories}
          empty={{
            icon: 'grid',
            title: 'Aún no hay categorías',
            body: 'Mientras estén vacías, el home no mostrará la sección "Compra por categoría" y las pills de /shop solo mostrarán "Todos" y "En oferta".'
          }}
          columns={[
            {
              key: 'preview',
              label: '',
              width: '72px',
              render: (c) => (
                <div
                  className={`w-14 h-10 rounded-sm shadow-xs bg-gradient-to-br ${gradientFor(c)}`}
                  style={
                    c.imageUrl
                      ? {
                          backgroundImage: `url(${c.imageUrl})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center'
                        }
                      : undefined
                  }
                />
              )
            },
            {
              key: 'name',
              label: 'Nombre',
              render: (c) => (
                <Link
                  href={`/admin/categorias/${c.id}`}
                  className={c.active ? '' : 'opacity-60'}
                >
                  <div className="font-display font-semibold text-text hover:text-brand-700 transition-colors">
                    {c.name}
                  </div>
                  <code className="font-mono text-[11px] text-text-soft">
                    /{c.slug}
                  </code>
                </Link>
              )
            },
            {
              key: 'order',
              label: 'Orden',
              align: 'center',
              render: (c) => (
                <span className="font-mono text-xs text-text-muted">
                  {c.order}
                </span>
              )
            },
            {
              key: 'active',
              label: 'Estado',
              render: (c) =>
                c.active ? (
                  <Badge tone="success" size="xs">
                    Activa
                  </Badge>
                ) : (
                  <Badge tone="neutral" size="xs">
                    Inactiva
                  </Badge>
                )
            },
            {
              key: 'actions',
              label: 'Acciones',
              align: 'right',
              width: '160px',
              render: (c) => (
                <CategoriesTableActions categoryId={c.id} active={c.active} />
              )
            }
          ]}
        />
      </div>
    </>
  );
}
