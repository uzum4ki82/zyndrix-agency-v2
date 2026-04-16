import React from 'react';
import { motion } from 'framer-motion';
import { Globe, Target, Mail, Zap, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsGridProps {
  leadsCount: number;
  highConversionCount: number;
  outreachCount: number;
  efficiencyRate: string;
}

export const StatsGrid: React.FC<StatsGridProps> = ({ 
  leadsCount, 
  highConversionCount, 
  outreachCount, 
  efficiencyRate 
}) => {
  const stats = [
    { label: 'Unidades Detectadas', val: leadsCount, icon: Globe, color: 'text-indigo-500', bg: 'bg-indigo-500/5' },
    { label: 'Oportunidades High-End', val: highConversionCount, icon: Target, color: 'text-emerald-500', bg: 'bg-emerald-500/5' },
    { label: 'Reportes Desplegados', val: outreachCount, icon: Mail, color: 'text-amber-500', bg: 'bg-amber-500/5' },
    { label: 'Efectividad Operativa', val: efficiencyRate, icon: Zap, color: 'text-violet-500', bg: 'bg-violet-500/5' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {stats.map((s, i) => (
        <motion.div 
          key={i} 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: i * 0.05 }}
          className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-[0_2px_4px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all group"
        >
          <div className="flex justify-between items-start mb-4">
            <div className={cn("p-2.5 rounded-lg border border-slate-100", s.bg)}>
              <s.icon size={18} className={s.color} />
            </div>
            <ArrowUpRight size={14} className="text-slate-300 group-hover:text-slate-400 transition-colors" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">{s.label}</p>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-bold text-slate-900 tracking-tight">{s.val}</p>
              <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-1.5 py-0.5 rounded">+12%</span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
