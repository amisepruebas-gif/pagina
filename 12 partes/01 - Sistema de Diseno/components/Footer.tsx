import { Logo } from "./Logo";
import { Button } from "./Button";
import { Input } from "./Input";

const COLS: { title: string; items: string[] }[] = [
  { title: "Ayuda",   items: ["Centro de ayuda", "Envíos y entregas", "Devoluciones", "Métodos de pago"] },
  { title: "Empresa", items: ["Sobre nosotros", "Sostenibilidad", "Trabaja con nosotros", "Prensa"] },
  { title: "Vende",   items: ["Abre tu tienda", "Centro para vendedores", "Calculadora de comisiones"] },
  { title: "Legal",   items: ["Términos", "Privacidad", "Cookies", "Avisos legales"] },
];

/**
 * Footer — completo con newsletter, columnas y baseline legal.
 */
export function Footer() {
  return (
    <footer className="bg-surface-2 border-t border-border mt-16">
      <div className="max-w-screen-xl mx-auto px-6 py-16">
        <div className="grid gap-10 grid-cols-1 md:grid-cols-3 lg:grid-cols-[1.4fr_repeat(4,1fr)]">
          <div>
            <Logo size={32} />
            <p className="mt-4 text-text-muted text-sm leading-relaxed max-w-xs">
              El marketplace genérico que se adapta a tu producto. Construye tu tienda, vende a todo el mundo.
            </p>
            <form className="mt-5 flex gap-2 max-w-sm" onSubmit={(e) => e.preventDefault()}>
              <div className="flex-1 min-w-0">
                <Input placeholder="tu@email.com" type="email" />
              </div>
              <Button>Suscribirme</Button>
            </form>
          </div>
          {COLS.map((c) => (
            <div key={c.title}>
              <h5 className="font-display font-bold uppercase tracking-wider text-[13px] mb-3.5">{c.title}</h5>
              <ul className="space-y-2.5">
                {c.items.map((i) => (
                  <li key={i}>
                    <a href="#" className="text-text-muted text-sm hover:text-brand-700 transition">{i}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-14 pt-6 border-t border-border flex flex-wrap justify-between gap-3 text-text-soft text-[13px]">
          <span>© 2026 página/ · Todos los derechos reservados</span>
          <span className="inline-flex gap-4">
            <a href="#" className="hover:text-text">Términos</a>
            <a href="#" className="hover:text-text">Privacidad</a>
            <a href="#" className="hover:text-text">Cookies</a>
          </span>
        </div>
      </div>
    </footer>
  );
}
