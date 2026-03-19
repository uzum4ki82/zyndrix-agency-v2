'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  ArrowUpRight, 
  Target, 
  Clock, 
  DollarSign, 
  Zap,
  Filter,
  Download,
  Activity,
  Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/toast';

export default function AnalyticsPage() {
  const [days, setDays] = useState(30);

  const metrics = [
    { label: "Tiempo de Operación Ahorrado", value: "342h", sub: "Equivalente a 2.4 FTEs", icon: Clock, color: "text-cyan-400" },
    { label: "Costo por Lead (IA)", value: "$4.20", sub: "vs $28.00 industria", icon: DollarSign, color: "text-emerald-400" },
    { label: "Tasa de Conversión IA", value: "4.8%", sub: "+2.1% este mes", icon: Target, color: "text-violet-400" },
    { label: "ROI Proyectado", value: "12.4x", sub: "Basado en LTV $2,500", icon: TrendingUp, color: "text-cyan-400" },
  ];

  const handleExport = () => {
    toast.info("Preparando exportación de datos de inteligencia...");
    setTimeout(() => toast.success("Datos exportados a CSV."), 1500);
  };

  return (
    <div className="space-y-10">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-white uppercase tracking-tighter italic">Analíticas de Impacto</h1>
          <p className="text-slate-400 text-lg font-medium italic">Medición de <span className="text-cyan-400 font-bold">Valor Operacional y Escalado</span>.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-slate-900/50 p-1.5 rounded-2xl border border-slate-800/80 backdrop-blur-md">
            {[30, 90, 365].map((d) => (
              <button
                key={d}
                onClick={() => setDays(d)}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  days === d ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20' : 'text-slate-500 hover:text-white'
                }`}
              >
                {d}D
              </button>
            ))}
          </div>
          <Button variant="outline" size="icon" onClick={() => toast.info('Filtros avanzados activos.')}>
            <Filter size={18} />
          </Button>
          <Button variant="primary" onClick={handleExport}>
            <Download size={16} />
            Exportar
          </Button>
        </div>
      </div>

      {/* METRICS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {metrics.map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-8 rounded-[2.5rem] bg-slate-900/30 border border-slate-800/40 space-y-4 group hover:border-slate-700 transition-all cursor-pointer relative overflow-hidden"
          >
            <div className="flex justify-between items-start">
              <div className={`p-4 rounded-2xl bg-slate-950 border border-slate-800 ${m.color} group-hover:border-cyan-500/50 transition-all`}>
                <m.icon size={24} />
              </div>
              <ArrowUpRight size={14} className="text-slate-700 group-hover:text-white transition-colors" />
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{m.label}</p>
              <p className="text-4xl font-black text-white tracking-tighter uppercase italic">{m.value}</p>
              <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{m.sub}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* CHART PLACEDHOLDERS (Elite Tier) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="p-10 rounded-[3rem] bg-slate-900/20 border border-slate-800/40 space-y-8 flex flex-col h-[500px] overflow-hidden group">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-white uppercase tracking-tighter flex items-center gap-3">
                <Activity className="text-cyan-400" size={24} />
                Crecimiento de Pipeline
              </h3>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Previsión Algorítmica v2.2 (Elite)</p>
            </div>
            <Badge variant="cyan">IA Activa</Badge>
          </div>
          <div className="flex-1 relative mt-10">
            <svg viewBox="0 0 1000 400" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#0891b2" stopOpacity="0" />
                  <stop offset="50%" stopColor="#22d3ee" />
                  <stop offset="100%" stopColor="#0891b2" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>
              
              {/* Grid Lines */}
              {[0, 100, 200, 300, 400].map(y => (
                <line key={y} x1="0" y1={y} x2="1000" y2={y} stroke="rgba(30, 41, 59, 0.4)" strokeWidth="1" />
              ))}

              {/* Main Trend Line */}
              <motion.path
                d="M 0 350 Q 150 320 250 200 T 500 150 T 750 100 T 1000 50"
                fill="none"
                stroke="url(#lineGradient)"
                strokeWidth="4"
                strokeLinecap="round"
                filter="url(#glow)"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 2, ease: "easeInOut" }}
              />

              {/* Elite Forecast Zone */}
              <motion.path
                d="M 1000 50 Q 1050 30 1100 10"
                fill="none"
                stroke="rgba(34, 211, 238, 0.4)"
                strokeWidth="2"
                strokeDasharray="6,6"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
              <text x="920" y="30" className="text-[9px] fill-cyan-400/60 font-black uppercase tracking-widest italic">Forecast IA</text>

              {/* Data Pulse */}
              <motion.circle
                r="6"
                fill="#22d3ee"
                initial={{ offsetDistance: "0%" }}
                animate={{ offsetDistance: "100%" }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                style={{ offsetPath: "path('M 0 350 Q 150 320 250 200 T 500 150 T 750 100 T 1000 50')", filter: 'drop-shadow(0 0 8px #22d3ee)' }}
              />
            </svg>
          </div>
          <div className="flex justify-between text-[10px] font-black text-slate-600 uppercase tracking-widest pt-4 border-t border-slate-800/30">
            <span>Ene</span><span>Mar</span><span>May</span><span>Jul</span><span>Sep</span><span>Nov</span>
          </div>
        </div>

        <div className="p-10 rounded-[3rem] bg-slate-900/20 border border-slate-800/40 space-y-8 flex flex-col h-[500px] overflow-hidden group">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-white uppercase tracking-tighter flex items-center gap-3">
                <Target className="text-violet-400" size={24} />
                Eficiencia por Sector
              </h3>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Distribución de Recursos IA</p>
            </div>
          </div>
          <div className="flex-1 space-y-6">
            <SectorRow name="Technology" value={92} color="bg-cyan-500" />
            <SectorRow name="Real Estate" value={78} color="bg-violet-500" />
            <SectorRow name="Logistics" value={85} color="bg-emerald-500" />
            <SectorRow name="Finance" value={65} color="bg-amber-500" />
            <SectorRow name="Healthcare" value={40} color="bg-slate-700" />
          </div>
        </div>
      </div>

      {/* FOOTER INSIGHT */}
      <div className="p-10 rounded-[3rem] bg-cyan-500/5 border border-cyan-500/10 flex flex-col md:flex-row items-center gap-10">
        <div className="w-20 h-20 rounded-[2rem] bg-cyan-500/10 flex items-center justify-center text-cyan-400 shadow-2xl shrink-0">
          <Zap size={40} fill="currentColor" />
        </div>
        <div className="space-y-2">
          <h4 className="text-2xl font-black text-white uppercase tracking-tight">Predicción de Escalado IA</h4>
          <p className="text-slate-400 text-sm leading-relaxed max-w-2xl font-medium">
            Basado en las tendencias actuales, la IA estima que podrías duplicar tu capacidad de outreach en los próximos 14 días sin aumentar costes operativos. Recomendamos activar el módulo de <span className="text-cyan-400 font-bold">'Auto-Warmup Extreme'</span> para las nuevas cuentas de correo.
          </p>
        </div>
        <Button variant="outline" className="md:ml-auto h-16 px-10 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500 hover:text-slate-950 transition-all uppercase tracking-widest text-xs font-black">
          Activar Optimización
        </Button>
      </div>
    </div>
  );
}

function SectorRow({ name, value, color }: { name: string, value: number, color: string }) {
  return (
    <div className="space-y-3 group cursor-pointer">
      <div className="flex justify-between items-center">
        <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest group-hover:text-white transition-colors">{name}</span>
        <span className="text-[11px] font-black text-white tracking-widest">{value}%</span>
      </div>
      <div className="h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800/50">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          className={`h-full ${color} shadow-[0_0_10px_rgba(0,0,0,0.5)] group-hover:brightness-125 transition-all`}
        />
      </div>
    </div>
  );
}
