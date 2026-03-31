'use client';

import React, { useState } from 'react';
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Target, 
  Brain, 
  Sparkles, 
  ArrowUpRight, 
  Download, 
  Filter, 
  Search, 
  Zap, 
  Activity,
  Layers,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function ReportsPage() {
  const [activeRange, setActiveRange] = useState('30d');

  return (
    <div className="animate-in space-y-8">
      {/* PAGE HEADER */}
      <div className="flex items-center justify-between mb-2">
         <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Informes e Inteligencia IA</h1>
            <div className="px-2 py-0.5 rounded bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest border border-indigo-700 shadow-sm">AI Engine Active</div>
         </div>
         <div className="flex items-center gap-4">
            <div className="flex items-center bg-white border border-slate-200 rounded-lg p-1 shadow-sm">
               <button onClick={() => setActiveRange('7d')} className={cn("p-1 px-3 text-[10px] font-bold rounded-md transition-all", activeRange === '7d' ? "bg-slate-100 text-slate-900" : "text-slate-400 hover:text-slate-600")}>7d</button>
               <button onClick={() => setActiveRange('30d')} className={cn("p-1 px-3 text-[10px] font-bold rounded-md transition-all", activeRange === '30d' ? "bg-slate-100 text-slate-900" : "text-slate-400 hover:text-slate-600")}>30d</button>
               <button onClick={() => setActiveRange('90d')} className={cn("p-1 px-3 text-[10px] font-bold rounded-md transition-all", activeRange === '90d' ? "bg-slate-100 text-slate-900" : "text-slate-400 hover:text-slate-600")}>90d</button>
            </div>
            <button className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-md text-[11px] font-bold shadow-md shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95 group">
               <Download size={14} className="group-hover:translate-y-0.5 transition-transform" />
               <span>Exportar Reporte</span>
            </button>
         </div>
      </div>

      {/* AI INSIGHTS HIGHLIGHTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <div className="ds-card p-8 bg-slate-900 text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform">
               <Brain size={140} className="text-indigo-400" />
            </div>
            <div className="relative z-10">
               <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
                     <Sparkles size={24} />
                  </div>
                  <h3 className="text-lg font-bold">Resumen de Inferencia AI</h3>
               </div>
               <p className="text-sm text-slate-400 leading-relaxed mb-8 max-w-lg">
                  Basándonos en la actividad de los últimos 30 días, el motor Zyndrix ha detectado una <span className="text-emerald-400 font-bold">mejora del 14%</span> en la cualificación de leads. Tu ROI proyectado para el Q2 es de <span className="text-white font-bold">42.500 €</span> mediante automatizaciones de WhatsApp.
               </p>
               <div className="flex gap-4">
                  <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl">
                     <span className="text-[10px] font-bold text-slate-500 uppercase">Ahorro Tiempo</span>
                     <div className="text-lg font-bold text-white">124h / mes</div>
                  </div>
                  <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl">
                     <span className="text-[10px] font-bold text-slate-500 uppercase">Eficiencia</span>
                     <div className="text-lg font-bold text-white">92.4%</div>
                  </div>
               </div>
            </div>
         </div>

         <div className="ds-card p-8 bg-white border-slate-100">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-8 flex items-center justify-between">
               Probabilidad de Cierre por Sector
               <TrendingUp size={16} className="text-emerald-500" />
            </h3>
            <div className="space-y-6">
               {[
                  { label: 'Salud / Clínicas', value: 85, color: '#4F46E5' },
                  { label: 'Servicios Legales', value: 65, color: '#6366F1' },
                  { label: 'E-commerce Retail', value: 45, color: '#818CF8' }
               ].map((item, i) => (
                  <div key={i} className="space-y-2">
                     <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800">{item.label}</span>
                        <span className="text-xs font-black text-slate-900">{item.value}%</span>
                     </div>
                     <div className="h-2 w-full bg-slate-50 rounded-full border border-slate-100 overflow-hidden">
                        <motion.div 
                           initial={{ width: 0 }}
                           animate={{ width: `${item.value}%` }}
                           className="h-full rounded-full transition-all duration-1000"
                           style={{ backgroundColor: item.color }}
                        />
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </div>

      {/* CORE METRICS GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
         {/* Conversion Analysis (Left) */}
         <div className="xl:col-span-8 ds-card p-8 bg-white border-slate-100">
            <div className="flex items-center justify-between mb-10">
               <div>
                  <h3 className="font-bold text-slate-900 text-sm">Rendimiento del Embudo AI</h3>
                  <p className="text-[10px] text-slate-400 font-medium tracking-tight">Tasa de conversión de leads fríos a reuniones confirmadas</p>
               </div>
               <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-md text-[10px] font-bold">
                  <Activity size={12} />
                  <span>Optimizando Flujo</span>
               </div>
            </div>

            <div className="h-64 flex items-end justify-between gap-4 relative pb-10">
               {[60, 45, 80, 55, 95, 70, 40, 85, 60, 90, 75, 40].map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-3 group relative h-full justify-end">
                     <div className="w-full flex items-end h-full gap-1">
                        <motion.div 
                           initial={{ height: 0 }} 
                           animate={{ height: `${h}%` }} 
                           className="w-full bg-indigo-500 rounded-lg group-hover:bg-indigo-600 shadow-lg shadow-indigo-100 transition-all cursor-crosshair"
                        />
                     </div>
                     <span className="text-[9px] font-bold text-slate-300 uppercase tracking-tighter absolute -bottom-6">
                        S{i+1}
                     </span>
                  </div>
               ))}
               <div className="absolute inset-0 flex flex-col justify-between pointer-events-none border-l border-slate-50 pl-2">
                  <span className="text-[8px] font-bold text-slate-200">100%</span>
                  <span className="text-[8px] font-bold text-slate-200">50%</span>
                  <span className="text-[8px] font-bold text-slate-200">0%</span>
               </div>
            </div>
         </div>

         {/* Opportunity Alerts (Right) */}
         <div className="xl:col-span-4 ds-card p-8 bg-white border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm mb-8 flex items-center justify-between">
               Detecciones IA
               <Layers size={14} className="text-slate-300" />
           </h3>
            <div className="space-y-6">
               {[
                  { title: 'Re-Engagement Necesario', desc: '4 leads de Salud no han recibido respuesta en 24h.', icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-50' },
                  { title: 'Patrón de Conversión', desc: 'Los leads que vienen de IG cierran un 30% más rápido.', icon: Zap, color: 'text-indigo-500', bg: 'bg-indigo-50' },
                  { title: 'Meta Alcanzada', desc: 'Has superado el objetivo de leads de Q1 en un 12%.', icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50' }
               ].map((alert, i) => (
                  <div key={i} className="flex gap-4 group cursor-pointer hover:translate-x-1 transition-transform">
                     <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center border border-transparent shadow-sm flex-shrink-0 group-hover:scale-110", alert.bg, alert.color)}>
                        <alert.icon size={18} />
                     </div>
                     <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-800">{alert.title}</span>
                        <p className="text-[10px] text-slate-400 font-medium leading-tight mt-1">{alert.desc}</p>
                     </div>
                  </div>
               ))}
            </div>
            
            <div className="mt-12 p-4 bg-indigo-600 rounded-2xl text-white shadow-xl shadow-indigo-100 flex items-center justify-between group cursor-pointer overflow-hidden border border-indigo-700">
               <div className="relative z-10">
                  <p className="text-[10px] font-bold text-indigo-200 uppercase mb-1">Zyndrix Assist</p>
                  <p className="text-sm font-bold">Generar Auditoría IA</p>
               </div>
               <ArrowUpRight size={18} className="relative z-10 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </div>
         </div>
      </div>

      {/* ROI AND BUDGET ANALYSIS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-12">
         {[
            { label: 'ROI Estimado Q1', value: '450%', sub: 'Retorno Inversión', trend: '+12%', isUp: true, icon: TrendingUp, color: 'emerald' },
            { label: 'Cualificación Lead', value: '9.2', sub: 'Escala 1 al 10', trend: '+0.4', isUp: true, icon: Target, color: 'indigo' },
            { label: 'Burn Rate', value: '1.200 €', sub: 'Mensual / ADS', trend: '-2%', isUp: false, icon: Activity, color: 'rose' }
         ].map((stat, i) => (
            <div key={i} className="ds-card p-6 bg-white border-slate-100 flex flex-col justify-between group hover:border-indigo-200 transition-colors">
               <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</span>
                  <stat.icon size={14} className={cn(
                     stat.color === 'emerald' ? "text-emerald-500" : 
                     stat.color === 'indigo' ? "text-indigo-500" : "text-rose-500"
                  )} />
               </div>
               <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-black text-slate-900 tracking-tighter leading-none">{stat.value}</span>
                  <div className={cn(
                     "text-[10px] font-black px-1.5 py-0.5 rounded-md",
                     stat.isUp ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                  )}>{stat.trend}</div>
               </div>
               <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between">
                  <span className="text-[9px] font-bold text-slate-300 uppercase tracking-tighter">{stat.sub}</span>
                  <button className="text-[9px] font-black text-indigo-600 uppercase tracking-widest hover:underline">Detalles</button>
               </div>
            </div>
         ))}
      </div>
    </div>
  );
}
