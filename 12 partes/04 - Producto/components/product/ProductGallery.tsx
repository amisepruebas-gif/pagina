"use client";
import { useEffect, useRef, useState } from "react";
import { ProductImage, Icon } from "@/components";
import { Lightbox, type LightboxImage } from "./Lightbox";
import { cn } from "@/lib/cn";

export interface ProductGalleryProps {
  images: LightboxImage[];
  /** Para alt text de accesibilidad */
  name: string;
}

/**
 * ProductGallery — galería del producto.
 *
 * - **Desktop**: tira vertical de miniaturas + imagen principal con
 *   zoom en hover (transform: scale + translate siguiendo el cursor).
 * - **Mobile**: carrusel horizontal con scroll-snap y dots indicadores.
 * - Click en la imagen abre el `<Lightbox/>` con navegación por teclado.
 */
export function ProductGallery({ images, name }: ProductGalleryProps) {
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);
  const [lightbox, setLightbox] = useState(false);
  const railRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = railRef.current;
    if (!el) return;
    const onScroll = () => {
      const w = el.clientWidth;
      const idx = Math.round(el.scrollLeft / w);
      if (idx !== active && idx >= 0 && idx < images.length) setActive(idx);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [active, images.length]);

  const goTo = (i: number) => {
    setActive(i);
    railRef.current?.scrollTo({ left: railRef.current.clientWidth * i, behavior: "smooth" });
  };

  return (
    <div className="min-w-0">
      {/* Desktop */}
      <div className="hidden lg:grid grid-cols-[80px_1fr] gap-4">
        <div className="flex flex-col gap-2.5 max-h-[600px] overflow-y-auto pb-1">
          {images.map((img, i) => (
            <button
              key={i} type="button"
              onClick={() => setActive(i)}
              aria-label={`Ver imagen ${i + 1}`}
              aria-pressed={active === i}
              className={cn(
                "relative size-20 p-0 rounded-md overflow-hidden cursor-pointer bg-transparent shrink-0",
                "transition-colors duration-fast ease-out",
                active === i ? "border-2 border-brand-500" : "border-[1.5px] border-border",
              )}
            >
              <ProductImage src={img.src} label={img.label} accent={img.accent} aspect="1/1" rounded="" />
            </button>
          ))}
        </div>

        <div
          role="button"
          tabIndex={0}
          aria-label="Ampliar imagen"
          onClick={() => setLightbox(true)}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setLightbox(true); }}
          onMouseMove={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            setZoom({
              x: ((e.clientX - r.left) / r.width) * 100,
              y: ((e.clientY - r.top)  / r.height) * 100,
            });
          }}
          onMouseLeave={() => setZoom(null)}
          className="relative aspect-square max-h-[600px] rounded-xl overflow-hidden
                     border border-border cursor-zoom-in"
        >
          <div
            style={{
              transform: zoom
                ? `scale(1.8) translate(${(50 - zoom.x) * 0.6}%, ${(50 - zoom.y) * 0.6}%)`
                : "scale(1)",
              transformOrigin: zoom ? `${zoom.x}% ${zoom.y}%` : "center",
            }}
            className={cn("absolute inset-0", !zoom && "transition-transform duration-base ease-out")}
          >
            <ProductImage
              src={images[active].src} label={images[active].label}
              accent={images[active].accent} aspect="1/1" rounded=""
            />
          </div>
          <span className="absolute bottom-3 right-3 inline-flex items-center gap-1 px-2.5 py-1.5
                           rounded-pill bg-white/90 text-text font-mono text-[11px] tracking-wider
                           uppercase font-semibold shadow-xs">
            <Icon name="search" size={12} strokeWidth={2} /> Ver grande
          </span>
        </div>
      </div>

      {/* Mobile */}
      <div className="lg:hidden">
        <div
          ref={railRef}
          onClick={() => setLightbox(true)}
          className="flex overflow-x-auto snap-x snap-mandatory rounded-xl border border-border cursor-zoom-in
                     [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {images.map((img, i) => (
            <div key={i} className="flex-[0_0_100%] aspect-square snap-start [scroll-snap-stop:always]">
              <ProductImage src={img.src} label={img.label} accent={img.accent} aspect="1/1" rounded="" />
            </div>
          ))}
        </div>

        <div className="flex justify-center gap-1.5 mt-3">
          {images.map((_, i) => (
            <button
              key={i} onClick={() => goTo(i)}
              aria-label={`Ir a imagen ${i + 1}`}
              className="min-w-[22px] h-[22px] p-0 border-0 bg-transparent inline-flex items-center justify-center cursor-pointer"
            >
              <span className={cn(
                "h-2 rounded-full transition-all duration-base ease-out",
                i === active ? "w-5 bg-brand-500" : "w-2 bg-border-strong",
              )} />
            </button>
          ))}
        </div>
      </div>

      {lightbox && (
        <Lightbox images={images} startIndex={active} onClose={() => setLightbox(false)} name={name} />
      )}
    </div>
  );
}
