'use client';

import React, { useState } from 'react';
import { 
  X, 
  UserPlus, 
  Building2, 
  Euro, 
  Mail, 
  Phone, 
  Briefcase,
  Sparkles,
  Save,
  Flag
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AddLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (lead: any) => void;
}

export default function AddLeadModal({ isOpen, onClose, onAdd }: AddLeadModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    value: '2.500',
    email: '',
    type: 'AI Agent',
    priority: 'media'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.company) return;
    
    const newLead = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name,
      company: formData.company,
      value: `${formData.value} €`,
      days: 'Hoy',
      type: formData.type,
      status: 'prospecto'
    };
    
    onAdd(newLead);
    setFormData({ name: '', company: '', value: '2.500', email: '', type: 'AI Agent', priority: 'media' });
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
            className="relative w-full max-w-lg bg-white rounded-[32px] shadow-2xl overflow-hidden border border-slate-100"
          >
            <div className="p-8 lg:p-10">
               <div className="flex items-center justify-between mb-10">
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-xl shadow-indigo-100">
                        <UserPlus size={24} />
                     </div>
                     <div>
                        <h2 className="text-xl font-bold text-slate-900 tracking-tight leading-none mb-1">Nuevo Prospecto</h2>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Captación de Oportunidad Zyndrix</p>
                     </div>
                  </div>
                  <button onClick={onClose} className="p-2 hover:bg-slate-50 text-slate-300 hover:text-slate-900 transition-all rounded-full">
                     <X size={20} />
                  </button>
               </div>

               <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 flex items-center gap-2">
                           <Briefcase size={12} className="text-indigo-400" />
                           Nombre del Lead
                        </label>
                        <input 
                           required
                           placeholder="Ej: Alejandro Pérez"
                           className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
                           value={formData.name}
                           onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 flex items-center gap-2">
                           <Building2 size={12} className="text-indigo-400" />
                           Empresa / Cliente
                        </label>
                        <input 
                           required
                           placeholder="Ej: Inmobiliaria Sol"
                           className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
                           value={formData.company}
                           onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        />
                     </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 flex items-center gap-2">
                           <Mail size={12} className="text-indigo-400" />
                           Email de Contacto
                        </label>
                        <input 
                           type="email"
                           placeholder="contacto@empresa.com"
                           className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
                           value={formData.email}
                           onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 flex items-center gap-2">
                           <Euro size={12} className="text-indigo-400" />
                           Valor Estimado (€)
                        </label>
                        <input 
                           placeholder="2.500"
                           className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
                           value={formData.value}
                           onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                        />
                     </div>
                  </div>

                  <div className="space-y-2 pb-6">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 flex items-center gap-2">
                        <Flag size={12} className="text-indigo-400" />
                        Tipo de Servicio AI
                     </label>
                     <div className="grid grid-cols-3 gap-3">
                        {['AI Agent', 'Automation', 'Full Tech'].map((t) => (
                           <button 
                              key={t}
                              type="button"
                              onClick={() => setFormData({ ...formData, type: t })}
                              className={cn(
                                 "p-3.5 rounded-2xl border text-[9px] font-black uppercase tracking-widest transition-all",
                                 formData.type === t ? "bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100" : "bg-slate-50 text-slate-400 border-transparent hover:border-slate-200"
                              )}
                           >
                              {t}
                           </button>
                        ))}
                     </div>
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-slate-900 text-white py-5 rounded-[20px] font-bold text-xs flex items-center justify-center gap-2.5 hover:bg-slate-800 transition-all shadow-2xl shadow-slate-200 active:scale-95 group"
                  >
                     <Save size={18} className="group-hover:-translate-y-0.5 transition-transform" />
                     Ingresar Lead al Embudo
                  </button>
               </form>
            </div>
            
            <div className="bg-indigo-50/50 p-8 flex items-center gap-4 border-t border-indigo-50">
               <div className="w-10 h-10 rounded-full bg-indigo-600/10 flex items-center justify-center text-indigo-600">
                  <Sparkles size={20} />
               </div>
               <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest leading-relaxed">Zyndrix analizará este lead mediante el Agente Neural para priorizar el cierre.</p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
