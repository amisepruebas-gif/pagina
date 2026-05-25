import { SectionTitle } from './SectionTitle';

export interface SpecRow {
  label: string;
  value: string;
}

/** SpecsTable — tabla clave/valor con filas zebra. Oculta si no hay datos. */
export function SpecsTable({ rows }: { rows: SpecRow[] }) {
  const filled = rows.filter((r) => r.value && r.value.trim() !== '');
  if (filled.length === 0) return null;

  return (
    <section className="py-12 border-t border-border">
      <SectionTitle eyebrow="Especificaciones">Detalles técnicos</SectionTitle>
      <div className="bg-surface border border-border rounded-lg overflow-hidden">
        <dl className="m-0">
          {filled.map((r, i) => (
            <div
              key={r.label}
              className={`grid gap-2 sm:gap-4 grid-cols-1 sm:grid-cols-[240px_1fr] px-4 py-3 sm:px-5 sm:py-3.5 ${
                i === 0 ? '' : 'border-t border-border'
              } ${i % 2 === 1 ? 'bg-surface-2' : 'bg-surface'}`}
            >
              <dt className="font-display font-semibold text-sm text-text">
                {r.label}
              </dt>
              <dd className="m-0 text-sm text-text-muted">{r.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
