import type { Metadata } from "next";
import "./globals.css";
import { 
  ChevronRight
} from 'lucide-react';
import { CommandPalette } from "@/components/expert/command-palette";
import { ToastContainer } from "@/components/ui/toast";
import { Sidebar } from "@/components/layout/sidebar";

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
        
        <div className="flex min-h-screen relative z-10 font-outfit">
          <CommandPalette />
          <ToastContainer />
          
          {/* SIDEBAR PREMIUM (Client Component) */}
          <Sidebar />

          {/* CONTENIDO PRINCIPAL */}
          <main className="flex-1 flex flex-col h-screen overflow-y-auto bg-[#020617]/20">
            <header className="h-20 border-b border-slate-800/40 flex items-center justify-between px-10 sticky top-0 bg-[#020617]/60 backdrop-blur-xl z-20">
              <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-slate-500">
                <span>Dashboard</span>
                <ChevronRight size={12} className="text-slate-700" />
                <span className="text-white">Panel de Control</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex flex-col text-right">
                  <span className="text-[11px] font-bold text-white uppercase tracking-tight">Oscar Montes</span>
                  <span className="text-[9px] font-black text-cyan-500 uppercase tracking-widest">Agency Admin</span>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 flex items-center justify-center text-xs font-bold text-slate-400 shadow-xl group cursor-pointer hover:border-cyan-500/50 transition-all">
                  OM
                </div>
              </div>
            </header>

            <div className="p-6 max-w-7xl mx-auto w-full">
              {children}
            </div>

            <footer className="mt-auto py-6 px-10 border-t border-slate-800/20 text-[9px] font-black text-slate-600 uppercase tracking-[0.2em] flex justify-between">
              <span>&copy; 2026 ZYNDRIX AI • Powered by Advanced Agentic Code</span>
              <span className="text-slate-500">v3.0.0-PRO</span>
            </footer>
          </main>
        </div>
      </body>
    </html>
  );
}
