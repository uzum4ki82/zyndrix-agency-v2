import type { Metadata } from "next";
import { Background } from "@/components/common/Background";
import "./globals.css";

/**
 * ZYNDRIX SEO INFRASTRUCTURE - ENTERPRISE LEVEL
 * Optimizado para indexación de Google Search Console 2024.
 * Incluye configuración OpenGraph, Twitter Cards y metadatos dinámicos.
 */

export const metadata: Metadata = {
  metadataBase: new URL('https://zyndrix.dev'),
  title: {
    default: "ZYNDRIX | Ingeniería de Automatización de IA y Captación de Leads",
    template: "%s | ZYNDRIX"
  },
  description: "Optimiza tu escala con sistemas de IA autónomos. Agencia de ingeniería de procesos que elimina la dependencia operativa y maximiza el ROI de tus leads.",
  keywords: ["IA para empresas", "Automatización de leads", "Ingeniería de procesos IA", "Agencia de automatización Madrid", "Captación de leads autónoma"],
  authors: [{ name: "Zyndrix Team" }],
  creator: "Zyndrix Agency",
  publisher: "Zyndrix",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico?v=3" },
      { url: "/favicon.png?v=3", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png?v=3",
  },
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "https://zyndrix.dev",
    siteName: "ZYNDRIX",
    title: "ZYNDRIX | La Estructura de la Autonomía Operativa",
    description: "Sistemas de IA de alto rendimiento para organizaciones que exigen eficiencia absoluta.",
    images: [
      {
        url: "/img/zyndrix-live.png",
        width: 1200,
        height: 630,
        alt: "Zyndrix Official Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ZYNDRIX | AI System Architecture",
    description: "Liderando la vanguardia de la eficiencia operativa con IA.",
    images: ["/img/zyndrix-live.png"],
    creator: "@zyndrix",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased min-h-screen selection:bg-primary/30">
        <Background />
        {children}
      </body>
    </html>
  );
}
