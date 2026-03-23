'use client';

import React, { useState, useEffect } from 'react';
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
  RefreshCcw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Loader2
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const fetchLeads = async () => {
    setRefreshing(true);
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setLeads(data || []);
    } catch (err) {
      console.error('Error fetching leads:', err);
    } finally {
      setTimeout(() => {
        setLoading(false);
        setRefreshing(false);
      }, 800);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const filteredLeads = leads.filter(l => 
    l.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    l.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.company?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6 animate-in">
      <header className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
             <Target size={14} className="text-blue-500" /> Database Live Connection
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-4">
             Leads CRM
             {refreshing && <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={fetchLeads}
            disabled={refreshing}
            className="ds-button ghost group relative overflow-hidden"
          >
             <RefreshCcw className={cn("w-4 h-4 transition-transform", refreshing && "animate-spin")} />
             <span>Refrescar Supabase</span>
          </button>
          <button className="ds-button primary shadow-lg shadow-blue-500/20">
            <Plus className="w-4 h-4" />
            <span>Nuevo Lead</span>
          </button>
        </div>
      </header>

      {/* FILTER SEARCH BAR */}
      <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] backdrop-blur-sm">
          <div className="flex items-center gap-3 bg-white/[0.03] border border-white/[0.1] rounded-xl px-4 py-2 flex-1 max-w-sm focus-within:border-blue-500/50 transition-all group">
             <Search className="w-4 h-4 text-slate-600 group-focus-within:text-blue-500" />
             <input 
                type="text" 
                placeholder="Filtrar por nombre, email o empresa..." 
                className="bg-transparent border-none outline-none text-sm w-full font-medium text-slate-300 placeholder:text-slate-600"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
             />
          </div>
          <div className="flex items-center gap-2">
             <div className="px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-[10px] font-black text-blue-500 uppercase tracking-widest">
                {filteredLeads.length} Registros
             </div>
             <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.03] border border-white/[0.1] hover:bg-white/[0.06] transition-all text-xs font-bold text-slate-500 uppercase tracking-widest hover:text-white">
                <Filter className="w-4 h-4" />
                <span>Filters</span>
             </button>
          </div>
      </div>

      <div className="ds-card p-0 overflow-hidden bg-white/[0.01] border-white/[0.08] relative group">
         <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none" />
         <table className="pro-table">
            <thead className="bg-white/[0.04]">
               <tr>
                  <th className="w-12 text-center">ID</th>
                  <th>Nombre / Empresa</th>
                  <th>Estado</th>
                  <th>Score IA</th>
                  <th>Registrado</th>
                  <th className="text-right pr-6">Acciones</th>
               </tr>
            </thead>
            <tbody>
               <AnimatePresence mode="popLayout">
               {loading ? (
                  <tr>
                     <td colSpan={6} className="py-32 text-center text-slate-700 font-medium">
                        <div className="flex flex-col items-center gap-4 animate-pulse">
                           <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                           <span className="text-[10px] uppercase font-black tracking-widest">Connecting to Supra Engine...</span>
                        </div>
                     </td>
                  </tr>
               ) : filteredLeads.length > 0 ? (
                  filteredLeads.map((lead, i) => (
                     <motion.tr 
                       key={lead.id} 
                       initial={{ opacity: 0, x: -10 }}
                       animate={{ opacity: 1, x: 0 }}
                       transition={{ delay: i * 0.05 }}
                       className="hover:bg-white/[0.03] transition-colors border-b border-white/[0.02]"
                     >
                        <td className="text-center">
                           <span className="text-[10px] font-mono font-bold text-slate-600">#{lead.id}</span>
                        </td>
                        <td>
                           <div className="flex flex-col gap-0.5">
                              <span className="font-bold text-slate-100 group-hover:text-blue-400 transition-colors uppercase font-mono tracking-tighter">{lead.name}</span>
                              <span className="text-[10px] text-slate-500 font-medium">{lead.email || lead.company || 'Sin Empresa'}</span>
                           </div>
                        </td>
                        <td>
                           <span className={cn(
                             "text-[9px] font-black tracking-widest rounded px-1.5 py-0.5 border border-white/[0.02] shadow-sm",
                              lead.status === 'HOT' ? "text-rose-500 bg-rose-500/10 border-rose-500/20" : lead.status === 'WARM' ? "text-amber-500 bg-amber-500/10 border-amber-500/20" : lead.status === 'COLD' ? "text-slate-500 bg-slate-500/10 border-slate-500/20" : "text-emerald-500 bg-emerald-500/10 border-emerald-500/20"
                           )}>
                              {lead.status || 'NEW'}
                           </span>
                        </td>
                        <td>
                           <div className="flex items-center gap-3">
                              <div className="w-16 h-1 rounded-full bg-white/[0.05] overflow-hidden">
                                 <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(lead.score_ia || 0) * 10}%` }}
                                    className="h-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" 
                                 />
                              </div>
                              <span className="text-[10px] font-bold text-slate-400 font-mono tracking-tighter">{(lead.score_ia || 0).toFixed(1)}</span>
                           </div>
                        </td>
                        <td>
                           <div className="flex flex-col">
                              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{new Date(lead.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}</span>
                              <span className="text-[9px] text-slate-600 font-medium uppercase">{new Date(lead.created_at).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</span>
                           </div>
                        </td>
                        <td className="text-right pr-4">
                           <div className="flex items-center justify-end gap-1">
                              <button className="p-2.5 rounded-xl hover:bg-blue-500/10 text-slate-500 hover:text-blue-500 transition-all" title="Email Lead"><Mail size={16} /></button>
                              <button className="p-2.5 rounded-xl hover:bg-purple-500/10 text-slate-500 hover:text-purple-500 transition-all" title="Classify AI"><Brain size={16} /></button>
                              <button className="p-2.5 rounded-xl hover:bg-white/[0.1] text-slate-500 hover:text-white transition-all"><MoreVertical size={16} /></button>
                           </div>
                        </td>
                     </motion.tr>
                  ))
               ) : (
                  <tr>
                     <td colSpan={6} className="py-40 text-center text-slate-600 font-medium">
                        <div className="flex flex-col items-center gap-6 max-w-sm mx-auto">
                           <div className="w-16 h-16 rounded-3xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-center text-slate-800">
                              <Users size={32} />
                           </div>
                           <div className="flex flex-col gap-1">
                              <h4 className="text-md font-bold text-slate-400 uppercase font-mono tracking-tight">Database Inactiva</h4>
                              <p className="text-[10px] text-slate-600 leading-relaxed font-semibold">No se han detectado leads en la tabla 'leads' de Supabase. Conecta tu landing page o añade datos manualmente en el dashboard de Supabase.</p>
                           </div>
                           <button 
                             onClick={fetchLeads}
                             className="ds-button ghost text-[10px] py-1.5 tracking-widest animate-pulse"
                           >
                              REINTENTAR CONEXIÓN
                           </button>
                        </div>
                     </td>
                  </tr>
               )}
               </AnimatePresence>
            </tbody>
         </table>
      </div>

      {/* PAGINATION (MOCKED FOR NOW) */}
      <div className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/[0.05] rounded-2xl backdrop-blur-sm">
         <div className="flex items-center gap-4 text-[10px] font-black text-slate-600 uppercase tracking-widest">
            <span>Supabase Sync Active • Persistence Level: High</span>
         </div>
         <div className="flex items-center gap-2">
            <button className="p-2 rounded-xl hover:bg-white/[0.05] text-slate-500 disabled:opacity-30"><ChevronLeft size={18} /></button>
            <span className="text-[10px] font-bold text-blue-500 w-8 text-center bg-blue-500/5 rounded-lg py-1 border border-blue-500/20">1</span>
            <button className="p-2 rounded-xl hover:bg-white/[0.05] text-slate-500 disabled:opacity-30"><ChevronRight size={18} /></button>
         </div>
      </div>
    </div>
  );
}
