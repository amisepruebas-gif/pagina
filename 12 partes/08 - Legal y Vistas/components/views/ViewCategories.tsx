import Link from "next/link";
import { ProductImage } from "@/components";
import type { Category } from "@/lib/sample-view";

export interface ViewCategoriesProps {
  eyebrow?: string;
  title: string;
  categories: Category[];
}

/**
 * ViewCategories — grid visual 2/3/6 columnas con imagen de placeholder
 * accent-tinted + overlay oscuro + nombre + conteo.
 */
export function ViewCategories({ eyebrow, title, categories }: ViewCategoriesProps) {
  return (
    <section className="py-12">
      <div className="mb-6">
        {eyebrow && (
          <span className="font-mono text-[12px] tracking-widest uppercase text-text-soft
                           inline-flex items-center gap-2 before:content-[''] before:w-7 before:h-px before:bg-current before:opacity-60">
            {eyebrow}
          </span>
        )}
        <h2 className={`${eyebrow ? "mt-3" : ""} font-display font-bold leading-[1.05] tracking-[-0.03em]
                        text-3xl sm:text-4xl lg:text-[clamp(28px,4vw,44px)]`}>
          {title}
        </h2>
      </div>
      <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
        {categories.map((c, i) => (
          <Link
            key={c.label} href={c.href ?? "#"}
            className="relative aspect-[3/4] overflow-hidden rounded-xl no-underline border border-border block
                       transition duration-base ease-out hover:-translate-y-1 hover:shadow-lg"
          >
            <ProductImage label={`CAT ${String.fromCharCode(65 + i)}`} accent={c.accent} aspect="3/4" rounded=""
                          className="absolute inset-0 !w-full !h-full" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute inset-0 p-4 flex flex-col justify-end text-white">
              <h3 className="font-display font-bold text-lg tracking-[-0.015em]">{c.label}</h3>
              {c.count != null && <div className="text-xs opacity-85 mt-0.5">{c.count} productos</div>}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
