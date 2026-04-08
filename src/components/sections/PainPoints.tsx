'use client';

import { motion } from 'framer-motion';
import { Clock, Database, Users, TrendingUp } from 'lucide-react';
import { SectionHeader } from '../common/SectionHeader';

const icons = [Clock, Database, Users, TrendingUp];

export const PainPoints = ({ dict = {}, system = {} }: { dict: any, system?: any }) => {
  return (
    <section id="problema" className="py-16 px-6 relative overflow-hidden bg-[#03040a]">
      {/* Background Noise/Grid */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-500/20 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col items-center mb-10">
           <motion.div 
             animate={{ opacity: [1, 0.4, 1] }} 
             transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
             className="font-mono text-[9px] font-black text-red-500/80 uppercase tracking-[0.5em] mb-4 flex items-center gap-4 bg-red-500/5 px-6 py-2 rounded-full border border-red-500/20"
           >
              <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping" />
              {system.diagnosing || "STATUS: DIAGNÓSTICO EJECUTANDO // COMPROBANDO_FRAGMENTACIÓN"}
           </motion.div>
        </div>
        <SectionHeader title={dict.title} subtitle={dict.subtitle} badge={dict.badge} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-20">
          {dict?.items?.map((item: any, i: number) => {
            const Icon = icons[i % icons.length];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, type: "spring", stiffness: 100 }}
                className="relative group p-8 md:p-14 rounded-[2.5rem] md:rounded-[4rem] border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all duration-700 overflow-hidden"
              >
                {/* Decorative index */}
                <div className="absolute top-10 right-10 font-mono text-[9px] text-white/5 font-black uppercase tracking-[0.5em] group-hover:text-red-500/20 transition-colors">
                   ERR_CODE_0{i + 1}
                </div>

                <div className="relative z-10 space-y-10">
                  <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-red-500/10 group-hover:border-red-500/40 transition-all duration-500 shadow-2xl">
                    <Icon className="w-10 h-10 text-white/20 group-hover:text-red-400 transition-colors" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-heading font-black text-white uppercase italic tracking-tighter leading-none mb-6 group-hover:text-red-400 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-white/30 leading-relaxed text-[14px] font-medium uppercase tracking-tight italic group-hover:text-white/60 transition-colors">
                      {item.description}
                    </p>
                  </div>
                </div>
                
                {/* Bottom line decoration */}
                <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-red-400/30 group-hover:w-full transition-all duration-1000" />
              </motion.div>
            );
          })}
        </div>
      </div>
      
      {/* Side Decorative Terminal Text */}
      <div className="absolute left-10 top-1/2 -rotate-90 origin-left hidden lg:block opacity-10">
         <div className="font-mono text-[8px] text-white uppercase tracking-[1em] whitespace-nowrap">
            CRITICAL_FAILURE_DETECTED // AUTO_FIX_MODE: OFF // RECOVERY_REQUIRED
         </div>
      </div>
    </section>
  );
};
