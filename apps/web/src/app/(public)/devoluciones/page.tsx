import LegalPage from '@/components/LegalPage';

export const metadata = { title: 'Devoluciones y reembolsos · pagina' };

export default function DevolucionesPage() {
  return (
    <LegalPage title="Devoluciones y reembolsos">
      <p>
        Queremos que tu compra te deje satisfecho. Si tu producto presenta algún
        defecto o no corresponde con lo solicitado, puedes solicitar una
        devolución bajo las siguientes condiciones.
      </p>

      <h2>Plazo</h2>
      <p>
        Cuentas con <strong>30 días naturales</strong> a partir de la fecha de
        entrega para solicitar una devolución.
      </p>

      <h2>Condiciones</h2>
      <ul>
        <li>El producto debe estar sin uso y en su empaque original.</li>
        <li>Debe incluir todos sus accesorios y etiquetas.</li>
        <li>
          Es necesario presentar el comprobante de compra o número de pedido.
        </li>
        <li>
          Los productos personalizados no admiten devolución, salvo defecto de
          fabricación.
        </li>
      </ul>

      <h2>Cómo solicitar una devolución</h2>
      <p>
        Inicia tu solicitud desde <strong>Mi cuenta → Quejas</strong>,
        describiendo el motivo y el número de pedido. Nuestro equipo te
        responderá con los pasos a seguir y, cuando aplique, la guía de envío
        de retorno.
      </p>

      <h2>Reembolsos</h2>
      <p>
        Una vez recibido y revisado el producto, el reembolso se procesa al
        mismo método de pago utilizado en la compra. El tiempo de reflejo
        depende de tu banco, habitualmente entre 5 y 10 días hábiles.
      </p>
    </LegalPage>
  );
}
