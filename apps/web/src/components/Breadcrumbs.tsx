import Link from 'next/link';

export interface Crumb {
  label: string;
  href?: string;
}

/**
 * Breadcrumbs reutilizable. El último elemento se renderiza como texto
 * (posición actual), el resto como links si tienen href.
 */
export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="text-sm text-text-soft py-4"
    >
      <ol className="flex items-center flex-wrap gap-1.5">
        {items.map((c, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={`${c.label}-${i}`} className="flex items-center gap-1.5">
              {c.href && !isLast ? (
                <Link href={c.href} className="hover:text-text transition">
                  {c.label}
                </Link>
              ) : (
                <span className={isLast ? 'text-text font-medium' : ''}>
                  {c.label}
                </span>
              )}
              {!isLast && (
                <span className="text-border-strong" aria-hidden>
                  /
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
