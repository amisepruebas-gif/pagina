"use client";
import { useState } from "react";
import { cn } from "@/lib/cn";
import type { Product } from "@/lib/ui-types";
import { Icon } from "./Icon";
import { Badge } from "./Badge";
import { Button } from "./Button";
import { IconButton } from "./IconButton";
import { Stars } from "./Stars";
import { ProductImage } from "./ProductImage";

export type ProductCardVariant =
  | "canonical"
  | "full-bleed"
  | "discount"
  | "quick-actions"
  | "minimal";

export interface ProductCardProps {
  product: Product;
  /** Estilo de la tarjeta. Default: "canonical" */
  variant?: ProductCardVariant;
  /** Handler global al click en la tarjeta */
  onSelect?: (p: Product) => void;
  /** Handler al togglear el corazón. Si no se pasa, se maneja en estado local. */
  onToggleFav?: (p: Product, fav: boolean) => void;
  /** Handler al agregar al carrito (quick-actions) */
  onAddToCart?: (p: Product, size?: string) => void;
  className?: string;
}

/* ───── helpers ───────────────────────────────────────────────────────────── */

const fmt = (n: number) =>
  "$" + n.toLocaleString("es-MX", { maximumFractionDigits: 0 });

const discountPct = (p: Product) =>
  p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : 0;

/* ───── FavButton ─────────────────────────────────────────────────────────── */

function FavButton({
  active, onClick, size = 36,
}: { active: boolean; onClick: () => void; size?: number }) {
  return (
    <button
      type="button"
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      aria-label={active ? "Quitar de favoritos" : "Agregar a favoritos"}
      style={{ width: size, height: size }}
      className={cn(
        "touch-target rounded-pill bg-white/90 backdrop-blur shadow-sm",
        "inline-flex items-center justify-center",
        "transition duration-base ease-out hover:scale-110",
        active ? "text-secondary-600" : "text-text",
      )}
    >
      <Icon name={active ? "heart-filled" : "heart"} size={Math.round(size * 0.5)} strokeWidth={2} />
    </button>
  );
}

/* ───── 1) Canonical ──────────────────────────────────────────────────────── */

function Canonical({ product: p, onToggleFav, ...rest }: ProductCardProps) {
  const [fav, setFav] = useState(p.fav ?? false);
  const d = discountPct(p);

  return (
    <article
      onClick={() => rest.onSelect?.(p)}
      className={cn(
        "group relative bg-surface rounded-xl border border-border p-3.5",
        "transition duration-base ease-out hover:-translate-y-1 hover:shadow-lg hover:border-brand-200",
        rest.className,
      )}
    >
      <div className="relative">
        <ProductImage src={p.image} label={p.label} accent={p.accent} aspect="1/1" />
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5">
          {d > 0  && <Badge tone="secondary" leadingIcon="bolt">-{d}%</Badge>}
          {p.tag  && <Badge tone="accent">{p.tag}</Badge>}
        </div>
        <div className="absolute top-2.5 right-2.5">
          <FavButton active={fav} onClick={() => { setFav(!fav); onToggleFav?.(p, !fav); }} />
        </div>
      </div>

      <div className="pt-3.5 px-1 flex flex-col gap-2">
        {p.brand && <span className="font-mono text-[11px] tracking-[0.08em] uppercase text-text-soft">{p.brand}</span>}
        <h3 className="font-display font-semibold text-base leading-snug line-clamp-2 min-h-[42px]">
          {p.name}
        </h3>
        {p.rating != null && <Stars value={p.rating} reviews={p.reviews} />}
        <div className="flex items-baseline gap-2 mt-1">
          <span className="font-display font-bold text-[22px] tracking-tight">{fmt(p.price)}</span>
          {p.oldPrice && <span className="text-sm text-text-soft line-through">{fmt(p.oldPrice)}</span>}
        </div>
      </div>
    </article>
  );
}

