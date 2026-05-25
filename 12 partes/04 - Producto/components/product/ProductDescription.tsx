import { Icon } from "@/components";
import { SectionTitle } from "./SectionTitle";

interface ProductDescriptionProps {
  description: string;
  bullets: string[];
}

/**
 * ProductDescription — bloque 2 columnas con párrafo + bullets de beneficios.
 * En móvil se apila en una sola columna.
 */
export function ProductDescription({ description, bullets }: ProductDescriptionProps) {
  return (
    <section className="py-12 border-t border-border">
      <SectionTitle eyebrow="01 / Descripción">Por qué te va a gustar</SectionTitle>
      <div className="grid gap-6 lg:gap-10 lg:grid-cols-[1.2fr_1fr]">
        <p className="text-base sm:text-lg leading-relaxed text-text-muted max-w-2xl">
          {description}
        </p>
        <ul className="list-none p-0 m-0 flex flex-col gap-3">
          {bullets.map((b) => (
            <li key={b} className="flex items-start gap-2.5 text-[15px] leading-relaxed">
              <span className="shrink-0 size-[22px] rounded-full bg-brand-grad text-white
                               inline-flex items-center justify-center mt-px shadow-xs">
                <Icon name="check" size={13} strokeWidth={3} />
              </span>
              {b}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
