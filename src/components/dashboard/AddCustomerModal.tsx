'use client';

import React, { useState } from 'react';
import { 
  X, 
  Crown, 
  TrendingUp, 
  Building2, 
  Euro, 
  Target, 
  CheckCircle2,
  Sparkles,
  Save,
  ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AddCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (customer: any) => void;
}

export default function AddCustomerModal({ isOpen, onClose, onAdd }: AddCustomerModalProps) {
  const [formData, setFormData] = useState({
    company: '',
    ltv: '5.000',
    status: 'activo',
    type: 'Retainer'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.company) return;
    
    const newCustomer = {
      id: Math.random().toString(36).substr(2, 9),
      company: formData.company,
      ltv: `${formData.ltv} €`,
      projects: 1,
      status: formData.status === 'activo' ? 'Activo' : 'Pausado',
      type: formData.type,
      isSpecial: true
    };
    
    onAdd(newCustomer);
    setFormData({ company: '', ltv: '5.000', status: 'activo', type: 'Retainer' });
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
            <div className="p-6 sm:p-8 lg:p-12">
               <div className="flex items-center justify-between mb-8 sm:mb-10">
                  <div className="flex items-center gap-3 sm:gap-4">
                     <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-2xl shadow-indigo-100 flex-shrink-0">
                        <Crown size={22} className="sm:hidden" />
                        <Crown size={28} className="hidden sm:block" />
                     </div>
                     <div>
                        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight leading-none mb-1.5">Nuevo Cliente</h2>
                        <p className="hidden xs:flex text-[10px] font-black text-slate-400 uppercase tracking-widest items-center gap-1.5">
                           <ShieldCheck size={10} className="text-emerald-500" />
                           Cartera de Valor Zyndrix
                        </p>
                     </div>
                  </div>
                  <button onClick={onClose} className="p-3 hover:bg-slate-50 text-slate-300 hover:text-slate-900 transition-all rounded-full border border-transparent hover:border-slate-100 flex-shrink-0">
                     <X size={20} />
                  </button>
               </div>

               <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
                  <div className="space-y-3">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 flex items-center gap-2">
                        <Building2 size={12} className="text-indigo-400" />
                        Nombre de la Empresa Cliente
                     </label>
                     <input 
                        required
                        placeholder="Ej: Multinacional Tech S.L."
                        className="w-full p-4 sm:p-5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-900 outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all placeholder:text-slate-200"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                     />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
                     <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 flex items-center gap-2">
                           <Euro size={12} className="text-indigo-400" />
                           LTV Estimado
                        </label>
                        <input 
                           placeholder="5.000"
                           className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-black text-slate-900 outline-none focus:border-indigo-500 transition-all"
                           value={formData.ltv}
                           onChange={(e) => setFormData({ ...formData, ltv: e.target.value })}
                        />
                     </div>
                     <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 flex items-center gap-2">
                           <Target size={12} className="text-indigo-400" />
                           Tipo de Contrato
                        </label>
                        <select 
                           className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-black text-slate-900 outline-none cursor-pointer focus:border-indigo-500"
                           value={formData.type}
                           onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        >
                           <option value="Retainer">Iguala Mensual (Retainer)</option>
                           <option value="Project">Proyecto Único</option>
                           <option value="Growth">Escalamiento IA</option>
                        </select>
                     </div>
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-slate-900 text-white py-6 rounded-[24px] font-bold text-xs flex items-center justify-center gap-3 hover:bg-slate-800 transition-all shadow-2xl shadow-indigo-900/10 active:scale-95 group"
                  >
                     <Save size={20} className="group-hover:-translate-y-0.5 transition-transform" />
                     Sellar Acuerdo y Añadir Cliente
                  </button>
               </form>
            </div>
            
            <div className="bg-indigo-50/50 p-8 flex items-center gap-4 border-t border-indigo-50">
               <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 flex items-center justify-center text-indigo-600">
                  <Sparkles size={24} />
               </div>
               <div>
                  <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest leading-none mb-1">Impacto en Facturación</p>
                  <p className="text-[10px] font-bold text-indigo-600/60 uppercase tracking-tight leading-relaxed">Este cliente especial incrementará tus métricas de ROI proyectado en un 12%.</p>
               </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
