'use client';

import Link from 'next/link';
import type { SiteContent, SiteContentKind } from '@/types/site-content';
import { Button, Badge } from '@/components/ui';
import { AdminPageHeader } from './AdminPageHeader';
import { DataTable } from './DataTable';
import SiteContentTableActions from './SiteContentTableActions';

const KIND_LABEL: Record<SiteContentKind, string> = {
  hero: 'Hero',
  'promo-banner': 'Banner promocional',
  topbar: 'Topbar'
};

const KIND_TONE: Record<SiteContentKind, 'info' | 'secondary' | 'accent'> = {
  hero: 'info',
  'promo-banner': 'secondary',
  topbar: 'accent'
};

function previewOf(c: SiteContent): string {
  if (c.kind === 'topbar') return c.message;
  return c.title;
}

function formatDate(d?: Date): string {
  if (!d) return '';
  return d.toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

export default function SiteContentTable({
  items
}: {
  items: SiteContent[];
}) {
  const activeCount = items.filter((c) => c.active).length;

  return (
    <>
      <AdminPageHeader
        breadcrumb={[{ label: 'Admin', href: '/admin' }, { label: 'Contenido' }]}
        title="Contenido del sitio"
        description={`Bloques editables del storefront — hero, banners y topbar. ${
          items.length
        } bloque${items.length === 1 ? '' : 's'} · ${activeCount} activo${
          activeCount === 1 ? '' : 's'
        }.`}
        action={
          <Link href="/admin/contenido/nuevo">
            <Button leadingIcon="plus">Nuevo bloque</Button>
          </Link>
        }
      />
      <div className="p-6">
        <DataTable<SiteContent>
          rows={items}
          empty={{
            icon: 'grid',
            title: 'El sitio usa hero, banners y topbar por defecto',
            body: 'Cuando crees un bloque aquí, el storefront lo lee automáticamente. Usa "Nuevo bloque" para crear el primero.'
          }}
          columns={[
            {
              key: 'kind',
              label: 'Tipo',
              render: (c) => (
                <Badge tone={KIND_TONE[c.kind]} size="xs">
                  {KIND_LABEL[c.kind]}
                </Badge>
              )
            },
            {
              key: 'name',
              label: 'Nombre / Preview',
              render: (c) => (
                <div className={c.active ? '' : 'opacity-55'}>
                  <Link
                    href={`/admin/contenido/${c.id}`}
                    className="font-display font-semibold hover:text-brand-500 transition"
                  >
                    {c.name || '(sin nombre)'}
                  </Link>
                  <div className="text-[11px] text-text-soft line-clamp-1">
                    {previewOf(c)}
                  </div>
                </div>
              )
            },
            {
              key: 'page',
              label: 'Página',
              render: (c) => (
                <span className="font-mono text-xs text-text-muted">
                  {c.page}
                </span>
              )
            },
            {
              key: 'order',
              label: 'Orden',
              align: 'center',
              render: (c) => (
                <span className="font-mono text-xs">{c.order}</span>
              )
            },
            {
              key: 'range',
              label: 'Vigencia',
              render: (c) => (
                <span className="text-xs text-text-soft">
                  {c.validFrom || c.validUntil
                    ? `${formatDate(c.validFrom) || '—'} → ${
                        formatDate(c.validUntil) || 'sin fin'
                      }`
                    : 'Sin límite'}
                </span>
              )
            },
            {
              key: 'active',
              label: 'Estado',
              render: (c) =>
                c.active ? (
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
              width: '120px',
              render: (c) => (
                <SiteContentTableActions id={c.id} active={c.active} />
              )
            }
          ]}
        />
      </div>
    </>
  );
}
