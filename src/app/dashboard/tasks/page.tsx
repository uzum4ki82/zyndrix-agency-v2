'use client';

import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Plus, 
  MoreVertical,
  Layers,
  Activity,
  Calendar,
  Briefcase,
  Target,
  ArrowRight,
  TrendingUp,
  Sparkles,
  Zap,
  ChevronRight,
  Flag
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import AddTaskModal from '@/components/dashboard/AddTaskModal';

// Sample Tasks Data
const initialTasks: any[] = [
  { id: 1, title: 'Optimización de RAG para Base de Conocimientos', priority: 'Alta', deadline: '31 Mar, 2026', progress: 45, status: 'En Progreso' },
  { id: 2, title: 'Integración Webhook n8n -> Supabase', priority: 'Media', deadline: '01 Abr, 2026', progress: 100, status: 'Completado' },
  { id: 3, title: 'Audit de Seguridad: Endpoints de OpenAI', priority: 'Alta', deadline: '02 Abr, 2026', progress: 15, status: 'Estratégico' },
  { id: 4, title: 'Despliegue de Agente de Ventas (Nicho E-commerce)', priority: 'Media', deadline: '05 Abr, 2026', progress: 60, status: 'En Progreso' },
  { id: 5, title: 'Refactor de Prompt Engineering (Lead Scoring)', priority: 'Baja', deadline: '10 Abr, 2026', progress: 0, status: 'Pendiente' },
];

