import { Topbar, Header, CategoryNav, Footer } from "@/components";
import { LegalPage, LegalP, LegalList } from "@/components/legal/LegalPage";
import { LEGAL_PAGES } from "@/lib/legal-content";

export const metadata = {
  title: "Envíos y entregas — página/",
  description: "Costos y tiempos de envío, rastreo de pedidos y excepciones.",
};

export default function Page() {
  const meta = LEGAL_PAGES.envios;
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
    {
      id: "tiempos",
      title: "Tiempos de entrega",
      content: <>
        <LegalP>Procesamos los pedidos en un plazo de 24 a 48 horas hábiles. Una vez enviado, los tiempos estimados dependen de tu ubicación:</LegalP>
        <LegalList items={[
          "Zona metropolitana: 24–48 horas hábiles",
          "Ciudades principales: 2–4 días hábiles",
          "Resto del país: 3–7 días hábiles",
          "Internacional: 7–21 días hábiles según destino",
        ]} />
      </>,
    },
    {
      id: "costos",
      title: "Costos de envío",
      content: <LegalP>El costo del envío se calcula al momento del pago según peso, dimensiones y destino. Ofrecemos envío gratis en compras mayores a $999 dentro del territorio nacional.</LegalP>,
    },
    {
      id: "rastreo",
      title: "Rastreo de tu pedido",
      content: <LegalP>Una vez que tu pedido sea enviado, recibirás un correo con el número de guía. Puedes consultar el estado en tiempo real desde "Mi cuenta &rarr; Pedidos".</LegalP>,
    },
    {
      id: "demoras",
      title: "Demoras y excepciones",
      content: <LegalP>Eventos como condiciones climáticas, días festivos o contingencias de la paquetería pueden afectar los tiempos. En caso de demora superior a 5 días hábiles sobre lo estimado, contáctanos para resolverlo.</LegalP>,
    },
  ]}
      />
      <Footer />
    </>
  );
}
