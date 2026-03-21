'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  BarChart2, 
  Clock, 
  ChevronRight, 
  Plus, 
  Mail, 
  Eye, 
  Zap,
  MoreVertical,
  CheckCircle2,
  AlertCircle,
  X,
  Sparkles,
  ArrowRight,
  Split,
  Target
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/toast';

type Campaign = {
  id: string;
  name: string;
  status: 'Active' | 'Paused' | 'Draft';
  sent: number;
  opened: number;
  replied: number;
  steps: number;
};

export default function OutreachPage() {
  const [campaigns] = useState<Campaign[]>([
    { id: '1', name: 'Tech Founders Discovery', status: 'Active', sent: 1240, opened: 840, replied: 42, steps: 4 },
    { id: '2', name: 'Real Estate Automation', status: 'Active', sent: 450, opened: 310, replied: 28, steps: 3 },
    { id: '3', name: 'Logistics SaaS Pre-launch', status: 'Paused', sent: 210, opened: 120, replied: 5, steps: 5 },
  ]);

  const [selectedMail, setSelectedMail] = useState<boolean>(false);

  const handleNewSequence = () => {
    toast.show("Cargando plantillas de IA generativa...", "info");
  };

  const handlePreview = () => {
    setSelectedMail(true);
  };

  return (
    <div className="space-y-10 relative">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-white uppercase tracking-tighter italic">Outreach</h1>
          <p className="text-slate-400 text-lg font-medium italic">Gestión de <span className="text-cyan-400 font-bold">Secuencias Hiper-Personalizadas</span>.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => toast.info('Accediendo a la biblioteca de assets...')}>
            <Mail size={16} />
            Biblioteca
          </Button>
          <Button variant="primary" onClick={handleNewSequence}>
            <Plus size={18} />
            Nueva Secuencia IA
          </Button>
        </div>
      </div>

      {/* CAMPAIGN GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {campaigns.map((camp, i) => (
          <motion.div
            key={camp.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-8 rounded-[2.5rem] bg-slate-900/30 border border-slate-800/40 hover:border-slate-700 transition-all group relative overflow-hidden flex flex-col cursor-pointer"
          >
            <div className="flex justify-between items-start mb-8">
              <div className="space-y-2">
                <Badge variant={camp.status === 'Active' ? 'emerald' : 'slate'}>{camp.status}</Badge>
                <h3 className="text-xl font-black text-white uppercase tracking-tight group-hover:text-cyan-400 transition-colors leading-none">{camp.name}</h3>
              </div>
              <button className="p-2 text-slate-600 hover:text-white transition-colors">
                <MoreVertical size={20} />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <Stat mini label="Enviados" value={camp.sent} />
              <Stat mini label="Apertura" value={`${Math.round((camp.opened / camp.sent) * 100)}%`} />
              <Stat mini label="Respuesta" value={`${Math.round((camp.replied / camp.sent) * 100)}%`} />
            </div>

            {/* SEQUENCE VISUALIZER MINI */}
            <div className="mt-auto pt-6 border-t border-slate-800/40">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Secuencia: {camp.steps} Pasos</span>
              </div>
              <div className="flex items-center gap-2">
                {[...Array(camp.steps)].map((_, idx) => (
                  <div key={idx} className="flex items-center gap-2 flex-1">
                    <div className={`h-1.5 rounded-full flex-1 ${idx === 0 ? 'bg-cyan-500' : 'bg-slate-800'} border border-slate-700/50`} />
                    {idx < camp.steps - 1 && <ChevronRight size={10} className="text-slate-700" />}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-6 flex gap-2">
              <Button variant="ghost" size="sm" className="w-full text-xs font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity" onClick={handlePreview}>
                <Eye size={14} />
                Vista Previa
              </Button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* RECENT OUTREACH LOG */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-white uppercase tracking-tighter flex items-center gap-3">
            <Clock className="text-violet-400" size={24} />
            Historial de Ejecución Live
          </h3>
        </div>
        <div className="rounded-[3rem] border border-slate-800/40 bg-slate-950/20 backdrop-blur-xl overflow-hidden divide-y divide-slate-800/30">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="p-8 flex items-center justify-between hover:bg-slate-800/20 transition-all group cursor-pointer">
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-emerald-400 shadow-2xl group-hover:border-cyan-500/50 transition-all">
                  <CheckCircle2 size={24} />
                </div>
                <div>
                  <div className="text-white font-black uppercase tracking-tight text-base leading-none mb-2">Email enviado a Oscar Montes</div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Campaña: Tech Founders Discovery</span>
                    <div className="w-1 h-1 rounded-full bg-slate-700" />
                    <span className="text-[10px] font-bold text-cyan-500 uppercase tracking-widest">Paso 2/4</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-sm font-black text-white uppercase tracking-tight">Enviado con Éxito</p>
                  <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mt-1">Hace 4 minutos</p>
                </div>
                <Button variant="outline" size="icon" onClick={handlePreview}>
                  <Eye size={18} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PREVIEW DRAWER */}
      <AnimatePresence>
        {selectedMail && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedMail(false)}
              className="fixed inset-0 bg-[#020617]/80 backdrop-blur-sm z-[150]"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-2xl bg-slate-950 border-l border-slate-800/60 z-[160] shadow-[-20px_0_40px_rgba(0,0,0,0.5)] flex flex-col"
            >
              <div className="p-10 border-b border-slate-800/40 flex items-center justify-between bg-slate-900/20 backdrop-blur-xl">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-[1.5rem] bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-black text-2xl shadow-2xl">
                    <Mail size={32} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-white uppercase tracking-tighter leading-none mb-1">Vista Previa IA</h2>
                    <Badge variant="violet">Secuencia Dinámica</Badge>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedMail(false)}
                  className="p-3 hover:bg-slate-800 rounded-2xl text-slate-500 hover:text-white transition-all border border-transparent hover:border-slate-700"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-10 space-y-12 custom-scrollbar">
                {/* AI SUMMARY */}
                <section className="space-y-4">
                  <div className="flex items-center gap-2 text-[10px] font-black text-cyan-400 uppercase tracking-[0.2em]">
                    <Sparkles size={14} />
                    Estrategia de Comunicación
                  </div>
                  <div className="p-8 rounded-[2rem] bg-cyan-500/5 border border-cyan-500/10 space-y-4">
                    <p className="text-sm text-slate-300 leading-relaxed font-medium italic">
                      "Este mensaje utiliza un ángulo de 'curiosidad técnica' basado en su reciente publicación sobre arquitectura serverless. El tono es profesional pero directo."
                    </p>
                    <div className="flex gap-4">
                      <div className="flex items-center gap-2 text-[9px] font-bold text-slate-500">
                        <Target size={12} className="text-emerald-500" />
                        PÁLPITO: 88%
                      </div>
                      <div className="flex items-center gap-2 text-[9px] font-bold text-slate-500">
                        <Split size={12} className="text-cyan-500" />
                        A/B TEST: V3
                      </div>
                    </div>
                  </div>
                </section>

                {/* EMAIL CONTENT */}
                <section className="space-y-4">
                  <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                    Contenido del Mensaje
                  </div>
                  <div className="p-8 rounded-[2rem] bg-slate-900/50 border border-slate-800/40 font-mono text-sm text-slate-400 space-y-6">
                    <div>
                      <span className="text-slate-600">Asunto:</span> <span className="text-white font-bold">Arquitectura serverless en TechNova - Curiosidad rápida</span>
                    </div>
                    <div className="space-y-4">
                      <p>Hola {"{Contact Name}"},</p>
                      <p>Estuve revisando vuestro reciente despliegue en {"{Company Name}"} y me llamó la atención cómo habéis resuelto la latencia en las funciones edge.</p>
                      <p>En ZYNDRIX estamos ayudando a agencias similares a automatizar el discovery de leads mediante una lógica parecida, liberando unas 15h semanales de vuestro equipo técnico.</p>
                      <p>¿Tendría sentido charlar 5 min el martes sobre vuestro pipeline actual?</p>
                      <p>Saludos,<br/><span className="text-cyan-500 font-bold">Zyndrix Intelligence</span></p>
                    </div>
                  </div>
                </section>
              </div>

              <div className="p-10 border-t border-slate-800/40 bg-slate-900/20 backdrop-blur-xl flex gap-4">
                <Button variant="outline" className="flex-1 h-14" onClick={() => toast.info('Generando variante alternativa...')}>
                  <Sparkles size={16} />
                  Variante IA
                </Button>
                <Button variant="primary" className="flex-1 h-14" onClick={() => { setSelectedMail(false); toast.success('Secuencia re-activada para este prospecto.'); }}>
                  Validar y Enviar
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

function Stat({ label, value, mini }: { label: string, value: any, mini?: boolean }) {
  return (
    <div className={`space-y-1 ${mini ? 'p-4 rounded-3xl bg-slate-950/20 border border-slate-800/30' : ''}`}>
      <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{label}</p>
      <p className={`${mini ? 'text-lg' : 'text-3xl'} font-black text-white tracking-tighter uppercase italic leading-none`}>{value}</p>
    </div>
  );
}
