'use client';

import { motion } from 'framer-motion';
import { 
  Zap, 
  Activity, 
  Database, 
  Mail, 
  Search, 
  Cpu, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  Layers,
  Container
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function WorkflowsPage() {
  const nodes = [
    { id: '1', label: 'Trigger: Supabase Row', type: 'system', icon: Database, x: 50, y: 50 },
    { id: '2', label: 'Enriquecimiento IA', type: 'ai', icon: Sparkles, x: 250, y: 150 },
    { id: '3', label: 'Clasificación Lead', type: 'ai', icon: Cpu, x: 450, y: 50 },
    { id: '4', label: 'Envío Outreach', type: 'action', icon: Mail, x: 650, y: 150 },
  ];

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h2 className="text-4xl font-extrabold tracking-tight text-white font-outfit uppercase tracking-tighter italic">Workflows</h2>
          <p className="text-slate-400 text-lg font-medium italic">Orquestación de <span className="text-cyan-400 font-bold">Agentes Autónomos Evolutivos</span>.</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="cyan">Motor v3.4 Activo</Badge>
          <Button variant="primary" size="sm">
            <Layers size={14} />
            Editor n8n
          </Button>
        </div>
      </div>

      <div className="relative h-[600px] w-full rounded-[3rem] bg-slate-950/40 border border-slate-800/40 overflow-hidden backdrop-blur-3xl group">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.05),transparent)]" />
        
        {/* CONNECTIONS (Expert Tier UI) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <defs>
            <filter id="pulse-glow">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          
          {/* Static Background Paths */}
          <path d="M 100 80 Q 150 150 250 180" stroke="rgba(6,182,212,0.1)" strokeWidth="1" fill="none" />
          <path d="M 350 180 Q 400 100 450 80" stroke="rgba(6,182,212,0.1)" strokeWidth="1" fill="none" />
          <path d="M 550 80 Q 600 150 650 180" stroke="rgba(6,182,212,0.1)" strokeWidth="1" fill="none" />

          {/* Animated Pulses */}
          <motion.path
            d="M 100 80 Q 150 150 250 180"
            stroke="cyan"
            strokeWidth="2"
            fill="none"
            filter="url(#pulse-glow)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: [0, 1, 1], opacity: [0, 1, 0] }}
            transition={{ duration: 3, repeat: Infinity, times: [0, 0.5, 1], ease: "easeInOut" }}
          />
          <motion.path
            d="M 350 180 Q 400 100 450 80"
            stroke="cyan"
            strokeWidth="2"
            fill="none"
            filter="url(#pulse-glow)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: [0, 1, 1], opacity: [0, 1, 0] }}
            transition={{ duration: 3, repeat: Infinity, delay: 1, times: [0, 0.5, 1], ease: "easeInOut" }}
          />
        </svg>

        {/* NODES */}
        {nodes.map((node, i) => (
          <motion.div
            key={node.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.2 }}
            style={{ left: node.x, top: node.y }}
            className="absolute p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl flex flex-col items-center gap-3 group/node cursor-grab active:cursor-grabbing hover:border-cyan-500/50 transition-all"
          >
            <div className={`p-4 rounded-xl ${node.type === 'ai' ? 'bg-cyan-500/10 text-cyan-400' : 'bg-slate-800 text-slate-400'} group-hover/node:scale-110 transition-transform`}>
              <node.icon size={24} />
            </div>
            <span className="text-[10px] font-black text-white uppercase tracking-widest">{node.label}</span>
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[8px] font-bold text-slate-500 uppercase tracking-tighter">Live</span>
            </div>
          </motion.div>
        ))}

        {/* DRAWER INFO */}
        <div className="absolute bottom-8 left-8 right-8 p-6 rounded-2xl bg-slate-900/60 border border-slate-800/40 backdrop-blur-md flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex flex-col">
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Carga de Sistema</span>
              <span className="text-sm font-black text-white uppercase">Optimizada</span>
            </div>
            <div className="w-px h-8 bg-slate-800" />
            <div className="flex flex-col">
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Ejecuciones/Hora</span>
              <span className="text-sm font-black text-white uppercase tracking-tighter italic">1,240 OPS</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-cyan-500" />
               <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest leading-none">Status: Escalando Autónomamente</span>
             </div>
          </div>
        </div>
      </div>

      {/* WORKFLOW LIST */}
      <section className="space-y-6">
         <h3 className="text-xl font-bold text-white uppercase tracking-tighter flex items-center gap-3">
            <Container className="text-cyan-400" size={24} />
            Inventario de Agentes
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <WorkflowCard 
              name="Búsqueda de Leads Master" 
              active 
              desc="Scraping de perfiles técnicos basado en palabras clave 'Rust', 'AI-Agent' y 'Next.js'."
            />
             <WorkflowCard 
              name="Enriquecimiento Apollo-V2" 
              active 
              desc="Conexión con Apollo API para recuperación de emails directos corporativos."
            />
          </div>
      </section>
    </div>
  );
}

function WorkflowCard({ name, active, desc }: { name: string, active: boolean, desc: string }) {
  return (
    <div className="p-8 rounded-[2.5rem] bg-slate-900/30 border border-slate-800/40 space-y-4 hover:border-slate-700 transition-all cursor-pointer group">
      <div className="flex justify-between items-center">
        <Badge variant={active ? 'cyan' : 'slate'}>{active ? 'Activo' : 'Pausa'}</Badge>
        <CheckCircle2 size={16} className="text-emerald-500 opacity-60" />
      </div>
      <div className="space-y-2">
        <p className="text-lg font-black text-white uppercase tracking-tight group-hover:text-cyan-400 transition-colors leading-none">{name}</p>
        <p className="text-[11px] text-slate-500 leading-relaxed font-medium uppercase tracking-tighter opacity-80">{desc}</p>
      </div>
      <div className="pt-4 border-t border-slate-800/30 flex justify-between items-center">
        <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest italic leading-none">Latencia: 12ms</span>
        <ArrowRight size={14} className="text-slate-700 group-hover:text-white transition-all -translate-x-2 group-hover:translate-x-0" />
      </div>
    </div>
  );
}
