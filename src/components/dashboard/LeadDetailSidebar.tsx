import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Globe, Mail, BarChart3, Braces, Rocket, ShieldCheck, AlertCircle, ChevronRight, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LeadDetailSidebarProps {
  lead: any;
  onClose: () => void;
  onSendOutreach: (leadId: string) => void;
  isProcessing: boolean;
}

export const LeadDetailSidebar: React.FC<LeadDetailSidebarProps> = ({ lead, onClose, onSendOutreach, isProcessing }) => {
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
          {/* ROI Potential */}
          <div className="bg-[#0F172A] text-white p-8 rounded-2xl relative overflow-hidden ring-1 ring-slate-800 shadow-xl">
            <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl -mr-16 -mt-16" />
            <div className="flex items-center gap-2 text-indigo-400 mb-6">
              <BarChart3 size={14} /> 
              <span className="text-[10px] font-bold uppercase tracking-widest">Análisis de Retorno Proyectado</span>
            </div>
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-5xl font-bold tracking-tighter text-white">+{lead.score || '85'}%</span>
              <span className="text-indigo-400 text-[10px] font-bold uppercase tracking-widest">IQ Operativo</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed font-medium">
              El motor de Zyndrix detecta una obsolescencia técnica severa. La implementación de la nueva infraestructura garantiza una captura de mercado inmediata.
            </p>
          </div>

          {/* Audit Details */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[10px] font-bold uppercase text-slate-400 tracking-widest flex items-center gap-2">
                <Braces size={14} /> Diagnóstico Estructural
              </h3>
              <span className="text-[10px] text-slate-300 font-medium">Protocolo V2.4</span>
            </div>
            <div className="space-y-3">
              <AuditItem label="Infraestructura Web" status={lead.website ? 'warning' : 'critical'} text={lead.website ? 'Sistema Obsoleto / Bloqueado' : 'Ausencia de Activos Digitales'} />
              <AuditItem label="Visibilidad My Business" status="success" text="Perfil Verificado por Red" />
              <AuditItem label="Huella Social IQ" status="critical" text="Sin Identidad de Marca Unificada" />
              <AuditItem label="Entregabilidad Email" status="warning" text="Riesgo de Filtrado en Inbox" />
            </div>
          </section>

          {/* Action Button */}
          <div className="pt-6 relative">
            <button 
              disabled={isProcessing}
              onClick={() => onSendOutreach(lead.id)}
              className="w-full bg-indigo-600 text-white rounded-xl py-4 font-bold flex items-center justify-center gap-3 hover:bg-slate-900 transition-all duration-300 active:scale-95 disabled:opacity-50 shadow-lg shadow-indigo-600/20 group"
            >
              {isProcessing ? (
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                  <Rocket size={18}/>
                </motion.div>
              ) : (
                <Rocket size={18} className="group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
              )}
              <span className="text-sm">Ejecutar Outreach Estratégico</span>
              <ChevronRight size={14} className="ml-auto opacity-50" />
            </button>
            <button 
              disabled={isProcessing}
              onClick={() => onSendOutreach(lead.id)}
              className="w-full mt-3 bg-slate-50 text-slate-900 border border-slate-200 rounded-xl py-3 font-bold flex items-center justify-center gap-3 hover:bg-slate-100 transition-all duration-300"
            >
              <Mail size={16} className="text-indigo-600" />
              <span className="text-xs uppercase tracking-tight">Enviar Test de Producción (960px)</span>
            </button>
            <p className="text-center mt-4 text-[11px] text-slate-400 font-medium">
              Esta acción desplegará la infraestructura personalizada y enviará un reporte técnico detallado.
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
