import { cn } from "@/lib/cn";

export interface LogoProps {
  /** Tamaño del símbolo en px. El texto escala proporcionalmente. */
  size?: number;
  className?: string;
}

/**
 * Logo — marca `página/`.
 * Cambia el copy aquí para personalizar.
 */
export function Logo({ size = 28, className }: LogoProps) {
  return (
    <span
      className={cn("inline-flex items-center gap-2.5 font-display font-extrabold tracking-[-0.04em]", className)}
      style={{ fontSize: size * 0.72 }}
    >
      <span
        className="inline-flex items-center justify-center rounded-full bg-brand-grad text-white font-extrabold shadow-brand"
        style={{ width: size, height: size, fontSize: size * 0.5 }}
      >
        p
      </span>
      <span>página<span className="text-brand-500">/</span></span>
    </span>
  );
}
