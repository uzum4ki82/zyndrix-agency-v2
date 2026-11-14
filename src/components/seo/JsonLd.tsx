import type { Product } from '@/config/offer';
import type { FaqItem } from '@/components/site/Faq';

const SITE_URL = 'https://zyndrix.dev';

/** Inserta un bloque JSON-LD. Solo datos verificables (sin valoraciones ni precios estructurados). */
export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

export function serviceJsonLd(p: Product) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: p.name,
    description: p.summary,
    url: `${SITE_URL}${p.path}`,
    serviceType: p.name,
    areaServed: { '@type': 'Country', name: 'España' },
    availableLanguage: 'es',
    provider: { '@type': 'Organization', name: 'Zyndrix', url: SITE_URL },
  };
}

export function faqJsonLd(items: FaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((i) => ({
      '@type': 'Question',
      name: i.q,
      acceptedAnswer: { '@type': 'Answer', text: i.a },
    })),
  };
}

export function breadcrumbJsonLd(p: Product) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: p.name, item: `${SITE_URL}${p.path}` },
    ],
  };
}
