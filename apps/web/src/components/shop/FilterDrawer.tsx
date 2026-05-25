'use client';
import { useEffect } from 'react';
import { Button, IconButton } from '@/components/ui';
import { FilterPanel, type FilterPanelProps } from './FilterPanel';

export interface FilterDrawerProps extends FilterPanelProps {
  open: boolean;
  onClose: () => void;
  resultCount: number;
  onClear: () => void;
}

/** FilterDrawer — overlay deslizable desde abajo, mobile. */
export function FilterDrawer({
  open,
  onClose,
  resultCount,
  onClear,
  ...panel
}: FilterDrawerProps) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Filtros"
      className="fixed inset-0 z-40 lg:hidden"
    >
      <button
        type="button"
        aria-label="Cerrar filtros"
        onClick={onClose}
        className="absolute inset-0 bg-black/45 animate-[mm-fade_200ms_cubic-bezier(.22,1,.36,1)]"
      />
      <div className="absolute left-0 right-0 bottom-0 top-[60px] bg-surface rounded-t-xl flex flex-col overflow-hidden animate-[drawer-up_320ms_cubic-bezier(.22,1,.36,1)]">
        <div className="sticky top-0 z-10 bg-surface border-b border-border px-5 py-3.5 flex items-center justify-between">
          <h2 className="font-display font-bold text-lg">Filtros</h2>
          <IconButton
            variant="ghost"
            icon="x"
            label="Cerrar filtros"
            onClick={onClose}
          />
        </div>
        <div className="flex-1 overflow-y-auto px-5">
          <FilterPanel {...panel} />
        </div>
        <div className="p-4 border-t border-border bg-surface flex gap-2.5 shadow-[0_-8px_24px_-8px_rgba(0,0,0,0.08)]">
          <Button variant="secondary" onClick={onClear} className="shrink-0">
            Limpiar
          </Button>
          <Button onClick={onClose} fullWidth trailingIcon="arr-right">
            Ver {resultCount} {resultCount === 1 ? 'producto' : 'productos'}
          </Button>
        </div>
      </div>
    </div>
  );
}
