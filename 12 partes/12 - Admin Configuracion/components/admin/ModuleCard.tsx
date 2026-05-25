"use client";
import { Badge, Icon, IconButton } from "@/components";
import { MODULE_TYPES, type ViewModule } from "@/lib/admin-rest";
import { Toggle } from "./Toggle";

export interface ModuleCardProps {
  module: ViewModule;
  index: number;
  expanded: boolean;
  onToggleExpand: () => void;
  onMove: (delta: number) => void;
  onToggleVisible: () => void;
  onRemove: () => void;
  isFirst: boolean;
  isLast: boolean;
  /** Render del editor expandido del módulo. */
  children?: React.ReactNode;
}

/**
 * ModuleCard — tarjeta de un módulo en el editor de vistas.
 * Tiene flechas para mover, toggle visible/oculto y botón eliminar.
 */
export function ModuleCard({
  module, index, expanded, onToggleExpand, onMove, onToggleVisible, onRemove,
  isFirst, isLast, children,
}: ModuleCardProps) {
  const mt = MODULE_TYPES.find((x) => x.id === module.type)!;
  return (
    <div className={`bg-surface border border-border rounded-md overflow-hidden ${module.visible ? "" : "opacity-65"}`}>
      <div className={`flex items-center gap-2.5 px-3 py-2.5 ${expanded ? "border-b border-border" : ""}`}>
        <div className="inline-flex flex-col gap-0.5">
          <IconButton variant="ghost" icon="chev-down" label="Subir" size="sm" disabled={isFirst}
                      onClick={() => onMove(-1)}
                      className="!size-6 rotate-180" />
          <IconButton variant="ghost" icon="chev-down" label="Bajar" size="sm" disabled={isLast}
                      onClick={() => onMove(1)} className="!size-6" />
        </div>
        <span className="size-9 rounded-sm shrink-0 bg-brand-50 text-brand-700 inline-flex items-center justify-center">
          <Icon name={mt.icon} size={18} strokeWidth={2} />
        </span>
        <div className="flex-1 min-w-0">
          <div className="font-display font-semibold text-sm">{module.title}</div>
          <div className="text-[11px] text-text-soft inline-flex items-center gap-1.5">
            <span className="font-mono">#{index + 1}</span> · {mt.label}
            {!module.visible && <Badge tone="neutral" size="xs">Oculto</Badge>}
          </div>
        </div>
        <div className="inline-flex items-center gap-1">
          <Toggle checked={module.visible} onChange={onToggleVisible} />
          <IconButton variant="ghost" icon={expanded ? "chev-down" : "chev-right"} label="Editar" size="sm" onClick={onToggleExpand} />
          <IconButton variant="ghost" icon="x" label="Eliminar" size="sm" onClick={onRemove} className="!text-error" />
        </div>
      </div>
      {expanded && (
        <div className="p-[18px] bg-bg">{children}</div>
      )}
    </div>
  );
}
