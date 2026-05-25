import Link from "next/link";
import { Icon } from "@/components";
import { Fragment } from "react";

export type BreadcrumbItem = { label: string; href?: string };

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

/**
 * Breadcrumbs — navegación de migas.
 *
 * @example
 * <Breadcrumbs items={[
 *   { label: "Inicio", href: "/" },
 *   { label: "Tienda", href: "/shop" },
 *   { label: "Calzado" },
 * ]} />
 */
export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumbs" className="flex flex-wrap items-center gap-1.5 text-sm text-text-soft py-4">
      {items.map((it, i) => (
        <Fragment key={i}>
          {i > 0 && <Icon name="chev-right" size={12} strokeWidth={2.4} className="opacity-50" />}
          {it.href ? (
            <Link href={it.href} className="py-1 hover:text-text transition">{it.label}</Link>
          ) : (
            <span className="text-text font-medium">{it.label}</span>
          )}
        </Fragment>
      ))}
    </nav>
  );
}
