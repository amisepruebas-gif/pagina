import Link from 'next/link';
import { getProducts } from '@/lib/products';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { StatCard } from '@/components/admin/StatCard';
import { Badge, Icon, type IconName } from '@/components/ui';

export const revalidate = 0;

export const metadata = { title: 'Dashboard · admin' };

const QUICK_LINKS: { icon: IconName; label: string; href: string }[] = [
  { icon: 'plus', label: 'Crear producto', href: '/admin/productos/nuevo' },
  { icon: 'tag', label: 'Aplicar descuento', href: '/admin/descuentos/nuevo' },
  { icon: 'grid', label: 'Editar contenido del sitio', href: '/admin/contenido' },
  { icon: 'warn', label: 'Revisar quejas', href: '/admin/quejas' }
];

export default async function AdminDashboardPage() {
  const all = await getProducts({ limit: 500 });
  const totalActive = all.length;
  const featured = all.filter((p) => p.isFeatured).length;
  const nuevos = all.filter((p) => p.isNew).length;
  const lowStock = all
    .filter((p) => typeof p.stock === 'number' && (p.stock as number) <= 5)
    .sort((a, b) => (a.stock ?? 0) - (b.stock ?? 0));

  return (
    <>
      <AdminPageHeader
        breadcrumb={[{ label: 'Admin', href: '/admin' }, { label: 'Dashboard' }]}
        title="Dashboard"
        description="Vista general del catálogo en Firestore."
      />

      <div className="p-6 flex flex-col gap-5">
        <div className="grid gap-3.5 grid-cols-[repeat(auto-fit,minmax(220px,1fr))]">
          <StatCard
            label="Productos activos"
            value={totalActive.toLocaleString('es-MX')}
            icon="tag"
            tone="brand"
          />
          <StatCard
            label="Destacados"
            value={featured.toLocaleString('es-MX')}
            icon="spark"
            tone="secondary"
          />
          <StatCard
            label="Novedades"
            value={nuevos.toLocaleString('es-MX')}
            icon="bolt"
            tone="info"
          />
          <StatCard
            label="Stock bajo (≤5)"
            value={lowStock.length.toLocaleString('es-MX')}
            icon="warn"
            tone="accent"
          />
        </div>

        <div className="grid gap-3.5 grid-cols-1 xl:grid-cols-[1.6fr_1fr]">
          <section className="min-w-0">
            <div className="flex justify-between items-baseline mb-2.5">
              <h3 className="font-display font-bold text-base">Stock bajo</h3>
              <Link
                href="/admin/productos"
                className="text-[13px] text-brand-700 font-display font-semibold"
              >
                Ver inventario →
              </Link>
            </div>
            <div className="bg-surface border border-border rounded-lg overflow-hidden flex flex-col">
              {lowStock.length === 0 ? (
                <div className="px-3.5 py-10 text-center text-text-soft text-sm">
                  Ningún producto con stock crítico.
                </div>
              ) : (
                lowStock.slice(0, 8).map((p, i) => (
                  <Link
                    key={p.id}
                    href={`/admin/productos/${p.id}`}
                    className={`flex items-center gap-3 px-3.5 py-3 hover:bg-surface-2 transition ${
                      i === 0 ? '' : 'border-t border-border'
                    }`}
                  >
                    <span
                      className={`size-9 rounded-sm inline-flex items-center justify-center shrink-0 font-display font-bold text-[13px] ${
                        (p.stock ?? 0) <= 2
                          ? 'bg-error/[0.12] text-error'
                          : 'bg-warning/[0.12] text-warning'
                      }`}
                    >
                      {p.stock}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="font-display font-semibold text-[13px] truncate">
                        {p.name}
                      </div>
                      {p.sku && (
                        <div className="text-[11px] text-text-soft font-mono">
                          {p.sku}
                        </div>
                      )}
                    </div>
                    <Icon
                      name="chev-right"
                      size={14}
                      strokeWidth={2}
                      className="text-text-soft"
                    />
                  </Link>
                ))
              )}
            </div>
          </section>

          <section className="min-w-0">
            <h3 className="font-display font-bold text-base mb-2.5">
              Accesos rápidos
            </h3>
            <div className="flex flex-col gap-1.5">
              {QUICK_LINKS.map((q) => (
                <Link
                  key={q.href}
                  href={q.href}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-sm bg-surface border border-border text-text font-display font-medium text-[13px] hover:border-brand-500 transition"
                >
                  <Icon
                    name={q.icon}
                    size={14}
                    strokeWidth={2}
                    className="text-brand-700"
                  />
                  <span className="flex-1">{q.label}</span>
                  <Icon
                    name="chev-right"
                    size={12}
                    strokeWidth={2.4}
                    className="text-text-soft"
                  />
                </Link>
              ))}
            </div>

            <div className="mt-3.5 p-4 rounded-lg border border-border bg-[linear-gradient(120deg,var(--brand-50),#FFF9E6)]">
              <Badge tone="gradient" size="xs" leadingIcon="spark">
                pagina admin
              </Badge>
              <p className="mt-2 text-[13px] text-text-muted leading-relaxed">
                Gestiona productos, pedidos y el contenido del sitio desde aquí.
              </p>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
