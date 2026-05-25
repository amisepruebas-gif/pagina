/**
 * Inyecta datos estructurados Schema.org como JSON-LD.
 * Renderizable en server components — Google lo lee del HTML.
 */
export default function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
