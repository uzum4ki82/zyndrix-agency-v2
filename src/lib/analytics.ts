/**
 * Medición mínima. Solo envía eventos si el visitante aceptó cookies de analítica
 * (gtag no se carga hasta entonces). Nunca enviar datos personales en los parámetros.
 */
export type AnalyticsEvent =
  | 'view_product'
  | 'cta_click'
  | 'form_start'
  | 'form_submit'
  | 'form_error'
  | 'whatsapp_contact_click';

type Params = Record<string, string | number | boolean | undefined>;

export function track(event: AnalyticsEvent, params: Params = {}) {
  if (typeof window === 'undefined') return;
  const w = window as unknown as { gtag?: (...args: unknown[]) => void };
  if (typeof w.gtag !== 'function') return;
  try {
    w.gtag('event', event, params);
  } catch {
    /* la analítica nunca debe romper la página */
  }
}
