import LegalPage from '@/components/LegalPage';

export const metadata = { title: 'Términos y condiciones · pagina' };

export default function TerminosPage() {
  return (
    <LegalPage title="Términos y condiciones">
      <p>
        Al utilizar este sitio y realizar una compra, aceptas los siguientes
        términos y condiciones.
      </p>

      <h2>Productos y precios</h2>
      <p>
        Procuramos que la información de los productos sea exacta. Los precios
        están expresados en pesos mexicanos (MXN) e incluyen los impuestos
        aplicables. Nos reservamos el derecho de corregir errores y de
        actualizar precios y disponibilidad sin previo aviso.
      </p>

      <h2>Pedidos</h2>
      <p>
        Un pedido se considera confirmado una vez recibido el pago. Nos
        reservamos el derecho de cancelar pedidos ante sospecha de fraude,
        errores de precio o falta de existencias, en cuyo caso se realizará el
        reembolso correspondiente.
      </p>

      <h2>Pagos</h2>
      <p>
        Los pagos se procesan a través de una pasarela de pago segura. No
        almacenamos los datos de tu tarjeta en nuestros servidores.
      </p>

      <h2>Propiedad intelectual</h2>
      <p>
        El contenido del sitio —textos, imágenes, logotipos y diseño— está
        protegido y no puede reproducirse sin autorización.
      </p>

      <h2>Contacto</h2>
      <p>
        Para cualquier duda sobre estos términos, utiliza los medios de contacto
        disponibles en el sitio.
      </p>
    </LegalPage>
  );
}
