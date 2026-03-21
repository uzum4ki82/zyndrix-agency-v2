'use client';

import { useState } from "react";
import { 
  ChevronRight,
  Menu,
  Bell
} from 'lucide-react';
import { Sidebar } from "@/components/layout/sidebar";
import { CommandPalette } from "@/components/expert/command-palette";
import { ToastContainer } from "@/components/ui/toast";

export function DashboardContainer({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen relative z-10 font-outfit">
      <CommandPalette />
      <ToastContainer />
      
      {/* SIDEBAR PREMIUM (Client Component) */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto bg-[#020617]/20">
        {/* MOBILE HEADER */}
        <header className="lg:hidden h-16 border-b border-slate-800/40 flex items-center justify-between px-6 sticky top-0 bg-[#020617]/60 backdrop-blur-xl z-[90]">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 -ml-2 text-slate-400 hover:text-white transition-colors"
            aria-label="Abrir menú"
          >
            <Menu size={24} />
          </button>
          
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg tracking-tighter text-white uppercase italic">
              Zyndrix
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <button className="p-2 text-slate-400 hover:text-white transition-colors">
              <Bell size={20} />
            </button>
          </div>
        </header>

        {/* DESKTOP HEADER (Hidden on mobile) */}
        <header className="hidden lg:flex h-20 border-b border-slate-800/40 items-center justify-between px-10 sticky top-0 bg-[#020617]/60 backdrop-blur-xl z-20">
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

        <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {children}
        </div>

        <footer className="mt-auto py-6 px-6 lg:px-10 border-t border-slate-800/20 text-[9px] font-black text-slate-600 uppercase tracking-[0.2em] flex flex-col md:flex-row justify-between gap-4 text-center md:text-left">
          <span>&copy; 2026 ZYNDRIX AI • Powered by Advanced Agentic Code</span>
          <span className="text-slate-500">v3.0.0-PRO</span>
        </footer>
      </main>
    </div>
  );
}
