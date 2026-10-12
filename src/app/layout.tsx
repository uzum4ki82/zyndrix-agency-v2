import type { Metadata, Viewport } from 'next';
import { Inter, Montserrat } from 'next/font/google';
import './globals.css';
import { ConsentAnalytics } from '@/components/site/ConsentAnalytics';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const montserrat = Montserrat({ subsets: ['latin'], weight: ['600', '700'], variable: '--font-montserrat', display: 'swap' });

const SITE_URL = 'https://zyndrix.dev';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Zyndrix · Agentes de IA para WhatsApp y teléfono',
    template: '%s',
  },
  description:
    'Agentes de IA que atienden el WhatsApp y el teléfono de pequeños negocios con su propia información. Desde 50 €/mes.',
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    siteName: 'Zyndrix',
    url: SITE_URL,
  },
  twitter: { card: 'summary_large_image' },
  icons: { icon: '/img/favicon-zyndrix.png', apple: '/apple-touch-icon.png' },
};

export const viewport: Viewport = {
  themeColor: '#ffffff',
  width: 'device-width',
  initialScale: 1,
};

// Datos estructurados mínimos y verificables: sin dirección, valoraciones ni precios estructurados.
const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Zyndrix',
  url: SITE_URL,
  logo: `${SITE_URL}/img/logo_raw.png`,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${inter.variable} ${montserrat.variable} scroll-smooth`}>
      <body className="bg-white font-sans text-secondary antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        {children}
        <ConsentAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
      </body>
    </html>
  );
}
