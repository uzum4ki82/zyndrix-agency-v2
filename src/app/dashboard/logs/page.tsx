'use client';

import React from 'react';
import { 
  ScrollText, 
  Search, 
  Filter, 
  Download, 
  Terminal, 
  Zap, 
  Activity, 
  Clock, 
  XCircle, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function LogsPage() {
  return (
    <div className="flex flex-col gap-6 animate-in">
      <header className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
             <Terminal size={14} className="text-emerald-500" /> Audit Trail & System Logs
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white uppercase font-mono tracking-tight">System Events</h1>
        </div>
        <div className="flex items-center gap-3">
          <button className="ds-button ghost opacity-50 pointer-events-none">
             <Download className="w-4 h-4" />
             <span>Export Log History</span>
          </button>
        </div>
      </header>

      {/* FILTER SEARCH BAR */}
      <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
          <div className="flex items-center gap-3 bg-white/[0.03] border border-white/[0.1] rounded-xl px-4 py-2 flex-1 max-w-sm">
             <Search className="w-4 h-4 text-slate-500" />
             <input 
                type="text" 
                placeholder="No hay eventos registrados..." 
                className="bg-transparent border-none outline-none text-sm w-full font-medium"
                readOnly
             />
          </div>
      </div>

      <div className="ds-card p-0 overflow-hidden bg-white/[0.01]">
         <table className="pro-table">
            <thead className="bg-white/[0.04]">
               <tr>
                  <th className="w-24">Exec ID</th>
                  <th>Webhook / Integration</th>
                  <th>Status</th>
                  <th>Run Time</th>
                  <th>Timestamp</th>
                  <th className="text-right">Audit</th>
               </tr>
            </thead>
            <tbody>
               <tr>
                  <td colSpan={6} className="py-40 text-center text-slate-700 font-medium h-[400px]">
                     <div className="flex flex-col items-center gap-6 max-w-md mx-auto">
                        <div className="w-20 h-20 rounded-full bg-emerald-500/5 flex items-center justify-center border border-white/[0.05] shadow-inner text-slate-800">
                           <Terminal size={32} />
                        </div>
                        <div className="flex flex-col gap-2">
                           <h4 className="text-lg font-bold text-slate-500 uppercase font-mono tracking-tight">Registro de Eventos Vacío</h4>
                           <p className="text-[11px] text-slate-600 leading-relaxed font-medium">El audit trail del sistema no contiene ejecuciones previas. Todas las llamadas a webhooks y logs de n8n se registrarán aquí en tiempo real una vez que el sistema esté operativo.</p>
                        </div>
                     </div>
                  </td>
               </tr>
            </tbody>
         </table>
      </div>

      <div className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/[0.05] rounded-2xl">
         <div className="flex items-center gap-2 opacity-30 pointer-events-none">
            <button className="ds-button ghost text-xs px-3">Prev</button>
            <button className="ds-button ghost text-xs px-3 border-blue-500 text-blue-500">1</button>
            <button className="ds-button ghost text-xs px-3">Next</button>
         </div>
         <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Event Logging ON (Persistent: 30 days)</span>
      </div>
    </div>
  );
}
