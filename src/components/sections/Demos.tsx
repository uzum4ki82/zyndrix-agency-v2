"use client";

import { motion } from "framer-motion";
import { PlayCircle, ShieldCheck, Zap, Activity, Cpu, Database, Eye } from "lucide-react";
import { SectionHeader } from "../common/SectionHeader";
import { cn } from "@/lib/utils";

const items = [
  { key: "d1", icon: Zap, color: "text-primary", bg: "bg-primary/5" },
  { key: "d2", icon: Cpu, color: "text-primary", bg: "bg-primary/5" },
  { key: "d3", icon: Database, color: "text-primary", bg: "bg-primary/5" },
];

export const Demos = ({ dict, locale }: { dict: any, locale: string }) => {
  return (
    <section id="demos" className="py-32 relative overflow-hidden bg-black border-y border-white/5">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <SectionHeader title={dict.title} badge={dict.badge} subtitle={dict.subtitle} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-24">
          {items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1, duration: 1, type: "spring", stiffness: 80 }}
              className="relative group p-12 rounded-[4rem] border border-white/5 bg-[#08080a] hover:bg-[#0c0c0f] transition-all duration-700 overflow-hidden"
            >
              {/* Operative scanline decoration */}
              <div className="absolute top-0 left-0 w-full h-[1px] bg-primary/20 -translate-y-full group-hover:translate-y-[450px] transition-transform duration-[3s] ease-linear repeat-infinite" />
              
              <div className="absolute top-10 right-10 flex gap-2">
                 <div className="w-1 h-1 bg-primary rounded-full animate-pulse" />
                 <span className="font-mono text-[8px] text-white/20 tracking-[0.3em]">LIVE_STREAM</span>
              </div>

              <div className="relative z-10 space-y-10">
                <div className={cn("w-20 h-20 rounded-3xl flex items-center justify-center border border-white/10 group-hover:bg-primary/10 group-hover:border-primary/40 transition-all duration-500 shadow-2xl", item.bg)}>
                  <item.icon className={cn("w-10 h-10", item.color)} />
                </div>
                
                <div className="space-y-6">
                  <h3 className="text-3xl font-heading font-black text-white italic uppercase tracking-tighter leading-none group-hover:text-primary transition-colors duration-500">
                    {dict[item.key] ? dict[item.key].title : item.key}
                  </h3>
                  <p className="text-white/20 leading-relaxed text-[14px] font-medium italic uppercase tracking-tight group-hover:text-white/60 transition-colors duration-500">
                     {dict[item.key] ? dict[item.key].desc : "Protocolo de demostración encriptado."}
                  </p>
                </div>

                <div className="pt-8">
                  <button className="btn-elite w-full group py-6 h-16 border-white/5 hover:border-primary/40 transition-all">
                    <span className="text-[12px] flex items-center gap-4">
                       <Eye className="w-5 h-5" /> {dict.cta || (locale === 'es' ? 'VER PROTOCOLO' : 'VIEW PROTOCOL')}
                    </span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
