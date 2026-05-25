import { Topbar, Header, CategoryNav, Footer } from "@/components";
import { LegalPage, LegalP, LegalList } from "@/components/legal/LegalPage";
import { LEGAL_PAGES } from "@/lib/legal-content";

export const metadata = {
  title: "Términos y condiciones — página/",
  description: "Reglas de uso del sitio página/.",
};

export default function Page() {
  const meta = LEGAL_PAGES.terminos;
  return (
    <>
      <Topbar />
      <Header cartCount={0} />
      <CategoryNav />
      <LegalPage
        title={meta.title}
        eyebrow={meta.eyebrow}
        lastUpdated={meta.lastUpdated}
        sections={[
    { id: "aceptacion", title: "Aceptación de los términos",
      content: <LegalP>Al utilizar página/ aceptas estos términos en su totalidad. Si no estás de acuerdo con alguna disposición, te pedimos no usar el sitio.</LegalP> },
    { id: "cuenta", title: "Tu cuenta",
      content: <LegalP>Eres responsable de la confidencialidad de tu contraseña y de toda actividad que ocurra bajo tu cuenta. Notifícanos inmediatamente cualquier acceso no autorizado.</LegalP> },
    { id: "compras", title: "Compras",
      content: <LegalP>Todos los precios están en pesos mexicanos e incluyen impuestos. Los productos están sujetos a disponibilidad. Nos reservamos el derecho de cancelar pedidos con información inválida o sospechosa.</LegalP> },
    { id: "propiedad", title: "Propiedad intelectual",
      content: <LegalP>Todo el contenido del sitio (textos, imágenes, logotipos, código) es propiedad de página/ o de sus licenciatarios y está protegido por las leyes aplicables.</LegalP> },
    { id: "limitacion", title: "Limitación de responsabilidad",
      content: <LegalP>En la máxima medida permitida por la ley, página/ no será responsable por daños indirectos, incidentales o consecuentes que surjan del uso del sitio.</LegalP> },
    { id: "ley", title: "Ley aplicable",
      content: <LegalP>Estos términos se rigen por las leyes de México. Cualquier controversia se resolverá ante los tribunales competentes de la Ciudad de México.</LegalP> },
  ]}
      />
      <Footer />
    </>
  );
}
