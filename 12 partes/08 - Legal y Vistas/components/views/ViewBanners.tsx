import Link from "next/link";
import { Icon } from "@/components";
import type { Banner } from "@/lib/sample-view";
import { cn } from "@/lib/cn";

export interface ViewBannersProps {
  banners: Banner[];
  /** 1, 2 o 3 columnas en desktop. Default: 2. Mobile siempre 1. */
  columns?: 1 | 2 | 3;
}

const COLS = {
  1: "grid-cols-1",
  2: "grid-cols-1 md:grid-cols-2",
  3: "grid-cols-1 md:grid-cols-3",
};

/** ViewBanners — grid de banners clickeables con fondo configurable. */
export function ViewBanners({ banners, columns = 2 }: ViewBannersProps) {
  return (
    <section className="py-8">
      <div className={cn("grid gap-4", COLS[columns])}>
        {banners.map((b, i) => (
          <Link
            key={i} href={b.href ?? "#"}
            style={{ background: b.bg ?? "linear-gradient(120deg, var(--brand-500), var(--accent-2))", color: b.color ?? "#fff" }}
            className="relative block no-underline rounded-xl overflow-hidden p-[clamp(20px,4vw,36px)]
                       transition duration-base ease-out hover:-translate-y-1 hover:shadow-lg"
          >
            <span aria-hidden
                  className="pointer-events-none absolute -top-16 -right-10 size-60 rounded-full opacity-40 blur-[60px]"
                  style={{ background: b.blob ?? "var(--accent)" }} />
            <div className="relative flex flex-col justify-between h-full"
                 style={{ aspectRatio: b.aspect ?? "21/9" }}>
              <div>
                {b.eyebrow && (
                  <span className="inline-block mb-3 px-2.5 py-1 rounded-full
                                   bg-black/20 font-mono text-[10px] tracking-[0.08em] uppercase font-bold">
                    {b.eyebrow}
                  </span>
                )}
                <h3 className="font-display font-bold leading-tight tracking-[-0.02em] text-inherit
                               text-xl sm:text-2xl lg:text-[clamp(20px,3vw,32px)]">
                  {b.title}
                </h3>
                {b.subtitle && (
                  <p className="mt-2 text-sm opacity-90 max-w-xs">{b.subtitle}</p>
                )}
              </div>
              <span className="inline-flex items-center gap-1.5 font-display font-semibold text-sm text-inherit">
                {b.cta ?? "Explorar"} <Icon name="arr-right" size={14} strokeWidth={2.4} />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
