import type { Metadata } from "next";
import { Outfit, Space_Grotesk } from "next/font/google";
import { Background } from "@/components/common/Background";
import "./globals.css";

// FUENTES DE GRADO EJECUTIVO
const outfit = Outfit({ 
  subsets: ["latin"], 
  variable: "--font-outfit",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({ 
  subsets: ["latin"], 
  variable: "--font-space-grotesk",
  display: "swap",
});

/**
 * ZYNDRIX SEO INFRASTRUCTURE - ENTERPRISE LEVEL
 * Optimizado para indexación de Google Search Console 2024.
 */

export const metadata: Metadata = {
  metadataBase: new URL('https://zyndrix.dev'),
  title: {
    default: "ZYNDRIX | Arquitectura de Automatización de IA",
    template: "%s | ZYNDRIX"
  },
  description: "Líderes en ingeniería de automatización IA para organizaciones que exigen eficiencia absoluta. Privatiza tu margen operativo con el Blueprint Zyndrix.",
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
    title: "ZYNDRIX | Arquitectura de Sistemas de IA",
    description: "La estructura de la autonomía operativa para PYMES y Grandes organizaciones.",
    images: [
      {
        url: "/img/zyndrix-live.png",
        width: 1200,
        height: 630,
        alt: "Zyndrix Official Logo",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${outfit.variable} ${spaceGrotesk.variable}`}>
      <body className="antialiased min-h-screen selection:bg-[#38bdf8]/30">
        <Background />
        {children}
      </body>
    </html>
  );
}

