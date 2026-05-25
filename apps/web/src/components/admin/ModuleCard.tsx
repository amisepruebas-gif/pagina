'use client';

import { type ReactNode } from 'react';
import { Badge, Icon, IconButton, type IconName } from '@/components/ui';
import { MODULE_LABELS, type ViewModuleType } from '@/types/page-view';
import { Toggle } from './Toggle';

/** Icono representativo de cada tipo de módulo. */
export const MODULE_ICONS: Record<ViewModuleType, IconName> = {
  slider: 'refresh',
  products: 'grid',
  promo: 'bolt',
  banners: 'eye',
  categories: 'tag',
  video: 'spark'
};

export interface ModuleCardProps {
  type: ViewModuleType;
  title?: string;
  visible: boolean;
  index: number;
  total: number;
  expanded: boolean;
  onToggleExpand: () => void;
  onMove: (delta: -1 | 1) => void;
  onToggleVisible: () => void;
  onRemove: () => void;
  /** Render del editor expandido del módulo. */
  children?: ReactNode;
}

/**
 * ModuleCard — tarjeta de un módulo en el editor de vistas.
 * Flechas para mover, toggle visible/oculto y botón eliminar.
 */
export function ModuleCard({
  type,
  title,
  visible,
  index,
  total,
  expanded,
  onToggleExpand,
  onMove,
  onToggleVisible,
  onRemove,
  children
}: ModuleCardProps) {
  const isFirst = index === 0;
  const isLast = index === total - 1;
  return (
    <div
      className={`bg-surface border border-border rounded-md overflow-hidden ${
        visible ? '' : 'opacity-65'
      }`}
    >
      <div
        className={`flex items-center gap-2.5 px-3 py-2.5 ${
          expanded ? 'border-b border-border' : ''
        }`}
      >
        <div className="inline-flex flex-col gap-0.5">
          <IconButton
            variant="ghost"
            icon="chev-down"
            label="Subir"
            size="sm"
            disabled={isFirst}
            onClick={() => onMove(-1)}
            className="!size-6 rotate-180"
          />
          <IconButton
            variant="ghost"
            icon="chev-down"
            label="Bajar"
            size="sm"
            disabled={isLast}
            onClick={() => onMove(1)}
            className="!size-6"
          />
        </div>
        <span className="size-9 rounded-sm shrink-0 bg-brand-50 text-brand-700 inline-flex items-center justify-center">
          <Icon name={MODULE_ICONS[type]} size={18} strokeWidth={2} />
        </span>
        <button
          type="button"
          onClick={onToggleExpand}
          className="flex-1 min-w-0 text-left"
        >
          <div className="font-display font-semibold text-sm truncate">
            {title?.trim() || MODULE_LABELS[type]}
          </div>
          <div className="text-[11px] text-text-soft inline-flex items-center gap-1.5">
            <span className="font-mono">#{index + 1}</span> ·{' '}
            {MODULE_LABELS[type]}
            {!visible && (
              <Badge tone="neutral" size="xs">
                Oculto
              </Badge>
            )}
          </div>
        </button>
        <div className="inline-flex items-center gap-1">
          <Toggle
            checked={visible}
            onChange={onToggleVisible}
            label="Visible"
          />
          <IconButton
            variant="ghost"
            icon={expanded ? 'chev-down' : 'chev-right'}
            label="Editar"
            size="sm"
            onClick={onToggleExpand}
          />
          <IconButton
            variant="ghost"
            icon="x"
            label="Eliminar módulo"
            size="sm"
            onClick={onRemove}
            className="!text-error"
          />
        </div>
      </div>
      {expanded && <div className="p-[18px] bg-bg">{children}</div>}
    </div>
  );
}
