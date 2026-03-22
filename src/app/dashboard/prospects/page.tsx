'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Search, 
  Download, 
  Filter, 
  ChevronRight, 
  Loader2, 
  FileText,
  Target,
  Zap,
  Mail,
  User,
  Building2,
  Sparkles,
  X,
  ExternalLink,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/toast';

import { supabase } from '@/lib/supabase';

type AutomationStep = {
  name: string;
  status: 'completed' | 'pending' | 'error';
  time?: string;
};

type Prospect = {
  id: string;
  name: string;
  email: string;
  company_name: string;
  message?: string;
  status: string;
  created_at: string;
  lead_score: number;
  role?: string;
  reasoning?: string;
  automation_steps?: AutomationStep[];
};

export default function ProspectsPage() {
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProspect, setSelectedProspect] = useState<Prospect | null>(null);

  const fetchLeads = async () => {
    try {
            if (!supabase) {
                      setLoading(false);
                      return;
            }
      
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching leads from Supabase:', error);
        toast.error('Error cargando prospectos de la base de datos.');
        return;
      }

      if (data) {
        setProspects(data as Prospect[]);
      }
    } catch (error) {
      console.error('Unexpected error fetching leads:', error);
      toast.error('Error inesperado al conectar con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
    const interval = setInterval(fetchLeads, 30000); // Poll every 30 seconds instead of 10
    return () => clearInterval(interval);
  }, []);

  const filteredProspects = prospects.filter(p => 
    p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 relative">
      {/* HEADER SECTION */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter italic">Prospectos</h1>
          <p className="text-slate-400 mt-1 text-sm md:text-base font-medium italic">Descubrimiento inteligente y <span className="text-cyan-400 font-bold">Automatización de Agencia</span>.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative group flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
            <input 
              type="text" 
              placeholder="Buscar..."
              className="bg-slate-900/50 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500/50 w-full sm:w-64 transition-all backdrop-blur-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="flex-1 sm:flex-none" onClick={() => toast.info('Filtros avanzados en desarrollo.')}>
              <Filter size={18} />
            </Button>
            <Button variant="primary" className="flex-[3] sm:flex-none justify-center" onClick={() => toast.success('Importando prospectos desde LinkedIn...')}>
              <Zap size={16} fill="currentColor" />
              Importar
            </Button>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-slate-950/20 border border-slate-800/40 rounded-[2.5rem] overflow-hidden backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800/50 bg-slate-900/40">
                <th className="px-4 md:px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Lead</th>
                <th className="px-4 md:px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] hidden sm:table-cell">Empresa</th>
                <th className="px-4 md:px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">IA Score</th>
                <th className="px-4 md:px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] hidden md:table-cell">Status</th>
                <th className="px-4 md:px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/30">
              {loading && prospects.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-32 text-center">
                    <Loader2 className="w-10 h-10 text-cyan-500 animate-spin mx-auto mb-4 opacity-50" />
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Analizando leads entrantes...</p>
                  </td>
                </tr>
              ) : filteredProspects.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-32 text-center text-slate-500">
                    <Users className="w-16 h-16 mx-auto mb-4 opacity-10" />
                    <p className="font-bold uppercase tracking-widest text-xs">Sin prospectos registrados</p>
                  </td>
                </tr>
              ) : (
                filteredProspects.map((lead) => (
                  <motion.tr 
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    key={lead.id} 
                    className="hover:bg-slate-800/20 transition-all group cursor-pointer"
                    onClick={() => setSelectedProspect(lead)}
                  >
                    <td className="px-4 md:px-8 py-4 md:py-6">
                      <div className="flex items-center gap-3 md:gap-4">
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-gradient-to-br from-slate-800 to-slate-950 border border-slate-700/50 flex items-center justify-center text-cyan-400 font-black text-base md:text-lg shadow-xl group-hover:border-cyan-500/50 transition-all flex-shrink-0">
                          {lead.name?.charAt(0) || 'L'}
                        </div>
                        <div className="min-w-0">
                          <div className="text-white font-black uppercase tracking-tight text-sm md:text-base leading-none mb-1 group-hover:text-cyan-400 transition-colors truncate">{lead.name}</div>
                          <div className="text-[9px] md:text-[10px] font-bold text-slate-500 uppercase tracking-widest truncate">{lead.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 md:px-8 py-4 md:py-6 hidden sm:table-cell">
                      <div className="text-slate-200 font-black uppercase tracking-tight leading-none mb-1">{lead.company_name}</div>
                      <div className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{new Date(lead.created_at).toLocaleDateString()}</div>
                    </td>
                    <td className="px-4 md:px-8 py-4 md:py-6">
                      <div className="flex items-center gap-2 md:gap-4">
                        <span className={`text-sm md:text-base font-black font-mono leading-none ${lead.lead_score >= 8 ? 'text-cyan-400' : 'text-indigo-400'}`}>
                          {lead.lead_score}/10
                        </span>
                        <div className="hidden xl:block w-24 h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800/50">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${lead.lead_score * 10}%` }}
                            className={`h-full ${
                              lead.lead_score >= 8 ? 'bg-cyan-500' : 'bg-indigo-500'
                            }`}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 md:px-8 py-4 md:py-6 hidden md:table-cell">
                      <Badge variant={lead.status === 'Qualified' ? 'cyan' : lead.status === 'Contacted' ? 'emerald' : 'slate'}>
                        {lead.status}
                      </Badge>
                    </td>
                    <td className="px-4 md:px-8 py-4 md:py-6 text-right">
                      <button className="p-2 md:p-3 bg-slate-900 border border-slate-800 hover:border-cyan-500/50 rounded-lg md:rounded-xl text-slate-400 hover:text-cyan-400 transition-all shadow-xl">
                        <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
                      </button>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* EXPERT DETAIL DRAWER */}
      <AnimatePresence>
        {selectedProspect && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProspect(null)}
              className="fixed inset-0 bg-[#020617]/80 backdrop-blur-sm z-[150]"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full md:max-w-xl bg-slate-950 border-l border-slate-800/60 z-[160] shadow-[-20px_0_40px_rgba(0,0,0,0.5)] flex flex-col"
            >
              <div className="p-6 md:p-10 border-b border-slate-800/40 flex items-center justify-between bg-slate-900/20 backdrop-blur-xl">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-[1.5rem] bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white font-black text-xl md:text-2xl shadow-2xl">
                    {selectedProspect.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-tighter leading-none mb-1">{selectedProspect.name}</h2>
                    <Badge variant="cyan">{selectedProspect.status}</Badge>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedProspect(null)}
                  className="p-2 md:p-3 hover:bg-slate-800 rounded-xl md:rounded-2xl text-slate-500 hover:text-white transition-all border border-transparent hover:border-slate-700"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 md:space-y-12 custom-scrollbar focus:outline-none">
                {/* QUICK ACTIONS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Button variant="primary" className="h-12 md:h-14" onClick={() => toast.info('Generando secuencia de email personalizada...')}>
                    <Mail size={18} />
                    Pre-outreach
                  </Button>
                  <Button variant="outline" className="h-12 md:h-14" onClick={() => toast.success('Lead marcado para seguimiento prioritario.')}>
                    <Target size={18} />
                    Prioritizar
                  </Button>
                </div>

                {/* AI INSIGHT SECTION */}
                <section className="space-y-4">
                  <div className="flex items-center gap-2 text-[10px] font-black text-cyan-400 uppercase tracking-[0.2em]">
                    <Sparkles size={14} />
                    Razonamiento de la IA
                  </div>
                  <div className="p-6 md:p-8 rounded-2xl md:rounded-[2rem] bg-cyan-500/5 border border-cyan-500/10 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-100 transition-opacity">
                      <Sparkles size={40} className="text-cyan-400" />
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed font-medium italic">
                      "{selectedProspect.reasoning || "Análisis predictivo en curso. Nuestros agentes están procesando los datos de este lead."}"
                    </p>
                  </div>
                </section>

                {/* DATA GRID */}
                <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                  <DetailItem icon={User} label="Rol" value={selectedProspect.role || "Prospecto"} />
                  <DetailItem icon={Mail} label="Email" value={selectedProspect.email} />
                  <DetailItem icon={Building2} label="Empresa" value={selectedProspect.company_name} />
                  <DetailItem icon={ExternalLink} label="Website" value="-" link />
                </section>

                {/* AUTOMATION STEPS */}
                <section className="space-y-4">
                  <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                    <Zap size={14} />
                    Pipeline Histórico
                  </div>
                  <div className="space-y-3">
                    {selectedProspect.automation_steps?.map((step, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 rounded-xl md:rounded-2xl bg-slate-900/50 border border-slate-800/50 group hover:border-slate-700 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${step.status === 'completed' ? 'bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.5)]' : 'bg-slate-800'}`} />
                          <span className="text-xs font-bold text-slate-300 uppercase tracking-tight">{step.name}</span>
                        </div>
                        <Badge variant={step.status === 'completed' ? 'emerald' : 'slate'}>{step.status}</Badge>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              <div className="p-6 md:p-10 border-t border-slate-800/40 bg-slate-900/20 backdrop-blur-xl">
                <Button variant="secondary" className="w-full h-12 md:h-14 uppercase tracking-widest text-xs" onClick={() => toast.info('Accediendo al perfil enriquecido...')}>
                  Ver Perfil Completo
                  <ArrowRight size={16} />
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function DetailItem({ icon: Icon, label, value, link }: any) {
  return (
    <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800/60 space-y-2 group hover:border-slate-700 transition-colors">
      <div className="flex items-center gap-2 text-[9px] font-black text-slate-600 uppercase tracking-widest">
        <Icon size={12} />
        {label}
      </div>
      <p className={`text-sm font-bold text-white uppercase tracking-tight truncate ${link ? 'text-cyan-400 group-hover:underline' : ''}`}>
        {value}
      </p>
    </div>
  );
}
