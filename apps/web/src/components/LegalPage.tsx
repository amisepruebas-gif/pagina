import type { ReactNode } from 'react';

/** Contenedor común para las páginas legales / de políticas. */
export default function LegalPage({
  title,
  children
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <>
      <section className="relative overflow-hidden border-b border-border py-14 sm:py-16 bg-[linear-gradient(120deg,var(--brand-50)_0%,#FFF9E6_60%,#FFE7EF_100%)]">
        <span
          aria-hidden
          className="pointer-events-none absolute -top-32 -right-16 size-[420px] rounded-full opacity-55 blur-[60px]"
          style={{ background: 'var(--grad-from)' }}
        />
        <span
          aria-hidden
          className="pointer-events-none absolute -bottom-32 -left-10 size-[320px] rounded-full opacity-35 blur-[60px]"
          style={{ background: 'var(--secondary)' }}
        />
        <div className="mx-auto max-w-3xl px-4 sm:px-6 relative">
          <span className="font-mono text-[12px] tracking-widest uppercase text-text-soft inline-flex items-center gap-2 before:content-[''] before:w-7 before:h-px before:bg-current before:opacity-60">
            Información
          </span>
          <h1 className="mt-3.5 font-display font-bold leading-none tracking-[-0.035em] text-4xl sm:text-5xl lg:text-[clamp(36px,6vw,60px)]">
            {title}
          </h1>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-12 md:py-14 pb-20">
        <div className="space-y-4 text-base text-text-muted leading-relaxed [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-text [&_h2]:tracking-[-0.02em] [&_h2]:mt-9 [&_h2]:mb-1 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_a]:text-brand-700 [&_a]:font-medium [&_strong]:text-text">
          {children}
        </div>
      </div>
    </>
  );
}
