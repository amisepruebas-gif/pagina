import Link from "next/link";
import { Button, Icon } from "@/components";

/**
 * AdminGate — pantalla de "Acceso restringido".
 * Renderízala desde el layout cuando el usuario no tiene rol `admin`.
 */
export function AdminGate() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-bg">
      <div className="max-w-md w-full bg-surface border border-border rounded-xl p-8 text-center shadow-md">
        <span className="size-16 rounded-full inline-flex items-center justify-center mb-4
                         bg-error/[0.12] text-error">
          <Icon name="shield" size={28} strokeWidth={2} />
        </span>
        <h2 className="font-display font-bold text-[22px] tracking-[-0.02em]">Acceso restringido</h2>
        <p className="mt-2 text-text-muted text-sm leading-relaxed">
          Esta área es solo para administradores autorizados.
          Si crees que deberías tener acceso, contacta al dueño de la tienda.
        </p>
        <div className="mt-5 flex gap-2.5 justify-center flex-wrap">
          <Link href="/"><Button variant="secondary" leadingIcon="arr-left">Volver a la tienda</Button></Link>
          <Link href="/login"><Button>Iniciar sesión</Button></Link>
        </div>
      </div>
    </div>
  );
}
