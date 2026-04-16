"use client";

import { motion } from "framer-motion";
import { AlertTriangle, Send, ChevronRight, ExternalLink, Activity, Eye, ShieldCheck, Zap, MapPin, Globe, Target, Star, Layers } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Business, TeamMember } from "@/types";
import Image from "next/image";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface BusinessCardProps {
  biz: Business;
  index: number;
  onAnalyze: () => void;
  isSaved?: boolean;
  team: TeamMember[];
}

export function BusinessCard({ biz, index, onAnalyze, isSaved, team }: BusinessCardProps) {
  // Determine Tier Color Scheme
  const getTierStyles = (tier?: string) => {
    switch(tier) {
      case 'TIER_1': return "bg-rose-50 text-rose-600 border-rose-100";
      case 'TIER_2': return "bg-amber-50 text-amber-600 border-amber-100";
      case 'TIER_3': return "bg-indigo-50 text-indigo-600 border-indigo-100";
      default: return "bg-slate-50 text-slate-400 border-slate-100";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.02)] group hover:shadow-[0_40px_80px_-20px_rgba(79,70,229,0.08)] hover:border-indigo-100/50 transition-all duration-500 relative overflow-hidden"
    >
      {/* Background Subtle Accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/30 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-indigo-100/40 transition-colors" />

      {/* Header Info */}
      <div className="flex justify-between items-start mb-6 border-b border-slate-50 pb-6 relative z-10">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
             <span className={cn(
               "text-[9px] font-black px-3 py-1 border rounded-full tracking-wider uppercase transition-all duration-300",
               getTierStyles(biz.intel?.tier)
             )}>
               {biz.intel?.tier || 'ANALYZING...'}
             </span>
             <div className="flex items-center gap-1.5 text-slate-400">
                <MapPin size={10} />
                <span className="text-[9px] font-bold uppercase tracking-widest">{biz.neighborhood || 'Local Area'}</span>
             </div>
          </div>
          <h3 className="text-2xl font-display font-light text-slate-900 group-hover:text-indigo-600 transition-colors tracking-tight leading-tight">
            {biz.name}
          </h3>
          <div className="flex items-center gap-3 mt-2">
             {biz.rating && (
               <div className="flex items-center gap-1">
                 <Star size={10} className="text-amber-400 fill-amber-400" />
                 <span className="text-[10px] font-bold text-slate-600">{biz.rating}</span>
                 <span className="text-[10px] text-slate-400">({biz.reviewsCount || biz.reviews_count || 0})</span>
               </div>
             )}
             {biz.website && (
               <div className="flex items-center gap-1 text-slate-400">
                 <Globe size={10} />
                 <span className="text-[9px] truncate max-w-[150px]">{biz.website.replace(/^https?:\/\//, '')}</span>
               </div>
             )}
          </div>
        </div>
        
        <div className="flex flex-col items-end">
           <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col items-center justify-center group-hover:bg-white group-hover:border-indigo-100 group-hover:shadow-lg group-hover:shadow-indigo-100/20 transition-all">
              <span className={cn(
                "text-2xl font-black font-display tracking-tighter leading-none",
                biz.score > 80 ? "text-indigo-600" : "text-amber-500"
              )}>
                {biz.score}
              </span>
              <span className="text-[7px] font-black text-slate-300 uppercase tracking-widest mt-0.5">V-Score</span>
           </div>
        </div>
      </div>

      <div className="relative z-10 space-y-6" onClick={onAnalyze}>
        {biz.screenshotUrl && (
          <div className="relative aspect-[16/10] rounded-[2rem] border border-slate-100 overflow-hidden group/media shadow-sm">
            <Image 
              src={biz.screenshotUrl} 
              fill 
              className="object-cover opacity-90 group-hover:scale-105 transition-transform duration-1000" 
              unoptimized 
              alt="Context Audit" 
            />
            {/* Vision Indicators */}
            <div className="absolute inset-0 bg-indigo-900/10 opacity-0 group-hover/media:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                <div className="bg-white/90 backdrop-blur-md px-6 py-3 rounded-2xl shadow-xl flex items-center gap-2" title="Analysis Mode">
                   <Target size={16} className="text-indigo-600" />
                   <span className="text-[10px] font-bold text-slate-900 uppercase tracking-widest">Deep Architecture Audit</span>
                </div>
            </div>
          </div>
        )}

        {/* Intelligence Highlights */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 group-hover:bg-white transition-colors">
            <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Impacto Estratégico</div>
            <div className="text-[11px] font-bold text-slate-700 truncate">
              {biz.intel?.estimatedLossLabel || 'Pending Review'}
            </div>
          </div>
          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 group-hover:bg-white transition-colors">
            <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Potencial Mercado</div>
            <div className={cn(
              "text-[11px] font-bold uppercase",
              biz.intel?.marketPotential === 'CRÍTICO' ? "text-rose-600" : "text-indigo-600"
            )}>
              {biz.intel?.marketPotential || 'Standard'}
            </div>
          </div>
        </div>

        {/* Pain Points */}
        {biz.intel?.painPoints && biz.intel.painPoints.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {biz.intel.painPoints.slice(0, 3).map((point, i) => (
              <span 
                key={i} 
                className="px-3 py-1.5 rounded-lg bg-white border border-slate-100 text-slate-500 text-[9px] font-bold uppercase tracking-wider"
              >
                {point}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="mt-8 flex items-center gap-3 relative z-20">
        <button 
          onClick={(e) => { e.stopPropagation(); onAnalyze(); }}
          className="flex-1 h-14 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-slate-200 hover:shadow-indigo-200 hover:bg-indigo-600 transition-all active:scale-95"
        >
          Diagnóstico Supreme
        </button>
        
        {(biz.intel?.tier === 'TIER_1' || biz.intel?.tier === 'TIER_2') && !biz.stitch_preview_url && (
          <button 
            onClick={(e) => { 
              e.stopPropagation(); 
              // En un entorno real, esto llamaría a la API de Stitch
              alert('Iniciando Motor Stitch para ' + biz.name + '...'); 
            }}
            className="h-14 px-6 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all flex items-center gap-2"
          >
            <Layers size={14} />
            Stitch
          </button>
        )}

        <button 
          onClick={(e) => { e.stopPropagation(); onAnalyze(); }}
          className="w-14 h-14 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-200 transition-all shadow-sm"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </motion.div>
  );
}
