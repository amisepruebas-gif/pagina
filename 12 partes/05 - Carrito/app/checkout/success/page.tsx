import { Topbar, Header, CategoryNav, Footer } from "@/components";
import { OrderConfirmation } from "@/components/cart";
import { SAMPLE_ORDER } from "@/lib/sample-cart";

interface SuccessPageProps {
  searchParams: { order?: string };
}

/**
 * /checkout/success — Pantalla de éxito tras volver de Stripe.
 *
 * En producción: lee `?order=` o `?session_id=` y consulta la orden real al backend.
 * Aquí se usa `SAMPLE_ORDER` como ejemplo.
 */
export default function SuccessPage(_props: SuccessPageProps) {
  return (
    <>
      <Topbar />
      <Header cartCount={0} />
      <CategoryNav />
      <main className="max-w-screen-xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <OrderConfirmation order={SAMPLE_ORDER} />
      </main>
      <Footer />
    </>
  );
}

export const metadata = {
  title: "¡Gracias por tu compra! — página/",
};
