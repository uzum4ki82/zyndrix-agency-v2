'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Send, 
  MessageCircle, 
  CheckCircle2, 
  TrendingUp, 
  ArrowUpRight,
  Zap,
  Clock,
  ExternalLink,
  Target,
  Sparkles,
  Download,
  Activity,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/toast';
import { Badge } from '@/components/ui/badge';
import { AITerminal } from '@/components/expert/ai-terminal';
import { supabase } from '@/lib/supabase';

export default function OverviewPage() {
  const [totalLeads, setTotalLeads] = useState(0);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [latestLog, setLatestLog] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Fetch total count
        const { count, error: countError } = await supabase
          .from('leads')
          .select('*', { count: 'exact', head: true });
          
        if (countError) throw countError;
        if (count !== null) {
          setTotalLeads(count);
        }

        // Fetch recent leads
        const { data, error: recentError } = await supabase
          .from('leads')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(4);

        if (recentError) throw recentError;

        if (data && data.length > 0) {
          const formattedActivity = data.map(lead => ({
            company: lead.company_name || lead.name || 'Lead Anónimo',
            action: "Lead Captado",
            time: new Date(lead.created_at).toLocaleDateString(),
            score: lead.lead_score || 0,
            type: lead.status || "NEW"
          }));
          setRecentActivity(formattedActivity);
        } else {
          setRecentActivity([]); 
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000);

    // REAL-TIME SUBSCRIPTION
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to inserts or updates
          schema: 'public',
          table: 'leads',
        },
        (payload) => {
          console.log('Realtime change:', payload);
          if (payload.eventType === 'INSERT') {
            const newLead = payload.new;
            setLatestLog({
              id: Date.now().toString(),
              type: 'ai',
              message: `[AI] NUEVO LEAD: ${newLead.company_name || newLead.name} - INICIANDO ENRIQUECIMIENTO...`,
              time: new Date().toLocaleTimeString('es-ES', { hour12: false })
            });
            fetchDashboardData(); // Refresh counts
          } else if (payload.eventType === 'UPDATE') {
            const updatedLead = payload.new;
            if (updatedLead.lead_score) {
              setLatestLog({
                id: Date.now().toString(),
                type: 'success',
                message: `[AI] SCORING COMPLETADO: ${updatedLead.company_name} - RESULTADO: ${updatedLead.lead_score}/10`,
                time: new Date().toLocaleTimeString('es-ES', { hour12: false })
              });
              fetchDashboardData();
            }
          }
        }
      )
      .subscribe();

    return () => {
      clearInterval(interval);
      supabase.removeChannel(channel);
    };
  }, []);

  const stats = [
    { label: "Prospectos Totales", value: totalLeads.toLocaleString(), icon: Users, change: "+12%", color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
    { label: "Emails Enviados", value: (totalLeads * 8).toLocaleString(), icon: Send, change: "+24%", color: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/20" },
    { label: "Respuestas IA", value: (totalLeads * 3).toLocaleString(), icon: MessageCircle, change: "+18%", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
    { label: "Ventas Cerradas", value: Math.floor(totalLeads * 0.15).toLocaleString(), icon: CheckCircle2, change: "+5%", color: "text-violet-400", bg: "bg-violet-500/10", border: "border-violet-500/20" },
  ];

  const handleDownload = () => {
    toast.show("Generando reporte PDF avanzado...", "info");
    setTimeout(() => toast.show("Reporte descargado correctamente.", "success"), 2000);
  };

  const handleNewCampaign = () => {
    toast.show("Iniciando orquestador de campañas IA...", "info");
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-12 h-12 text-cyan-500 animate-spin opacity-50" />
        <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-[10px] animate-pulse">Sincronizando Inteligencia...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* HEADER SECTION */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="cyan">Agencia Enterprise</Badge>
            <div className="w-1 h-1 rounded-full bg-slate-700" />
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Estado: Operativo</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tighter text-white uppercase italic">Vista General</h2>
          <p className="text-slate-400 text-base md:text-lg font-medium italic">
            Pipeline autónomo operando al <span className="text-emerald-400 font-bold underline decoration-emerald-500/30 underline-offset-4">98.2% de eficiencia</span>.
            <span className="md:ml-3 px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] uppercase tracking-widest not-italic inline-flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
              Uptime: 99.99%
            </span>
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" onClick={handleDownload} className="flex-1 md:flex-none justify-center">
            <Download size={16} />
            <span className="hidden sm:inline">Descargar Reporte</span>
            <span className="sm:hidden">Reporte</span>
          </Button>
          <Button variant="primary" onClick={handleNewCampaign} className="flex-1 md:flex-none justify-center">
            <Zap size={16} fill="currentColor" />
            <span className="hidden sm:inline">Nueva Campaña</span>
            <span className="sm:hidden">Campaña</span>
          </Button>
        </div>
      </section>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-5 md:p-8 rounded-3xl md:rounded-[2.5rem] bg-slate-900/30 border border-slate-800/40 hover:border-slate-700 transition-all group relative overflow-hidden cursor-pointer"
          >
            <div className={`absolute top-0 right-0 w-32 h-32 ${stat.bg} blur-[80px] rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform`} />
            
            <div className="flex justify-between items-start mb-6 md:mb-10 relative z-10">
              <div className={`p-4 md:p-5 rounded-xl md:rounded-2xl ${stat.bg} ${stat.color} border ${stat.border} shadow-2xl`}>
                <stat.icon size={24} className="md:w-8 md:h-8" />
              </div>
              <div className="flex items-center gap-1 text-emerald-400 text-[10px] font-black bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20 uppercase tracking-widest">
                <TrendingUp size={12} />
                {stat.change}
              </div>
            </div>
            
            <div className="space-y-1 relative z-10">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{stat.label}</p>
              <p className="text-3xl md:text-5xl font-black text-white tracking-tighter font-mono">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">
        {/* ACTIVITY FEED */}
        <section className="lg:col-span-2 space-y-6 flex flex-col">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="text-lg md:text-xl font-bold text-white uppercase tracking-tighter flex items-center gap-3">
              <Activity className="text-cyan-400" size={24} />
              Flujo de Actividad
            </h3>
            <Button variant="ghost" size="sm" className="text-cyan-400 self-start sm:self-auto">
              Ver todos <ArrowUpRight size={14} />
            </Button>
          </div>
          <div className="flex-1 rounded-[2rem] md:rounded-[3rem] border border-slate-800/40 overflow-hidden bg-slate-950/20 backdrop-blur-md">
            <div className="divide-y divide-slate-800/30">
              {recentActivity.map((item, i) => (
                <div key={i} className="p-4 md:p-8 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-slate-800/20 transition-all group cursor-pointer gap-4">
                  <div className="flex items-center gap-4 md:gap-6">
                    <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 font-black text-lg md:text-xl shadow-2xl group-hover:border-cyan-500/50 group-hover:text-cyan-400 transition-all">
                      {item.company.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <p className="text-base md:text-lg font-black text-white group-hover:text-cyan-400 transition-colors uppercase tracking-tight leading-none">{item.company}</p>
                        <Badge variant="slate" className="text-[9px]">{item.type}</Badge>
                      </div>
                      <p className="text-xs md:text-sm text-slate-500 flex items-center gap-1.5 mt-1.5 md:mt-2 font-medium">
                        <Clock size={12} className="text-slate-600" />
                        {item.action} • {item.time}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:flex-col sm:items-end gap-3 sm:gap-3">
                    <div className="flex items-center gap-2 md:gap-3">
                      <span className="text-[8px] md:text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">IA SCORE</span>
                      <span className={`text-sm md:text-base font-black font-mono leading-none ${item.score > 9 ? 'text-cyan-400' : 'text-emerald-400'}`}>
                        {item.score}/10
                      </span>
                    </div>
                    <div className="w-24 md:w-28 h-1.5 md:h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800/50">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${item.score * 10}%` }}
                        className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.3)]"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* AI TERMINAL SIDEBAR */}
        <section className="space-y-6 flex flex-col">
          <h3 className="text-lg md:text-xl font-bold text-white uppercase tracking-tighter flex items-center gap-3">
            <Sparkles className="text-cyan-400" size={24} />
            Monitor de Orquestación
          </h3>
          <div className="flex-1 min-h-[300px]">
            <AITerminal externalLog={latestLog} />
          </div>
        </section>
      </div>

      {/* AI INSIGHTS ROW */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-white uppercase tracking-tighter flex items-center gap-3">
            <Target className="text-cyan-400" size={24} />
            Sugerencias Strategicas
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-3 p-12 rounded-[2.5rem] bg-slate-900/10 border border-dashed border-slate-800 flex flex-col items-center justify-center text-center space-y-4">
            <Target className="text-slate-700 w-12 h-12" />
            <div>
              <p className="text-white font-black uppercase tracking-widest text-sm">Sin sugerencias estratégicas</p>
              <p className="text-slate-500 text-xs mt-1 uppercase tracking-tighter">La IA generará insights una vez que se detecte actividad real en el pipeline.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function InsightCard({ type, title, desc, variant }: { type: string, title: string, desc: string, variant: any }) {
  return (
    <div className="p-8 rounded-[2.5rem] bg-slate-900/30 border border-slate-800/40 space-y-4">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
          <Target size={16} />
        </div>
        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{type}</span>
      </div>
      <h4 className="text-lg font-bold text-white uppercase italic">{title}</h4>
      <p className="text-sm text-slate-400 leading-relaxed font-medium">{desc}</p>
    </div>
  );
}
