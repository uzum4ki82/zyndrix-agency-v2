import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

export const viewport: Viewport = {
  themeColor: "#6366f1",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "ZYNDRIX COMMANDER | AI Sales Engine",
  description: "Next-gen autonomous sales infrastructure for elite businesses. Proactive lead discovery and strategic outreach reporting.",
  openGraph: {
    title: "ZYNDRIX COMMANDER",
    description: "AI-Powered Sales Infrastructure",
    url: "https://zyndrix.dev",
    siteName: "Zyndrix",
    images: [
      {
        url: "/img/logo-dark.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "es_ES",
    type: "website",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Zyndrix",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased transition-colors duration-300">
        {children}
      </body>
    </html>
  );
}
