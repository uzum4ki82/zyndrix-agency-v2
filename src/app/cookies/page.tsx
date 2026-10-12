import type { Metadata } from 'next';
import { LegalPage } from '@/components/site/LegalPage';
import { ReopenConsent } from '@/components/site/ReopenConsent';

export const metadata: Metadata = {
  title: 'Política de cookies | Zyndrix',
  alternates: { canonical: '/cookies' },
};

export default function Cookies() {
  return (
    <LegalPage title="Política de cookies" updated="octubre de 2026">
      <h2>Qué usamos</h2>
      <ul>
        <li>
          <strong>Técnicas (necesarias):</strong> guardamos en tu navegador si aceptaste o rechazaste la analítica.
          No requieren consentimiento.
        </li>
        <li>
          <strong>Analítica (opcional):</strong> Google Analytics, para saber qué páginas se visitan y qué botones se
          usan. Solo se activa si la aceptas. No enviamos tus datos de contacto a la analítica.
        </li>
      </ul>
      <h2>Cómo cambiar tu elección</h2>
      <p>Puedes cambiar tu elección cuando quieras:</p>
      <ReopenConsent />
      <p>También puedes borrar las cookies desde la configuración de tu navegador.</p>
    </LegalPage>
  );
}
