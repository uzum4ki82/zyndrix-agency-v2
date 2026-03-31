'use client';

import React from 'react';
import { 
  X, 
  Brain, 
  Zap, 
  Target, 
  TrendingUp, 
  MessageSquare, 
  Phone, 
  Mail, 
  Globe, 
  ArrowUpRight,
  ShieldCheck,
  Sparkles,
  PieChart,
  BarChart3,
  Calendar,
  Layers,
  Search,
  Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  prospect: any;
}

export default function AnalysisModal({ isOpen, onClose, prospect }: AnalysisModalProps) {
  if (!prospect) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 sm:p-6">
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
            className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl shadow-slate-950/20 overflow-hidden flex flex-col md:flex-row h-[90vh] md:h-auto max-h-[90vh] border border-slate-100"
          >
            {/* Sidebar info (Left) */}
            <div className="w-full md:w-80 bg-slate-50 border-r border-slate-100 p-8 flex flex-col overflow-y-auto">
               <div className="mb-10">
                  <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center text-white mb-6 shadow-lg shadow-indigo-100">
                     <Brain size={32} />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 leading-tight mb-2">Análisis de Inteligencia</h2>
                  <p className="text-xs font-bold text-indigo-500 uppercase tracking-widest">Prospecto: {prospect.name || 'Empresa'}</p>
               </div>

               <div className="space-y-6 flex-1">
                  <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Puntuación Elite</span>
                     <div className="flex items-end gap-2">
                        <span className="text-4xl font-black text-slate-900 leading-none">94</span>
                        <span className="text-sm font-bold text-emerald-500 mb-1">/100</span>
                     </div>
                  </div>

                  <div className="space-y-4">
                     <div className="flex items-center gap-3 text-slate-600">
                        <Mail size={16} className="text-slate-400" />
                        <span className="text-xs font-bold truncate">{prospect.email || 'info@zyndrix.ai'}</span>
                     </div>
                     <div className="flex items-center gap-3 text-slate-600">
                        <Phone size={16} className="text-slate-400" />
                        <span className="text-xs font-bold">{prospect.phone || '+34 900 000 000'}</span>
                     </div>
                     <div className="flex items-center gap-3 text-slate-600">
                        <Globe size={16} className="text-slate-400" />
                        <span className="text-xs font-bold">{prospect.company_name || 'Individual'}</span>
                     </div>
                  </div>
               </div>

               <div className="mt-10 pt-6 border-t border-slate-200">
                  <button className="w-full bg-slate-900 text-white rounded-xl py-4 font-bold text-xs flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-lg shadow-slate-200">
                     <MessageSquare size={16} />
                     Personalizar Outreach
                  </button>
               </div>
            </div>

            {/* Main Content (Right) */}
            <div className="flex-1 p-8 md:p-12 overflow-y-auto bg-white custom-scrollbar">
               <button 
                 onClick={onClose}
                 className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-50 text-slate-400 hover:text-slate-900 transition-all z-10"
               >
                 <X size={20} />
               </button>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                  <div className="space-y-4">
                     <div className="flex items-center gap-2 text-indigo-600 mb-2">
                        <Zap size={18} fill="currentColor" />
                        <h3 className="font-bold text-sm uppercase tracking-widest">Pain Points Detectados</h3>
                     </div>
                     <div className="space-y-3">
                        {[
                           'Saturación en atención al cliente vía WhatsApp',
                           'Baja tasa de conversión en leads cualificados',
                           'Falta de seguimiento automático tras primer contacto'
                        ].map((point, i) => (
                           <div key={i} className="flex gap-3 items-start group">
                              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 group-hover:scale-150 transition-transform" />
                              <p className="text-sm text-slate-600 font-medium">{point}</p>
                           </div>
                        ))}
                     </div>
                  </div>

                  <div className="space-y-4">
                     <div className="flex items-center gap-2 text-emerald-600 mb-2">
                        <Target size={18} fill="currentColor" />
                        <h3 className="font-bold text-sm uppercase tracking-widest">Oportunidades de Cierre</h3>
                     </div>
                     <div className="space-y-3">
                        {[
                           'Presupuesto superior al ticket medio (High-Ticket)',
                           'Necesidad inmediata de implementación (2 semanas)',
                           'Perfil de decisor con autoridad directa (CEO/Owner)'
                        ].map((opt, i) => (
                           <div key={i} className="flex gap-3 items-start group">
                              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 group-hover:scale-150 transition-transform" />
                              <p className="text-sm text-slate-600 font-medium">{opt}</p>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>

               <div className="ds-card p-8 bg-indigo-50/30 border-indigo-100 mb-8 border-dashed">
                  <div className="flex items-center gap-3 mb-6">
                     <Sparkles className="text-indigo-600" size={24} />
                     <h3 className="font-bold text-slate-900 text-lg">Inferencia Estratégica IA</h3>
                  </div>
                  <p className="text-slate-600 leading-relaxed text-sm italic font-medium">
                     "Basándonos en el volumen de consultas reportado y el sector de actividad, el prospecto presenta un ROI proyectado del 450% en los primeros 90 días mediante la implementación de un Agente Neural de Nivel 2 sincronizado con su CRM actual. Se recomienda oferta de onboarding acelerado."
                  </p>
               </div>

               <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                     <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2">Ticket Estimado</span>
                     <span className="text-lg font-bold text-slate-900">{prospect.budget || '12.500 €'}</span>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                     <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2">Ajuste de Producto</span>
                     <span className="text-lg font-bold text-indigo-600">Perfecto</span>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                     <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2">Estado</span>
                     <span className="text-lg font-bold text-emerald-600">Prioridad</span>
                  </div>
               </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
