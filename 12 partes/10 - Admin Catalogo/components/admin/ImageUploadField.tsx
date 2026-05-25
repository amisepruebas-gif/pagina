"use client";
import { useRef, useState } from "react";
import { Icon } from "@/components";
import { cn } from "@/lib/cn";

export type UploadedImage = { url: string; name?: string };

export interface ImageUploadFieldProps {
  label?: string;
  value: UploadedImage | null;
  onChange: (v: UploadedImage | null) => void;
  hint?: string;
  /** CSS aspect-ratio (`"1/1"`, `"3/4"`, etc.) */
  aspect?: string;
  /** `accept` del input. Default `"image/*"` */
  accept?: string;
}

/**
 * ImageUploadField — campo para subir una imagen desde el equipo.
 *
 * - Click o drag&drop para cargar.
 * - Preview con botón de quitar.
 * - Genera un `object URL` local; en producción reemplaza por upload al CDN.
 */
export function ImageUploadField({
  label, value, onChange, hint, aspect = "1/1", accept = "image/*",
}: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = (file?: File) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    onChange({ url, name: file.name });
  };

  return (
    <div>
      {label && (
        <div className="font-display font-semibold text-[13px] mb-1.5">{label}</div>
      )}
      <div
        role="button" tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") inputRef.current?.click(); }}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files?.[0]); }}
        style={{ aspectRatio: aspect }}
        className={cn(
          "relative flex items-center justify-center w-full max-w-[280px] rounded-md overflow-hidden cursor-pointer",
          "transition-colors duration-fast ease-out",
          value?.url ? "bg-surface" : (dragOver ? "bg-brand-50" : "bg-surface-2"),
          `border-2 border-dashed ${dragOver ? "border-brand-500" : "border-border-strong"}`,
        )}
      >
        {value?.url ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value.url} alt={value.name ?? ""} className="w-full h-full object-cover block" />
            <div className="absolute inset-0 flex items-end p-2.5 gap-2
                            bg-[linear-gradient(180deg,transparent_50%,rgba(0,0,0,0.55))]">
              <span className="text-white text-[11px] font-mono flex-1 truncate">
                {value.name ?? "Imagen cargada"}
              </span>
              <button
                type="button" aria-label="Quitar imagen"
                onClick={(e) => { e.stopPropagation(); onChange(null); }}
                className="size-8 p-0 rounded-full bg-white/90 border-0 cursor-pointer text-text
                           inline-flex items-center justify-center"
              >
                <Icon name="x" size={14} strokeWidth={2.4} />
              </button>
            </div>
          </>
        ) : (
          <div className="text-center p-4 pointer-events-none">
            <span className={cn(
              "inline-flex items-center justify-center size-12 rounded-full mb-2 shadow-xs",
              dragOver ? "bg-brand-500 text-white" : "bg-surface text-brand-700",
            )}>
              <Icon name="plus" size={22} strokeWidth={2} />
            </span>
            <div className="font-display font-semibold text-[13px] text-text">
              Subir desde el equipo
            </div>
            <div className="mt-1 text-[11px] text-text-soft">o arrastra una imagen aquí</div>
          </div>
        )}
        <input
          ref={inputRef} type="file" accept={accept}
          onChange={(e) => handleFile(e.target.files?.[0] ?? undefined)}
          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
        />
      </div>
      {hint && <div className="mt-1.5 text-xs text-text-soft">{hint}</div>}
    </div>
  );
}
