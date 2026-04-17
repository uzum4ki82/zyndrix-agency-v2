import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Globe, Power, PowerOff, ShieldCheck, Eye, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Asset {
  id: string;
  name: string;
  website?: string | null;
  stitch_preview_url?: string;
  site_active?: boolean;
  score: number;
  last_audit?: string;
}

interface AssetsManagementTableProps {
  assets: Asset[];
  onToggleStatus: (assetId: string, currentStatus: boolean) => void;
  onPreview: (asset: Asset) => void;
}

export const AssetsManagementTable: React.FC<AssetsManagementTableProps> = ({ assets, onToggleStatus, onPreview }) => {
  return (
    <div className="bg-white border border-slate-200/60 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden min-h-[500px] flex flex-col">
      <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 tracking-tight">Gestión de Activos Digitales</h3>
          <p className="text-sm text-slate-500 font-medium">Sitios web generados y desplegados por el motor Zyndrix</p>
        </div>
        <div className="flex items-center gap-3 px-3 py-1.5 bg-indigo-50 rounded-full border border-indigo-100/50">
          <Globe size={14} className="text-indigo-600" />
          <span className="text-[10px] uppercase font-bold text-indigo-700 tracking-wider">
            {assets.filter(a => a.site_active).length} Activos Operativos
          </span>
        </div>
      </div>
      
      <div className="flex-1 overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200/60">
              <th className="px-8 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-left">Activo / Cliente</th>
              <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center">Calidad Demo</th>
              <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center">Estado del Nodo</th>
              <th className="px-8 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-right">Interruptor de Red</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence mode='popLayout'>
              {assets.map((asset, i) => (
                <motion.tr 
                  key={asset.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.2, delay: i * 0.03 }}
                  className={cn(
                    "group transition-all duration-200 border-b border-slate-100 hover:bg-slate-50/40",
                    !asset.site_active && "opacity-60 grayscale-[0.5]"
                  )}
                >
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "h-12 w-12 rounded-xl flex items-center justify-center border transition-all shadow-sm overflow-hidden",
                        asset.site_active ? "bg-white border-slate-200 group-hover:border-indigo-200" : "bg-slate-100 border-slate-200"
                      )}>
                         {asset.website ? (
                           <img 
                             src={`https://www.google.com/s2/favicons?domain=${asset.website}&sz=64`} 
                             alt="" 
                             className="w-8 h-8 object-contain"
                           />
                         ) : (
                           <Globe size={20} className="text-slate-300" />
                         )}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-sm">{asset.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] text-slate-400 font-medium">ID: {asset.id.split('-')[0].toUpperCase()}</span>
                          {asset.stitch_preview_url && (
                             <a 
                               href={asset.stitch_preview_url} 
                               target="_blank" 
                               className="text-[10px] text-indigo-500 font-bold hover:underline flex items-center gap-1"
                             >
                               Ver Demo <ExternalLink size={8} />
                             </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                           <div 
                             key={star} 
                             className={cn("h-1.5 w-1.5 rounded-full", star <= (asset.score / 20) ? "bg-amber-400" : "bg-slate-200")} 
                           />
                        ))}
                      </div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase">{asset.score}% Premium</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <div className={cn(
                      "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter border shadow-sm",
                      asset.site_active 
                        ? "bg-emerald-50 text-emerald-700 border-emerald-100/50" 
                        : "bg-slate-50 text-slate-400 border-slate-200/50"
                    )}>
                      {asset.site_active ? (
                        <>
                          <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          ONLINE
                        </>
                      ) : (
                        <>
                          <div className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                          OFFLINE
                        </>
                      )}
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end items-center gap-3">
                      <button 
                        onClick={() => onToggleStatus(asset.id, !!asset.site_active)}
                        className={cn(
                          "flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm border",
                          asset.site_active 
                            ? "bg-white text-rose-500 border-rose-100 hover:bg-rose-50" 
                            : "bg-indigo-600 text-white border-indigo-500 hover:bg-slate-900"
                        )}
                      >
                        {asset.site_active ? (
                          <><PowerOff size={14} /> Desactivar</>
                        ) : (
                          <><Power size={14} /> Activar</>
                        )}
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
      
      {!assets.length && (
        <div className="flex-1 flex flex-col items-center justify-center p-20 text-center">
          <div className="h-24 w-24 rounded-3xl bg-slate-50 flex items-center justify-center text-slate-200 border-2 border-dashed border-slate-200 mb-6 shadow-inner">
            <ShieldCheck size={40} />
          </div>
          <h4 className="text-slate-900 font-bold text-lg">Sin Activos Generados</h4>
          <p className="text-slate-500 text-sm max-w-sm mt-2 leading-relaxed font-medium">
            No se han detectado despliegues de activos digitales. Inicie una campaña para generar demos de alta fidelidad.
          </p>
        </div>
      )}
    </div>
  );
};
