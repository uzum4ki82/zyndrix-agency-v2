import type { Metadata } from "next";
import { Background } from "@/components/common/Background";
import "./globals.css";

export const metadata: Metadata = {
  title: "ZYNDRIX | Control Center",
  description: "Autonomous Lead Generation Agency Hub",
  icons: {
    icon: [
      { url: "/favicon.ico?v=2" },
      { url: "/favicon.png?v=2", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png?v=2",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased min-h-screen">
        <Background />
        {children}
      </body>
    </html>
  );
}