/* ───── 2) Full-bleed ─────────────────────────────────────────────────────── */

function FullBleed({ product: p, onToggleFav, onSelect, className }: ProductCardProps) {
  const [fav, setFav] = useState(p.fav ?? false);
  const d = discountPct(p);

  return (
    <article
      onClick={() => onSelect?.(p)}
      className={cn(
        "relative rounded-xl overflow-hidden aspect-[3/4] cursor-pointer shadow-sm",
        "transition duration-base ease-out hover:-translate-y-1 hover:shadow-lg",
        className,
      )}
    >
      <ProductImage src={p.image} label={p.label} accent={p.accent} aspect="3/4" rounded=""
                    className="absolute inset-0 !w-full !h-full" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />

      <div className="absolute top-3.5 left-3.5 right-3.5 flex justify-between">
        <div className="flex flex-col gap-1.5">
          {d > 0  && <Badge tone="gradient" leadingIcon="bolt">-{d}%</Badge>}
          {p.tag  && <Badge tone="accent">{p.tag}</Badge>}
        </div>
        <FavButton active={fav} onClick={() => { setFav(!fav); onToggleFav?.(p, !fav); }} />
      </div>

      <div className="absolute inset-x-0 bottom-0 p-5 text-white flex flex-col gap-2">
        {p.brand && <span className="font-mono text-[11px] tracking-[0.08em] uppercase opacity-85">{p.brand}</span>}
        <h3 className="font-display font-bold text-xl leading-tight">{p.name}</h3>
        <div className="flex items-center justify-between mt-1">
          <div className="flex items-baseline gap-2">
            <span className="font-display font-bold text-[22px]">{fmt(p.price)}</span>
            {p.oldPrice && <span className="text-[13px] opacity-70 line-through">{fmt(p.oldPrice)}</span>}
          </div>
          {p.rating != null && (
            <span className="inline-flex items-center gap-1 text-xs opacity-90">
              <Icon name="star-filled" size={13} strokeWidth={1.4} className="text-accent" />
              {p.rating.toFixed(1)}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

/* ───── 3) Discount ───────────────────────────────────────────────────────── */

function Discount({ product: p, onToggleFav, onSelect, className }: ProductCardProps) {
  const [fav, setFav] = useState(p.fav ?? false);
  const d = discountPct(p) || 30;
  const stock = p.stock ?? 7;
  const sold  = Math.max(0, 100 - stock * 4);

  return (
    <article
      onClick={() => onSelect?.(p)}
      className={cn(
        "relative aspect-[3/4] transition duration-base ease-out",
        className,
      )}
    >
      {/* Wrapper con el redondeo, borde y clipping. El círculo va por fuera para no recortarse. */}
      <div className="absolute inset-0 bg-surface rounded-xl border-2 border-secondary shadow-secondary overflow-hidden">
        {/* Imagen a sangre completa. */}
        <ProductImage
          src={p.image}
          label={p.label}
          accent={p.accent}
          aspect="3/4"
          rounded=""
          className="absolute inset-0 !w-full !h-full"
        />

        <div className="absolute top-2.5 left-2.5 z-20">
          <Badge tone="error" leadingIcon="bolt">Última oportunidad</Badge>
        </div>

        {/* Gradiente + textos sobre la imagen. */}
        <div
          className="absolute inset-x-0 bottom-0 z-10 px-3.5 pt-14 pb-3 text-white
                     bg-gradient-to-t from-black/85 via-black/60 to-transparent"
        >
          <div className="pr-12 flex flex-col gap-1.5">
            {p.brand && (
              <span className="font-mono text-[10px] tracking-[0.08em] uppercase text-white/70">
                {p.brand}
              </span>
            )}
            <h3 className="font-display font-semibold text-[15px] leading-snug line-clamp-2 drop-shadow-sm">
              {p.name}
            </h3>
            {p.rating != null && <Stars value={p.rating} reviews={p.reviews} />}

            <div className="flex items-end gap-2 mt-0.5">
              <span className="font-display font-extrabold text-[24px] text-white tracking-[-0.03em] leading-none drop-shadow">
                {fmt(p.price)}
              </span>
              {p.oldPrice && (
                <div className="flex flex-col mb-0.5">
                  <span className="text-[12px] text-white/65 line-through leading-tight">
                    {fmt(p.oldPrice)}
                  </span>
                  <span className="text-[10px] text-accent font-semibold leading-tight">
                    Ahorras {fmt(p.oldPrice - p.price)}
                  </span>
                </div>
              )}
            </div>

            <div className="mt-1">
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-accent font-semibold">
                  ¡Solo quedan {stock}!
                </span>
                <span className="text-white/70">Vendidos {sold}</span>
              </div>
              <div className="h-1.5 rounded-full bg-white/25 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-secondary to-accent"
                  style={{ width: `${sold}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-3 right-3 z-20">
          <FavButton
            active={fav}
            onClick={() => {
              setFav(!fav);
              onToggleFav?.(p, !fav);
            }}
            size={36}
          />
        </div>
      </div>

      {/* Círculo de descuento — fuera del wrapper con overflow-hidden, sobresale del card como antes. */}
      <div className="absolute -top-4 -right-2.5 z-30 size-[78px] rounded-full bg-gradient-to-br from-secondary to-[#FF8FB1]
                      text-white flex flex-col items-center justify-center font-display font-extrabold
                      shadow-secondary border-[3px] border-surface animate-wiggle origin-center">
        <span className="text-2xl leading-none tracking-tight">-{d}%</span>
        <span className="text-[9px] tracking-widest uppercase mt-0.5">OFF</span>
      </div>
    </article>
  );
}

/* ───── 4) Quick actions ─────────────────────────────────────────────────────
   - Desktop (hover-capable): overlay sobre la imagen al hacer hover.
   - Mobile / touch (pointer: coarse): el overlay se oculta y la CTA queda
     visible siempre debajo del precio. Las clases `.qa-hover-only` y
     `.qa-touch-only` controlan la conmutación desde globals.css.
*/

function QuickActions({ product: p, onToggleFav, onAddToCart, onSelect, className }: ProductCardProps) {
  const [fav, setFav] = useState(p.fav ?? false);
  const [added, setAdded] = useState(false);
  const d = discountPct(p);

  const add = (e: React.MouseEvent, size?: string) => {
    e.stopPropagation();
    onAddToCart?.(p, size);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <article
      onClick={() => onSelect?.(p)}
      className={cn(
        "group relative bg-surface rounded-xl border border-border p-3.5",
        "transition duration-base ease-out hover:-translate-y-1 hover:shadow-lg hover:border-brand-300",
        className,
      )}
    >
      <div className="relative overflow-hidden rounded-lg">
        <ProductImage src={p.image} label={p.label} accent={p.accent} aspect="1/1" />
        {d > 0 && (
          <div className="absolute top-2.5 left-2.5">
            <Badge tone="secondary" leadingIcon="bolt">-{d}%</Badge>
          </div>
        )}
        <div className="absolute top-2.5 right-2.5">
          <FavButton active={fav} onClick={() => { setFav(!fav); onToggleFav?.(p, !fav); }} />
        </div>

        {/* hover overlay (desktop only) */}
        <div className="qa-hover-only absolute inset-x-3 bottom-3 flex flex-col gap-1.5
                        translate-y-[calc(100%+12px)] opacity-0
                        transition duration-base ease-out
                        group-hover:translate-y-0 group-hover:opacity-100">
          {p.sizes && p.sizes.length > 0 && (
            <div className="flex gap-1.5 p-1.5 bg-white/90 backdrop-blur rounded-pill shadow-sm justify-center">
              {p.sizes.map((s) => (
                <button key={s} type="button" onClick={(e) => add(e, s)}
                  className="size-8 rounded-full font-display font-semibold text-xs text-text
                             hover:bg-brand-500 hover:text-white transition duration-fast ease-out">
                  {s}
                </button>
              ))}
            </div>
          )}
          <div className="flex gap-1.5">
            <Button leadingIcon={added ? "check" : "cart"} fullWidth onClick={(e) => add(e)}>
              {added ? "¡Agregado!" : "Agregar al carrito"}
            </Button>
            <IconButton icon="eye" label="Vista rápida" />
          </div>
        </div>
      </div>

      <div className="pt-3.5 px-1 flex flex-col gap-1.5">
        {p.brand && <span className="font-mono text-[11px] tracking-[0.08em] uppercase text-text-soft">{p.brand}</span>}
        <h3 className="font-display font-semibold text-base leading-snug line-clamp-2 min-h-[42px]">{p.name}</h3>
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-display font-bold text-xl tracking-tight">{fmt(p.price)}</span>
            {p.oldPrice && <span className="text-[13px] text-text-soft line-through">{fmt(p.oldPrice)}</span>}
          </div>
          {p.rating != null && <Stars value={p.rating} showValue={false} size={12} />}
        </div>

        {/* touch-only CTA — visible always on coarse pointer */}
        <div className="qa-touch-only gap-1.5 mt-2">
          <Button fullWidth leadingIcon={added ? "check" : "cart"} onClick={(e) => add(e)}>
            {added ? "¡Agregado!" : "Agregar"}
          </Button>
          <IconButton icon="eye" label="Vista rápida" />
        </div>
      </div>
    </article>
  );
}

/* ───── 5) Minimal ────────────────────────────────────────────────────────── */

function Minimal({ product: p, onToggleFav, onSelect, className }: ProductCardProps) {
  const [fav, setFav] = useState(p.fav ?? false);

  return (
    <article
      onClick={() => onSelect?.(p)}
      className={cn("group relative cursor-pointer", className)}
    >
      <div className="relative overflow-hidden rounded-lg">
        <div className="transition duration-slow ease-out group-hover:scale-[1.04]">
          <ProductImage src={p.image} label={p.label} accent={p.accent} aspect="1/1" />
        </div>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); setFav(!fav); onToggleFav?.(p, !fav); }}
          aria-label={fav ? "Quitar de favoritos" : "Agregar a favoritos"}
          className={cn(
            "touch-target absolute top-1.5 right-1.5 size-9 inline-flex items-center justify-center",
            "rounded-full bg-white/85 backdrop-blur transition duration-fast ease-out",
            fav ? "text-secondary-600" : "text-text",
          )}
        >
          <Icon name={fav ? "heart-filled" : "heart"} size={20} strokeWidth={2} />
        </button>
      </div>
      <div className="pt-2.5 px-0.5 flex justify-between items-baseline gap-2.5">
        <h3 className="text-sm font-medium leading-snug line-clamp-1">{p.name}</h3>
        <span className="font-display font-bold text-sm whitespace-nowrap">{fmt(p.price)}</span>
      </div>
    </article>
  );
}

/* ───── Switch ────────────────────────────────────────────────────────────── */

/**
 * ProductCard — tarjeta de producto con 5 variantes.
 *
 * @example
 * <ProductCard variant="canonical"     product={p} />
 * <ProductCard variant="full-bleed"    product={p} />
 * <ProductCard variant="discount"      product={p} />
 * <ProductCard variant="quick-actions" product={p} onAddToCart={…} />
 * <ProductCard variant="minimal"       product={p} />
 */
export function ProductCard(props: ProductCardProps) {
  const v = props.variant ?? "canonical";
  if (v === "full-bleed")    return <FullBleed    {...props} />;
  if (v === "discount")      return <Discount     {...props} />;
  if (v === "quick-actions") return <QuickActions {...props} />;
  if (v === "minimal")       return <Minimal      {...props} />;
  return <Canonical {...props} />;
}
