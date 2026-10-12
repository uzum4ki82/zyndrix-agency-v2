import type { Metadata } from 'next';
import { LEGAL, LegalPage, val } from '@/components/site/LegalPage';

export const metadata: Metadata = {
  title: 'Política de privacidad | Zyndrix',
  alternates: { canonical: '/privacidad' },
};

export default function Privacidad() {
  return (
    <LegalPage title="Política de privacidad" updated="octubre de 2026">
      <h2>Responsable del tratamiento</h2>
      <p>
        {val(LEGAL.titular, 'Nombre o razón social')}, NIF {val(LEGAL.nif, 'NIF')}, con domicilio en{' '}
        {val(LEGAL.domicilio, 'Domicilio')}. Contacto: {val(LEGAL.email, 'Email')}.
      </p>
      <h2>Qué datos tratamos</h2>
      <p>
        Los que nos facilitas en el formulario de contacto: nombre, negocio, email o teléfono, el producto que te
        interesa y el mensaje que escribas. No pedimos más datos de los necesarios para responderte.
      </p>
      <h2>Para qué los usamos</h2>
      <ul>
        <li>Responder a tu solicitud y enviarte información sobre el servicio que nos pides.</li>
        <li>Preparar y enviarte una propuesta si la solicitas.</li>
      </ul>
      <h2>Base legal</h2>
      <p>
        Tu consentimiento al enviar el formulario y la aplicación de medidas precontractuales a petición tuya
        (artículo 6.1.a y 6.1.b del RGPD).
      </p>
      <h2>Cuánto tiempo los conservamos</h2>
      <p>
        Mientras gestionamos tu solicitud y, si no llegas a contratar, durante un máximo de 12 meses, salvo que pidas
        antes su supresión.
      </p>
      <h2>Quién más accede a los datos</h2>
      <p>
        Proveedores que nos prestan servicios técnicos (alojamiento web, base de datos, automatización y correo), con
        los que existe o se formalizará un contrato de encargado del tratamiento. Algunos pueden estar fuera del
        Espacio Económico Europeo, con las garantías que exige el RGPD. No vendemos tus datos.
      </p>
      <h2>Tus derechos</h2>
      <p>
        Puedes pedir acceso, rectificación, supresión, oposición, limitación y portabilidad escribiendo a{' '}
        {val(LEGAL.email, 'Email')}. Si consideras que no hemos atendido bien tu petición, puedes reclamar ante la
        Agencia Española de Protección de Datos (aepd.es).
      </p>
      <h2>Datos de los clientes de tu negocio</h2>
      <p>
        Cuando contratas un agente, Zyndrix trata los datos de las personas que escriben o llaman a tu negocio por
        cuenta tuya, como encargado del tratamiento. Ese tratamiento se regula en el contrato y en el acuerdo de
        encargo que firmamos contigo, no en esta política.
      </p>
    </LegalPage>
  );
}
