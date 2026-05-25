import { type ReactNode } from 'react';
import { Icon, type IconName } from '@/components/ui';

export interface AuthLayoutProps {
  title: string;
  subtitle?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
}

const HIGHLIGHTS: { icon: IconName; text: string }[] = [
  { icon: 'truck', text: 'Envío rápido a todo México' },
  { icon: 'shield', text: 'Pago seguro con encriptación SSL' },
  { icon: 'refresh', text: 'Devoluciones en 30 días' }
];

/** AuthLayout — card dividida: panel de marca + formulario. */
export function AuthLayout({ title, subtitle, children, footer }: AuthLayoutProps) {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-10 md:py-16">
      <div className="grid md:grid-cols-2 rounded-2xl overflow-hidden border border-border shadow-lg bg-surface">
        <aside className="relative overflow-hidden text-white p-8 md:p-10 hidden md:flex flex-col justify-between bg-[linear-gradient(135deg,var(--brand-500)_0%,var(--brand-700)_50%,var(--accent-2)_100%)]">
          <span
            aria-hidden
            className="pointer-events-none absolute -top-20 -right-28 size-[360px] rounded-full opacity-50 blur-[60px]"
            style={{ background: 'var(--accent)' }}
          />
          <span
            aria-hidden
            className="pointer-events-none absolute -bottom-24 -left-16 size-[280px] rounded-full opacity-45 blur-[60px]"
            style={{ background: 'var(--secondary)' }}
          />
          <span
            aria-hidden
            className="absolute inset-0 opacity-[0.12]"
            style={{
              backgroundImage:
                'radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)',
              backgroundSize: '24px 24px'
            }}
          />

          <div className="relative">
            <span className="inline-block px-3.5 py-1.5 rounded-full bg-black/20 text-accent font-mono text-[11px] tracking-widest uppercase font-semibold">
              <Icon
                name="spark"
                size={12}
                strokeWidth={2.4}
                className="mr-1.5 align-[-2px] inline-block"
              />
              pagina
            </span>
            <h2 className="mt-6 font-display font-bold leading-[1.05] tracking-[-0.025em] text-3xl lg:text-4xl">
              Tu cuenta,
              <br />
              <span className="bg-[linear-gradient(90deg,var(--accent),#fff)] bg-clip-text text-transparent">
                más simple.
              </span>
            </h2>
            <p className="mt-4 text-base leading-relaxed opacity-90 max-w-sm">
              Sigue tus pedidos, guarda favoritos y compra más rápido la próxima
              vez.
            </p>
          </div>

          <ul className="relative flex flex-col gap-3 pt-6 border-t border-white/20">
            {HIGHLIGHTS.map((h) => (
              <li
                key={h.text}
                className="flex items-center gap-2.5 text-sm opacity-90"
              >
                <Icon name={h.icon} size={16} strokeWidth={2} />
                {h.text}
              </li>
            ))}
          </ul>
        </aside>

        <main className="p-6 sm:p-10 flex flex-col gap-7">
          <div>
            <h1 className="font-display font-bold leading-[1.05] tracking-[-0.03em] text-3xl sm:text-4xl">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-2.5 text-text-muted text-[15px] leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>
          {children}
          {footer && (
            <div className="pt-4 border-t border-border text-center text-sm">
              {footer}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
