import { type ReactNode } from 'react';
import Image from 'next/image';
import { Icon, type IconName } from '@/components/ui';
import type { AuthPanelConfig } from '@/types/auth-panel';

export interface AuthLayoutProps {
  title: string;
  subtitle?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  /**
   * Configuración del panel lateral de marca. Si no se pasa, cae al diseño
   * default heredado del tema (CSS vars). Si se pasa, controla imagen +
   * capa + blobs vía estilo inline.
   */
  panel?: AuthPanelConfig;
}

const HIGHLIGHTS: { icon: IconName; text: string }[] = [
  { icon: 'truck', text: 'Envío rápido a todo México' },
  { icon: 'shield', text: 'Pago seguro con encriptación SSL' },
  { icon: 'refresh', text: 'Devoluciones en 30 días' }
];

/** AuthLayout — card dividida: panel de marca + formulario. */
export function AuthLayout({ title, subtitle, children, footer, panel }: AuthLayoutProps) {
  const hasBg = !!panel?.bgImageUrl;
  const coverBg = panel
    ? panel.coverType === 'gradient'
      ? `linear-gradient(135deg, ${panel.coverFrom}, ${panel.coverTo})`
      : panel.coverFrom
    : 'linear-gradient(135deg,var(--brand-500) 0%,var(--brand-700) 50%,var(--accent-2) 100%)';
  const coverAlpha = panel
    ? Math.min(100, Math.max(0, panel.coverOpacity)) / 100
    : 1;
  const imageAlpha = panel
    ? Math.min(100, Math.max(0, panel.bgImageOpacity)) / 100
    : 1;
  const blob1Color = panel?.blob1Color ?? 'var(--accent)';
  const blob1Alpha = panel
    ? Math.min(100, Math.max(0, panel.blob1Opacity)) / 100
    : 0.5;
  const blob2Color = panel?.blob2Color ?? 'var(--secondary)';
  const blob2Alpha = panel
    ? Math.min(100, Math.max(0, panel.blob2Opacity)) / 100
    : 0.45;

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-10 md:py-16">
      <div className="grid md:grid-cols-2 rounded-2xl overflow-hidden border border-border shadow-lg bg-surface">
        <aside
          className="relative overflow-hidden text-white p-8 md:p-10 hidden md:flex flex-col justify-between"
          style={hasBg ? { backgroundColor: '#FFFFFF' } : undefined}
        >
          {hasBg && (
            <Image
              src={panel!.bgImageUrl}
              alt=""
              fill
              sizes="(max-width: 768px) 0px, 50vw"
              className="object-cover"
              style={{ opacity: imageAlpha }}
            />
          )}

          {/* Capa de color: encima de la imagen, o como fondo cuando no hay imagen. */}
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{ background: coverBg, opacity: coverAlpha }}
          />

          <span
            aria-hidden
            className="pointer-events-none absolute -top-20 -right-28 size-[360px] rounded-full blur-[60px]"
            style={{ background: blob1Color, opacity: blob1Alpha }}
          />
          <span
            aria-hidden
            className="pointer-events-none absolute -bottom-24 -left-16 size-[280px] rounded-full blur-[60px]"
            style={{ background: blob2Color, opacity: blob2Alpha }}
          />
          <span
            aria-hidden
            className="absolute inset-0 opacity-[0.12] pointer-events-none"
            style={{
              backgroundImage:
                'radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)',
              backgroundSize: '24px 24px'
            }}
          />

          <div className="relative z-10">
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

          <ul className="relative z-10 flex flex-col gap-3 pt-6 border-t border-white/20">
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
