"use client";
import { useEffect, useRef, useState } from "react";
import { Badge, Button, Icon } from "@/components";
import type { SliderSlide } from "@/lib/sample-view";

export interface ViewSliderProps {
  slides: SliderSlide[];
  /** Autoplay con rotación automática (pausa al hover) */
  autoplay?: boolean;
  /** Milisegundos entre rotaciones */
  interval?: number;
}

/**
 * ViewSlider — carrusel full-bleed con autoplay, indicadores tipo "ant track",
 * flechas (desktop) y scroll-snap horizontal (mobile swipe-friendly).
 */
export function ViewSlider({ slides, autoplay = true, interval = 5000 }: ViewSliderProps) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const railRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!autoplay || paused) return;
    const id = setInterval(() => setI((n) => (n + 1) % slides.length), interval);
    return () => clearInterval(id);
  }, [autoplay, paused, interval, slides.length]);

  useEffect(() => {
    const el = railRef.current;
    if (el) el.scrollTo({ left: el.clientWidth * i, behavior: "smooth" });
  }, [i]);

  return (
    <section
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="relative overflow-hidden rounded-2xl my-4"
    >
      <div ref={railRef}
           className="flex overflow-x-auto snap-x snap-mandatory rounded-2xl
                      [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {slides.map((s, idx) => (
          <div key={idx}
               style={{ background: s.bg, color: s.color ?? "#fff" }}
               className="flex-[0_0_100%] snap-start aspect-[21/9] min-h-[280px] max-h-[480px]
                          relative overflow-hidden flex items-center
                          p-[clamp(24px,6vw,64px)]">
            <span aria-hidden className="pointer-events-none absolute -top-20 -right-16 size-[360px] rounded-full opacity-40 blur-[60px]"
                  style={{ background: s.blob ?? "var(--accent)" }} />
            <div className="relative max-w-xl">
              {s.eyebrow && <Badge tone="accent">{s.eyebrow}</Badge>}
              <h2 className="mt-3.5 font-display font-bold leading-none tracking-[-0.035em]
                             text-3xl sm:text-5xl lg:text-[clamp(28px,5vw,56px)] text-inherit">
                {s.title}
              </h2>
              {s.subtitle && (
                <p className="mt-3 opacity-90 max-w-md
                              text-[clamp(14px,1.6vw,18px)]">
                  {s.subtitle}
                </p>
              )}
              <div className="mt-5 flex gap-2.5 flex-wrap">
                <Button size="lg" variant="secondary" trailingIcon="arr-right">{s.cta ?? "Ver más"}</Button>
                {s.cta2 && <Button size="lg" variant="ghost" className="!text-inherit hover:!bg-white/10">{s.cta2}</Button>}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="absolute bottom-4 inset-x-0 flex justify-center gap-2 z-[2]">
        {slides.map((_, idx) => (
          <button key={idx} type="button" onClick={() => setI(idx)}
                  aria-label={`Ir a slide ${idx + 1}`}
                  className="min-w-8 h-8 p-0 border-0 bg-transparent cursor-pointer inline-flex items-center justify-center">
            <span
              style={{ width: idx === i ? 28 : 8 }}
              className={`h-2 rounded-full transition-all duration-base ease-out
                          ${idx === i ? "bg-white" : "bg-white/50"}`}
            />
          </button>
        ))}
      </div>

      <ArrowBtn dir="prev" onClick={() => setI((i - 1 + slides.length) % slides.length)} />
      <ArrowBtn dir="next" onClick={() => setI((i + 1) % slides.length)} />
    </section>
  );
}

function ArrowBtn({ dir, onClick }: { dir: "prev" | "next"; onClick: () => void }) {
  return (
    <button
      type="button" onClick={onClick}
      aria-label={dir === "prev" ? "Anterior" : "Siguiente"}
      className={`hidden sm:inline-flex absolute top-1/2 -translate-y-1/2 z-[2]
                  size-11 items-center justify-center rounded-full border-0
                  bg-white/90 text-text shadow-sm backdrop-blur cursor-pointer
                  transition hover:scale-[1.08]
                  ${dir === "prev" ? "left-4" : "right-4"}`}
    >
      <Icon name={dir === "prev" ? "arr-left" : "arr-right"} size={20} strokeWidth={2.4} />
    </button>
  );
}
