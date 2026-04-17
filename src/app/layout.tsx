import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700", "800"] });

export const viewport: Viewport = {
  themeColor: "#4f46e5",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "ZYNDRIX | Arquitectura de Autoridad Digital",
  description: "Infraestructura de ventas autónoma de última generación. Descubrimiento proactivo de leads y despliegue estratégico de activos digitales.",
  icons: {
    icon: "/img/logo_raw.png",
    apple: "/img/logo_raw.png",
  },
  openGraph: {
    title: "ZYNDRIX | Luxury Sales Engine",
    description: "Sistemas de Inteligencia y Despliegue de Activos Digitales.",
    url: "https://zyndrix.dev",
    siteName: "Zyndrix Capital",
    images: [
      {
        url: "/img/logo_raw.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "es_ES",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <head>
        {/* Google Analytics - Strategic Monitoring */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XXXXXXXXXX');
          `}
        </Script>
      </head>
      <body className={`${inter.className} antialiased selection:bg-indigo-100 selection:text-indigo-900 transition-colors duration-300`}>
        {children}
      </body>
    </html>
  );
}
