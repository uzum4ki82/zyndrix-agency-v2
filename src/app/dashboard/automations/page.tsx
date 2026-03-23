'use client';

import React, { useState } from 'react';
import { 
  Zap, 
  Search, 
  Play, 
  Edit3, 
  Activity, 
  Plus, 
  Workflow, 
  Cpu, 
  RefreshCcw, 
  History,
  AlertCircle
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function AutomationsPage() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="flex flex-col gap-6 animate-in">
      <header className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
             <Workflow size={14} className="text-purple-500" /> n8n Orchestrator
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Automatizaciones</h1>
        </div>
        <div className="flex items-center gap-3">
          <button className="ds-button ghost">
             <RefreshCcw className="w-4 h-4" />
             <span>Sin Stats</span>
          </button>
          <button className="ds-button primary shadow-lg shadow-blue-500/20">
            <Plus className="w-4 h-4" />
            <span>Nueva Automation</span>
          </button>
        </div>
      </header>

      {/* STATS OVERVIEW - ZERO STATE */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 opacity-40">
         <div className="ds-card flex items-center gap-5 p-6 bg-white/[0.01]">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
               <Cpu className="w-6 h-6 text-blue-500" />
            </div>
            <div className="flex flex-col">
               <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Load</span>
               <span className="text-2xl font-bold text-white uppercase font-mono tracking-tighter">0.0 ops/s</span>
            </div>
         </div>
         <div className="ds-card flex items-center gap-5 p-6 bg-white/[0.01]">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
               <Activity className="w-6 h-6 text-emerald-500" />
            </div>
            <div className="flex flex-col">
               <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Success Rate</span>
               <span className="text-2xl font-bold text-white uppercase font-mono tracking-tighter">100%</span>
            </div>
         </div>
         <div className="ds-card flex items-center gap-5 p-6 bg-white/[0.01]">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
               <Zap className="w-6 h-6 text-purple-500" />
            </div>
            <div className="flex flex-col">
               <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Total Runs</span>
               <span className="text-2xl font-bold text-white uppercase font-mono tracking-tighter">0</span>
            </div>
         </div>
      </div>

      <div className="flex flex-col gap-4 mt-4">
         <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 bg-white/[0.02] border border-white/[0.05] rounded-xl px-4 py-2 flex-1 max-w-sm">
               <Search className="w-4 h-4 text-slate-500" />
               <input 
                  type="text" 
                  placeholder="No hay automatizaciones..." 
                  className="bg-transparent border-none outline-none text-sm w-full font-medium"
                  value={searchTerm}
                  readOnly
               />
            </div>
         </div>

         <div className="ds-card flex flex-col items-center justify-center py-32 text-center gap-6 bg-white/[0.01] border-dashed">
            <div className="w-20 h-20 rounded-3xl bg-purple-500/5 flex items-center justify-center border border-white/[0.05] text-slate-700 animate-pulse">
               <Workflow size={32} />
            </div>
            <div className="flex flex-col gap-2 max-w-xs mx-auto">
               <h4 className="text-lg font-bold text-slate-400 uppercase font-mono tracking-tight">Cero Automatizaciones</h4>
               <p className="text-xs text-slate-600 leading-relaxed font-medium">No se han detectado flujos de n8n sincronizados. Empieza creando tu primera automatización en la nube.</p>
            </div>
            <button className="ds-button ghost border-white/[0.1] hover:border-purple-500/50 hover:text-white transition-all">Configurar n8n Connect ›</button>
         </div>
      </div>
    </div>
  );
}
