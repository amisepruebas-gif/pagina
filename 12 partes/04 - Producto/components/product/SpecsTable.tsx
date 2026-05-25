import { SectionTitle } from "./SectionTitle";

interface SpecsTableProps {
  specs: [string, string][];
}

/**
 * SpecsTable — tabla clave/valor con filas zebra.
 * En móvil se apila clave sobre valor.
 */
export function SpecsTable({ specs }: SpecsTableProps) {
  return (
    <section className="py-12 border-t border-border">
      <SectionTitle eyebrow="02 / Especificaciones">Detalles técnicos</SectionTitle>
      <div className="bg-surface border border-border rounded-lg overflow-hidden">
        <dl className="m-0">
          {specs.map(([k, v], i) => (
            <div key={k}
                 className={`grid gap-2 sm:gap-4 grid-cols-1 sm:grid-cols-[240px_1fr]
                             px-4 py-3 sm:px-5 sm:py-3.5
                             ${i === 0 ? "" : "border-t border-border"}
                             ${i % 2 === 1 ? "bg-surface-2" : "bg-surface"}`}>
              <dt className="font-display font-semibold text-sm text-text">{k}</dt>
              <dd className="m-0 text-sm text-text-muted">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
