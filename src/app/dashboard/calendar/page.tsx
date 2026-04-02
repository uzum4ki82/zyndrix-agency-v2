'use client';

import React, { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Clock, 
  Video, 
  Phone, 
  Target, 
  Users, 
  MoreVertical,
  Activity,
  Layers,
  Search,
  Bell
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';
import AddEventModal from '@/components/dashboard/AddEventModal';

// Sample Mock Events
const initialEvents: any[] = [
  { id: 1, title: 'Daily Standup: Sincronización n8n', time: '09:00 - 09:30', type: 'meeting', participants: 'Equipo Técnico', status: 'upcoming' },
  { id: 2, title: 'Demo Cliente: Agente de Atención al Cliente', time: '11:00 - 12:00', type: 'video', participants: 'Carlos (CEO E-com)', status: 'upcoming' },
  { id: 3, title: 'Sesión de Prompt Engineering Avanzado', time: '15:00 - 16:30', type: 'meeting', participants: 'Head of IA', status: 'upcoming' },
  { id: 4, title: 'Revisión de Flujos de Captación', time: '17:30 - 18:00', type: 'call', participants: 'Marketing Team', status: 'completed' },
];

export default function CalendarPage() {
  const [events, setEvents] = useState(initialEvents);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());

  // Intentamos cargar eventos reales si existen
  useEffect(() => {
    async function fetchEvents() {
      const { data, error } = await supabase.from('calendar_events').select('*');
      if (!error && data && data.length > 0) {
        const mapped = data.map(ev => ({
           id: ev.id,
           title: ev.title,
           time: `${ev.start_time?.split('T')[1]?.slice(0,5)} - ${ev.end_time?.split('T')[1]?.slice(0,5)}`,
           type: ev.event_type || 'meeting',
           participants: 'Admin',
           status: 'upcoming'
        }));
        setEvents([...initialEvents, ...mapped]);
      }
    }
    fetchEvents();
  }, []);

  const handleAddEvent = (newEvent: any) => {
    setEvents(prev => [{ ...newEvent, id: Date.now() }, ...prev]);
  };

  return (
    <div className="animate-in space-y-8">
      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-2">
         <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Calendario de Operaciones</h1>
            <div className="inline-flex w-fit px-2 py-0.5 rounded bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest border border-indigo-100">Planificación AI</div>
         </div>
         <div className="flex items-center gap-3 sm:gap-4 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
            <div className="flex items-center bg-white border border-slate-200 rounded-lg p-1 shadow-sm flex-shrink-0">
               <button className="p-1 px-3 text-[10px] font-bold bg-slate-100 rounded-md text-slate-900">Agenda</button>
               <button className="p-1 px-3 text-[10px] font-bold text-slate-400 hover:text-slate-600 transition-colors">Mes</button>
               <button className="p-1 px-3 text-[10px] font-bold text-slate-400 hover:text-slate-600 transition-colors">Semana</button>
            </div>
            <button 
               onClick={() => setIsModalOpen(true)}
               className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-md text-[11px] font-bold shadow-md shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95 group flex-shrink-0"
            >
               <Plus size={14} className="group-hover:rotate-90 transition-transform" />
               <span>Nuevo Evento</span>
            </button>
         </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
         {/* Main Agenda Section (Left) */}
         <div className="xl:col-span-8 space-y-6">
            <div className="ds-card p-4 sm:p-6 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
               <div className="flex items-center gap-4 sm:gap-6">
                  <div className="flex items-center gap-2">
                     <button className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"><ChevronLeft size={16} className="text-slate-500" /></button>
                     <button className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"><ChevronRight size={16} className="text-slate-500" /></button>
                  </div>
                  <h2 className="text-sm sm:text-lg font-bold text-slate-900 lowercase first-letter:uppercase">Martes, 31 de Marzo, 2026</h2>
               </div>
               <div className="flex items-center gap-2 text-indigo-600 cursor-pointer group w-fit">
                  <span className="text-[10px] font-black uppercase tracking-widest group-hover:underline">Hoy</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
               </div>
            </div>

            {/* Time Slots Area */}
            <div className="ds-card p-0 overflow-hidden bg-white">
               <div className="p-4 sm:p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/20">
                  <h3 className="font-bold text-slate-800 text-xs sm:text-sm">Eventos de Hoy</h3>
                  <div className="flex items-center gap-1.5 text-slate-400 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">
                     <Clock size={12} fill="currentColor" className="opacity-20" />
                     <span>Sincronizado hace 2m</span>
                  </div>
               </div>
               
               <div className="divide-y divide-slate-50">
                  <AnimatePresence mode="popLayout">
                    {events.map((event, i) => (
                       <motion.div 
                          key={event.id} 
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="p-4 sm:p-6 hover:bg-slate-50/80 transition-all flex flex-col sm:flex-row sm:gap-8 group gap-4"
                       >
                          <div className="w-full sm:w-24 flex sm:flex-col items-center sm:items-start justify-between sm:justify-start gap-1">
                             <span className={cn(
                                "text-sm font-black tracking-tighter",
                                event.status === 'completed' ? "text-slate-300" : "text-slate-900"
                             )}>{event.time.split(' - ')[0]}</span>
                             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{event.time.split(' - ')[1]}</p>
                          </div>
                          
                          <div className="flex-1 flex items-start justify-between gap-4">
                             <div className="flex gap-4 sm:gap-5">
                                <div className={cn(
                                   "w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-105",
                                   event.type === 'meeting' ? "bg-indigo-50 text-indigo-600 shadow-indigo-100/50" : 
                                   event.type === 'call' ? "bg-emerald-50 text-emerald-600 shadow-emerald-100/50" :
                                   event.type === 'video' ? "bg-amber-50 text-amber-600 shadow-amber-100/50" : "bg-slate-50 text-slate-400"
                                )}>
                                   {event.type === 'meeting' ? <Users size={18} /> : 
                                    event.type === 'call' ? <Phone size={18} /> :
                                    event.type === 'video' ? <Video size={18} /> : <Target size={18} />}
                                </div>
                                <div className="flex flex-col">
                                   <h4 className={cn(
                                      "text-xs sm:text-sm font-bold opacity-90",
                                      event.status === 'completed' ? "text-slate-300 line-through" : "text-slate-900"
                                   )}>{event.title}</h4>
                                   <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5">
                                      <div className="flex items-center gap-1.5">
                                         <div className="w-1 h-1 rounded-full bg-slate-300" />
                                         <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{event.participants}</span>
                                      </div>
                                      {event.status === 'upcoming' && (
                                         <div className="flex items-center gap-1.5">
                                            <div className="w-1 h-1 rounded-full bg-indigo-500" />
                                            <span className="text-[9px] font-bold text-indigo-600 uppercase tracking-tighter">Confirmado</span>
                                         </div>
                                      )}
                                   </div>
                                </div>
                             </div>
                             
                             <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                                {event.type === 'video' && (
                                   <button className="hidden sm:block bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-md shadow-indigo-100 hover:bg-indigo-700 transition-all opacity-0 group-hover:opacity-100 whitespace-nowrap">Unirse</button>
                                )}
                                <MoreVertical size={16} className="text-slate-200 cursor-pointer hover:text-slate-500 transition-colors" />
                             </div>
                          </div>
                       </motion.div>
                    ))}
                  </AnimatePresence>
               </div>
            </div>
         </div>

         {/* Sidebar Controls (Right) */}
         <div className="xl:col-span-4 space-y-8">
            <div className="ds-card p-6 bg-white overflow-hidden relative">
               <h3 className="font-bold text-slate-900 text-sm mb-6 flex items-center justify-between">
                  Vista Mensual
                  <Bell size={14} className="text-slate-300 cursor-pointer" />
               </h3>
               <div className="grid grid-cols-7 gap-y-3 gap-x-1 text-center">
                  {['L','M','X','J','V','S','D'].map(d => (
                     <span key={d} className="text-[10px] font-black text-slate-300">{d}</span>
                  ))}
                  {Array.from({ length: 31 }).map((_, i) => {
                     const isSelected = i + 1 === 31;
                     const hasEvent = [4, 12, 19, 24, 28].includes(i+1);
                     return (
                        <div key={i} className="flex flex-col items-center gap-0.5">
                           <button className={cn(
                              "w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-bold transition-all relative",
                              isSelected ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100" : "text-slate-600 hover:bg-slate-50"
                           )}>
                              {i + 1}
                              {hasEvent && !isSelected && (
                                 <div className="absolute bottom-1 w-1 h-1 rounded-full bg-indigo-200" />
                              )}
                           </button>
                        </div>
                     );
                  })}
               </div>
            </div>

            <div className="ds-card p-6 bg-slate-900 text-white overflow-hidden relative">
               <div className="absolute top-0 right-0 p-4 transform rotate-12 opacity-10">
                  <Activity size={100} />
               </div>
               <h3 className="text-xs font-black uppercase tracking-widest text-indigo-400 mb-6 relative z-10">Estado de Red</h3>
               <div className="space-y-5 relative z-10">
                  <div className="flex items-center justify-between">
                     <span className="text-[11px] font-bold text-slate-300">Calendario Google</span>
                     <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
                        <span className="text-[9px] font-black uppercase">Live</span>
                     </div>
                  </div>
                  <div className="flex items-center justify-between">
                     <span className="text-[11px] font-bold text-slate-300">Slack Webhooks</span>
                     <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
                        <span className="text-[9px] font-black uppercase">Live</span>
                     </div>
                  </div>
               </div>
               <div className="mt-8 pt-6 border-t border-white/5 relative z-10">
                  <button className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/10 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all backdrop-blur-sm">Sincronizar Manualmente</button>
               </div>
            </div>
         </div>
      </div>

      <AddEventModal 
         isOpen={isModalOpen} 
         onClose={() => setIsModalOpen(false)} 
         onAdd={handleAddEvent} 
      />
    </div>
  );
}
