'use client';

import React from 'react';
import { 
  ScrollText, 
  Search, 
  Filter, 
  Download, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Eye, 
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Clock,
  Zap,
  Terminal,
  Code
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const mockLogs = [
  { id: 'ex_1842', webhook: 'zyndrix-lead-scoring', status: 'SUCCESS', runtime: '428ms', timestamp: '22 Mar, 10:42:01', integration: 'n8n Cloud' },
  { id: 'ex_1841', webhook: 'auto-responder-lead', status: 'SUCCESS', runtime: '812ms', timestamp: '22 Mar, 10:41:45', integration: 'n8n Cloud' },
  { id: 'ex_1840', webhook: 'zyndrix-lead-scoring', status: 'ERROR', runtime: '1241ms', timestamp: '22 Mar, 10:38:12', integration: 'n8n Cloud' },
  { id: 'ex_1839', webhook: 'slack-notif-bot', status: 'WARNING', runtime: '215ms', timestamp: '22 Mar, 10:12:05', integration: 'n8n Cloud' },
  { id: 'ex_1838', webhook: 'zyndrix-lead-scoring', status: 'SUCCESS', runtime: '394ms', timestamp: '22 Mar, 09:56:44', integration: 'n8n Cloud' },
  { id: 'ex_1837', webhook: 'database-sync-hub', status: 'SUCCESS', runtime: '184ms', timestamp: '22 Mar, 09:12:31', integration: 'n8n Cloud' },
  { id: 'ex_1836', webhook: 'zyndrix-lead-scoring', status: 'SUCCESS', runtime: '411ms', timestamp: '22 Mar, 08:44:11', integration: 'n8n Cloud' },
  { id: 'ex_1835', webhook: 'email-gemini-gen', status: 'SUCCESS', runtime: '2481ms', timestamp: '22 Mar, 08:32:00', integration: 'n8n Cloud' },
];

export default function LogsPage() {
  return (
    <div className="flex flex-col gap-6 opacity-0 translate-y-4 animate-in fill-mode-forwards duration-700 ease-out-quint">
      <header className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
             <Terminal size={14} className="text-emerald-500" /> Audit Trail & System Logs
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white uppercase font-mono tracking-tight">System Events</h1>
        </div>
        <div className="flex items-center gap-3">
          <button className="ds-button ghost">
             <Download className="w-4 h-4" />
             <span>Export Log History</span>
          </button>
        </div>
      </header>

      {/* FILTER SEARCH BAR */}
      <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
          <div className="flex items-center gap-3 bg-white/[0.03] border border-white/[0.1] rounded-xl px-4 py-2 flex-1 max-w-sm focus-within:border-blue-500/50 transition-all">
             <Search className="w-4 h-4 text-slate-500" />
             <input 
                type="text" 
                placeholder="Buscar por ID o integración..." 
                className="bg-transparent border-none outline-none text-sm w-full font-medium"
             />
          </div>
          <div className="flex items-center gap-2">
             <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.03] border border-white/[0.1] hover:bg-white/[0.06] transition-all text-xs font-bold text-slate-500 uppercase tracking-widest">
                <Filter className="w-4 h-4" />
                <span>Status: All</span>
             </button>
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
               {mockLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-white/[0.03] transition-colors border-b border-white/[0.02]">
                     <td>
                        <span className="text-[11px] font-bold font-mono text-slate-500 px-2 py-1 rounded bg-white/[0.05] border border-white/[0.05]">
                           {log.id}
                        </span>
                     </td>
                     <td>
                        <div className="flex items-center gap-3">
                           <Zap className="w-3.5 h-3.5 text-blue-500" />
                           <span className="text-sm font-bold text-slate-200 uppercase font-mono tracking-tighter">{log.webhook}</span>
                        </div>
                     </td>
                     <td>
                        <div className="flex items-center gap-2">
                           {log.status === 'SUCCESS' ? <CheckCircle2 size={12} className="text-emerald-500" /> : log.status === 'ERROR' ? <XCircle size={12} className="text-rose-500" /> : <AlertTriangle size={12} className="text-amber-500" />}
                           <span className={cn(
                             "text-[10px] font-black tracking-widest rounded px-1.5 py-0.5 border border-white/[0.02]",
                             log.status === 'SUCCESS' ? 'text-emerald-500 bg-emerald-500/10' : log.status === 'ERROR' ? 'text-rose-500 bg-rose-500/10' : 'text-amber-500 bg-amber-500/10'
                           )}>
                              {log.status}
                           </span>
                        </div>
                     </td>
                     <td>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 font-mono italic">
                           <Clock className="w-3 h-3" /> {log.runtime}
                        </div>
                     </td>
                     <td>
                        <span className="text-xs font-medium text-slate-600">{log.timestamp}</span>
                     </td>
                     <td className="text-right">
                        <div className="flex items-center justify-end gap-2">
                           <button className="p-2 rounded-lg hover:bg-white/[0.1] text-slate-500 hover:text-white transition-all group" title="View Payload">
                              <Code className="w-4 h-4 group-hover:scale-110" />
                           </button>
                           <button className="p-2 rounded-lg hover:bg-white/[0.1] text-slate-500 hover:text-white transition-all group" title="Open n8n Workflow">
                              <ExternalLink className="w-4 h-4 group-hover:scale-110" />
                           </button>
                        </div>
                     </td>
                  </tr>
               ))}
            </tbody>
         </table>
      </div>

      <div className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/[0.05] rounded-2xl">
         <div className="flex items-center gap-2">
            <button className="ds-button ghost text-xs px-3">Prev</button>
            <button className="ds-button ghost text-xs px-3 border-blue-500 text-blue-500">1</button>
            <button className="ds-button ghost text-xs px-3">2</button>
            <button className="ds-button ghost text-xs px-3">3</button>
            <button className="ds-button ghost text-xs px-3">Next</button>
         </div>
         <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Event Logging active (Persistence: 30 days)</span>
      </div>
    </div>
  );
}