export default function TasksPage() {
  const [tasks, setTasks] = useState(initialTasks);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);

  const toggleTaskStatus = (id: number) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        const isCompleted = t.status === 'Completado';
        return { 
          ...t, 
          status: isCompleted ? 'En Progreso' : 'Completado',
          progress: isCompleted ? 45 : 100 
        };
      }
      return t;
    }));
  };

  const handleAddTask = (newTask: any) => {
    setTasks(prev => [{ ...newTask, id: Date.now() }, ...prev]);
  };

  return (
    <div className="animate-in space-y-8 pb-10">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <div className="flex items-center gap-2 text-indigo-600 mb-1">
              <CheckCircle2 size={14} className="animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest">Workflow de Ejecución Zyndrix</span>
           </div>
           <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Gestión de Tareas e Hitos</h1>
        </div>
        
        <div className="flex items-center gap-3 bg-white p-1.5 rounded-xl border border-slate-100 shadow-sm">
           <button 
             onClick={() => setIsAddTaskOpen(true)}
             className="bg-slate-900 text-white px-6 py-2.5 rounded-lg text-[11px] font-black uppercase tracking-widest shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all active:scale-95 flex items-center gap-2.5 group"
           >
              <Plus size={16} className="group-hover:rotate-90 transition-transform" />
              Añadir Tarea
           </button>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
           { label: 'Tareas Pendientes', value: tasks.filter(t => t.status !== 'Completado').length, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
           { label: 'Proyectos Activos', value: '8', icon: Layers, color: 'text-indigo-600', bg: 'bg-indigo-50' },
           { label: 'Tasa de Éxito IA', value: '98.5%', icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' }
        ].map((kpi, i) => (
           <div key={i} className="ds-card p-6 bg-white flex items-center gap-5 group hover:border-indigo-100 transition-all">
              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110", kpi.bg, kpi.color)}>
                 <kpi.icon size={22} />
              </div>
              <div className="flex flex-col">
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{kpi.label}</span>
                 <span className="text-xl font-bold text-slate-900 leading-none">{kpi.value}</span>
              </div>
           </div>
        ))}
      </div>

      {/* MAIN TASKS AREA */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
         <div className="xl:col-span-8 ds-card p-0 bg-white overflow-hidden border-slate-100">
            <div className="p-6 border-b border-slate-50 flex items-center justify-between">
               <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Activity size={16} className="text-indigo-600" />
                  Lista Operativa
               </h3>
               <div className="flex bg-slate-50 p-1 rounded-lg">
                  <button className="px-3 py-1 text-[9px] font-black uppercase text-indigo-600 bg-white rounded shadow-sm">Todas</button>
                  <button className="px-3 py-1 text-[9px] font-black uppercase text-slate-400">Hoy</button>
                  <button className="px-3 py-1 text-[9px] font-black uppercase text-slate-400">Próximas</button>
               </div>
            </div>
            
            <div className="divide-y divide-slate-50">
               <AnimatePresence mode="popLayout">
                 {tasks.map((task) => (
                    <motion.div 
                       layout
                       key={task.id}
                       initial={{ opacity: 0, x: -10 }}
                       animate={{ opacity: 1, x: 0 }}
                       className="p-4 sm:p-6 hover:bg-slate-50/50 transition-all group flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                       <div className="flex items-center gap-4 sm:gap-6 flex-1">
                          <div 
                             onClick={() => toggleTaskStatus(task.id)}
                             className={cn(
                                "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110 cursor-pointer",
                                task.status === 'Completado' ? "bg-emerald-50 text-emerald-600" : "bg-slate-50 text-slate-400 hover:bg-emerald-50 hover:text-emerald-500"
                             )}
                          >
                             <CheckCircle2 size={18} />
                          </div>
                          <div className="space-y-1 content-center flex-1">
                             <h4 className={cn(
                                "text-sm font-bold tracking-tight",
                                task.status === 'Completado' ? "text-slate-300 line-through" : "text-slate-900"
                             )}>{task.title}</h4>
                             <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                                <div className="flex items-center gap-1.5">
                                   <Flag size={10} className={cn(
                                      task.priority === 'Alta' ? "text-rose-500" : 
                                      task.priority === 'Media' ? "text-amber-500" : "text-slate-300"
                                   )} />
                                   <span className="text-[10px] font-black uppercase tracking-tighter text-slate-400">{task.priority}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                   <Calendar size={10} className="text-slate-300" />
                                   <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{task.deadline}</span>
                                </div>
                             </div>
                          </div>
                       </div>
                       
                       <div className="flex items-center justify-between sm:justify-end gap-6 sm:gap-10 border-t sm:border-0 pt-3 sm:pt-0 border-slate-50">
                          <div className="flex flex-col items-start sm:items-end gap-1.5">
                             <div className="flex items-center justify-between w-28 sm:w-32">
                                <span className="text-[9px] font-black text-slate-300 uppercase leading-none">Progreso</span>
                                <span className="text-[9px] font-black text-slate-900 leading-none">{task.progress}%</span>
                             </div>
                             <div className="w-28 sm:w-32 h-1.5 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                                <motion.div 
                                   initial={{ width: 0 }}
                                   animate={{ width: `${task.progress}%` }}
                                   className={cn(
                                      "h-full rounded-full transition-all duration-1000",
                                      task.progress === 100 ? "bg-emerald-500" : "bg-indigo-600"
                                   )}
                                />
                             </div>
                          </div>
                          <MoreVertical size={16} className="text-slate-200 cursor-pointer hover:text-slate-500 transition-colors" />
                       </div>
                    </motion.div>
                 ))}
               </AnimatePresence>
            </div>
         </div>

         {/* SIDEBAR WIDGETS (Right) */}
         <div className="xl:col-span-4 space-y-8">
            <div className="ds-card p-8 bg-slate-900 text-white overflow-hidden relative group">
               <div className="absolute top-0 right-0 p-6 transform rotate-12 opacity-10 group-hover:scale-110 transition-transform">
                  <Sparkles size={80} />
               </div>
               <h3 className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-6">Optimización de Workflow</h3>
               <p className="text-sm font-medium leading-relaxed mb-8 opacity-80 italic">"Tu equipo está trabajando un <span className="text-white font-black underline decoration-indigo-500">22% más rápido</span> gracias a las automatizaciones de IA implementadas esta semana."</p>
               <button className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/10 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all backdrop-blur-sm shadow-xl">Ver Informe IA</button>
            </div>

            <div className="ds-card p-8 bg-white border-2 border-dashed border-slate-100 flex flex-col items-center justify-center text-center group cursor-pointer hover:border-indigo-100 transition-colors">
               <div className="w-16 h-16 rounded-[28px] bg-slate-50 flex items-center justify-center text-slate-300 mb-6 group-hover:scale-110 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all border border-transparent group-hover:border-indigo-100">
                  <Zap size={28} />
               </div>
               <h4 className="text-sm font-bold text-slate-900 mb-2">Crear Hito Estratégico</h4>
               <p className="text-[10px] text-slate-400 font-medium leading-relaxed max-w-[200px]">Define objetivos a largo plazo para tus proyectos automatizados de IA.</p>
            </div>
         </div>
      </div>

      <AddTaskModal 
        isOpen={isAddTaskOpen}
        onClose={() => setIsAddTaskOpen(false)}
        onAdd={handleAddTask}
      />
    </div>
  );
}
