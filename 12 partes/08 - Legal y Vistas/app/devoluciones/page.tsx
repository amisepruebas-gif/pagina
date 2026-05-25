import { Topbar, Header, CategoryNav, Footer } from "@/components";
import { LegalPage, LegalP, LegalList } from "@/components/legal/LegalPage";
import { LEGAL_PAGES } from "@/lib/legal-content";

export const metadata = {
  title: "Devoluciones — página/",
  description: "Plazo, condiciones y proceso para devolver un producto.",
};

export default function Page() {
  const meta = LEGAL_PAGES.devoluciones;
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
      id: "plazo",
      title: "Plazo para devolver",
      content: <LegalP>Tienes 30 días naturales desde la entrega para solicitar la devolución de cualquier producto que no te satisfaga.</LegalP>,
    },
    {
      id: "condiciones",
      title: "Condiciones del producto",
      content: <>
        <LegalP>Para aceptar la devolución, el producto debe cumplir con:</LegalP>
        <LegalList items={[
          "Estar en su empaque original sin daños",
          "Incluir todos los accesorios y manuales originales",
          "No mostrar signos visibles de uso",
          "Contar con etiquetas si aplica (ropa, calzado)",
        ]} />
      </>,
    },
    {
      id: "proceso",
      title: "Cómo iniciar una devolución",
      content: <LegalP>Desde "Mi cuenta &rarr; Pedidos" selecciona el artículo a devolver y elige "Solicitar devolución". Te enviaremos una guía prepagada por correo. Coloca el producto en el empaque original y entrégalo en la sucursal indicada.</LegalP>,
    },
    {
      id: "reembolso",
      title: "Reembolso",
      content: <LegalP>Una vez recibamos el producto y validemos su estado, procesaremos el reembolso al método de pago original en un plazo de 5 a 10 días hábiles.</LegalP>,
    },
  ]}
      />
      <Footer />
    </>
  );
}
