"use client";
import Link from "next/link";
import { Badge, Button, Icon, IconButton, Input, Select } from "@/components";
import { ADMIN_PRODUCTS, fmtMx, type AdminProduct } from "@/lib/admin-catalog";
import { DataTable } from "./DataTable";
import { StockBadge } from "./StockBadge";

interface ProductsTableProps {
  products?: AdminProduct[];
  page?: number;
  pages?: number;
  onPageChange?: (p: number) => void;
}

/**
 * ProductsTable — tabla de productos del admin con filtros, paginación
 * y banner de stock bajo. Reusa el `DataTable` genérico.
 */
export function ProductsTable({
  products = ADMIN_PRODUCTS, page = 1, pages = 4, onPageChange,
}: ProductsTableProps) {
  const lowStock = products.filter((p) => p.stock <= 10);

  return (
    <div className="p-6 flex flex-col gap-4">
      {lowStock.length > 0 && (
        <div className="px-4 py-3.5 rounded-md bg-warning/[0.12] border border-warning/30
                        flex items-center gap-3 flex-wrap">
          <span className="size-9 rounded-full shrink-0 bg-warning text-white inline-flex items-center justify-center">
            <Icon name="warn" size={18} strokeWidth={2.4} />
          </span>
          <div className="flex-1 min-w-[200px]">
            <div className="font-display font-semibold text-sm">
              Atención: {lowStock.length} productos con stock bajo
            </div>
            <div className="text-xs text-text-muted">
              Refuerza el inventario o ajusta la visibilidad para evitar quedarte sin stock.
            </div>
          </div>
          <Button size="sm" variant="secondary">Ver lista</Button>
        </div>
      )}

      <div className="flex gap-2.5 flex-wrap items-center p-3 bg-surface border border-border rounded-md">
        <div className="flex-1 min-w-[200px] max-w-[320px]">
          <Input leadingIcon="search" placeholder="Buscar por nombre o SKU…" className="!h-9" />
        </div>
        <div className="w-[180px]">
          <Select options={["Todas las categorías", "Ropa", "Calzado", "Accesorios", "Electrónica"]} className="!h-9" />
        </div>
        <div className="w-[180px]">
          <Select options={["Estado: todos", "Activos", "Inactivos", "Stock bajo"]} className="!h-9" />
        </div>
        <Button size="sm" variant="ghost" leadingIcon="bolt">Filtros</Button>
      </div>

      <DataTable<AdminProduct>
        columns={[
          { key: "name", label: "Producto", render: (r) => (
            <div className="flex items-center gap-2.5">
              <span className="size-9 shrink-0 rounded-sm overflow-hidden inline-block"
                    style={{ background: r.accent }} />
              <div className="min-w-0">
                <div className="font-display font-semibold truncate max-w-[240px]">{r.name}</div>
                <div className="text-[11px] text-text-soft inline-flex gap-1.5 items-center">
                  {r.featured && <Badge tone="brand" size="xs">★ Destacado</Badge>}
                  {r.isNew && <Badge tone="accent" size="xs">Nuevo</Badge>}
                  {!r.active && <Badge tone="neutral" size="xs">Inactivo</Badge>}
                </div>
              </div>
            </div>
          )},
          { key: "sku", label: "SKU", render: (r) => <code className="font-mono text-xs">{r.sku}</code> },
          { key: "category", label: "Categoría", render: (r) => <span className="text-text-muted">{r.category}</span> },
          { key: "price", label: "Precio", align: "right",
            render: (r) => (
              <div className="text-right">
                <div className="font-display font-bold">{fmtMx(r.price)}</div>
                {r.oldPrice && <div className="text-[11px] text-text-soft line-through">{fmtMx(r.oldPrice)}</div>}
              </div>
            )},
          { key: "stock", label: "Stock", align: "center", render: (r) => <StockBadge stock={r.stock} /> },
          { key: "actions", label: "Acciones", align: "right", width: "140px", render: (r) => (
            <div className="inline-flex gap-1">
              <IconButton variant="ghost" icon="eye" label="Vista previa" size="sm" />
              <Link href={`/admin/productos/${r.id}`}>
                <IconButton variant="ghost" icon="grid" label="Editar" size="sm" />
              </Link>
              <IconButton variant="ghost" icon="x" label="Eliminar" size="sm" className="!text-error" />
            </div>
          )},
        ]}
        rows={products}
        pagination={{
          page, pages, from: 1, to: products.length, total: 24,
          onPrev: () => onPageChange?.(Math.max(1, page - 1)),
          onNext: () => onPageChange?.(Math.min(pages, page + 1)),
        }}
      />
    </div>
  );
}
