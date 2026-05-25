"use client";
import { useState } from "react";
import { Button, Icon, IconButton, Input } from "@/components";
import type { AppliedCoupon } from "@/lib/sample-cart";
import { VALID_COUPONS } from "@/lib/sample-cart";

export interface CouponBoxProps {
  applied: AppliedCoupon | null;
  onApply: (coupon: AppliedCoupon) => void;
  onRemove: () => void;
  /** Override del set de cupones válidos (default `VALID_COUPONS`) */
  validCoupons?: Record<string, AppliedCoupon>;
}

/**
 * CouponBox — caja colapsable para aplicar código de descuento.
 *
 * Estados: cerrada (CTA "¿Tienes un código?") · abierta (input + aplicar) ·
 * aplicada (chip de éxito con botón de quitar).
 */
export function CouponBox({
  applied, onApply, onRemove, validCoupons = VALID_COUPONS,
}: CouponBoxProps) {
  const [open, setOpen]   = useState(!!applied);
  const [code, setCode]   = useState("");
  const [error, setError] = useState("");

  if (applied) {
    return (
      <div className="flex items-center gap-2.5 px-4 py-3 rounded-md bg-brand-50 border border-brand-200">
        <span className="size-7 rounded-full shrink-0 bg-brand-500 text-white inline-flex items-center justify-center">
          <Icon name="check" size={16} strokeWidth={3} />
        </span>
        <div className="flex-1 min-w-0">
          <div className="font-display font-semibold text-[13px]">
            Cupón <span className="text-brand-700">{applied.label}</span> aplicado
          </div>
          {applied.hint && <div className="text-xs text-text-muted">{applied.hint}</div>}
        </div>
        <IconButton variant="ghost" icon="x" label="Quitar cupón" size="sm" onClick={onRemove} />
      </div>
    );
  }

  if (!open) {
    return (
      <button
        type="button" onClick={() => setOpen(true)}
        className="flex items-center gap-2 w-full px-4 py-3 min-h-12
                   bg-surface-2 border border-dashed border-border-strong rounded-md text-text
                   font-display font-semibold text-sm cursor-pointer
                   hover:border-brand-500 transition"
      >
        <Icon name="tag" size={16} strokeWidth={2} className="text-brand-700" />
        ¿Tienes un código de descuento?
      </button>
    );
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const c = validCoupons[code.trim().toUpperCase()];
    if (c) { setError(""); onApply(c); }
    else   { setError("Código inválido. Prueba con WELCOME10 o ENVIO."); }
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-2">
      <div className="flex gap-2">
        <div className="flex-1 min-w-0">
          <Input
            placeholder="Ej: WELCOME10" leadingIcon="tag"
            value={code} onChange={(e) => { setCode(e.target.value); setError(""); }}
            error={error}
          />
        </div>
        <Button type="submit">Aplicar</Button>
      </div>
      <button
        type="button" onClick={() => { setOpen(false); setCode(""); setError(""); }}
        className="self-start border-0 bg-transparent text-text-soft text-xs font-medium px-1.5 py-1 cursor-pointer"
      >
        Cancelar
      </button>
    </form>
  );
}
