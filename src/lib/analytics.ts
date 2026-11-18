/**
 * Medición mínima. Solo envía eventos si el visitante aceptó cookies de analítica
 * (GTM no se carga hasta entonces). Nunca enviar datos personales en los parámetros.
 */
export type AnalyticsEvent =
  | 'view_product'
  | 'cta_click'
  | 'form_start'
  | 'form_submit'
  | 'form_error'
  | 'whatsapp_contact_click';

type Params = { product?: string; location?: string };

/**
 * Envía el evento al dataLayer de GTM. GTM solo existe tras aceptar cookies;
 * sin él no se envía nada. Se fijan siempre product y location (aunque vengan
 * vacíos) para que no arrastren el valor del evento anterior.
 */
export function track(event: AnalyticsEvent, params: Params = {}) {
  if (typeof window === 'undefined') return;
  const w = window as unknown as { dataLayer?: unknown[]; google_tag_manager?: unknown };
  if (!w.google_tag_manager || !Array.isArray(w.dataLayer)) return;
  try {
    w.dataLayer.push({ event, product: params.product ?? undefined, location: params.location ?? undefined });
  } catch {
    /* la analítica nunca debe romper la página */
  }
}
