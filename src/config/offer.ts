/**
 * Fuente única de la oferta comercial de Zyndrix.
 * Precios, inclusiones y condiciones se leen SOLO desde aquí.
 *
 * Los campos marcados con `pending: true` no están decididos por el propietario.
 * La web no los presenta como promesa: muestra que se confirman por escrito antes de contratar.
 */

export type ProductId = 'whatsapp' | 'voz';

export interface Product {
  id: ProductId;
  name: string;
  shortName: string;
  path: string;
  priceMonthly: number;
  currency: 'EUR';
  tagline: string;
  summary: string;
  includes: string[];
  notIncluded: string[];
  externalCosts: string[];
  ctaPrimary: string;
}

export const PRODUCTS: Record<ProductId, Product> = {
  whatsapp: {
    id: 'whatsapp',
    name: 'Agente de WhatsApp con IA',
    shortName: 'WhatsApp',
    path: '/agente-whatsapp',
    priceMonthly: 50,
    currency: 'EUR',
    tagline: 'Contesta los mensajes de tu WhatsApp mientras tú trabajas.',
    summary:
      'Responde las preguntas de siempre con la información de tu negocio, toma los datos de quien te escribe y te avisa cuando hace falta que intervengas tú.',
    includes: [
      'Configuración con la información de tu negocio: servicios, precios, horarios, ubicación y normas',
      'Respuestas en español a las preguntas frecuentes, a cualquier hora',
      'Recuerda lo que se ha hablado en la misma conversación',
      'Recoge nombre, teléfono y motivo de la consulta',
      'Aviso al negocio cuando llega una solicitud o una pregunta que no sabe responder',
      'Ajustes de las respuestas durante el primer mes',
    ],
    notIncluded: [
      'Envíos masivos o campañas de marketing por WhatsApp',
      'Conexión con tu programa de gestión o tu web (se valora aparte)',
      'Atención por otros canales (Instagram, email, web)',
    ],
    externalCosts: [
      'Necesitas un número de WhatsApp para el negocio. Te ayudamos a decidir si usar el actual o uno nuevo.',
    ],
    ctaPrimary: 'Quiero el agente de WhatsApp',
  },
  voz: {
    id: 'voz',
    name: 'Agente de voz con IA',
    shortName: 'Voz',
    path: '/agente-voz',
    priceMonthly: 75,
    currency: 'EUR',
    tagline: 'Atiende las llamadas que tú no puedes coger.',
    summary:
      'Coge el teléfono, entiende para qué llaman, responde lo habitual y te deja por escrito quién ha llamado y qué necesita.',
    includes: [
      'Atención de llamadas entrantes en español con voz natural',
      'Se presenta como asistente virtual del negocio desde el primer momento',
      'Responde las preguntas frecuentes con la información de tu negocio',
      'Toma nombre, teléfono y motivo de la llamada',
      'Resumen escrito de cada llamada atendida',
      'Ajustes del guion durante el primer mes',
    ],
    notIncluded: [
      'Llamadas salientes o campañas de llamadas',
      'Transferencia de la llamada a una persona (se estudia según tu operador)',
      'Conexión con tu programa de gestión (se valora aparte)',
    ],
    externalCosts: [
      'La telefonía y los minutos de voz tienen un coste que depende del uso. Antes de empezar te indicamos los minutos incluidos y el precio si se superan.',
      'Para que el agente atienda tu número actual, tu operador debe permitir el desvío de llamadas.',
    ],
    ctaPrimary: 'Quiero el agente de voz',
  },
};

export const PRODUCT_LIST: Product[] = [PRODUCTS.whatsapp, PRODUCTS.voz];

/** Condiciones que el propietario aún debe definir. No se muestran como cifras públicas. */
export const PENDING_TERMS = {
  setupFee: { pending: true, value: null as number | null },
  taxesIncluded: { pending: true, value: null as boolean | null },
  whatsappIncludedConversations: { pending: true, value: null as number | null },
  voiceIncludedMinutes: { pending: true, value: null as number | null },
  minimumTerm: { pending: true, value: null as string | null },
};

/** Texto público honesto para lo que aún no está fijado. */
export const TERMS_NOTICE =
  'Antes de empezar te enviamos por escrito el volumen incluido, el coste de alta si lo hubiera y los impuestos aplicables. Sin letra pequeña en la factura.';

export const CONTACT = {
  /** Pendiente de confirmar: en el código conviven dos números distintos. */
  whatsappNumber: '34637729266',
};

export const formatPrice = (p: Product) => `${p.priceMonthly} €`;
