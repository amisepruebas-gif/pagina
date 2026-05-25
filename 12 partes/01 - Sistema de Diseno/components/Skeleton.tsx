import { cn } from "@/lib/cn";
import { type CSSProperties } from "react";

export interface SkeletonProps {
  className?: string;
  style?: CSSProperties;
}

/**
 * Skeleton — bloque animado de carga.
 * Forma controlada por clases Tailwind: `w-…`, `h-…`, `rounded-…`.
 *
 * @example
 * <Skeleton className="h-4 w-32 rounded" />
 * <Skeleton className="aspect-square w-full rounded-lg" />
 */
export function Skeleton({ className, style }: SkeletonProps) {
  return <div className={cn("shimmer rounded", className)} style={style} />;
}

/** Skeleton específico de ProductCard. */
export function ProductCardSkeleton() {
  return (
    <article className="bg-surface rounded-xl border border-border p-3.5">
      <Skeleton className="aspect-square w-full rounded-lg" />
      <div className="pt-3.5 px-1 flex flex-col gap-2.5">
        <Skeleton className="h-3 w-2/5 rounded" />
        <Skeleton className="h-3.5 w-11/12 rounded" />
        <Skeleton className="h-3.5 w-3/4 rounded" />
        <Skeleton className="h-5 w-2/5 rounded mt-1" />
      </div>
    </article>
  );
}
