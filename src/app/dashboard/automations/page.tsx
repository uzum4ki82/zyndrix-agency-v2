'use client';

import React, { useState } from 'react';
import { 
  Zap, 
  Search, 
  Play, 
  Settings, 
  Activity, 
  Plus, 
  Workflow, 
  Cpu, 
  RefreshCcw, 
  History,
  AlertCircle,
  MessageSquare,
  Globe,
  Database,
  ArrowUpRight,
  ShieldCheck,
  Pause,
  ExternalLink,
  Bot
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import StatCard from '@/components/dashboard/StatCard';
import { motion, AnimatePresence } from 'framer-motion';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const AUTOMATIONS = [
  {
    id: 'wa-zyn-v1',
    name: 'Zyn AI Agent - WhatsApp',
    description: 'Agente autónomo para atención al cliente y gestión de citas vía WhatsApp.',
    type: 'AI Agent',
    status: 'Active',
    lastRun: 'Hace 2 min',
    runs24h: 142,
    successRate: '99.2%',
    icon: MessageSquare,
    color: 'emerald',
    badge: 'Production'
  },
  {
    id: 'lead-disco-v1',
    name: 'Discovery Pipeline - Google Maps',
    description: 'Extracción masiva de leads e inyección directa en el CRM de Supabase.',
    type: 'Lead Gen',
    status: 'Scheduled',
    lastRun: 'Hoy, 09:00',
    runs24h: 1,
    successRate: '100%',
    icon: Globe,
    color: 'blue',
    badge: 'Cron'
  },
  {
    id: 'supa-sync-v1',
    name: 'Supabase Data Synchronizer',
    description: 'Mantiene la integridad de los datos entre n8n y el clúster de base de datos.',
    type: 'Infrastructure',
    status: 'Active',
    lastRun: 'En curso',
    runs24h: 1440,
    successRate: '100%',
    icon: Database,
    color: 'purple',
    badge: 'Core'
  }
];

export default function AutomationsPage() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="flex flex-col gap-8 animate-in mt-2 pb-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-xs font-black text-slate-500 uppercase tracking-[0.2em]">
             <Workflow size={14} className="text-blue-500" /> n8n Orchestrator Engine
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-3">
             <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-white/40">AUTOMATIZACIONES</span>
             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button className="ds-button ghost group relative overflow-hidden backdrop-blur-md">
             <RefreshCcw className="w-4 h-4 text-slate-500" />
             <span>Sync Status</span>
          </button>
          <button className="ds-button primary shadow-2xl shadow-blue-500/20 group">
            <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
            <span>Desplegar Nuevo Flujo</span>
          </button>
        </div>
      </header>

      {/* STATS OVERVIEW */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         <StatCard 
           label="Active Flows" 
           value="12" 
           trend="+2" 
           trendType="up"
           icon={Workflow} 
           subValue="n8n Production Environment"
           color="blue"
         />
         <StatCard 
           label="System Load" 
           value="24%" 
           trend="-5%" 
           trendType="down"
           icon={Cpu} 
           subValue="EC2 Instance Health: Optimal"
           color="emerald"
         />
         <StatCard 
           label="Executions" 
           value="1.4k" 
           trend="+12%" 
           trendType="up"
           icon={Zap} 
           subValue="Total runs (Last 24h)"
           color="violet"
         />
         <StatCard 
           label="Inference Score" 
           value="9.2" 
           trend="+0.1" 
           trendType="up"
           icon={Bot} 
           subValue="Avg. Model Accuracy"
           color="cyan"
         />
      </div>

      <div className="flex flex-col gap-6">
         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-3">
               Catálogo de Procesos
               <span className="px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] font-black text-blue-500 tracking-widest uppercase">3 ONLINE</span>
            </h2>
            <div className="flex items-center gap-3 bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 flex-1 max-w-sm focus-within:border-blue-500/50 transition-all">
               <Search className="w-4 h-4 text-slate-500" />
               <input 
                  type="text" 
                  placeholder="Buscar automatización..." 
                  className="bg-transparent border-none outline-none text-sm w-full font-medium"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
               />
            </div>
         </div>

         <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <AnimatePresence>
            {AUTOMATIONS.filter(a => a.name.toLowerCase().includes(searchTerm.toLowerCase())).map((auto, i) => (
              <motion.div 
                key={auto.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="ds-card p-0 flex flex-col group hover:border-blue-500/30 transition-all duration-500 bg-[#121215]/40 backdrop-blur-xl relative overflow-hidden"
              >
                {/* Background Glow */}
                <div className={`absolute -top-20 -right-20 w-40 h-40 bg-${auto.color}-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />
                
                <div className="p-8 pb-6 flex items-start gap-6 relative z-10">
                   <div className={`p-4 rounded-2xl bg-${auto.color}-500/10 border border-${auto.color}-500/20 text-${auto.color}-500 shadow-inner group-hover:scale-110 transition-transform duration-500`}>
                      <auto.icon size={32} />
                   </div>
                   <div className="flex-1 flex flex-col gap-1">
                      <div className="flex items-center justify-between mb-1">
                         <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{auto.type}</span>
                         <span className={cn(
                           "text-[9px] font-black px-2 py-0.5 rounded border tracking-widest uppercase",
                           auto.status === 'Active' ? "text-emerald-500 bg-emerald-500/5 border-emerald-500/20" : "text-blue-500 bg-blue-500/5 border-blue-500/20"
                         )}>
                           {auto.status}
                         </span>
                      </div>
                      <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors uppercase font-mono tracking-tighter">{auto.name}</h3>
                      <p className="text-xs text-slate-400 leading-relaxed max-w-sm mt-1">{auto.description}</p>
                   </div>
                </div>

                <div className="px-8 pb-8 pt-2 grid grid-cols-3 gap-6 relative z-10">
                   <div className="flex flex-col gap-0.5">
                      <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Runs (24h)</span>
                      <span className="text-sm font-bold text-slate-200 font-mono tracking-tighter">{auto.runs24h}</span>
                   </div>
                   <div className="flex flex-col gap-0.5 border-x border-white/[0.05] px-6">
                      <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Success</span>
                      <span className="text-sm font-bold text-emerald-500 font-mono tracking-tighter">{auto.successRate}</span>
                   </div>
                   <div className="flex flex-col gap-0.5">
                      <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Last Run</span>
                      <span className="text-sm font-bold text-slate-500 font-mono tracking-tighter">{auto.lastRun}</span>
                   </div>
                </div>

                <div className="mt-auto border-t border-white/[0.05] p-4 bg-white/[0.01] flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <button className="p-2 rounded-xl hover:bg-white/[0.05] text-slate-500 hover:text-white transition-all" title="Settings">
                         <Settings size={16} />
                      </button>
                      <button className="p-2 rounded-xl hover:bg-white/[0.05] text-slate-500 hover:text-white transition-all" title="Logs">
                         <History size={16} />
                      </button>
                   </div>
                   <div className="flex items-center gap-2">
                      <button className="ds-button ghost text-[10px] py-2 px-4 border-none hover:bg-white/5 uppercase tracking-widest">Configurar</button>
                      <button className={cn(
                        "p-2.5 rounded-xl transition-all shadow-lg",
                        auto.status === 'Active' ? "bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white shadow-rose-500/10" : "bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white shadow-blue-500/10"
                      )}>
                        {auto.status === 'Active' ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
                      </button>
                   </div>
                </div>
              </motion.div>
            ))}
            </AnimatePresence>
         </div>
      </div>
    </div>
  );
}
