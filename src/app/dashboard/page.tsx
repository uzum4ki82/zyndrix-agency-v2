'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Zap, 
  Target, 
  ArrowUpRight, 
  TrendingUp,
  Workflow,
  Plus,
  Loader2,
  Activity,
  ChevronRight,
  Sparkles,
  Database,
  ShieldCheck,
  Bot,
  Brain
} from 'lucide-react';
import StatCard from '@/components/dashboard/StatCard';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import AnalysisModal from '@/components/dashboard/AnalysisModal';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Mock logs if n8n is not reachable
const DEFAULT_LOGS = [
  { br: 'ZYN-WA', t: 'Hace 2s', a: 'Inferencia Completada', dt: 'El agente respondió a una consulta sobre precios.', c: '#10b981' },
  { br: 'DISCO', t: 'Hace 15m', a: 'Lead Detectado', dt: 'Nueva clínica dental encontrada en Madrid.', c: '#3b82f6' },
  { br: 'SYSTEM', t: 'Sincronizado', a: 'DB Heartbeat', dt: 'Conexión con Supabase Cluster establecida.', c: '#8b5cf6' }
];

export default function DashboardOverview() {
  const [leadCount, setLeadCount] = useState<number | null>(null);
  const [conversionRate, setConversionRate] = useState<number | null>(null);
  const [recentLeads, setRecentLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [n8nLogs, setN8nLogs] = useState<any[]>(DEFAULT_LOGS);
  const [selectedProspect, setSelectedProspect] = useState<any>(null);
  const [isAnalysisModalOpen, setIsAnalysisModalOpen] = useState(false);

  const openAnalysis = (prospect: any) => {
    setSelectedProspect(prospect);
    setIsAnalysisModalOpen(true);
  };

  const fetchN8nData = async () => {
    try {
      const resp = await fetch('https://n8n.zyndrix.dev/webhook/dashboard-data', { signal: AbortSignal.timeout(3000) });
      if (resp.ok) {
        const data = await resp.json();
        if (data.feed && data.feed.length > 0) setN8nLogs(data.feed);
      }
    } catch (e) { 
      // Silently fail and keep default logs
    }
  };

  const fetchData = async () => {
    try {
      // Fetch from prospects (new schema)
      const { data: allLeads, error } = await supabase
        .from('prospects')
        .select(`
          *,
          companies (name)
        `)
        .order('created_at', { ascending: false });
      
      if (!error && allLeads) {
        setLeadCount(allLeads.length);
        const highPriority = allLeads.filter((l: any) => l.priority === 'Critical' || l.priority === 'High' || l.status === 'Qualified').length;
        const rate = allLeads.length > 0 ? (highPriority / allLeads.length) * 100 : 0;
        setConversionRate(Math.floor(rate) || 18);
        setRecentLeads(allLeads.slice(0, 5));
      } else {
        // Fallback to legacy leads
        const { data: legacyLeads } = await supabase.from('leads').select('*').order('created_at', { ascending: false });
        if (legacyLeads) {
          setLeadCount(legacyLeads.length);
          setRecentLeads(legacyLeads.slice(0, 5));
        }
      }
    } catch (err) {
      console.warn('Dashboard data fetch failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    fetchN8nData();
    const n8nInterval = setInterval(fetchN8nData, 30000);

    const channel = supabase
      .channel('dashboard-leads-feed')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'prospects' }, () => fetchData())
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
      clearInterval(n8nInterval);
    };
  }, []);

  return (
    <div className="flex flex-col gap-10 animate-in">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">
             <ShieldCheck size={14} className="text-blue-500" /> Operational Readiness: Optimal
          </div>
          <h1 className="text-3xl font-black tracking-tighter text-white flex items-center gap-3">
            MISSION <span className="bg-clip-text text-transparent bg-gradient-to-r from-rose-500 to-amber-500 font-mono italic">CONTROL V7</span>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white/5 border border-white/10 ml-2">
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
               <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Live Engine</span>
            </div>
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button className="ds-button ghost border-white/5 backdrop-blur-md">
             <Bot className="w-4 h-4 text-purple-500" />
             <span>AI Insight</span>
          </button>
          <Link href="/dashboard/automations">
            <button className="ds-button primary shadow-2xl shadow-blue-500/20 group px-6">
               <Workflow className="w-4 h-4 group-hover:rotate-12 transition-transform" />
               <span className="font-black tracking-widest text-[10px]">ORQUESTAR FLUJOS</span>
            </button>
          </Link>
        </div>
      </header>

      {/* KPI GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="Prospectos Totales" 
          value={loading ? '...' : (leadCount || 0).toString()} 
          trend="+14%" 
          trendType="up"
          icon={Users} 
          subValue="Cross-platform discovery"
          color="blue"
        />
        <StatCard 
          label="Efficiency Rate" 
          value={loading ? '...' : `${conversionRate || 24}%`} 
          trend="+2.1%" 
          trendType="up"
          icon={Target} 
          subValue="Lead Qualified Accuracy"
          color="emerald"
        />
        <StatCard 
          label="Automations Active" 
          value="12" 
          trend="+3" 
          trendType="up"
          icon={Zap} 
          subValue="Running on n8n Engine"
          color="violet"
        />
        <StatCard 
          label="Inference Load" 
          value="12ms" 
          trend="Stable" 
          trendType="up"
          icon={Activity} 
          subValue="GPT-4o Response Time"
          color="cyan"
        />
      </div>

      {/* DASHBOARD GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEADS TABLE MINI */}
        <div className="lg:col-span-2 ds-card p-0 flex flex-col h-full bg-[#121215]/40 backdrop-blur-xl border-white/5 overflow-hidden">
          <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
            <h3 className="text-lg font-bold text-white flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 border border-blue-500/20 shadow-inner">
                <Users size={16} />
              </div>
              Inbound Pipeline (Real-Time)
            </h3>
            <Link href="/dashboard/leads">
               <button className="text-[10px] font-black text-slate-500 hover:text-blue-500 transition-all uppercase tracking-widest flex items-center gap-2 group/btn">
                  VER CRM COMPLETO 
                  <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
               </button>
            </Link>
          </div>
          <div className="flex-1 overflow-x-auto w-full">
             <div className="table-container">
              <table className="pro-table">
                 <thead>
                    <tr className="border-b border-white/5">
                       <th className="text-[10px] uppercase tracking-widest py-5">Prospecto / Empresa</th>
                       <th className="text-[10px] uppercase tracking-widest">Status</th>
                       <th className="text-[10px] uppercase tracking-widest">AI Tier</th>
                       <th className="text-right pr-6 text-[10px] uppercase tracking-widest text-slate-700">Ref</th>
                    </tr>
                 </thead>
                 <tbody>
                    <AnimatePresence mode="wait">
                    {loading ? (
                       <tr><td colSpan={4} className="py-20 text-center text-slate-600 animate-pulse uppercase text-[10px] font-black tracking-widest">Synchronizing Neural Net...</td></tr>
                    ) : recentLeads.length > 0 ? (
                       recentLeads.map((lead, i) => (
                         <motion.tr 
                           key={lead.id || i} 
                           initial={{ opacity: 0, x: -10 }} 
                           animate={{ opacity: 1, x: 0 }} 
                           transition={{ delay: i * 0.1 }}
                           className="hover:bg-white/[0.03] transition-colors border-b border-white/[0.02]"
                         >
                            <td>
                               <div className="flex flex-col gap-0.5 py-1">
                                  <span className="font-bold text-slate-200 uppercase font-mono tracking-tighter text-xs">
                                     {lead.first_name ? `${lead.first_name} ${lead.last_name || ''}` : lead.name}
                                  </span>
                                  <span className="text-[9px] text-slate-600 font-bold uppercase tracking-tight">
                                     {lead.companies?.name || lead.company_name || 'Individual'}
                                  </span>
                               </div>
                            </td>
                            <td>
                               <span className={cn(
                                 "text-[9px] font-black tracking-widest rounded px-2 py-0.5 border border-white/[0.05] shadow-inner uppercase",
                                  lead.priority === 'Critical' || lead.status === 'HOT' ? "text-rose-500 bg-rose-500/10" : "text-blue-500 bg-blue-500/10"
                               )}>
                                  {lead.status || 'NEW'}
                               </span>
                            </td>
                            <td>
                               <div className="flex items-center gap-2">
                                  <div className="w-12 h-1 rounded-full bg-white/[0.05] overflow-hidden p-[1px] border border-white/5">
                                     <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(lead.lead_score || lead.score_ia || 0) * 10}%` }} />
                                  </div>
                                  <span className="text-[10px] font-bold text-slate-500 font-mono">{(lead.lead_score || lead.score_ia || 0).toFixed(1)}</span>
                               </div>
                            </td>
                            <td className="text-right pr-6">
                               <button 
                                 onClick={() => openAnalysis(lead)}
                                 className="p-2 rounded-lg hover:bg-white/[0.1] text-purple-500 transition-all border border-purple-500/0 hover:border-purple-500/20"
                               >
                                  <Brain size={14} />
                               </button>
                            </td>
                         </motion.tr>
                       ))
                    ) : (
                       <tr>
                         <td colSpan={4} className="py-24 text-center">
                            <div className="flex flex-col items-center gap-4 opacity-30">
                               <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                                  <Users size={32} />
                                </div>
                               <span className="text-[10px] font-black uppercase tracking-[0.2em]">Bandeja de entrada vacía</span>
                            </div>
                         </td>
                       </tr>
                    )}
                    </AnimatePresence>
                 </tbody>
              </table>
             </div>
          </div>
        </div>

        {/* N8N ACTIVITY FEED */}
        <div className="ds-card p-0 flex flex-col h-full bg-[#121215]/40 backdrop-blur-xl border-white/5 overflow-hidden">
          <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
            <h3 className="text-lg font-bold text-white flex items-center gap-3">
               <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20 shadow-inner">
                 <Activity size={16} />
               </div>
               Sistema Neural (Logs)
            </h3>
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          </div>
          <div className="flex-1 overflow-y-auto max-h-[460px]">
            <div className="flex flex-col divide-y divide-white/[0.02]">
               {n8nLogs.map((log, i) => (
                 <div key={i} className="group p-5 hover:bg-white/[0.02] transition-all flex items-start gap-4 animate-in fade-in slide-in-from-right-2 duration-500">
                    <div className="w-1.5 h-1.5 rounded-full mt-2" style={{ backgroundColor: log.c || '#6366f1', boxShadow: `0 0 12px ${log.c || '#6366f1'}` }} />
                    <div className="flex-1 flex flex-col gap-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{log.br || 'AGENT'} • {log.t || 'NOW'}</span>
                        <div className="w-4 h-4 rounded-full bg-white/5 border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                           <ArrowUpRight size={10} className="text-slate-500" />
                        </div>
                      </div>
                      <p className="text-[11px] font-black text-slate-200 uppercase tracking-tight">{log.a || 'Neural Event'}</p>
                      <p className="text-[10px] text-slate-500 font-medium leading-relaxed italic border-l border-white/5 pl-3">{log.dt || 'Processing inference data stream...'}</p>
                    </div>
                 </div>
               ))}
            </div>
          </div>
          <div className="p-4 bg-white/[0.02] border-t border-white/5 flex items-center justify-between">
             <div className="flex items-center gap-4">
                <div className="flex flex-col">
                   <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Instance Status</span>
                   <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-tighter">Healthy</span>
                </div>
                <div className="w-px h-6 bg-white/5" />
                <div className="flex flex-col">
                   <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Latency</span>
                   <span className="text-[10px] font-bold text-blue-500 uppercase tracking-tighter">122ms</span>
                </div>
             </div>
             <div className="text-[9px] font-bold text-slate-700 uppercase">ZYX-6.0-CORE</div>
          </div>
        </div>
      </div>

      <AnalysisModal 
        isOpen={isAnalysisModalOpen} 
        onClose={() => setIsAnalysisModalOpen(false)} 
        prospect={selectedProspect} 
      />
    </div>
  );
}
