import type { Metadata } from "next";
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
      <body className="antialiased min-h-screen bg-[#020617] text-slate-200">
        <div className="dark-grid" />
        {children}
      </body>
    </html>
  );
}
