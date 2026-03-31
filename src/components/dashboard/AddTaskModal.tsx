'use client';

import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  Clock, 
  Flag, 
  Layout, 
  MessageSquare,
  Sparkles,
  Save,
  Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (task: any) => void;
}

export default function AddTaskModal({ isOpen, onClose, onAdd }: AddTaskModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    priority: 'media',
    deadline: 'Hoy',
    status: 'Pendiente'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return;
    
    const newTask = {
      id: Math.random().toString(36).substr(2, 9),
      title: formData.title,
      priority: formData.priority.charAt(0).toUpperCase() + formData.priority.slice(1),
      deadline: formData.deadline,
      progress: 0,
      status: 'En proceso'
    };
    
    onAdd(newTask);
    setFormData({ title: '', priority: 'media', deadline: 'Hoy', status: 'Pendiente' });
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
            className="relative w-full max-w-lg bg-white rounded-[40px] shadow-2xl overflow-hidden border border-slate-100"
          >
            <div className="p-8 lg:p-12">
               <div className="flex items-center justify-between mb-10">
                  <div className="flex items-center gap-4">
                     <div className="w-14 h-14 rounded-[22px] bg-slate-900 flex items-center justify-center text-white shadow-2xl shadow-slate-200">
                        <CheckCircle2 size={28} />
                     </div>
                     <div>
                        <h2 className="text-2xl font-bold text-slate-900 tracking-tight leading-none mb-1.5">Nueva Tarea</h2>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5 leading-none">
                           <Layout size={10} className="text-indigo-400" />
                           Workflow Operativo Zyndrix
                        </p>
                     </div>
                  </div>
                  <button onClick={onClose} className="p-2.5 hover:bg-slate-50 text-slate-300 hover:text-slate-900 transition-all rounded-full border border-transparent hover:border-slate-100">
                     <X size={20} />
                  </button>
               </div>

               <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="space-y-3">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 flex items-center gap-2">
                        <MessageSquare size={12} className="text-indigo-400" />
                        Definición de la Tarea
                     </label>
                     <textarea 
                        required
                        placeholder="Ej: Integrar API de WhatsApp en n8n para ClinicaSol..."
                        rows={3}
                        className="w-full p-5 bg-slate-50 border border-slate-100 rounded-3xl text-sm font-bold text-slate-900 outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all resize-none placeholder:text-slate-300"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                     />
                  </div>

                  <div className="grid grid-cols-2 gap-8">
                     <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 flex items-center gap-2">
                           <Flag size={12} className="text-indigo-400" />
                           Prioridad
                        </label>
                        <div className="relative group">
                           <select 
                             className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-black text-slate-900 outline-none appearance-none focus:border-indigo-500 cursor-pointer"
                             value={formData.priority}
                             onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                           >
                              <option value="baja">Baja</option>
                              <option value="media">Media</option>
                              <option value="alta">Alta</option>
                           </select>
                           <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300">
                              <Layout size={14} />
                           </div>
                        </div>
                     </div>
                     <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 flex items-center gap-2">
                           <Calendar size={12} className="text-indigo-400" />
                           Fecha Límite
                        </label>
                        <input 
                           placeholder="Mañana"
                           className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-black text-slate-900 outline-none focus:border-indigo-500 transition-all"
                           value={formData.deadline}
                           onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                        />
                     </div>
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-slate-900 text-white py-6 rounded-[24px] font-bold text-xs flex items-center justify-center gap-3 hover:bg-slate-800 transition-all shadow-2xl shadow-indigo-900/10 active:scale-95 group"
                  >
                     <Save size={20} className="group-hover:-translate-y-0.5 transition-transform" />
                     Guardar Tarea en Workflow
                  </button>
               </form>
            </div>
            
            <div className="bg-emerald-50/40 p-8 flex items-center gap-4 border-t border-emerald-50">
               <div className="w-12 h-12 rounded-2xl bg-emerald-600/10 flex items-center justify-center text-emerald-600">
                  <Sparkles size={24} />
               </div>
               <div>
                  <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest leading-none mb-1">IA Zyndrix Activa</p>
                  <p className="text-[10px] font-bold text-emerald-600/60 uppercase tracking-tight leading-relaxed">Esta tarea se sincronizará automáticamente con tu calendario operativo.</p>
               </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
