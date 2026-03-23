import type { Metadata } from "next";
import { Background } from "@/components/common/Background";
import "./globals.css";

export const metadata: Metadata = {
  title: "ZYNDRIX | Control Center",
  description: "Autonomous Lead Generation Agency Hub",
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
