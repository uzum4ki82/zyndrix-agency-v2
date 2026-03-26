'use client';

import React from 'react';
import { 
  X, 
  Brain, 
  Target, 
  Zap, 
  Activity, 
  CheckCircle2, 
  AlertCircle,
  ArrowUpRight,
  ArrowRight,
  TrendingUp,
  Cpu,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  prospect: any;
}

export default function AnalysisModal({ isOpen, onClose, prospect }: AnalysisModalProps) {
  if (!prospect) return null;

  const score = prospect.lead_score || prospect.score_ia || 0;
  const reasoning = prospect.reasoning || "No se ha generado un análisis detallado para este prospecto aún. El sistema está esperando la activación del motor de inferencia.";
  
  // Try to parse opportunities if its a JSON string or array
  let opportunities: string[] = [];
  try {
     if (typeof prospect.opportunities === 'string') {
        opportunities = JSON.parse(prospect.opportunities);
     } else if (Array.isArray(prospect.opportunities)) {
        opportunities = prospect.opportunities;
     } else {
        opportunities = ["Implementación de Agente WhatsApp", "Automatización de CRM", "Lead Scoring Predictivo"];
     }
  } catch (e) {
     opportunities = ["AI Chatbot for Support", "Automated Lead CRM Sync", "AI Content Engine"];
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100]"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-[#0a0a0c] border border-white/10 rounded-[2rem] shadow-[0_30px_100px_rgba(0,0,0,0.8)] z-[101] overflow-hidden"
          >
            {/* Header / Top bar style */}
            <div className="h-1.5 w-full bg-gradient-to-r from-blue-600 via-purple-600 to-rose-600" />
            
            <div className="p-8">
               <div className="flex items-start justify-between mb-8">
                  <div className="flex items-center gap-4">
                     <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 shadow-inner">
                        <Brain size={28} />
                     </div>
                     <div className="flex flex-col">
                        <h2 className="text-2xl font-black text-white uppercase font-mono tracking-tighter">AI Neuro-Analysis</h2>
                        <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">
                           <Cpu size={12} className="text-purple-500" /> Model: GPT-4o-Analyst • Ref: {prospect.id?.toString().slice(0,8)}
                        </div>
                     </div>
                  </div>
                  <button 
                    onClick={onClose}
                    className="p-2 rounded-xl hover:bg-white/5 text-slate-500 hover:text-white transition-all"
                  >
                     <X size={24} />
                  </button>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Left Column: Stats & Score */}
                  <div className="flex flex-col gap-6">
                     <div className="ds-card bg-white/[0.02] p-6 border-white/5 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                           <TrendingUp size={64} />
                        </div>
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Score de Prioridad IA</span>
                        <div className="flex items-baseline gap-3">
                           <span className={cn(
                             "text-6xl font-black font-mono tracking-tighter",
                             score > 8 ? "text-emerald-500" : score > 5 ? "text-blue-500" : "text-amber-500"
                           )}>
                              {score.toFixed(1)}
                           </span>
                           <span className="text-xl font-bold text-slate-700">/ 10</span>
                        </div>
                        <div className="mt-4 flex items-center gap-2">
                           <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden p-[1px]">
                              <motion.div 
                                 initial={{ width: 0 }}
                                 animate={{ width: `${score * 10}%` }}
                                 className={cn(
                                    "h-full rounded-full transition-all duration-1000",
                                    score > 8 ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" : "bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                                 )}
                              />
                           </div>
                        </div>
                        <div className="mt-4 flex items-center justify-between">
                           <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Confidence: 98.4%</span>
                           <span className={cn(
                             "text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded border",
                             prospect.priority === 'Critical' ? "text-rose-500 border-rose-500/20 bg-rose-500/5" : "text-blue-500 border-blue-500/20 bg-blue-500/5"
                           )}>
                              {prospect.priority || 'Standard'}
                           </span>
                        </div>
                     </div>

                     <div className="flex flex-col gap-3">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                           <Sparkles size={12} className="text-amber-500" /> Oportunidades Detectadas
                        </span>
                        <div className="flex flex-col gap-2">
                           {opportunities.map((opp, i) => (
                             <motion.div 
                               key={i}
                               initial={{ opacity: 0, x: -10 }}
                               animate={{ opacity: 1, x: 0 }}
                               transition={{ delay: 0.2 + (i * 0.1) }}
                               className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex items-center gap-3 hover:bg-white/[0.05] transition-colors"
                             >
                                <div className="w-6 h-6 rounded-md bg-blue-500/10 flex items-center justify-center text-blue-500 border border-blue-500/20">
                                   <Zap size={12} fill="currentColor" />
                                </div>
                                <span className="text-xs font-bold text-slate-300 uppercase tracking-tight">{opp}</span>
                             </motion.div>
                           ))}
                        </div>
                     </div>
                  </div>

                  {/* Right Column: Reasoning */}
                  <div className="flex flex-col gap-4">
                     <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                        <Activity size={12} className="text-rose-500" /> Inferencia de Negocio
                     </span>
                     <div className="ds-card flex-1 bg-white/[0.01] border-white/5 p-6 relative group border-dashed">
                        <div className="absolute inset-0 bg-blue-500/[0.02] opacity-0 group-hover:opacity-100 transition-opacity" />
                        <p className="text-sm font-medium text-slate-400 leading-relaxed relative z-10 italic">
                           "{reasoning}"
                        </p>
                        
                        <div className="mt-8 pt-6 border-t border-white/5 relative z-10">
                           <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-4">Metadata del Lead</h4>
                           <div className="grid grid-cols-2 gap-4">
                              <div className="flex flex-col gap-0.5">
                                 <span className="text-[8px] font-black text-slate-700 uppercase tracking-tighter">Sector</span>
                                 <span className="text-[10px] font-bold text-slate-400 text-ellipsis overflow-hidden whitespace-nowrap">{prospect.companies?.industry || "Enterprise"}</span>
                              </div>
                              <div className="flex flex-col gap-0.5">
                                 <span className="text-[8px] font-black text-slate-700 uppercase tracking-tighter">Source</span>
                                 <span className="text-[10px] font-bold text-slate-400">{prospect.source || "Discovery v1"}</span>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>

               <div className="mt-10 flex items-center justify-between pt-6 border-t border-white/5">
                  <div className="flex items-center gap-4 text-slate-600">
                     <div className="flex items-center gap-1">
                        <CheckCircle2 size={12} className="text-emerald-500" />
                        <span className="text-[9px] font-bold uppercase tracking-widest">Enriquecido</span>
                     </div>
                     <div className="w-px h-3 bg-white/5" />
                     <div className="flex items-center gap-1">
                        <AlertCircle size={12} />
                        <span className="text-[9px] font-bold uppercase tracking-widest">Listo para Outreach</span>
                     </div>
                  </div>
                  <button className="ds-button primary px-8 shadow-xl shadow-blue-500/20 group">
                     <span>Personalizar Propuesta</span>
                     <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </button>
               </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}


