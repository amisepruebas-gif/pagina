import { Topbar, Header, CategoryNav, Footer } from "@/components";
import { DynamicView } from "@/components/views";
import { SAMPLE_VIEW } from "@/lib/sample-view";

interface ViewPageProps {
  params: { slug: string };
}

/**
 * /v/[slug] — Página de vista dinámica.
 *
 * En producción: `const config = await fetch(\`/api/views/\${params.slug}\`)`.
 * Aquí se usa `SAMPLE_VIEW` como ejemplo.
 *
 * > NOTA: el exportador no permite `[` / `]` en nombres de carpeta —
 * > renombra `app/v/-slug-/` a `app/v/[slug]/` al integrar al proyecto Next.js.
 */
export default function DynamicViewPage(_props: ViewPageProps) {
  const config = SAMPLE_VIEW;
  return (
    <>
      <Topbar />
      <Header cartCount={0} />
      <CategoryNav />
      <DynamicView modules={config.modules} />
      <Footer />
    </>
  );
}

export async function generateMetadata({ params: _params }: ViewPageProps) {
  return {
    title: SAMPLE_VIEW.title ?? "Vista dinámica — página/",
    description: SAMPLE_VIEW.description,
  };
}
