import { Button, Icon } from "@/components";

interface EmptyStateProps {
  onClear: () => void;
}

/**
 * EmptyState — cuando los filtros no devuelven ningún producto.
 * CTA principal: limpiar filtros.
 */
export function EmptyState({ onClear }: EmptyStateProps) {
  return (
    <div className="py-20 px-6 text-center border-2 border-dashed border-border
                    rounded-xl bg-surface">
      <span className="inline-flex items-center justify-center size-[72px] rounded-full
                       bg-brand-50 text-brand-700 mb-5">
        <Icon name="grid" size={32} strokeWidth={1.6} />
      </span>
      <h3 className="font-display font-bold text-[26px] tracking-tight mb-2">
        Sin coincidencias.
      </h3>
      <p className="text-text-muted max-w-sm mx-auto mb-6 text-[15px] leading-relaxed">
        Tus filtros son muy específicos. Prueba relajar alguno o limpia todos
        para ver el catálogo completo.
      </p>
      <Button leadingIcon="refresh" onClick={onClear}>Limpiar filtros</Button>
    </div>
  );
}
