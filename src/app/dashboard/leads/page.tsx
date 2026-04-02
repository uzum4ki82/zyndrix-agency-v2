'use client';

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Target,
  ArrowUpRight,
  Sparkles,
  ChevronRight,
  Star,
  CheckCircle2,
  Clock,
  Briefcase,
  ExternalLink,
  Zap,
  Mail,
  UserPlus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import AnalysisModal from '@/components/dashboard/AnalysisModal';
import AddLeadModal from '@/components/dashboard/AddLeadModal';

import { supabase } from '@/lib/supabase';

// Sample Leads Data (Now dynamic)
const initialLeads: any[] = [];

export default function LeadsPage() {
  const [leads, setLeads] = useState<any[]>(initialLeads);
  const [loading, setLoading] = useState(true);
  const [isAnalysisOpen, setIsAnalysisOpen] = useState(false);
  const [isAddLeadOpen, setIsAddLeadOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<any>(null);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('id', { ascending: false });

      if (error) throw error;

      if (data) {
        const mappedLeads = data.map(l => ({
          id: l.id,
          name: l.name || 'Sin Nombre',
          email: l.email,
          company: l.company_name || 'Negocio Privado',
          value: l.budget || 'Bajo Estudio',
          type: l.service || 'Prospecto Web',
          status: l.status || 'prospecto',
          days: new Date(l.created_at || Date.now()).toLocaleDateString(),
          message: l.message
        }));
        setLeads(mappedLeads);
      }
    } catch (err) {
      console.error('Error fetching leads:', err);
    } finally {
      setLoading(false);
    }
  };

  const openAnalysis = (lead: any) => {
    setSelectedLead(lead);
    setIsAnalysisOpen(true);
  };

  const handleAddLead = (newLead: any) => {
    setLeads(prev => [newLead, ...prev]);
  };

  const initialTasks: any[] = [];

  const columns = [
    { id: 'prospecto', label: 'Nuevos Leads', color: 'bg-indigo-50 text-indigo-600 border-indigo-100' },
    { id: 'contacto', label: 'Primer Contacto', color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
    { id: 'propuesta', label: 'Propuesta Enviada', color: 'bg-amber-50 text-amber-600 border-amber-100' },
    { id: 'cierre', label: 'Fase de Cierre', color: 'bg-rose-50 text-rose-600 border-rose-100' }
  ];

  return (
    <div className="animate-in space-y-8 pb-10">
      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
           <div className="flex items-center gap-2 text-indigo-600 mb-1">
              <Zap size={14} className="animate-pulse fill-indigo-600" />
              <span className="text-[10px] font-black uppercase tracking-widest">Pipeline Activo de Ventas</span>
           </div>
           <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Embudo CRM Estratégico</h1>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-3">
           <div className="relative w-full sm:w-64 group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 group-hover:text-indigo-400 transition-colors" size={16} />
              <input 
                placeholder="Buscar prospecto..." 
                className="bg-white border border-slate-100 rounded-xl py-2.5 pl-10 pr-4 text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all w-full shadow-sm"
              />
           </div>
           <button 
             onClick={() => setIsAddLeadOpen(true)}
             className="w-full sm:w-auto bg-slate-900 text-white px-5 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all active:scale-95 flex items-center justify-center gap-2 group"
           >
              <UserPlus size={14} className="group-hover:translate-x-0.5 transition-transform" />
              Añadir Prospecto
           </button>
        </div>
      </div>

      {/* KANBAN BOARD */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 min-h-[600px]">
        {columns.map((column) => (
          <div key={column.id} className="flex flex-col gap-6">
            <div className={cn("p-4 rounded-xl border flex items-center justify-between shadow-sm", column.color)}>
              <span className="text-[10px] font-black uppercase tracking-widest">{column.label}</span>
              <span className="bg-white/50 px-2 py-0.5 rounded text-[10px] font-bold border border-white">
                {leads.filter(l => l.status === column.id).length}
              </span>
            </div>

            <div className="flex-1 space-y-4">
              <AnimatePresence mode="popLayout">
                {leads.filter(l => l.status === column.id).map((lead) => (
                  <motion.div 
                    layout
                    key={lead.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="ds-card p-5 cursor-pointer bg-white group hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-900/5 transition-all"
                    onClick={() => openAnalysis(lead)}
                  >
                    <div className="flex justify-between items-start mb-4">
                       <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 group-hover:border-indigo-100 transition-all font-black text-[10px] shadow-sm">
                          {lead.name.split(' ').map((n: string) => n[0]).join('')}
                       </div>
                       <MoreVertical size={14} className="text-slate-200" />
                    </div>
                    
                    <div className="space-y-1">
                       <h3 className="text-xs font-black text-slate-900 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{lead.name}</h3>
                       <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1.5 leading-none">
                          <Building2 size={10} className="text-slate-300" />
                          {lead.company}
                       </p>
                    </div>

                    <div className="mt-5 pt-4 border-t border-slate-50 flex items-center justify-between">
                       <div className="flex flex-col">
                          <span className="text-[9px] font-black text-slate-300 uppercase leading-none">Valor Negocio</span>
                          <span className="text-[11px] font-black text-slate-900 mt-1">{lead.value}</span>
                       </div>
                       <div className="bg-slate-50 px-2 py-1 rounded text-[8px] font-black text-slate-400 uppercase tracking-widest group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                          {lead.type}
                       </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                       <div className="flex -space-x-1.5">
                          {[1,2].map(i => (
                             <div key={i} className="w-5 h-5 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[8px] font-bold text-slate-400">IA</div>
                          ))}
                       </div>
                       <span className="text-[9px] font-bold text-slate-300 italic">{lead.days}</span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              <button 
                 onClick={() => setIsAddLeadOpen(true)}
                 className="w-full py-4 border-2 border-dashed border-slate-100 rounded-2xl flex flex-col items-center justify-center text-slate-300 hover:border-indigo-100 hover:text-indigo-400 hover:bg-white transition-all group"
              >
                 <Plus size={20} className="mb-1 group-hover:scale-125 transition-transform" />
                 <span className="text-[9px] font-black uppercase tracking-widest">Soltar Prospecto</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedLead && (
        <AnalysisModal 
          isOpen={isAnalysisOpen}
          onClose={() => setIsAnalysisOpen(false)}
          prospect={selectedLead}
        />
      )}

      <AddLeadModal 
         isOpen={isAddLeadOpen}
         onClose={() => setIsAddLeadOpen(false)}
         onAdd={handleAddLead}
      />
    </div>
  );
}

function Building2(props: any) { return <Users {...props} />; }
