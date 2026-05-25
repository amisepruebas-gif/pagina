import { type ReactNode } from "react";
import { Icon, Logo } from "@/components";

export interface AuthLayoutProps {
  title: string;
  subtitle?: ReactNode;
  /** Contenido principal: formulario, separador, etc. */
  children: ReactNode;
  /** Línea bajo el formulario: link a login/registro/recuperar. */
  footer?: ReactNode;
}

/**
 * AuthLayout — pantalla dividida.
 *
 * - **Desktop (≥880px)**: panel visual izquierda con gradiente de marca,
 *   logo, frase y stats; formulario derecha centrado.
 * - **Mobile (<880px)**: el panel visual se compacta a un encabezado;
 *   formulario llena la pantalla. `<520px` el panel desaparece y
 *   sale un logo arriba del título.
 */
export function AuthLayout({ title, subtitle, children, footer }: AuthLayoutProps) {
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-bg">
      {/* Visual side */}
      <aside className="relative overflow-hidden text-white p-6 md:p-12
                        flex flex-col justify-between min-h-[200px] md:min-h-screen
                        bg-[linear-gradient(135deg,var(--brand-500)_0%,var(--brand-700)_50%,var(--accent-2)_100%)]
                        hidden xs:flex">
        <span aria-hidden className="pointer-events-none absolute -top-20 -right-32 size-[420px] rounded-full opacity-50 blur-[60px]"
              style={{ background: "var(--accent)" }} />
        <span aria-hidden className="pointer-events-none absolute -bottom-24 -left-16 size-[320px] rounded-full opacity-45 blur-[60px]"
              style={{ background: "var(--secondary)" }} />
        <span aria-hidden className="absolute inset-0 opacity-[0.12]"
              style={{
                backgroundImage: "radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)",
                backgroundSize: "24px 24px",
              }} />

        <div className="relative">
          <a href="/" className="text-inherit no-underline inline-block">
            <Logo size={32} />
          </a>
        </div>

        <div className="relative hidden md:block">
          <span className="inline-block mb-6 px-3.5 py-1.5 rounded-full
                           bg-black/20 text-accent font-mono text-[11px] tracking-widest uppercase font-semibold">
            <Icon name="spark" size={12} strokeWidth={2.4} className="mr-1.5 align-[-2px] inline-block" />
            Comunidad página/
          </span>
          <h2 className="font-display font-bold leading-[1.05] tracking-[-0.025em] max-w-md
                         text-3xl lg:text-[clamp(28px,4vw,44px)]">
            Tu tienda, tus reglas.<br />
            <span className="bg-[linear-gradient(90deg,var(--accent),#fff)] bg-clip-text text-transparent">
              Vende lo que sea.
            </span>
          </h2>
          <p className="mt-4 text-base leading-relaxed opacity-90 max-w-sm">
            Miles de productos curados, envío rápido y la mejor relación calidad-precio del marketplace.
          </p>
        </div>

        <div className="relative hidden md:flex gap-6 flex-wrap pt-6 border-t border-white/20">
          {[
            ["50K+", "Productos"],
            ["2K+",  "Marcas"],
            ["98%",  "Clientes felices"],
          ].map(([n, l]) => (
            <div key={l}>
              <div className="font-display font-bold text-2xl tracking-[-0.02em] leading-none">{n}</div>
              <div className="mt-1 text-[11px] opacity-80 font-mono tracking-widest uppercase">{l}</div>
            </div>
          ))}
        </div>
      </aside>

      {/* Form side */}
      <main className="flex flex-col justify-center py-12 px-5 sm:px-10 lg:px-20 relative overflow-y-auto">
        {/* Logo for very small screens where the visual aside is hidden */}
        <div className="xs:hidden mb-6">
          <Logo size={28} />
        </div>
        <div className="max-w-md w-full mx-auto flex flex-col gap-7">
          <div>
            <h1 className="font-display font-bold leading-[1.05] tracking-[-0.03em]
                           text-3xl sm:text-4xl lg:text-[clamp(28px,4.5vw,38px)]">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-2.5 text-text-muted text-[15px] leading-relaxed">{subtitle}</p>
            )}
          </div>
          {children}
          {footer && (
            <div className="pt-4 border-t border-border text-center text-sm">{footer}</div>
          )}
        </div>
      </main>
    </div>
  );
}
