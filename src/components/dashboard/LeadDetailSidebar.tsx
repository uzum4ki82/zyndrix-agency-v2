import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Globe, Mail, BarChart3, Braces, Rocket, ShieldCheck, AlertCircle, ChevronRight, ExternalLink, Activity, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

import { Business } from '@/types';

interface LeadDetailSidebarProps {
  lead: Business;
  onClose: () => void;
  onSendOutreach: (leadId: string, type?: string) => void;
  onGenerateSite: (lead: Business) => void;
  onPreview?: (asset: Business) => void;
  isProcessing: boolean;
  isGenerating: boolean;
}

export const LeadDetailSidebar: React.FC<LeadDetailSidebarProps> = ({ lead, onClose, onSendOutreach, onGenerateSite, onPreview, isProcessing, isGenerating }) => {
  if (!lead) return null;

  return (
    <motion.div 
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 30, stiffness: 300 }}
      className="fixed top-0 right-0 w-[480px] h-full bg-white shadow-[-40px_0_80px_rgba(0,0,0,0.05)] z-50 overflow-y-auto border-l border-slate-200"
    >
      <div className="sticky top-0 bg-white/80 backdrop-blur-md z-10 flex justify-between items-center px-8 py-6 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-indigo-600" />
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Expediente de Inteligencia</h2>
        </div>
        <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-900 transition-colors hover:bg-slate-50 rounded-lg"><X size={18}/></button>
      </div>

      <div className="p-8">
        <div className="mb-10">
          <h1 className="text-2xl font-bold text-slate-900 mb-2 tracking-tight">{lead.name}</h1>
          <p className="text-slate-500 text-sm font-medium flex items-center gap-1.5 italic opacity-80">
            {lead.address || 'Ubicación Estratégica No Definida'}
          </p>
          
          <div className="flex gap-2 mt-6">
              {lead.website && (
                <a href={lead.website} target="_blank" className="flex items-center gap-2 text-[12px] font-bold text-indigo-600 bg-indigo-50/50 px-4 py-2 rounded-lg hover:bg-indigo-100/50 transition-all border border-indigo-100/50">
                  <Globe size={14} /> Dominio Público <ExternalLink size={12} />
                </a>
              )}
              <div className="bg-slate-50 border border-slate-200 px-4 py-2 rounded-lg flex items-center gap-2">
                  <ShieldCheck size={14} className="text-slate-400" />
                  <span className="text-[11px] font-bold uppercase text-slate-500 tracking-wider">Prioridad {lead.tier || 'ALTA'}</span>
              </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* ROI Potential - Luxury Version */}
          <div className="bg-slate-950 text-white p-8 rounded-3xl relative overflow-hidden ring-1 ring-white/10 shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-[80px] -mr-32 -mt-32" />
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-indigo-500/5 rounded-full blur-[60px] -ml-20 -mb-20" />
            
            <div className="flex items-center gap-2 text-amber-400/80 mb-6">
              <BarChart3 size={14} /> 
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Retorno de Impacto Proyectado</span>
            </div>
            
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-400">+{lead.score || '85'}%</span>
              <span className="text-amber-400 text-[10px] font-black uppercase tracking-[0.1em]">IQ Estratégico</span>
            </div>
            
            <p className="text-slate-400 text-xs leading-relaxed font-medium">
              Arquitectura digital detectada como deficiente. La implementación de la infraestructura <span className="text-white">Zyndrix v2</span> garantiza una ventaja competitiva inmediata y una captura de mercado institucional.
            </p>
          </div>

          {/* Digital Twin Section - Highlighted when ready */}
          {lead.status === 'DESIGN_READY' ? (
            <section className="bg-amber-50/30 border border-amber-200/50 p-6 rounded-3xl space-y-4 shadow-sm relative overflow-hidden group">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-200/20 rounded-full blur-2xl group-hover:bg-amber-200/40 transition-all duration-700" />
              <div className="flex items-center justify-between">
                <h3 className="text-[10px] font-black uppercase text-amber-600 tracking-[0.15em] flex items-center gap-2">
                  <Rocket size={12} /> Architectural Preview
                </h3>
                <span className="text-[9px] font-black bg-amber-400 text-amber-900 px-2 py-0.5 rounded flex items-center gap-1 shadow-sm">
                   LIVE
                </span>
              </div>
              <p className="text-[12px] font-semibold text-slate-900 leading-snug">
                Hemos generado un "Double Digital" personalizado para este cliente. La arquitectura visual está lista para demostración ejecutiva.
              </p>
              <button 
                onClick={() => {
                  if (onPreview) onPreview(lead);
                  else if (lead.stitch_preview_url) window.open(lead.stitch_preview_url, '_blank');
                }}
                className="flex items-center justify-center gap-3 w-full bg-slate-950 text-amber-400 rounded-2xl py-4 font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-amber-900/10 border border-amber-400/20"
              >
                <Eye size={16} /> Abrir Experiencia Live
              </button>
            </section>
          ) : (
            <section className="space-y-4">
              <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.15em] flex items-center gap-2">
                <Activity size={12} className="text-indigo-500" /> Inteligencia de Conversión
              </h3>
              <div className="bg-slate-50 border border-slate-100 p-6 rounded-3xl space-y-5">
                <VectorProgress label="Estética Identitaria" value={lead.website ? 45 : 10} color="bg-rose-500" />
                <VectorProgress label="Autoridad de Mercado" value={lead.rating ? (lead.rating * 20) : 30} color="bg-amber-500" />
                <VectorProgress label="Escalabilidad Infra" value={20} color="bg-indigo-600" />
              </div>
            </section>
          )}

          {/* Audit Details */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.15em] flex items-center gap-2">
                <Braces size={14} /> Diagnóstico Estructural
              </h3>
              <span className="text-[9px] font-mono text-slate-300">PROTOCOLO Z-960</span>
            </div>
            <div className="space-y-3">
              <AuditItem label="Infraestructura Web" status={lead.website ? 'warning' : 'critical'} text={lead.website ? 'Sistema Obsoleto / Bloqueado' : 'Ausencia de Activos Digitales'} />
              <AuditItem label="Visibilidad My Business" status="success" text="Perfil Verificado por Red" />
              <AuditItem label="Huella Social IQ" status="critical" text="Sin Identidad de Marca Unificada" />
            </div>
          </section>

          {/* Action Footer */}
          <div className="pt-6 space-y-3">
            <button 
              disabled={isProcessing}
              onClick={() => onSendOutreach(lead.id, lead.email_sent ? 'followup' : 'impact')}
              className={cn(
                "w-full rounded-2xl py-5 font-black flex items-center justify-center gap-3 transition-all duration-500 active:scale-[0.98] shadow-xl text-xs uppercase tracking-widest border",
                lead.email_sent 
                  ? "bg-slate-50 text-slate-500 border-slate-200 hover:bg-white" 
                  : "bg-indigo-600 text-white border-indigo-500 hover:bg-indigo-700 shadow-indigo-200"
              )}
            >
              <Mail size={16} className={cn(!lead.email_sent && "animate-pulse")} />
              <span>{lead.email_sent ? 'Reforzar Impacto (Seguimiento)' : 'Lanzar Outreach Estratégico'}</span>
            </button>

            {!lead.stitch_preview_url && (
              <button 
                disabled={isProcessing || isGenerating}
                onClick={() => onGenerateSite(lead)}
                className="w-full bg-white text-slate-900 border border-slate-200 rounded-2xl py-4 font-black flex items-center justify-center gap-3 hover:bg-slate-50 transition-all text-xs uppercase tracking-widest group shadow-sm"
              >
                <Braces size={16} className="text-indigo-600 group-hover:scale-110 transition-transform" />
                <span>Generar Digital Twin (Stitch AI)</span>
              </button>
            )}
            
            <p className="text-center px-4 text-[10px] text-slate-400 font-bold uppercase tracking-tight leading-relaxed opacity-60">
              Zyndrix Commander v2.2 - Operaciones Autónomas 24/7
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const AuditItem = ({ label, status, text }: { label: string, status: 'success' | 'warning' | 'critical', text: string }) => (
  <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100 hover:bg-white hover:border-slate-200 hover:shadow-sm transition-all group cursor-default">
    <div className={cn(
      "h-1.5 w-1.5 rounded-full",
      status === 'success' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' :
      status === 'warning' ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]' :
      'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.4)]'
    )} />
    <div className="flex-1">
      <p className="text-[9px] font-bold uppercase text-slate-400 mb-0.5 tracking-wider">{label}</p>
      <p className="text-[13px] font-semibold text-slate-900 tracking-tight">{text}</p>
    </div>
    <ChevronRight size={12} className="text-slate-200 group-hover:text-slate-400 transition-colors" />
  </div>
);

const VectorProgress = ({ label, value, color }: { label: string, value: number, color: string }) => (
  <div className="space-y-1.5">
    <div className="flex justify-between items-center px-1">
      <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">{label}</span>
      <span className="text-[10px] font-mono font-bold text-slate-900">{value}%</span>
    </div>
    <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className={cn("h-full rounded-full", color)}
      />
    </div>
  </div>
);
