'use client';

import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Download, 
  MoreHorizontal, 
  Mail, 
  Sparkles, 
  Brain,
  ChevronLeft,
  ChevronRight,
  UserPlus,
  Send,
  Zap,
  MoreVertical,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const mockLeads = [
  { id: 1, name: 'María López', email: 'm.lopez@globaltech.com', company: 'Global Tech SA', status: 'HOT', score: 9.4, bant: 'B: High, A: Mid, N: High, T: Q1' },
  { id: 2, name: 'Enrique Castro', email: 'enrique@castrologistics.es', company: 'Castro Logistics', status: 'WARM', score: 6.8, bant: 'B: Mid, A: Low, N: High, T: Q2' },
  { id: 3, name: 'Jimena Fuentes', email: 'jimena@creativelab.io', company: 'Creative Lab', status: 'COLD', score: 3.2, bant: 'B: Low, A: Low, N: Mid, T: Q4' },
  { id: 4, name: 'Carlos Ruiz', email: 'cruiz@nextrealstate.com', company: 'Next Real Estate', status: 'HOT', score: 9.1, bant: 'B: High, A: High, N: High, T: Q1' },
  { id: 5, name: 'Elena García', email: 'e.garcia@techsolutions.cl', company: 'Tech Solutions CL', status: 'WARM', score: 7.2, bant: 'B: Mid, A: Mid, N: High, T: Q2' },
  { id: 6, name: 'Roberto Díaz', email: 'rdiaz@energycorp.mx', company: 'Energy Corp MX', status: 'HOT', score: 8.9, bant: 'B: High, A: Mid, N: High, T: Q1' },
  { id: 7, name: 'Lucía Méndez', email: 'lucia.m@marketinghub.co', company: 'Marketing Hub', status: 'COLD', score: 4.1, bant: 'B: Low, A: Mid, N: Low, T: Q3' },
];

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
            <Users className="w-3.5 h-3.5" /> CRM Central
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Leads Management</h1>
        </div>
        <div className="flex items-center gap-3">
          <button className="ds-button ghost">
            <Download className="w-4 h-4" />
            <span>Exportar CSV</span>
          </button>
          <button className="ds-button primary">
            <UserPlus className="w-4 h-4" />
            <span>Añadir Lead</span>
          </button>
        </div>
      </header>

      {/* FILTER BAR */}
      <div className="flex items-center justify-between gap-4 bg-white/[0.02] border border-white/[0.05] p-3 rounded-2xl">
        <div className="flex items-center gap-4 flex-1">
          <div className="flex items-center gap-2 bg-white/[0.03] border border-white/[0.1] rounded-xl px-4 py-2 flex-1 max-w-md focus-within:border-blue-500/50 transition-all">
            <Search className="w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="Buscar por nombre, email o empresa..." 
              className="bg-transparent border-none outline-none text-sm w-full font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.03] border border-white/[0.1] hover:bg-white/[0.06] transition-all text-sm font-semibold text-slate-300">
            <Filter className="w-4 h-4 text-slate-500" />
            <span>Filtros</span>
          </button>
        </div>
        
        <div className="flex items-center gap-2">
           <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mr-2">MOSTRANDO 1-7 DE 1,248</span>
           <div className="flex items-center gap-1">
              <button className="p-2 rounded-lg bg-white/[0.03] border border-white/[0.1] text-slate-500 hover:text-white transition-all"><ChevronLeft size={16}/></button>
              <button className="p-2 rounded-lg bg-white/[0.03] border border-white/[0.1] text-slate-500 hover:text-white transition-all"><ChevronRight size={16}/></button>
           </div>
        </div>
      </div>

      {/* LEADS TABLE */}
      <div className="card-container overflow-hidden border border-white/[0.08] rounded-2xl bg-white/[0.01]">
        <table className="pro-table">
          <thead className="bg-white/[0.02]">
            <tr>
              <th className="w-10">
                <input type="checkbox" className="accent-blue-500" />
              </th>
              <th>Información del Lead</th>
              <th>Calificación IA</th>
              <th>BANT Profiling</th>
              <th>Acciones de Automatización</th>
              <th className="text-right">Detalles</th>
            </tr>
          </thead>
          <tbody>
            {mockLeads.map((lead) => (
              <tr key={lead.id} className={cn("transition-colors", selectedLeads.includes(lead.id) ? "bg-blue-500/5" : "hover:bg-white/[0.02]")}>
                <td>
                  <input 
                    type="checkbox" 
                    className="accent-blue-500" 
                    checked={selectedLeads.includes(lead.id)}
                    onChange={() => toggleSelect(lead.id)}
                  />
                </td>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 border border-white/[0.1] flex items-center justify-center text-xs font-bold text-slate-300">
                      {lead.name.split(' ').map(n=>n[0]).join('')}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-100">{lead.name}</span>
                      <span className="text-xs text-slate-500 font-medium">{lead.email}</span>
                    </div>
                  </div>
                </td>
                <td>
                   <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-2 justify-between w-24">
                         <span className={cn(
                           "text-[9px] font-black px-1.5 py-0.5 rounded border border-white/[0.05] tracking-widest",
                           lead.status === 'HOT' ? 'bg-rose-500/10 text-rose-500' : lead.status === 'WARM' ? 'bg-amber-500/10 text-amber-500' : 'bg-slate-500/10 text-slate-500'
                         )}>
                           {lead.status}
                         </span>
                         <span className="text-xs font-mono font-bold text-blue-400">{lead.score}</span>
                      </div>
                      <div className="w-24 h-1 bg-white/[0.05] rounded-full overflow-hidden">
                         <div 
                           className={cn("h-full rounded-full transition-all duration-1000", lead.status === 'HOT' ? 'bg-rose-500' : lead.status === 'WARM' ? 'bg-amber-500' : 'bg-slate-500')} 
                           style={{ width: `${lead.score * 10}%` }} 
                         />
                      </div>
                   </div>
                </td>
                <td>
                   <div className="flex items-center gap-2">
                     <AlertCircle className="w-3.5 h-3.5 text-blue-500/50" />
                     <span className="text-[11px] font-medium text-slate-400">{lead.bant}</span>
                   </div>
                </td>
                <td>
                   <div className="flex items-center gap-2">
                      <button className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-500 hover:bg-blue-500/20 transition-all group" title="Generar Email con IA">
                         <Mail className="w-4 h-4 group-hover:scale-110" />
                      </button>
                      <button className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/20 transition-all group" title="Clasificar con IA">
                         <Brain className="w-4 h-4 group-hover:scale-110" />
                      </button>
                      <button className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-500 hover:bg-purple-500/20 transition-all group" title="Ejecutar Workflow n8n">
                         <Zap className="w-4 h-4 group-hover:scale-110" />
                      </button>
                   </div>
                </td>
                <td className="text-right">
                   <button className="p-2 rounded-lg hover:bg-white/[0.05] text-slate-600 hover:text-white transition-all">
                      <MoreVertical className="w-4 h-4" />
                   </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/[0.05] rounded-2xl">
         <div className="flex items-center gap-2">
            <button className="ds-button ghost text-xs">Anterior</button>
            <div className="flex items-center gap-1">
               <button className="w-8 h-8 rounded-lg bg-blue-500 text-white text-xs font-bold">1</button>
               <button className="w-8 h-8 rounded-lg hover:bg-white/[0.05] text-slate-500 text-xs font-bold">2</button>
               <button className="w-8 h-8 rounded-lg hover:bg-white/[0.05] text-slate-500 text-xs font-bold">3</button>
               <span className="px-1 text-slate-600">...</span>
               <button className="w-8 h-8 rounded-lg hover:bg-white/[0.05] text-slate-500 text-xs font-bold">12</button>
            </div>
            <button className="ds-button ghost text-xs">Siguiente</button>
         </div>
         <span className="text-[11px] font-bold text-slate-600 uppercase tracking-widest">Page 1 of 124</span>
      </div>
    </div>
  );
}
