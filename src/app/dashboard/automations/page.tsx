'use client';

import React, { useState } from 'react';
import { 
  Zap, 
  Search, 
  Play, 
  Edit3, 
  ExternalLink, 
  Clock, 
  Activity, 
  Plus, 
  Webhook, 
  Mail, 
  Database, 
  Bot,
  Circle,
  MoreVertical,
  ChevronRight,
  TrendingUp,
  Workflow,
  Cpu,
  RefreshCcw,
  Code
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const mockAutomations = [
  { id: 1, name: 'Lead Multi-Scoring v4.2', type: 'WEBHOOK', status: 'ACTIVE', lastRun: '2m', successRate: '99.8%', runs: '12.4k', icon: Webhook, color: 'text-blue-500' },
  { id: 2, name: 'Auto-Responder Outreach', type: 'EMAIL', status: 'ACTIVE', lastRun: '14m', successRate: '98.2%', runs: '4.8k', icon: Mail, color: 'text-purple-500' },
  { id: 3, name: 'Database Hybrid Sync', type: 'DATABASE', status: 'INACTIVE', lastRun: '3d', successRate: '94.1%', runs: '1.2k', icon: Database, color: 'text-emerald-500' },
  { id: 4, name: 'Gemini Analysis Core', type: 'AI', status: 'ACTIVE', lastRun: '5m', successRate: '100%', runs: '8.9k', icon: Bot, color: 'text-indigo-500' },
  { id: 5, name: 'Slack Notifications Bot', type: 'SYSTEM', status: 'ACTIVE', lastRun: '1m', successRate: '100%', runs: '24.1k', icon: Zap, color: 'text-amber-500' },
];

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
             <span>Refrescar Stats</span>
          </button>
          <button className="ds-button primary">
            <Plus className="w-4 h-4" />
            <span>Nueva Automation</span>
          </button>
        </div>
      </header>

      {/* STATS OVERVIEW */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="ds-card flex items-center gap-5 p-6 bg-white/[0.01]">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
               <Cpu className="w-6 h-6 text-blue-500" />
            </div>
            <div className="flex flex-col">
               <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Current Load</span>
               <span className="text-2xl font-bold text-white uppercase font-mono tracking-tighter">14.2 ops/s</span>
            </div>
         </div>
         <div className="ds-card flex items-center gap-5 p-6 bg-white/[0.01]">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
               <Activity className="w-6 h-6 text-emerald-500" />
            </div>
            <div className="flex flex-col">
               <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Success Avg</span>
               <span className="text-2xl font-bold text-white uppercase font-mono tracking-tighter">99.4%</span>
            </div>
         </div>
         <div className="ds-card flex items-center gap-5 p-6 bg-white/[0.01]">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
               <TrendingUp className="w-6 h-6 text-purple-500" />
            </div>
            <div className="flex flex-col">
               <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Executions Today</span>
               <span className="text-2xl font-bold text-white uppercase font-mono tracking-tighter">8,421</span>
            </div>
         </div>
      </div>

      <div className="flex flex-col gap-4 mt-4">
         <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 bg-white/[0.02] border border-white/[0.08] rounded-xl px-4 py-2 flex-1 max-w-sm focus-within:border-blue-500/50 transition-all">
               <Search className="w-4 h-4 text-slate-500" />
               <input 
                  type="text" 
                  placeholder="Filtrar por nombre o tipo..." 
                  className="bg-transparent border-none outline-none text-sm w-full font-medium"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
               />
            </div>
         </div>

         <div className="grid grid-cols-1 gap-4">
            {mockAutomations.map((auto) => (
               <div key={auto.id} className="ds-card group p-5 hover:bg-white/[0.02] flex items-center gap-6 border border-white/[0.06] hover:border-blue-500/30 transition-all cursor-pointer">
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center border border-white/[0.1] shadow-inner transition-all group-hover:scale-105",
                    auto.color.replace('text', 'bg').concat('/5'),
                    auto.color
                  )}>
                     <auto.icon className="w-6 h-6" />
                  </div>
                  
                  <div className="flex flex-col flex-1 gap-1">
                     <div className="flex items-center gap-3">
                        <h4 className="font-bold text-white text-lg tracking-tight group-hover:text-blue-400 transition-colors uppercase font-mono">
                           {auto.name}
                        </h4>
                        <span className={cn(
                          "text-[9px] font-black tracking-widest px-2 py-0.5 rounded border border-white/[0.05]",
                          auto.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-500/10 text-slate-500'
                        )}>
                           {auto.status}
                        </span>
                     </div>
                     <div className="flex items-center gap-4 text-xs font-bold text-slate-500 tracking-tighter uppercase line-clamp-1">
                        <div className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Última run: {auto.lastRun} ago</div>
                        <div className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5" /> {auto.runs} runs</div>
                        <div className="flex items-center gap-1.5"><Activity className="w-3.5 h-3.5" /> Rate: {auto.successRate}</div>
                     </div>
                  </div>

                  <div className="flex items-center gap-2 group-hover:bg-white/[0.05] p-1.5 rounded-xl transition-all">
                     <button className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-500 hover:bg-blue-500 hover:text-white transition-all shadow-lg hover:shadow-blue-500/40">
                        <Play className="w-4 h-4" />
                     </button>
                     <button className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.1] text-slate-400 hover:text-white transition-all">
                        <Edit3 className="w-4 h-4" />
                     </button>
                     <button className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.1] text-slate-400 hover:text-white transition-all">
                        <Code className="w-4 h-4" />
                     </button>
                     <div className="h-8 w-px bg-white/[0.06] mx-2" />
                     <button className="p-2 rounded-lg hover:bg-white/[0.1] text-slate-600 transition-colors">
                        <MoreVertical className="w-5 h-5" />
                     </button>
                  </div>
               </div>
            ))}
         </div>
      </div>
    </div>
  );
}
