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
  AlertCircle,
  TrendingUp,
  Loader2,
  TrendingUp as TrendIcon,
  Activity as ActivityIcon,
  Sparkles as SparkleIcon,
  Search as SearchIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import AnalysisModal from '@/components/dashboard/AnalysisModal';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { cn } from '@/lib/utils';

export default function LeadsPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeLead, setActiveLead] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchLeads();
  }, []);

  async function fetchLeads() {
    setLoading(true);
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setLeads(data);
    }
    setLoading(false);
  }

  const filteredLeads = leads.filter(lead => 
    lead.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    lead.companies?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = [
    { label: 'Total Leads', value: leads.length, icon: Users, color: 'blue' },
    { label: 'High Priority', value: leads.filter(l => l.priority === 'Critical' || l.priority === 'High').length, icon: Target, color: 'rose' },
    { label: 'AI Analyzed', value: leads.filter(l => l.lead_score > 0).length, icon: Brain, color: 'purple' },
    { label: 'Conv. Rate', value: '12.4%', icon: TrendingUp, color: 'emerald' },
  ];

  return (
    <div className="flex h-screen bg-[#060608] text-white overflow-hidden font-sans">
      <div className="w-72 border-r border-white/5 bg-[#0a0a0c]/80 backdrop-blur-3xl hidden md:block">
        <Sidebar />
      </div>

      <main className="flex-1 overflow-y-auto relative grainy-bg custom-scrollbar">
       <div className="absolute inset-0 bg-grid-white/[0.02] pointer-events-none" />
       
       <div className="p-10 max-w-7xl mx-auto relative z-10 w-full">
          {/* Header */}
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
             <div>
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-3 mb-4"
                >
                   <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 shadow-lg shadow-blue-500/10">
                      <Users size={20} />
                   </div>
                   <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-500">Prospect Intelligence</span>
                </motion.div>
                <h1 className="text-4xl font-black tracking-tighter uppercase italic">Control de <span className="text-gradient-cyan">Leads CRM</span></h1>
                <p className="text-slate-500 font-medium text-sm mt-2">Monitorización en tiempo real de la base de datos de adquisición activa.</p>
             </div>
             
             <button className="ds-button primary group">
                <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
                <span>NUEVO PROSPECTO</span>
             </button>
          </header>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
             {stats.map((stat, i) => (
                <motion.div 
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="ds-card p-6 flex items-center gap-6 group hover:border-white/10"
                >
                   <div className={cn(
                     "w-14 h-14 rounded-2xl flex items-center justify-center border transition-all duration-500",
                     stat.color === 'blue' ? "bg-blue-500/5 border-blue-500/10 text-blue-500 group-hover:bg-blue-500/20" :
                     stat.color === 'rose' ? "bg-rose-500/5 border-rose-500/10 text-rose-500 group-hover:bg-rose-500/20" :
                     stat.color === 'purple' ? "bg-purple-500/5 border-purple-500/10 text-purple-500 group-hover:bg-purple-500/20" :
                     "bg-emerald-500/5 border-emerald-500/10 text-emerald-500 group-hover:bg-emerald-500/20"
                   )}>
                      <stat.icon size={24} className="group-hover:scale-110 transition-transform" />
                   </div>
                   <div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-1">{stat.label}</span>
                      <span className="text-2xl font-black font-mono tracking-tight">{stat.value}</span>
                   </div>
                </motion.div>
             ))}
          </div>

          {/* CRM Controls */}
          <div className="flex flex-col md:flex-row gap-6 mb-8 items-center justify-between">
             <div className="relative w-full md:w-96 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                <input 
                  type="text" 
                  placeholder="SEARCH PROSPECTS DATA..." 
                  className="ds-input pl-12 bg-white/[0.02] border-white/5 hover:border-white/10 focus:border-blue-500/30 w-full font-mono text-xs font-bold"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
             </div>
             
             <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                <button className="ds-button ghost text-[10px] tracking-widest group">
                   <Filter className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                   <span>FILTROS</span>
                </button>
                <button className="ds-button ghost text-[10px] tracking-widest uppercase">
                   <Download className="w-4 h-4" />
                   <span>Export</span>
                </button>
             </div>
          </div>

          {/* Table */}
          <div className="ds-card p-0 overflow-hidden bg-[#121215]/40 border-white/5 relative group">
             <div className="table-container">
              <table className="pro-table">
                <thead>
                   <tr className="bg-white/[0.02] border-b border-white/5">
                      <th className="w-12 text-center text-[10px] font-black tracking-widest uppercase py-6">ID</th>
                      <th className="text-[10px] font-black tracking-widest uppercase">Persona / Empresa</th>
                      <th className="text-[10px] font-black tracking-widest uppercase">Status</th>
                      <th className="text-[10px] font-black tracking-widest uppercase">Prioridad</th>
                      <th className="text-[10px] font-black tracking-widest uppercase">AI Score</th>
                      <th className="text-right pr-10 text-[10px] font-black tracking-widest uppercase">Acción</th>
                   </tr>
                </thead>
                <tbody>
                   <AnimatePresence mode="popLayout">
                   {loading ? (
                      <tr>
                         <td colSpan={6} className="py-40 text-center">
                            <div className="flex flex-col items-center gap-4 animate-pulse">
                               <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                                  <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
                               </div>
                               <span className="text-[10px] uppercase font-black tracking-[0.3em] text-slate-600">Connecting Neural Database...</span>
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
                           className="hover:bg-white/[0.03] transition-colors border-b border-white/[0.02] group/row"
                         >
                            <td className="text-center">
                               <span className="text-[10px] font-mono font-bold text-slate-600">#{(lead.id || i).toString().slice(0,4)}</span>
                            </td>
                            <td className="py-5">
                               <div className="flex items-center gap-4">
                                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black text-xs shadow-lg uppercase">
                                     {(lead.first_name || lead.name || 'U').charAt(0)}
                                  </div>
                                  <div className="flex flex-col">
                                     <span className="font-bold text-sm tracking-tight">{lead.first_name} {lead.last_name || lead.name}</span>
                                     <span className="text-[10px] text-slate-500 font-medium uppercase tracking-widest">{lead.companies?.name || lead.company_name || 'Individual'}</span>
                                  </div>
                               </div>
                            </td>
                            <td>
                               <div className="flex items-center gap-2">
                                  <div className="w-1 h-1 rounded-full bg-blue-500 animate-pulse" />
                                  <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Active Search</span>
                               </div>
                            </td>
                            <td>
                               <div className="flex items-center gap-2">
                                  <Target size={12} className={cn(
                                    lead.priority === 'Critical' ? "text-rose-500" : "text-slate-600"
                                  )} />
                                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{lead.priority || 'Low'}</span>
                               </div>
                            </td>
                            <td>
                               <div className="flex items-center gap-3">
                                  <div className="w-16 h-1.5 rounded-full bg-white/[0.05] overflow-hidden border border-white/5 p-[1px]">
                                     <div 
                                       className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full" 
                                       style={{ width: `${(lead.lead_score || lead.score_ia || 0) * 10}%` }}
                                     />
                                  </div>
                                  <span className="text-[10px] font-black font-mono text-blue-500">{(lead.lead_score || lead.score_ia || 0).toFixed(1)}</span>
                               </div>
                            </td>
                            <td className="text-right pr-6">
                               <div className="flex items-center justify-end gap-2">
                                  <button 
                                    className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                                    onClick={() => {
                                       setActiveLead(lead);
                                       setIsModalOpen(true);
                                    }}
                                  >
                                     <Brain size={16} />
                                  </button>
                                  <button className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-slate-400 hover:text-blue-500 hover:bg-blue-500/10 transition-all opacity-0 group-hover/row:opacity-100">
                                     <ArrowUpRight size={16} />
                                  </button>
                               </div>
                            </td>
                         </motion.tr>
                      ))
                   ) : (
                      <tr>
                         <td colSpan={6} className="py-20 text-center text-slate-500 font-mono text-xs">No active nodes found in this sector.</td>
                      </tr>
                   )}
                   </AnimatePresence>
                </tbody>
              </table>
             </div>
          </div>
       </div>

       {/* Analysis Modal */}
       <AnalysisModal 
         isOpen={isModalOpen} 
         onClose={() => setIsModalOpen(false)} 
         prospect={activeLead} 
       />
      </main>
    </div>
  );
}
