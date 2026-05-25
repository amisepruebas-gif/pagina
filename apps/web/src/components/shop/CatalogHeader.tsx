interface CatalogHeaderProps {
  title: string;
  description?: string;
  count: number;
}

interface SearchHeaderProps {
  query: string;
  count: number;
}

/** CatalogHeader — encabezado de la página de catálogo. */
export function CatalogHeader({ title, description, count }: CatalogHeaderProps) {
  return (
    <div className="py-2">
      <h1 className="font-display font-bold leading-none tracking-[-0.035em] text-3xl sm:text-5xl lg:text-[clamp(32px,5vw,56px)]">
        {title}
      </h1>
      {description && (
        <p className="mt-3 text-text-muted text-sm sm:text-base max-w-xl">
          {description}
        </p>
      )}
      <p className="mt-2 text-text-soft text-[13px]">
        {count.toLocaleString('es-MX')} {count === 1 ? 'resultado' : 'resultados'}
      </p>
    </div>
  );
}

/** SearchHeader — encabezado de la página de búsqueda. */
export function SearchHeader({ query, count }: SearchHeaderProps) {
  return (
    <div className="py-2">
      <span className="font-mono text-[12px] tracking-widest uppercase text-text-soft inline-flex items-center gap-2 before:content-[''] before:w-7 before:h-px before:bg-current before:opacity-60">
        Búsqueda
      </span>
      <h1 className="mt-3 font-display font-bold leading-tight tracking-[-0.03em] text-3xl sm:text-4xl lg:text-[clamp(28px,4.5vw,44px)] flex flex-wrap items-baseline gap-3">
        <span>Resultados para</span>
        <span className="bg-brand-grad bg-clip-text text-transparent">
          &ldquo;{query}&rdquo;
        </span>
      </h1>
      <p className="mt-2 text-text-soft text-[13px]">
        {count.toLocaleString('es-MX')} {count === 1 ? 'resultado' : 'resultados'}
      </p>
    </div>
  );
}
