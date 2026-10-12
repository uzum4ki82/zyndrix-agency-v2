import type { Metadata } from 'next';
import { LEGAL, LegalPage, val } from '@/components/site/LegalPage';

export const metadata: Metadata = {
  title: 'Aviso legal | Zyndrix',
  alternates: { canonical: '/aviso-legal' },
  robots: { index: true, follow: true },
};

export default function AvisoLegal() {
  return (
    <LegalPage title="Aviso legal" updated="octubre de 2026">
      <h2>Titular de la web</h2>
      <ul>
        <li>Titular: {val(LEGAL.titular, 'Nombre o razón social')}</li>
        <li>NIF: {val(LEGAL.nif, 'NIF')}</li>
        <li>Domicilio: {val(LEGAL.domicilio, 'Domicilio')}</li>
        <li>Email de contacto: {val(LEGAL.email, 'Email')}</li>
        {LEGAL.registro && <li>Datos registrales: {LEGAL.registro}</li>}
      </ul>
      <h2>Objeto</h2>
      <p>
        Esta web informa sobre los servicios de agentes de inteligencia artificial para WhatsApp y teléfono que ofrece
        Zyndrix y permite solicitar información. La información publicada no constituye una oferta vinculante: las
        condiciones de cada servicio se envían por escrito antes de contratar.
      </p>
      <h2>Uso de la web</h2>
      <p>
        Quien navega por esta web se compromete a usarla de forma lícita y a no introducir datos falsos o de terceros
        sin autorización en los formularios.
      </p>
      <h2>Propiedad intelectual</h2>
      <p>
        Los textos, el diseño y la marca Zyndrix pertenecen a su titular. No se permite su reproducción sin
        autorización, salvo para uso personal.
      </p>
      <h2>Responsabilidad</h2>
      <p>
        Se procura que la información sea correcta y esté actualizada, pero puede contener errores. Los ejemplos de
        conversaciones de esta web son ilustrativos y no corresponden a clientes reales.
      </p>
      <h2>Legislación aplicable</h2>
      <p>Esta web se rige por la legislación española.</p>
    </LegalPage>
  );
}
