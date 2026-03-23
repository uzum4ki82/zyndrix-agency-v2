'use client';

import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Download, 
  Plus, 
  Mail, 
  Brain, 
  Zap, 
  Eye, 
  ArrowUpRight,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Target,
  Clock
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function LeadsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLeads, setSelectedLeads] = useState<number[]>([]);

  const toggleSelect = (id: number) => {
    setSelectedLeads(prev => 
      prev.includes(id) ? prev.filter(lid => lid !== id) : [...prev, id]
    );
  };

  return (
    <div className="flex flex-col gap-6 animate-in">
      <header className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
             <Target size={14} className="text-blue-500" /> Lead Pipeline & Management
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Leads CRM</h1>
        </div>
        <div className="flex items-center gap-3">
          <button className="ds-button ghost">
             <Download className="w-4 h-4" />
             <span>Exportar CSV</span>
          </button>
          <button className="ds-button primary shadow-lg shadow-blue-500/20">
            <Plus className="w-4 h-4" />
            <span>Añadir Lead</span>
          </button>
        </div>
      </header>

      {/* FILTER SEARCH BAR */}
      <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
          <div className="flex items-center gap-3 bg-white/[0.03] border border-white/[0.1] rounded-xl px-4 py-2 flex-1 max-w-sm focus-within:border-blue-500/50 transition-all">
             <Search className="w-4 h-4 text-slate-500" />
             <input 
                type="text" 
                placeholder="Buscar por nombre, email o empresa..." 
                className="bg-transparent border-none outline-none text-sm w-full font-medium"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
             />
          </div>
          <div className="flex items-center gap-2">
             <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.03] border border-white/[0.1] hover:bg-white/[0.06] transition-all text-xs font-bold text-slate-500 uppercase tracking-widest">
                <Filter className="w-4 h-4" />
                <span>Filtros Avanzados</span>
             </button>
          </div>
      </div>

      <div className="ds-card p-0 overflow-hidden bg-white/[0.01]">
         <table className="pro-table">
            <thead className="bg-white/[0.04]">
               <tr>
                  <th className="w-12 text-center">#</th>
                  <th>Nombre / Empresa</th>
                  <th>Estado</th>
                  <th>BANT Info</th>
                  <th>Score IA</th>
                  <th>Último Contacto</th>
                  <th className="text-right pr-6">Acciones Rápidas</th>
               </tr>
            </thead>
            <tbody>
               <tr>
                  <td colSpan={7} className="py-32 text-center text-slate-600 font-medium h-[400px]">
                     <div className="flex flex-col items-center gap-6 max-w-md mx-auto">
                        <div className="w-20 h-20 rounded-full bg-blue-500/5 flex items-center justify-center border border-white/[0.05] shadow-inner">
                           <Users size={32} className="text-slate-700" />
                        </div>
                        <div className="flex flex-col gap-2">
                           <h4 className="text-lg font-bold text-slate-400 uppercase font-mono tracking-tight">Database Totalmente Limpia</h4>
                           <p className="text-xs text-slate-600 leading-relaxed font-medium">No hay leads en la base de datos actual. Una vez que conectes tu landing page y el scoring de n8n, los registros aparecerán aquí automáticamente enriquecidos con IA.</p>
                        </div>
                        <div className="flex gap-4 mt-2">
                           <button className="ds-button ghost px-6 py-2 border-dashed border-white/[0.1] hover:border-blue-500/50">Simular Lead</button>
                           <button className="ds-button primary px-6 py-2 shadow-sm font-mono tracking-tighter uppercase text-xs">Conectar Webhook</button>
                        </div>
                     </div>
                  </td>
               </tr>
            </tbody>
         </table>
      </div>

      <div className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/[0.05] rounded-2xl">
         <div className="flex items-center gap-4 text-xs font-bold text-slate-600 uppercase tracking-widest">
            <span>Mostrando: 0 - 0 de 0 leads</span>
         </div>
         <div className="flex items-center gap-2 opacity-50 pointer-events-none">
            <button className="ds-button ghost p-2 text-slate-500"><ChevronLeft size={18} /></button>
            <span className="text-xs font-bold text-slate-400 w-8 text-center bg-white/[0.05] rounded py-1 border border-white/[0.05]">1</span>
            <button className="ds-button ghost p-2 text-slate-500"><ChevronRight size={18} /></button>
         </div>
      </div>
    </div>
  );
}
