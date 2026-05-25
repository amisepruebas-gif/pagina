"use client";
import { useEffect, useState, type ReactNode } from "react";
import { Button, Icon } from "@/components";
import { cn } from "@/lib/cn";

export interface LegalSection {
  id: string;
  title: string;
  content: ReactNode;
}

export interface LegalPageProps {
  title: string;
  /** Etiqueta mono encima del título */
  eyebrow?: string;
  /** Fecha legible (ej. "12 de mayo de 2026") */
  lastUpdated?: string;
  sections: LegalSection[];
  /** Renderizado del footer "¿Te quedó alguna duda?" */
  helpFooter?: ReactNode;
}

/**
 * LegalPage — shell para páginas legales/informativas.
 *
 * - Hero con fondo de gradiente sutil + fecha de actualización.
 * - Sidebar TOC en desktop (≥880px) con scroll-spy.
 * - En móvil el TOC se oculta y solo se muestra el contenido.
 *
 * @example
 * <LegalPage
 *   title="Envíos y entregas"
 *   eyebrow="Información"
 *   lastUpdated="12 de mayo de 2026"
 *   sections={[{ id: "tiempos", title: "Tiempos de entrega", content: <p>…</p> }]}
 * />
 */
export function LegalPage({
  title, eyebrow, lastUpdated, sections, helpFooter,
}: LegalPageProps) {
  const [active, setActive] = useState(sections[0]?.id);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => { for (const e of entries) if (e.isIntersecting) setActive(e.target.id); },
      { rootMargin: "-30% 0px -60% 0px" },
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [sections]);

  return (
    <>
      <section className="relative overflow-hidden border-b border-border py-14 sm:py-16
                          bg-[linear-gradient(120deg,var(--brand-50)_0%,#FFF9E6_60%,#FFE7EF_100%)]">
        <span aria-hidden className="pointer-events-none absolute -top-32 -right-16 size-[420px] rounded-full opacity-55 blur-[60px]"
              style={{ background: "var(--grad-from)" }} />
        <span aria-hidden className="pointer-events-none absolute -bottom-32 -left-10 size-[320px] rounded-full opacity-35 blur-[60px]"
              style={{ background: "var(--secondary)" }} />
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 relative max-w-[820px]">
          {eyebrow && (
            <span className="font-mono text-[12px] tracking-widest uppercase text-text-soft
                             inline-flex items-center gap-2 before:content-[''] before:w-7 before:h-px before:bg-current before:opacity-60">
              {eyebrow}
            </span>
          )}
          <h1 className={cn(
            eyebrow && "mt-3.5",
            "font-display font-bold leading-none tracking-[-0.035em]",
            "text-4xl sm:text-5xl lg:text-[clamp(36px,6vw,64px)]",
          )}>{title}</h1>
          {lastUpdated && (
            <p className="mt-4 text-sm text-text-muted inline-flex items-center gap-2">
              <Icon name="info" size={14} strokeWidth={2} className="text-brand-700" />
              Última actualización: {lastUpdated}
            </p>
          )}
        </div>
      </section>

      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-12 lg:py-14 pb-20
                      grid gap-10 lg:gap-14 grid-cols-1 lg:grid-cols-[240px_minmax(0,1fr)] items-start">
        {/* TOC sidebar */}
        <aside className="hidden lg:block sticky top-6 self-start">
          <h3 className="font-mono text-[11px] tracking-widest uppercase text-text-soft font-semibold mb-3">
            En esta página
          </h3>
          <nav className="flex flex-col gap-0.5">
            {sections.map((s) => (
              <a key={s.id} href={`#${s.id}`}
                 onClick={() => setActive(s.id)}
                 className={cn(
                   "px-3 py-2 rounded-sm no-underline text-[13px] font-display border-l-2",
                   "transition-colors duration-fast ease-out",
                   active === s.id
                     ? "text-brand-700 bg-brand-50 font-semibold border-brand-500"
                     : "text-text-muted font-medium border-transparent hover:bg-surface-2",
                 )}>
                {s.title}
              </a>
            ))}
          </nav>
        </aside>

        <main className="min-w-0 max-w-[720px]">
          {sections.map((s) => (
            <section key={s.id} id={s.id} className="scroll-mt-6 mb-12 last:mb-0">
              <h2 className="font-display font-bold leading-tight tracking-[-0.02em] mb-4
                             text-xl sm:text-2xl lg:text-[clamp(22px,3vw,28px)]">{s.title}</h2>
              <div className="text-text-muted text-base leading-relaxed">{s.content}</div>
            </section>
          ))}

          {helpFooter ?? (
            <div className="mt-16 p-6 bg-surface border border-border rounded-xl flex items-center gap-4 flex-wrap">
              <span className="size-12 rounded-full shrink-0 text-white inline-flex items-center justify-center
                               shadow-brand bg-brand-grad">
                <Icon name="info" size={22} strokeWidth={2} />
              </span>
              <div className="flex-1 min-w-[200px]">
                <div className="font-display font-bold text-base">¿Te quedó alguna duda?</div>
                <div className="mt-1 text-[13px] text-text-muted">
                  Escríbenos a soporte@pagina.com o abre un ticket desde Mi cuenta.
                </div>
              </div>
              <Button variant="secondary" trailingIcon="arr-right">Contactar</Button>
            </div>
          )}
        </main>
      </div>
    </>
  );
}

/* Helpers de contenido — facilitan escribir secciones legibles */

export function LegalP({ children }: { children: ReactNode }) {
  return <p className="mb-4">{children}</p>;
}

export function LegalList({ items }: { items: ReactNode[] }) {
  return (
    <ul className="list-none p-0 mb-4 flex flex-col gap-2">
      {items.map((it, i) => (
        <li key={i} className="flex items-start gap-2.5">
          <span className="shrink-0 size-5 rounded-full mt-1 bg-brand-50 text-brand-700 inline-flex items-center justify-center">
            <Icon name="check" size={11} strokeWidth={3} />
          </span>
          <span>{it}</span>
        </li>
      ))}
    </ul>
  );
}
