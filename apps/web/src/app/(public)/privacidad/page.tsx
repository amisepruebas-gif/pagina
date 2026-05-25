import LegalPage from '@/components/LegalPage';

export const metadata = { title: 'Aviso de privacidad · pagina' };

export default function PrivacidadPage() {
  return (
    <LegalPage title="Aviso de privacidad">
      <p>
        Este aviso describe cómo recabamos, usamos y protegemos tus datos
        personales, conforme a la Ley Federal de Protección de Datos Personales
        en Posesión de los Particulares.
      </p>

      <h2>Datos que recabamos</h2>
      <ul>
        <li>Datos de identificación y contacto: nombre, correo, teléfono.</li>
        <li>Dirección de envío y facturación.</li>
        <li>
          Información de tus pedidos. Los datos de pago son procesados
          directamente por la pasarela de pago; no almacenamos números de
          tarjeta.
        </li>
      </ul>

      <h2>Uso de los datos</h2>
      <ul>
        <li>Procesar y entregar tus pedidos.</li>
        <li>Brindar atención y soporte al cliente.</li>
        <li>Enviar información sobre el estado de tus compras.</li>
      </ul>

      <h2>Derechos ARCO</h2>
      <p>
        Tienes derecho a Acceder, Rectificar, Cancelar u Oponerte al tratamiento
        de tus datos personales. Para ejercer cualquiera de estos derechos,
        escríbenos a través de los medios de contacto disponibles en el sitio.
      </p>

      <h2>Resguardo</h2>
      <p>
        Aplicamos medidas de seguridad razonables para proteger tu información.
        No compartimos tus datos con terceros salvo lo necesario para completar
        tu compra (paqueterías, procesador de pagos) o cuando la ley lo exija.
      </p>
    </LegalPage>
  );
}
