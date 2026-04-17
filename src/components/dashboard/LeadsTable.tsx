import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Star, Shield, TrendingUp, Mail, Eye, MoreVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Lead {
  id: string;
  name: string;
  website?: string | null;
  address?: string | null;
  email?: string | null;
  score: number;
  tier: 'TIER_1' | 'TIER_2' | 'TIER_3' | 'OPTIMAL' | string;
  status?: string | null;
  stitch_preview_url?: string;
  email_sent?: boolean;
}

interface LeadsTableProps {
  leads: Lead[];
  onSelectLead: (lead: Lead) => void;
  onSendOutreach: (leadId: string, type?: string) => void;
  selectedLeadId?: string;
}

export const LeadsTable: React.FC<LeadsTableProps> = ({ 
  leads, 
  onSelectLead, 
  onSendOutreach,
  selectedLeadId 
}) => {
  return (
    <div className="bg-white border border-slate-200/60 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden min-h-[600px] flex flex-col">
      <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 tracking-tight">Directorio de Oportunidades</h3>
          <p className="text-sm text-slate-500 font-medium">Unidades de inteligencia comercial detectadas</p>
        </div>
        <div className="flex items-center gap-3 px-3 py-1.5 bg-emerald-50 rounded-full border border-emerald-100/50">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider">Motor Activo</span>
        </div>
      </div>
      
      <div className="flex-1 overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200/60">
              <th className="px-8 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-left">Entidad Táctica</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100/50">Canal / Estado</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100/50">Demos</th>
              <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center">Score IQ</th>
              <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center">Clasificación Tier</th>
              <th className="px-8 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence mode='popLayout'>
              {leads.map((lead, i) => (
                <motion.tr 
                  key={lead.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.2, delay: i * 0.03 }}
                  onClick={() => onSelectLead(lead)}
                  className={cn(
                    "group cursor-pointer transition-all duration-200 border-b border-slate-100",
                    selectedLeadId === lead.id 
                      ? "bg-indigo-50/40 relative after:absolute after:left-0 after:top-0 after:bottom-0 after:w-1 after:bg-indigo-600" 
                      : "hover:bg-slate-50/50"
                  )}
                >
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      {lead.website ? (
                        <div className="h-12 w-12 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-center text-slate-900 font-semibold text-sm overflow-hidden group-hover:border-amber-200/50 transition-all duration-500 shadow-sm relative">
                          <img 
                            src={`https://www.google.com/s2/favicons?domain=${lead.website}&sz=128`} 
                            alt="" 
                            className="w-full h-full object-cover scale-75 group-hover:scale-90 transition-transform duration-500"
                            onError={(e) => (e.currentTarget.style.display = 'none')}
                          />
                          {lead.status === 'DESIGN_READY' && (
                            <div className="absolute inset-0 border-2 border-amber-400/30 rounded-xl" />
                          )}
                        </div>
                      ) : (
                        <div className="h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 shadow-inner group-hover:bg-slate-200 transition-colors">
                          <Shield size={20} className="opacity-40" />
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-slate-900 text-sm tracking-tight">{lead.name}</p>
                          {lead.status === 'DESIGN_READY' && (
                            <span className="flex h-1.5 w-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
                          )}
                        </div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5 truncate max-w-[200px]">{lead.address}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-lg bg-slate-50 border border-slate-200/60 flex items-center justify-center text-slate-400">
                        <Mail size={12} />
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-medium text-slate-600">{lead.email || 'Email no detectado'}</span>
                        {lead.opened_at && (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-[10px] font-bold text-emerald-600 border border-emerald-100 w-fit">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            LEÍDO {new Date(lead.opened_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    {lead.status === 'DESIGN_READY' ? (
                       <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950 text-amber-400 border border-amber-400/20 text-[9px] font-black uppercase tracking-[0.15em] shadow-lg shadow-amber-900/5">
                        <TrendingUp size={10} className="animate-pulse" /> Stitch Active
                      </div>
                    ) : lead.email_sent ? (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100/50 text-[9px] font-black uppercase tracking-widest shadow-sm">
                        <Mail size={10} /> Contactado
                      </div>
                    ) : (
                       <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100/50 text-slate-400 border border-slate-200/50 text-[9px] font-black uppercase tracking-widest">
                        En Cola
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-5 text-center text-sm font-mono text-slate-600">
                    <div className="flex flex-col items-center">
                      <span className={cn(
                        "font-bold",
                        lead.score > 80 ? "text-emerald-600" : "text-slate-900"
                      )}>
                        {lead.score}
                      </span>
                      <div className="w-8 h-1 bg-slate-100 rounded-full mt-1 overflow-hidden">
                        <div 
                          className={cn(
                            "h-full rounded-full transition-all duration-1000",
                            lead.score > 80 ? "bg-emerald-500" : "bg-indigo-500"
                          )}
                          style={{ width: `${lead.score}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <div className="flex justify-center">
                      <span className={cn(
                        "px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-widest border shadow-sm",
                        lead.tier === 'OPTIMAL' ? "bg-slate-950 text-white border-slate-800" :
                        lead.tier === 'TIER_1' ? "bg-amber-50 text-amber-700 border-amber-200/50" :
                        lead.tier === 'TIER_2' ? "bg-indigo-50 text-indigo-700 border-indigo-200/50" : 
                        "bg-white text-slate-500 border-slate-200"
                      )}>
                        {lead.tier?.replace('_', ' ')}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                      {lead.stitch_preview_url && (
                        <a 
                          href={lead.stitch_preview_url} 
                          target="_blank" 
                          onClick={(e) => e.stopPropagation()}
                          className="h-9 flex items-center gap-2 px-4 rounded-xl bg-slate-950 text-amber-400 border border-amber-400/20 hover:bg-black hover:border-amber-400/50 transition-all text-[10px] font-black uppercase tracking-widest shadow-xl shadow-amber-900/10"
                        >
                          <Eye size={12} /> View Demo
                        </a>
                      )}
                      <button 
                         onClick={(e) => { e.stopPropagation(); onSendOutreach(lead.id, lead.email_sent ? 'followup' : 'impact'); }}
                         className={cn(
                           "h-9 px-4 flex items-center gap-2 rounded-xl transition-all duration-300 text-[10px] font-black uppercase tracking-widest shadow-lg",
                           lead.email_sent 
                            ? "bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200/60" 
                            : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200 hover:shadow-indigo-300"
                         )}
                      >
                        <Mail size={12} />
                        {lead.email_sent ? 'Reforzar' : 'Enviar'}
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
      
      {!leads.length && (
        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
          <div className="h-20 w-20 rounded-full bg-slate-50 flex items-center justify-center text-slate-200 border-2 border-dashed border-slate-200 mb-4">
            <Shield size={32} />
          </div>
          <p className="text-slate-900 font-semibold">No hay leads en el pipeline</p>
          <p className="text-slate-500 text-sm max-w-xs mt-1">Inicie un escaneo para identificar unidades de inteligencia comercial en su zona estratégica.</p>
        </div>
      )}
    </div>
  );
};

