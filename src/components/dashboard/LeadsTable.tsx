import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Star, Shield, TrendingUp, Mail, Eye, MoreVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Lead {
  id: string;
  name: string;
  website?: string | null;
  address?: string | null;
  score: number;
  tier: 'TIER_1' | 'TIER_2' | 'TIER_3' | 'OPTIMAL' | string;
  status?: string | null;
}

interface LeadsTableProps {
  leads: Lead[];
  onSelectLead: (lead: Lead) => void;
  selectedLeadId?: string;
}

export const LeadsTable: React.FC<LeadsTableProps> = ({ leads, onSelectLead, selectedLeadId }) => {
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
                        <div className="h-10 w-10 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-900 font-semibold text-sm overflow-hidden group-hover:border-indigo-200 transition-colors shadow-sm">
                          <img 
                            src={`https://www.google.com/s2/favicons?domain=${lead.website}&sz=64`} 
                            alt="" 
                            className="w-full h-full object-cover scale-75"
                            onError={(e) => (e.currentTarget.style.display = 'none')}
                          />
                        </div>
                      ) : (
                        <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 shadow-inner">
                          <Shield size={16}/>
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-slate-900 text-sm">{lead.name}</p>
                        <p className="text-[11px] font-medium text-slate-400 mt-0.5 truncate max-w-[180px]">{lead.address}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <div className={cn(
                      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md font-bold text-xs border transition-all",
                      lead.score > 80 
                        ? "bg-emerald-50 text-emerald-700 border-emerald-100/50" 
                        : "bg-indigo-50 text-indigo-700 border-indigo-100/50"
                    )}>
                      {lead.score}%
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className={cn(
                      "inline-block px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-tight border",
                      lead.tier === 'TIER_1' ? "bg-amber-50 text-amber-700 border-amber-200/50" :
                      lead.tier === 'TIER_2' ? "bg-indigo-50 text-indigo-700 border-indigo-200/50" : 
                      "bg-slate-50 text-slate-500 border-slate-200/50"
                    )}>
                      {lead.tier?.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                      <button className="h-8 w-8 flex items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-600 transition-all shadow-sm">
                        <Eye size={14} />
                      </button>
                      <button className="h-8 w-8 flex items-center justify-center rounded-lg bg-indigo-600 text-white hover:bg-slate-900 transition-all shadow-md">
                        <Mail size={14} />
                      </button>
                      <button className="h-8 w-8 flex items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-400 hover:bg-slate-50 transition-all">
                        <MoreVertical size={14} />
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

