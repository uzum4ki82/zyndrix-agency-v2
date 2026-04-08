import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { Viewport } from 'next';
import { Background } from "@/components/common/Background";
import { headers } from 'next/headers';
import { getDictionary } from '@/lib/dictionaries';

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const viewport: Viewport = {
  themeColor: '#03040a',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headerList = await headers();
  const locale = (headerList.get('x-zyndrix-lang') as string) || 'es';
  const dict = await getDictionary(locale);

  return (
    <html lang={locale} className="scroll-smooth">
      <head>
        {/* Localized JSON-LD Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ProfessionalService",
              "name": dict.metadata.schema_name || "ZYNDRIX | Arquitectura de Automatización IA",
              "image": "https://www.zyndrix.com/img/zyndrix-live.png",
              "url": "https://www.zyndrix.com",
              "telephone": "+34680875704",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Torre Europa, P.º de la Castellana, 95",
                "addressLocality": "Madrid",
                "postalCode": "28046",
                "addressCountry": "ES"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": 40.4502,
                "longitude": -3.6918
              },
              "openingHoursSpecification": {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": [
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday"
                ],
                "opens": "09:00",
                "closes": "18:00"
              },
              "sameAs": [
                "https://www.linkedin.com/company/zyndrix",
                "https://x.com/zyndrix"
              ]
            })
          }}
        />
      </head>
      <body className={`${inter.variable} ${outfit.variable} font-sans antialiased bg-[#03040a] selection:bg-primary selection:text-black`}>
        <Background />
        {children}
      </body>
    </html>
  );
}
