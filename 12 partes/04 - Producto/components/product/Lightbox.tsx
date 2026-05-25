"use client";
import { useEffect, useState } from "react";
import { IconButton, ProductImage, Icon } from "@/components";
import { cn } from "@/lib/cn";

export interface LightboxImage {
  label: string;
  accent: string;
  src?: string;
}

export interface LightboxProps {
  images: LightboxImage[];
  startIndex: number;
  onClose: () => void;
  /** Para accessible labels */
  name: string;
}

/**
 * Lightbox — overlay fullscreen para ampliar la galería.
 *
 * - Teclado: ← / → cambian imagen, Esc cierra.
 * - Click fuera del contenedor de la imagen NO cierra (solo el botón X).
 * - Body scroll bloqueado mientras está abierto.
 */
export function Lightbox({ images, startIndex, onClose, name }: LightboxProps) {
  const [i, setI] = useState(startIndex);
  const prev = () => setI((n) => (n - 1 + images.length) % images.length);
  const next = () => setI((n) => (n + 1) % images.length);

  useEffect(() => {
    const prevOv = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOv;
      window.removeEventListener("keydown", onKey);
    };
  });

  const img = images[i];

  return (
    <div role="dialog" aria-modal="true" aria-label={`Galería de ${name}`}
         className="fixed inset-0 z-[120] bg-[rgba(10,10,8,0.95)] flex flex-col
                    animate-[lb-fade_200ms_cubic-bezier(.22,1,.36,1)]">
      <div className="flex justify-between items-center px-5 py-4 text-white">
        <span className="font-mono text-xs opacity-70">{i + 1} / {images.length}</span>
        <IconButton variant="ghost" icon="x" label="Cerrar" onClick={onClose}
                    className="!text-white hover:!bg-white/10" />
      </div>

      <div className="flex-1 flex items-center justify-center p-5 relative min-h-0">
        <button onClick={prev} aria-label="Anterior" className={arrowCls + " left-4"}>
          <Icon name="arr-left" size={22} strokeWidth={2.4} />
        </button>
        <div className="w-[min(900px,90vw)] aspect-square max-h-[calc(100vh-200px)]
                        rounded-xl overflow-hidden">
          <ProductImage src={img.src} label={img.label} accent={img.accent} aspect="1/1" rounded="" />
        </div>
        <button onClick={next} aria-label="Siguiente" className={arrowCls + " right-4"}>
          <Icon name="arr-right" size={22} strokeWidth={2.4} />
        </button>
      </div>

      <div className="px-5 py-4 flex justify-center gap-2 overflow-x-auto">
        {images.map((im, idx) => (
          <button
            key={idx} onClick={() => setI(idx)}
            aria-pressed={i === idx}
            className={cn(
              "shrink-0 w-14 h-14 p-0 rounded-sm overflow-hidden cursor-pointer bg-transparent",
              idx === i ? "border-2 border-white opacity-100" : "border border-white/30 opacity-60",
            )}
          >
            <ProductImage src={im.src} label="" accent={im.accent} aspect="1/1" rounded="" />
          </button>
        ))}
      </div>

      <style jsx global>{`
        @keyframes lb-fade { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </div>
  );
}

const arrowCls =
  "absolute top-1/2 -translate-y-1/2 size-12 rounded-full bg-white/15 text-white border-0 cursor-pointer " +
  "inline-flex items-center justify-center backdrop-blur transition hover:bg-white/25";
