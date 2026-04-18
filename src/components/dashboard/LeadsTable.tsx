import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, TrendingUp, Mail, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

import { Business } from '@/types';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35 },
  },
  exit: { opacity: 0, scale: 0.98, transition: { duration: 0.2 } },
};

interface LeadsTableProps {
  leads: Business[];
  onSelectLead: (lead: Business) => void;
  onSendOutreach?: (leadId: string, type?: string) => void;
  onGenerateSite?: (leadId: string) => void;
  selectedLeadId?: string;
  selectedLeadIds?: string[];
  onToggleSelect?: (id: string) => void;
  onSelectAll?: (ids: string[]) => void;
}

export const LeadsTable: React.FC<LeadsTableProps> = ({ 
  leads, 
  onSelectLead, 
  onSendOutreach,
  selectedLeadId,
  selectedLeadIds = [],
  onToggleSelect,
  onSelectAll
}) => {
  const isAllSelected = leads.length > 0 && selectedLeadIds.length === leads.length;

  return (
    <div className="bg-white border border-slate-200/60 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden min-h-[600px] flex flex-col relative">
      <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 tracking-tight">Directorio de Oportunidades</h3>
          <p className="text-sm text-slate-500 font-medium">Unidades de inteligencia comercial detectadas</p>
        </div>
        
        {selectedLeadIds.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-4 bg-indigo-600 px-4 py-2 rounded-xl border border-indigo-500 shadow-lg shadow-indigo-600/20"
          >
            <span className="text-white text-xs font-bold">{selectedLeadIds.length} Seleccionados</span>
            <div className="h-4 w-px bg-white/20" />
            <div className="flex gap-2">
              <button className="text-[10px] uppercase font-black text-white hover:text-indigo-100 transition-colors">Enviar Masivo</button>
              <button className="text-[10px] uppercase font-black text-white hover:text-indigo-100 transition-colors">Generar Demos</button>
            </div>
          </motion.div>
        )}

        <div className="flex items-center gap-3 px-3 py-1.5 bg-emerald-50 rounded-full border border-emerald-100/50">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider">Motor Activo</span>
        </div>
      </div>
      
      <div className="flex-1 overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200/60">
              <th className="px-6 py-4 w-12">
                <input 
                  type="checkbox" 
                  checked={isAllSelected}
                  onChange={() => {
                    if (isAllSelected) onSelectAll?.([]);
                    else onSelectAll?.(leads.map(l => l.id));
                  }}
                  className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
              </th>
              <th className="px-8 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-left">Entidad Táctica</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100/50">Canal / Estado</th>
              <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100/50">Engagement</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100/50">Demos</th>
              <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center">Score IQ</th>
              <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center">Clasificación Tier</th>
              <th className="px-8 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-right">Acciones</th>
            </tr>
          </thead>
          <motion.tbody
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <AnimatePresence mode='popLayout'>
              {leads.map((lead) => (
                <motion.tr
                  key={lead.id}
                  layout
                  variants={itemVariants}
                  onClick={() => onSelectLead(lead)}
                  className={cn(
                    "group cursor-pointer transition-all duration-200 border-b border-slate-100",
                    selectedLeadId === lead.id 
                      ? "bg-indigo-50/40 relative after:absolute after:left-0 after:top-0 after:bottom-0 after:w-1 after:bg-indigo-600" 
                      : (selectedLeadIds.includes(lead.id) ? "bg-indigo-50/20" : "hover:bg-slate-50/50")
                  )}
                >
                  <td className="px-6 py-5 text-center" onClick={(e) => e.stopPropagation()}>
                    <input 
                      type="checkbox" 
                      checked={selectedLeadIds.includes(lead.id)}
                      onChange={() => onToggleSelect?.(lead.id)}
                      className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </td>
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
                    <div className="flex flex-col items-center gap-2">
                      {lead.engagement_score !== undefined ? (
                        <>
                          <div className="flex items-center gap-2">
                            <span className={cn(
                              "text-xs font-bold",
                              lead.email_complained ? "text-red-600" :
                              lead.email_bounced ? "text-orange-600" :
                              lead.email_clicked ? "text-emerald-600" :
                              lead.email_opened ? "text-emerald-500" :
                              "text-slate-400"
                            )}>
                              {lead.engagement_score}
                            </span>
                            <span className={cn(
                              "text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full",
                              lead.email_complained ? "bg-red-100 text-red-700" :
                              lead.email_bounced ? "bg-orange-100 text-orange-700" :
                              lead.email_clicked ? "bg-emerald-100 text-emerald-700" :
                              lead.email_opened ? "bg-emerald-50 text-emerald-600" :
                              "bg-slate-100 text-slate-500"
                            )}>
                              {lead.open_status || 'Pendiente'}
                            </span>
                          </div>
                          <div className="w-12 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={cn(
                                "h-full rounded-full transition-all",
                                lead.email_complained ? "bg-red-500" :
                                lead.email_bounced ? "bg-orange-500" :
                                lead.email_clicked ? "bg-emerald-600" :
                                lead.email_opened ? "bg-emerald-500" :
                                "bg-slate-300"
                              )}
                              style={{ width: `${Math.max(10, (lead.engagement_score || 0) + 100) / 2}%` }}
                            />
                          </div>
                        </>
                      ) : (
                        <span className="text-[10px] font-medium text-slate-400">-</span>
                      )}
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
                         onClick={(e) => { e.stopPropagation(); onSendOutreach?.(lead.id, lead.email_sent ? 'followup' : 'impact'); }}
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
          </motion.tbody>
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

