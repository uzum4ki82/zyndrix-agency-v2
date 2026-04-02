'use client';

import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  DollarSign, 
  Target, 
  ArrowUpRight, 
  MoreVertical,
  Activity,
  Plus,
  Calendar,
  CheckCircle2,
  Clock,
  PieChart as PieChartIcon,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function DashboardOverview() {
  const [activeTab, setActiveTab] = useState('resumen');
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    const dateStr = now.toLocaleDateString('es-ES', options);
    setCurrentDate(dateStr.charAt(0).toUpperCase() + dateStr.slice(1));
  }, []);

  return (
    <div className="animate-in space-y-8">
      {/* PAGE HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
           <div className="flex items-center gap-2 text-indigo-600 mb-1">
              <Calendar size={14} className="animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest">{currentDate || 'Cargando fecha operativa...'}</span>
           </div>
           <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Resumen General de Operaciones</h1>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-3 bg-white p-1.5 rounded-xl border border-slate-100 shadow-sm shadow-slate-200/50 w-fit overflow-x-auto no-scrollbar">
           <button 
             onClick={() => setActiveTab('resumen')}
             className={cn("px-4 sm:px-6 py-2 rounded-lg text-[10px] sm:text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap", activeTab === 'resumen' ? "bg-slate-900 text-white shadow-xl shadow-slate-200" : "text-slate-400 hover:text-slate-600")}
           >
              Resumen
           </button>
           <button 
             onClick={() => setActiveTab('detalles')}
             className={cn("px-4 sm:px-6 py-2 rounded-lg text-[10px] sm:text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap", activeTab === 'detalles' ? "bg-slate-900 text-white shadow-xl shadow-slate-200" : "text-slate-400 hover:text-slate-600")}
           >
              Detalles
           </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'resumen' ? (
          <motion.div 
            key="resumen"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="space-y-8"
          >
            {/* KPI GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Ingresos Mensuales', value: '14.250,00 €', trend: '+12.5%', isUp: true, icon: DollarSign, color: 'indigo' },
                { label: 'Pipeline CRM', value: '45.800,00 €', trend: '+5.2%', isUp: true, icon: Target, color: 'emerald' },
                { label: 'Nuevos Leads', value: '24', trend: '+8', isUp: true, icon: Users, color: 'amber' },
                { label: 'Tasa Conversión', value: '18.4%', trend: '+2.1%', isUp: true, icon: Activity, color: 'rose' }
              ].map((kpi, i) => (
                <div key={i} className="ds-card p-6 bg-white hover:border-indigo-100 group transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center border transition-transform group-hover:scale-110 shadow-sm",
                      kpi.color === 'indigo' ? "bg-indigo-50 text-indigo-600 border-indigo-100 shadow-indigo-100/30" :
                      kpi.color === 'emerald' ? "bg-emerald-50 text-emerald-600 border-emerald-100 shadow-emerald-100/30" :
                      kpi.color === 'amber' ? "bg-amber-50 text-amber-600 border-amber-100 shadow-amber-100/30" : "bg-rose-50 text-rose-600 border-rose-100 shadow-rose-100/30"
                    )}>
                      <kpi.icon size={20} />
                    </div>
                    <div className={cn(
                      "text-[10px] font-black px-2 py-0.5 rounded-full",
                      kpi.isUp ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                    )}>
                      {kpi.trend}
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{kpi.label}</span>
                  <div className="text-xl font-bold text-slate-900 mt-1">{kpi.value}</div>
                </div>
              ))}
            </div>

            {/* PERFORMANCE ANALYSIS */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
              <div className="xl:col-span-8 ds-card p-8 bg-white overflow-hidden relative group">
                  <div className="absolute top-0 right-0 p-8 transform rotate-12 opacity-5 translate-x-8 -translate-y-8 group-hover:scale-110 transition-transform">
                     <TrendingUp size={160} className="text-indigo-600" />
                  </div>
                  
                  <div className="flex items-center justify-between mb-10 relative z-10">
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm italic">Métricas de Crecimiento Anual</h3>
                      <p className="text-[10px] text-slate-400 font-medium tracking-tight">Comparativa de ingresos mensuales auditada por IA</p>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-indigo-600" /><span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">2024</span></div>
                      <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-slate-200" /><span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">2023</span></div>
                    </div>
                  </div>

                  <div className="h-64 flex items-end justify-between gap-4 relative pb-10 z-10">
                    {[45, 52, 48, 65, 72, 85, 78, 92, 100, 88, 95, 110].map((h, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-2 group relative h-full justify-end">
                        <div className="w-full flex items-end h-full gap-1">
                          <motion.div 
                             initial={{ height: 0 }} 
                             animate={{ height: `${h}%` }} 
                             className="w-1/2 bg-indigo-600 rounded-sm group-hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100/50"
                          />
                          <motion.div 
                             initial={{ height: 0 }} 
                             animate={{ height: `${h * 0.7}%` }} 
                             className="w-1/2 bg-slate-100 rounded-sm"
                          />
                        </div>
                        <span className="hidden sm:block text-[9px] font-black text-slate-300 uppercase tracking-tighter absolute -bottom-6">
                           {[ 'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic' ][i]}
                        </span>
                      </div>
                    ))}
                  </div>
              </div>

              <div className="xl:col-span-4 ds-card p-8 bg-white">
                  <h3 className="font-bold text-slate-900 text-sm mb-6 flex items-center justify-between">
                     Feed de Actividad Zyndrix
                     <Activity size={14} className="text-slate-300" />
                  </h3>
                  <div className="space-y-6">
                    {[
                      { icon: Users, label: 'Nuevo Lead Entrante', desc: 'Carlos Martinez ha iniciado Auditoría IA desde el Lead Magnet.', time: 'Recién', color: 'text-emerald-600', bg: 'bg-emerald-50' },
                      { icon: Target, label: 'Pipeline Actualizado', desc: 'Oportunidad "Vortex Retail" movida a Negociación.', time: 'Hace 12m', color: 'text-indigo-600', bg: 'bg-indigo-50' },
                      { icon: Zap, label: 'Optimización IA', desc: 'Se ha completado el entrenamiento del RAG operativo.', time: 'Hace 45m', color: 'text-amber-600', bg: 'bg-amber-50' },
                      { icon: ShieldCheck, label: 'Seguridad Sync', desc: 'Protocolo de cifrado activado para el CRM.', time: 'Hace 2h', color: 'text-slate-600', bg: 'bg-slate-50' }
                    ].map((act, i) => (
                      <div key={i} className="flex gap-4 group cursor-pointer hover:translate-x-1 transition-transform">
                        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center border border-transparent shadow-sm flex-shrink-0 group-hover:scale-105", act.bg, act.color)}>
                          <act.icon size={18} />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-slate-900">{act.label}</span>
                          <p className="text-[10px] text-slate-400 font-medium leading-tight mt-0.5">{act.desc}</p>
                          <span className="text-[9px] font-bold text-indigo-500 uppercase tracking-widest mt-1.5">{act.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="w-full mt-10 py-3 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-black text-slate-400 uppercase tracking-widest hover:bg-slate-100 hover:text-slate-600 transition-all">Auditar logs completos</button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="detalles"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="space-y-8"
          >
            {/* DETAILS CONTENT */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
               <div className="md:col-span-12 ds-card p-10 bg-indigo-600 text-white flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden group border-none shadow-2xl shadow-indigo-900/30">
                  <div className="absolute top-0 right-0 p-10 opacity-10 transform rotate-12 group-hover:scale-110 transition-transform"><PieChartIcon size={200} /></div>
                  <div className="relative z-10 max-w-xl">
                     <h3 className="text-2xl font-bold mb-4 italic">Análisis Profundo del Beneficio</h3>
                     <p className="text-indigo-100 text-sm leading-relaxed mb-6 font-medium">Estamos auditando tu pipeline comercial. Tu margen operativo ha incrementado un <span className="text-white font-black underline decoration-emerald-400 decoration-2">8.4%</span> mediante automatización de leads. Explora los detalles financieros proyectados para el trimestre actual.</p>
                     <div className="flex gap-4">
                        <button className="bg-white text-indigo-600 px-6 py-2.5 rounded-xl font-bold text-xs shadow-xl shadow-indigo-900/20 hover:bg-slate-50 transition-all active:scale-95">Exportar Informe Pericial</button>
                        <button className="bg-indigo-500/20 border border-white/20 text-white px-6 py-2.5 rounded-xl font-bold text-xs hover:bg-indigo-500/40 transition-all active:scale-95">Ver Histórico Detallado</button>
                     </div>
                  </div>
                  <div className="relative z-10 bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl text-center min-w-[220px]">
                     <span className="text-[10px] font-black uppercase text-indigo-200 tracking-widest">Profit Neto Auditado</span>
                     <div className="text-4xl font-black text-white mt-2 leading-none whitespace-nowrap">125.400 €</div>
                     <p className="text-[9px] text-emerald-400 font-bold mt-4">+15.500 € vs Q1 Anterior</p>
                  </div>
               </div>

               <div className="md:col-span-6 ds-card p-8 bg-white">
                  <h3 className="font-bold text-slate-900 text-sm mb-8 flex items-center justify-between">
                     Estructura de Gastos IA
                     <Activity size={14} className="text-slate-200" />
                  </h3>
                  <div className="space-y-6">
                     {[
                        { label: 'Infraestructura Neural (SaaS)', value: '4.200 €', perc: 45, color: '#6366F1' },
                        { label: 'Estrategia de Captación (ADS)', value: '3.100 €', perc: 30, color: '#F59E0B' },
                        { label: 'Servicios de Terceros', value: '2.500 €', perc: 25, color: '#10B981' }
                     ].map((item, i) => (
                        <div key={i} className="space-y-2">
                           <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-slate-700">{item.label}</span>
                              <span className="text-xs font-bold text-slate-900">{item.value}</span>
                           </div>
                           <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                              <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${item.perc}%`, backgroundColor: item.color }} />
                           </div>
                        </div>
                     ))}
                  </div>
               </div>

               <div className="md:col-span-6 ds-card p-8 bg-white border-2 border-dashed border-slate-100 flex flex-col items-center justify-center text-center group cursor-pointer hover:border-indigo-200 transition-colors">
                  <div className="w-16 h-16 rounded-3xl bg-slate-50 text-slate-300 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:text-indigo-400 transition-all">
                     <Plus size={32} />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 mb-2">Añadir Módulo Operativo</h4>
                  <p className="text-[10px] text-slate-400 max-w-[210px] leading-relaxed">Personaliza tu centro de mando añadiendo métricas personalizadas de rendimiento y conversión.</p>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
