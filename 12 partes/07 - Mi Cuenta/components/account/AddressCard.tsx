"use client";
import { Badge, Button, Icon, type IconName } from "@/components";
import type { Address } from "@/lib/sample-account";

export interface AddressCardProps {
  address: Address;
  onEdit?: () => void;
  onDelete?: () => void;
  onMakeDefault?: () => void;
}

/**
 * AddressCard — tarjeta de una dirección guardada.
 * Resalta con borde brand si es la dirección por defecto.
 */
export function AddressCard({ address, onEdit, onDelete, onMakeDefault }: AddressCardProps) {
  const icon: IconName = address.label.toLowerCase().startsWith("oficina") ? "grid" : "shield";
  return (
    <article
      className={`bg-surface rounded-xl p-[18px] flex flex-col gap-3 relative
                  ${address.default ? "border-2 border-brand-500" : "border border-border"}`}
    >
      <div className="flex justify-between items-center gap-2 flex-wrap">
        <div className="inline-flex items-center gap-2.5">
          <span className="size-8 rounded-full bg-brand-50 text-brand-700 inline-flex items-center justify-center">
            <Icon name={icon} size={16} strokeWidth={2} />
          </span>
          <div className="font-display font-bold text-[15px]">{address.label}</div>
        </div>
        {address.default && <Badge tone="brand">Predeterminada</Badge>}
      </div>

      <div className="flex flex-col gap-1 text-sm text-text-muted">
        <div className="text-text font-medium">{address.name}</div>
        <div>{address.street}</div>
        <div>{address.city}, {address.state} {address.zip}</div>
        <div>{address.country}</div>
        <div className="mt-1 font-mono text-xs">{address.phone}</div>
      </div>

      <div className="flex gap-2 flex-wrap pt-2 border-t border-border">
        {!address.default && (
          <Button size="sm" variant="ghost" onClick={onMakeDefault}>Hacer predeterminada</Button>
        )}
        <div className="ml-auto flex gap-2">
          <Button size="sm" variant="secondary" onClick={onEdit}>Editar</Button>
          <Button size="sm" variant="ghost" onClick={onDelete} className="!text-error">Eliminar</Button>
        </div>
      </div>
    </article>
  );
}
