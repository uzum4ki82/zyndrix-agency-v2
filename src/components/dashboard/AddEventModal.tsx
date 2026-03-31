'use client';

import React, { useState } from 'react';
import { 
  X, 
  Calendar as CalendarIcon, 
  Clock, 
  Video, 
  Phone, 
  Target, 
  Users, 
  Sparkles,
  Save
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (event: any) => void;
}

export default function AddEventModal({ isOpen, onClose, onAdd }: AddEventModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    time_start: '10:00',
    time_end: '11:00',
    type: 'meeting',
    participants: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return;
    
    const newEvent = {
      id: Math.random().toString(36).substr(2, 9),
      title: formData.title,
      time: `${formData.time_start} - ${formData.time_end}`,
      type: formData.type,
      participants: formData.participants || 'Sin asignar',
      status: 'upcoming'
    };
    
    onAdd(newEvent);
    setFormData({ title: '', time_start: '10:00', time_end: '11:00', type: 'meeting', participants: '' });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100"
          >
            <div className="p-8">
               <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-100">
                        <CalendarIcon size={20} />
                     </div>
                     <h2 className="text-xl font-bold text-slate-900 tracking-tight">Nuevo Evento</h2>
                  </div>
                  <button onClick={onClose} className="p-2 overflow-hidden hover:bg-slate-50 text-slate-300 hover:text-slate-900 transition-all rounded-full">
                     <X size={20} />
                  </button>
               </div>

               <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Título del Evento</label>
                     <input 
                        required
                        placeholder="Ej: Demo Agente IA Hospital"
                        className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold text-slate-900 outline-none focus:border-indigo-500 transition-all"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                     />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Hora Inicio</label>
                        <input 
                           type="time" 
                           className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold text-slate-900 outline-none focus:border-indigo-500 transition-all"
                           value={formData.time_start}
                           onChange={(e) => setFormData({ ...formData, time_start: e.target.value })}
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Hora Fin</label>
                        <input 
                           type="time" 
                           className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold text-slate-900 outline-none focus:border-indigo-500 transition-all"
                           value={formData.time_end}
                           onChange={(e) => setFormData({ ...formData, time_end: e.target.value })}
                        />
                     </div>
                  </div>

                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Tipo de Evento</label>
                     <div className="grid grid-cols-3 gap-2">
                        {[
                           { id: 'meeting', icon: Users, label: 'Reunión' },
                           { id: 'call', icon: Phone, label: 'Llamada' },
                           { id: 'video', icon: Video, label: 'Vídeo' }
                        ].map((t) => (
                           <button 
                              key={t.id}
                              type="button"
                              onClick={() => setFormData({ ...formData, type: t.id })}
                              className={cn(
                                 "flex flex-col items-center justify-center p-3 rounded-2xl border transition-all gap-1.5",
                                 formData.type === t.id ? "bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100" : "bg-slate-50 text-slate-400 border-transparent hover:border-slate-200"
                              )}
                           >
                              <t.icon size={16} />
                              <span className="text-[8px] font-black uppercase tracking-widest">{t.label}</span>
                           </button>
                        ))}
                     </div>
                  </div>

                  <div className="space-y-2 pb-4">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Participante / Cliente</label>
                     <input 
                        placeholder="Ej: Dr. Alejandro / Glow"
                        className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold text-slate-900 outline-none focus:border-indigo-500 transition-all"
                        value={formData.participants}
                        onChange={(e) => setFormData({ ...formData, participants: e.target.value })}
                     />
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-slate-900 text-white py-5 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 active:scale-95 group"
                  >
                     <Save size={18} className="group-hover:translate-y-0.5 transition-transform" />
                     Guardar Evento en Agenda
                  </button>
               </form>
            </div>
            
            <div className="bg-indigo-50/50 p-6 flex items-center gap-3 border-t border-indigo-50">
               <Sparkles className="text-indigo-600" size={16} />
               <p className="text-[9px] font-bold text-indigo-600 uppercase tracking-widest leading-snug">Zyndrix enviará un recordatorio automático 15m antes.</p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
