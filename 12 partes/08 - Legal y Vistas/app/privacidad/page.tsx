import { Topbar, Header, CategoryNav, Footer } from "@/components";
import { LegalPage, LegalP, LegalList } from "@/components/legal/LegalPage";
import { LEGAL_PAGES } from "@/lib/legal-content";

export const metadata = {
  title: "Aviso de privacidad — página/",
  description: "Cómo tratamos tus datos personales en página/.",
};

export default function Page() {
  const meta = LEGAL_PAGES.privacidad;
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
    { id: "responsable", title: "Responsable de los datos",
      content: <LegalP>página/ es el responsable del tratamiento de los datos personales que recabamos de ti. Nuestro domicilio fiscal está disponible bajo solicitud al correo de privacidad.</LegalP> },
    { id: "datos", title: "Qué datos recabamos", content: <>
      <LegalP>Los datos personales que tratamos para los fines descritos en este aviso son los siguientes:</LegalP>
      <LegalList items={[
        "Identificación: nombre, fecha de nacimiento, RFC",
        "Contacto: correo, teléfono, dirección de envío",
        "Pago: información requerida para procesar la transacción (no almacenamos números completos de tarjeta)",
        "Comportamiento: páginas visitadas, búsquedas, productos guardados",
      ]} />
    </> },
    { id: "finalidad", title: "Para qué los usamos",
      content: <LegalP>Tratamos tus datos para procesar pedidos, entregar productos, ofrecer soporte, prevenir fraude y, con tu consentimiento, enviarte comunicaciones de marketing.</LegalP> },
    { id: "derechos", title: "Tus derechos ARCO",
      content: <LegalP>Tienes derecho a Acceder, Rectificar, Cancelar u Oponerte al tratamiento de tus datos. Para ejercerlos, escríbenos a privacidad@pagina.com.</LegalP> },
    { id: "cookies", title: "Uso de cookies",
      content: <LegalP>Utilizamos cookies para mejorar tu experiencia. Puedes desactivarlas en cualquier momento desde la configuración de tu navegador, pero algunas funciones del sitio podrían dejar de funcionar correctamente.</LegalP> },
  ]}
      />
      <Footer />
    </>
  );
}
