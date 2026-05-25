import Link from "next/link";
import { Fragment, type ReactNode } from "react";
import { Icon } from "@/components";

export type AdminCrumb = { label: string; href?: string };

export interface AdminPageHeaderProps {
  title: string;
  description?: string;
  breadcrumb?: AdminCrumb[];
  action?: ReactNode;
}

/**
 * AdminPageHeader — header de cada sección del admin:
 * breadcrumb pequeño · título · descripción · acción primaria.
 */
export function AdminPageHeader({
  title, description, breadcrumb, action,
}: AdminPageHeaderProps) {
  return (
    <div className="px-6 py-5 border-b border-border bg-surface">
      {breadcrumb && breadcrumb.length > 0 && (
        <nav aria-label="Breadcrumb"
             className="inline-flex items-center gap-1.5 text-xs text-text-soft mb-2 flex-wrap">
          {breadcrumb.map((b, i) => (
            <Fragment key={i}>
              {i > 0 && <Icon name="chev-right" size={11} strokeWidth={2.4} className="opacity-50" />}
              {b.href ? (
                <Link href={b.href} className="text-inherit no-underline hover:text-text">{b.label}</Link>
              ) : (
                <span className="text-text">{b.label}</span>
              )}
            </Fragment>
          ))}
        </nav>
      )}
      <div className="flex justify-between items-end gap-3 flex-wrap">
        <div>
          <h1 className="font-display font-bold leading-tight tracking-[-0.02em]
                         text-xl sm:text-2xl lg:text-[clamp(22px,3vw,28px)]">
            {title}
          </h1>
          {description && (
            <p className="mt-1.5 text-text-muted text-sm max-w-2xl">{description}</p>
          )}
        </div>
        {action}
      </div>
    </div>
  );
}
