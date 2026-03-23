'use client';

import React from 'react';
import { 
  Bell, 
  Search, 
  Terminal, 
  User, 
  Command,
  HelpCircle,
  Activity
} from 'lucide-react';

export default function Topbar() {
  return (
    <header className="dashboard-header">
      <div className="flex items-center gap-6 w-1/3">
        <div className="flex items-center gap-2 bg-white/[0.03] border border-white/[0.08] rounded-lg px-3 py-1.5 w-full max-w-sm group focus-within:border-blue-500/50 transition-all cursor-pointer">
          <Search className="w-4 h-4 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
          <span className="text-slate-500 text-sm font-medium transition-colors">Buscar leads...</span>
          <div className="ml-auto flex items-center gap-1 bg-white/[0.05] border border-white/[0.1] rounded px-1.5 py-0.5 pointer-events-none">
            <Command className="w-2.5 h-2.5 text-slate-400" />
            <span className="text-[10px] font-bold text-slate-400">K</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 mr-4">
          <Activity className="w-3.5 h-3.5 text-emerald-500" />
          <span className="text-[11px] font-bold text-emerald-500 tracking-tight">n8n OPERATIONAL</span>
        </div>

        <button className="p-2 rounded-lg hover:bg-white/[0.05] transition-colors relative">
          <Bell className="w-5 h-5 text-slate-400" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-blue-500 rounded-full border-2 border-slate-950"></span>
        </button>

        <button className="p-2 rounded-lg hover:bg-white/[0.05] transition-colors">
          <HelpCircle className="w-5 h-5 text-slate-400" />
        </button>

        <button className="p-2 rounded-lg hover:bg-white/[0.05] transition-colors">
          <Terminal className="w-5 h-5 text-slate-400" />
        </button>

        <div className="h-8 w-px bg-white/[0.08] mx-2" />

        <div className="flex items-center gap-3 pl-2 cursor-pointer group">
          <div className="flex flex-col items-end">
            <span className="text-sm font-semibold tracking-tight leading-tight">Zyndrix Control</span>
            <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest opacity-80">Admin Console</span>
          </div>
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-slate-200 to-slate-400 border border-white/[0.2] flex items-center justify-center p-0.5 group-hover:shadow-lg group-hover:shadow-blue-500/20 transition-all">
             <User className="w-6 h-6 text-slate-900" />
          </div>
        </div>
      </div>
    </header>
  );
}
