'use client';

import React, { useState } from 'react';
import { 
  X, 
  FileText, 
  Euro, 
  Calendar, 
  Users, 
  CreditCard,
  Sparkles,
  Save,
  Clock,
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AddQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (quote: any) => void;
}

export default function AddQuoteModal({ isOpen, onClose, onAdd }: AddQuoteModalProps) {
  const [formData, setFormData] = useState({
    client: '',
    amount: '4.500',
    valid_until: '30 Abr 2026',
    type: 'AI Retainer',
    tax_included: true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.client) return;
    
    const newQuote = {
      id: `#${Math.floor(1000 + Math.random() * 9000)}`,
      client: formData.client,
      amount: `${formData.amount} €`,
      date: 'Hoy',
      expiry: formData.valid_until,
      status: 'borrador',
      type: formData.type
    };
    
    onAdd(newQuote);
    setFormData({ client: '', amount: '4.500', valid_until: '30 Abr 2026', type: 'AI Retainer', tax_included: true });
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
            className="relative w-full max-w-xl bg-white rounded-[40px] shadow-2xl overflow-hidden border border-slate-100"
          >
            <div className="p-8 lg:p-12">
               <div className="flex items-center justify-between mb-10">
                  <div className="flex items-center gap-4">
                     <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-2xl shadow-indigo-100">
                        <FileText size={28} />
                     </div>
                     <div>
                        <h2 className="text-2xl font-bold text-slate-900 tracking-tight leading-none mb-1.5">Nuevo Presupuesto</h2>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5 italic">
                           <CreditCard size={10} className="text-emerald-500" />
                           Cotización Certificada Zyndrix
                        </p>
                     </div>
                  </div>
                  <button onClick={onClose} className="p-3 hover:bg-slate-50 text-slate-300 hover:text-slate-900 transition-all rounded-full border border-transparent hover:border-slate-100">
                     <X size={20} />
                  </button>
               </div>

               <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="space-y-3">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 flex items-center gap-2">
                        <Users size={12} className="text-indigo-400" />
                        Cliente / Empresa Destino
                     </label>
                     <input 
                        required
                        placeholder="Ej: Inmobiliaria Sol S.A."
                        className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-900 outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all placeholder:text-slate-200"
                        value={formData.client}
                        onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                     />
                  </div>

                  <div className="grid grid-cols-2 gap-8">
                     <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 flex items-center gap-2">
                           <Euro size={12} className="text-indigo-400" />
                           Importe Base (€)
                        </label>
                        <input 
                           placeholder="4.500"
                           className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-black text-slate-900 outline-none focus:border-indigo-500 transition-all"
                           value={formData.amount}
                           onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                        />
                     </div>
                     <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 flex items-center gap-2">
                           <Calendar size={12} className="text-indigo-400" />
                           Válido hasta
                        </label>
                        <input 
                           placeholder="30 Abr 2026"
                           className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-black text-slate-900 outline-none focus:border-indigo-500 transition-all"
                           value={formData.valid_until}
                           onChange={(e) => setFormData({ ...formData, valid_until: e.target.value })}
                        />
                     </div>
                  </div>

                  <div className="space-y-3 pb-4">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 flex items-center gap-2">
                        <ShieldCheck size={12} className="text-indigo-400" />
                        Tipo de Servicio
                     </label>
                     <select 
                        className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-black text-slate-900 outline-none cursor-pointer focus:border-indigo-500 transition-all"
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                     >
                        <option value="AI Retainer">Iguala Mensual (AI Retainer)</option>
                        <option value="AI Automation">Automatización IA</option>
                        <option value="Enterprise AI">Implementación Corporativa</option>
                        <option value="Maintenance">Mantenimiento y Soporte</option>
                     </select>
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-slate-900 text-white py-6 rounded-[24px] font-bold text-xs flex items-center justify-center gap-3 hover:bg-slate-800 transition-all shadow-2xl shadow-indigo-900/10 active:scale-95 group"
                  >
                     <Save size={20} className="group-hover:-translate-y-0.5 transition-transform" />
                     Emitir y Enviar a Pasarela de Pagos
                  </button>
               </form>
            </div>
            
            <div className="bg-emerald-50/40 p-8 flex items-center gap-4 border-t border-emerald-50 overflow-hidden relative group">
               <div className="absolute top-0 right-0 p-4 opacity-5 transform rotate-12 group-hover:scale-110 transition-transform"><CreditCard size={100} /></div>
               <div className="w-12 h-12 rounded-2xl bg-emerald-600/10 flex items-center justify-center text-emerald-600 relative z-10">
                  <Sparkles size={24} />
               </div>
               <div className="relative z-10">
                  <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest leading-none mb-1">Pasarela Stripe Lista</p>
                  <p className="text-[10px] font-bold text-emerald-600/60 uppercase tracking-tight leading-relaxed">Zyndrix generará un enlace de pago seguro para que el cliente pague con tarjeta o transferencia.</p>
               </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
