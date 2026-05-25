"use client";
import { useState } from "react";
import { Button, Icon, Input } from "@/components";

/**
 * Newsletter — captura de email centrada con estado de éxito.
 */
export function Newsletter() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  return (
    <section className="py-14 sm:py-24 relative overflow-hidden">
      <span aria-hidden className="pointer-events-none absolute top-[20%] -left-32 size-[500px] rounded-full opacity-55 blur-[60px]"
            style={{ background: "var(--grad-from)" }} />
      <span aria-hidden className="pointer-events-none absolute top-[10%] -right-28 size-[420px] rounded-full opacity-35 blur-[60px]"
            style={{ background: "var(--secondary)" }} />

      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 relative">
        <div className="max-w-2xl mx-auto text-center bg-surface rounded-2xl
                        p-8 sm:p-12 lg:p-16 border border-border shadow-md">
          <span className="inline-flex items-center justify-center size-12 sm:size-14 rounded-full
                           text-white shadow-brand bg-brand-grad">
            <Icon name="spark" size={24} strokeWidth={2} />
          </span>

          <h2 className="mt-5 sm:mt-6 font-display font-bold leading-tight tracking-[-0.03em]
                         text-3xl sm:text-4xl lg:text-[clamp(28px,4.5vw,44px)]">
            Antes que nadie.
          </h2>
          <p className="mt-3 text-base sm:text-lg text-text-muted max-w-md mx-auto">
            Suscríbete y recibe primero las ofertas y selecciones del equipo editorial.
          </p>

          {done ? (
            <div className="mt-6 sm:mt-7 inline-flex items-center gap-2.5 px-5 py-3 sm:px-6 sm:py-4
                            rounded-pill bg-brand-50 text-brand-700 font-display font-semibold text-sm sm:text-base">
              <Icon name="check" size={18} strokeWidth={2.4} /> ¡Listo! Revisa tu correo.
            </div>
          ) : (
            <form
              className="mt-6 sm:mt-7 flex flex-col sm:flex-row gap-2 max-w-md mx-auto"
              onSubmit={(e) => { e.preventDefault(); if (email) setDone(true); }}
            >
              <div className="flex-1 min-w-0">
                <Input
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  leadingIcon="user"
                  required
                />
              </div>
              <Button type="submit" size="lg" trailingIcon="arr-right" fullWidth className="sm:!w-auto">
                Suscribirme
              </Button>
            </form>
          )}

          <p className="mt-4 text-xs text-text-soft">Sin spam. Cancela cuando quieras.</p>
        </div>
      </div>
    </section>
  );
}
