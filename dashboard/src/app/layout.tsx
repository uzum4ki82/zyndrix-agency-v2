import type { Metadata } from "next";
import "./globals.css";
import { DashboardContainer } from "@/components/layout/dashboard-container";

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
        <DashboardContainer>
          {children}
        </DashboardContainer>
      </body>
    </html>
  );
}
