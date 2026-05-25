"use client";
import { type ReactNode } from "react";
import { Button, IconButton, Icon, type IconName } from "@/components";

export interface DataTableColumn<T> {
  key: string;
  label: string;
  align?: "left" | "right" | "center";
  /** Ancho CSS (ej. "120px") */
  width?: string;
  /** Renderizado custom de la celda */
  render?: (row: T) => ReactNode;
}

export interface DataTablePagination {
  page: number;
  pages: number;
  from: number;
  to: number;
  total: number;
  onPrev?: () => void;
  onNext?: () => void;
}

export interface DataTableEmpty {
  icon?: IconName;
  title?: string;
  body?: string;
  cta?: string;
  onCta?: () => void;
}

export interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  rows: T[];
  empty?: DataTableEmpty;
  pagination?: DataTablePagination;
}

/**
 * DataTable — tabla reutilizable del admin.
 *
 * - Encabezado mono, filas con hover, scroll horizontal en móvil.
 * - Estado vacío con icono + título + body + CTA.
 * - Paginación opcional con botones prev/next.
 *
 * @example
 * <DataTable
 *   columns={[
 *     { key: "id", label: "Pedido", render: r => <code>{r.id}</code> },
 *     { key: "total", label: "Total", align: "right" },
 *   ]}
 *   rows={orders}
 *   pagination={{ page, pages, from, to, total, onPrev, onNext }}
 * />
 */
export function DataTable<T extends { id?: string | number }>({
  columns, rows, empty, pagination,
}: DataTableProps<T>) {
  if (!rows || rows.length === 0) {
    return (
      <div className="bg-surface border border-border rounded-lg py-14 px-5 text-center">
        <div className="inline-flex items-center justify-center size-14 rounded-full bg-surface-2 text-text-soft mb-3">
          <Icon name={empty?.icon ?? "grid"} size={24} strokeWidth={1.6} />
        </div>
        <div className="font-display font-semibold text-base">{empty?.title ?? "Sin datos"}</div>
        <div className="mt-1 text-text-muted text-[13px]">
          {empty?.body ?? "Cuando haya información aparecerá aquí."}
        </div>
        {empty?.cta && (
          <div className="mt-4">
            <Button size="sm" leadingIcon="plus" onClick={empty.onCta}>{empty.cta}</Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-surface border border-border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse min-w-[600px] text-[13px]">
          <thead>
            <tr className="bg-surface-2">
              {columns.map((c) => (
                <th key={c.key} scope="col"
                    style={{ textAlign: c.align ?? "left", width: c.width }}
                    className="px-3.5 py-2.5 font-display font-semibold text-[11px] tracking-[0.06em] uppercase
                               text-text-soft border-b border-border">
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={row.id ?? i}
                  className={`hover:bg-surface-2 transition-colors duration-fast ease-out
                              ${i === rows.length - 1 ? "" : "border-b border-border"}`}>
                {columns.map((c) => (
                  <td key={c.key}
                      style={{ textAlign: c.align ?? "left" }}
                      className="px-3.5 py-3 text-text align-middle">
                    {c.render ? c.render(row) : (row as any)[c.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {pagination && (
        <div className="px-4 py-2.5 border-t border-border flex justify-between items-center flex-wrap gap-2.5
                        text-[13px] text-text-muted">
          <span>
            Mostrando {pagination.from}–{pagination.to} de {pagination.total.toLocaleString("es-MX")}
          </span>
          <div className="flex gap-1.5">
            <IconButton variant="secondary" icon="arr-left" label="Anterior" size="sm"
                        disabled={pagination.page <= 1} onClick={pagination.onPrev} />
            <span className="px-3 min-h-8 rounded-sm bg-surface-2 inline-flex items-center font-display font-semibold text-[13px]">
              {pagination.page} / {pagination.pages}
            </span>
            <IconButton variant="secondary" icon="arr-right" label="Siguiente" size="sm"
                        disabled={pagination.page >= pagination.pages} onClick={pagination.onNext} />
          </div>
        </div>
      )}
    </div>
  );
}
