import Image from "next/image";
import { cn } from "@/lib/cn";

export interface ProductImageProps {
  /** URL real. Si está, ignora el placeholder */
  src?: string;
  /** Texto monospace cuando no hay imagen */
  label?: string;
  /** Hex para el blob de acento */
  accent?: string;
  /** Aspect ratio CSS (`1/1`, `3/4`, `4/5`) */
  aspect?: `${number}/${number}`;
  rounded?: string;
  className?: string;
  alt?: string;
}

/**
 * ProductImage — slot para imagen del producto.
 * Sin `src` muestra placeholder rayado con etiqueta monospace.
 *
 * @example
 * <ProductImage src={p.image} alt={p.name} aspect="1/1" />
 * <ProductImage label="TENIS · M" accent="#00D97A" />
 */
export function ProductImage({
  src, label = "PRODUCTO", accent, aspect = "1/1", rounded = "rounded-lg", className, alt,
}: ProductImageProps) {
  const [w, h] = aspect.split("/").map(Number);

  if (src) {
    return (
      <div className={cn("relative w-full overflow-hidden", rounded, className)} style={{ aspectRatio: aspect }}>
        <Image src={src} alt={alt ?? label} fill className="object-cover" sizes="(max-width: 768px) 50vw, 25vw" />
      </div>
    );
  }

  return (
    <div className={cn("ph-stripes relative w-full flex items-center justify-center overflow-hidden", rounded, className)}
         style={{ aspectRatio: aspect }}>
      {accent && (
        <span aria-hidden className="absolute pointer-events-none rounded-full blur-[60px] opacity-55"
              style={{ width: "60%", height: "60%", background: accent, top: "10%", left: "20%" }} />
      )}
      <div className="absolute inset-3 border border-dashed border-black/10 dark:border-white/10 rounded-[14px] flex items-center justify-center">
        <span className="font-mono text-[11px] tracking-[0.12em] uppercase text-text-soft">{label}</span>
      </div>
    </div>
  );
}
