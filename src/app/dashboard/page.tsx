'use client';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
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
  Database
} from 'lucide-react';
import StatCard from '@/components/dashboard/StatCard';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function DashboardOverview() {
  const [leadCount, setLeadCount] = useState<number | null>(null);
  const [recentLeads, setRecentLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      // Fetch stats
      const { count, error: countError } = await supabase
        .from('leads')
        .select('*', { count: 'exact', head: true });
      
      if (!countError) setLeadCount(count || 0);

      // Fetch recent
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(4);
      
      if (!error) setRecentLeads(data || []);
    } catch (err) {
      console.warn('Dashboard data fetch failed (Check DB Table):', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="flex flex-col gap-10 animate-in">
      <header className="flex items-center justify-between pb-2">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            Mission <span className="text-blue-500 font-mono italic">Control</span> <TrendingUp size={24} className="text-slate-800" />
          </h1>
          <div className="flex items-center gap-3 text-sm font-medium text-slate-500">
             <span>Agencia IA • Resumen Operativo</span>
             <span className="w-1 h-1 rounded-full bg-slate-700" />
             <span className="text-blue-400/80 font-mono tracking-tighter uppercase">Instance ID: ZYX-01 • Version: XP-5.1</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="ds-button ghost group relative overflow-hidden">
             <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
             <span>Exportar Informe</span>
          </button>
          <Link href="/dashboard/automations">
            <button className="ds-button primary shadow-lg shadow-blue-500/20 group">
               <Workflow className="w-4 h-4 group-hover:rotate-12 transition-transform" />
               <span>Orquestar Flujos</span>
            </button>
          </Link>
        </div>
      </header>

      {/* KPI GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="Total Leads" 
          value={loading ? '...' : (leadCount || 0).toString()} 
          trend="+12%" 
          trendType="up"
          icon={Users} 
          subValue="Sincronizado vía Supabase"
          color="blue"
        />
        <StatCard 
          label="Conversion Rate" 
          value="42.3%" 
          trend="+1.2%" 
          trendType="up"
          icon={Target} 
          subValue="Lead Scoring n8n Active"
          color="emerald"
        />
        <StatCard 
          label="AI Automations" 
          value="14" 
          trend="+8%" 
          trendType="up"
          icon={Sparkles} 
          subValue="Efficiency boost +22%"
          color="amber"
        />
        <StatCard 
          label="Infrastructure" 
          value="100%" 
          trend="+0%" 
          trendType="up"
          icon={Database} 
          subValue="n8n + Supabase Cluster"
          color="purple"
        />
      </div>

      {/* DASHBOARD GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEADS TABLE MINI */}
        <div className="lg:col-span-2 ds-card p-0 flex flex-col h-full bg-[#121215]/40 overflow-hidden relative group">
          <div className="absolute top-0 right-0 p-8 pt-6 pointer-events-none opacity-5 group-hover:opacity-20 transition-opacity">
             <Users size={120} className="text-white" />
          </div>
          <div className="p-6 border-b border-white/[0.05] flex items-center justify-between relative z-10 backdrop-blur-md bg-[#121215]/20">
            <h3 className="text-lg font-bold text-white flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 border border-blue-500/20">
                <Users size={16} />
              </div>
              Leads en Tiempo Real
            </h3>
            <Link href="/dashboard/leads">
               <button className="text-[10px] font-black text-slate-500 hover:text-blue-500 transition-all uppercase tracking-widest flex items-center gap-2 group/btn">
                  Abrir CRM Pro 
                  <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
               </button>
            </Link>
          </div>
          <div className="flex-1 overflow-x-auto relative z-10">
             <table className="pro-table">
                <thead>
                   <tr>
                      <th>NOMBRE / EMPRESA</th>
                      <th>ESTADO</th>
                      <th>SCORE IA</th>
                      <th className="text-right">ACCESO</th>
                   </tr>
                </thead>
                <tbody>
                   <AnimatePresence mode="wait">
                   {loading ? (
                      <tr><td colSpan={4} className="py-20 text-center text-slate-600 animate-pulse uppercase text-[10px] font-black tracking-widest">Conectando Base de Datos...</td></tr>
                   ) : recentLeads.length > 0 ? (
                      recentLeads.map((lead, i) => (
                        <motion.tr 
                          key={lead.id} 
                          initial={{ opacity: 0, x: -10 }} 
                          animate={{ opacity: 1, x: 0 }} 
                          transition={{ delay: i * 0.1 }}
                          className="hover:bg-white/[0.02] transition-colors border-b border-white/[0.02]"
                        >
                           <td>
                              <div className="flex flex-col gap-0.5">
                                 <span className="font-bold text-slate-200 uppercase font-mono tracking-tighter text-xs">{lead.name}</span>
                                 <span className="text-[9px] text-slate-600 font-bold uppercase">{lead.email || 'Lead Externo'}</span>
                              </div>
                           </td>
                           <td>
                              <span className={cn(
                                "text-[9px] font-black tracking-widest rounded px-1.5 py-0.5 border border-white/[0.02] shadow-inner",
                                 lead.status === 'HOT' ? "text-rose-500 bg-rose-500/10" : lead.status === 'WARM' ? "text-amber-500 bg-amber-500/10" : "text-emerald-500 bg-emerald-500/10"
                              )}>
                                 {lead.status || 'NEW'}
                              </span>
                           </td>
                           <td>
                              <div className="flex items-center gap-2">
                                 <div className="w-12 h-1 rounded-full bg-white/[0.05] overflow-hidden">
                                    <div className="h-full bg-blue-500 shadow-sm" style={{ width: `${(lead.score_ia || 0) * 10}%` }} />
                                 </div>
                                 <span className="text-[10px] font-bold text-slate-500 font-mono">{(lead.score_ia || 0).toFixed(1)}</span>
                              </div>
                           </td>
                           <td className="text-right pr-6">
                              <Link href="/dashboard/leads">
                                 <button className="p-2 rounded-lg hover:bg-white/[0.1] text-slate-600 hover:text-white transition-all">
                                    <ArrowUpRight size={14} />
                                 </button>
                              </Link>
                           </td>
                        </motion.tr>
                      ))
                   ) : (
                      <tr>
                        <td colSpan={4} className="py-24 text-center">
                           <div className="flex flex-col items-center gap-3 opacity-30">
                              <Users size={32} />
                              <span className="text-[10px] font-bold uppercase tracking-widest">No hay leads registrados</span>
                           </div>
                        </td>
                      </tr>
                   )}
                   </AnimatePresence>
                </tbody>
             </table>
          </div>
        </div>

        {/* N8N ACTIVITY FEED */}
        <div className="ds-card p-0 flex flex-col h-full bg-[#121215]/40 backdrop-blur-sm overflow-hidden border-indigo-500/10">
          <div className="p-6 border-b border-white/[0.05] flex items-center justify-between bg-indigo-500/5">
            <h3 className="text-lg font-bold text-white flex items-center gap-3">
               <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-500 border border-indigo-500/20">
                 <Activity size={16} />
               </div>
               Sistema Neural (Logs)
            </h3>
          </div>
          <div className="p-6 flex-1 flex flex-col items-center justify-center py-20 text-center gap-5 opacity-40">
             <div className="w-16 h-16 rounded-full bg-white/[0.02] border border-white/[0.05] flex items-center justify-center text-slate-700 relative overflow-hidden group">
                <div className="absolute inset-0 bg-blue-500/10 animate-pulse" />
                <Zap size={24} className="relative z-10" />
             </div>
             <div className="flex flex-col gap-1">
                <p className="text-xs font-black text-slate-500 uppercase tracking-widest">En espera</p>
                <p className="text-[10px] text-slate-600 font-medium px-8 leading-relaxed">Conecta n8n para ver la actividad del motor de inferencia en tiempo real.</p>
             </div>
             <Link href="/dashboard/docs">
               <button className="text-[9px] font-black text-blue-500/50 hover:text-blue-500 uppercase tracking-widest underline underline-offset-4 decoration-blue-500/20">Documentación SDK ›</button>
             </Link>
          </div>
          <div className="p-4 bg-white/[0.02] border-t border-white/[0.05] flex items-center justify-between">
             <span className="text-[9px] font-black text-slate-700 uppercase tracking-widest">Heartbeat: Active</span>
             <span className="flex items-center gap-1.5 text-[9px] font-black text-emerald-500 uppercase tracking-widest">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live
             </span>
          </div>
        </div>
      </div>
    </div>
  );
}
