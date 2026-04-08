"use client";

import { motion } from "framer-motion";
import { PlayCircle, ShieldCheck, Zap, Activity, Cpu, Database, Eye, Layers, Server, Code } from "lucide-react";
import { SectionHeader } from "../common/SectionHeader";
import { cn } from "@/lib/utils";
import Image from "next/image";

const items = [
  { key: "d1", icon: Zap, color: "text-primary", bg: "bg-primary/5" },
  { key: "d2", icon: Cpu, color: "text-primary", bg: "bg-primary/5" },
  { key: "d3", icon: Database, color: "text-primary", bg: "bg-primary/5" },
];

export const Demos = ({ dict, locale }: { dict: any, locale: string }) => {
  return (
    <section id="demos" className="py-12 md:py-20 relative overflow-hidden bg-base border-y border-white/5">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <SectionHeader title={dict.title} badge={dict.badge} subtitle={dict.subtitle} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-24">
          {items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="relative group min-h-[550px] rounded-[4rem] border border-white/5 bg-[#08080a] hover:border-primary/30 transition-all duration-700 overflow-hidden shadow-2xl"
            >
              {/* Background Image with Overlay */}
              <div className="absolute inset-0 z-0">
                <Image 
                   src={`/img/demo${i+1}.png`} 
                   alt={`Demo ${i+1} background`} 
                   fill
                   className="object-cover opacity-20 scale-100 group-hover:scale-110 group-hover:opacity-40 transition-all duration-1000 grayscale group-hover:grayscale-0" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#08080a] via-[#08080a]/80 to-transparent" />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/10 transition-colors duration-700" />
              </div>

              {/* Technical scanline */}
              <div className="absolute inset-0 bg-scanline opacity-10 group-hover:opacity-20 pointer-events-none transition-opacity" />
              
              <div className="absolute top-10 right-10 flex gap-2 z-20">
                 <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse shadow-[0_0_10px_rgba(56,189,248,0.8)]" />
                 <span className="font-mono text-[9px] text-white/40 tracking-[0.4em] uppercase">LIVE_SIGNAL</span>
              </div>

              <div className="relative z-10 p-12 h-full flex flex-col justify-end space-y-8">
                <div className={cn("w-20 h-20 rounded-[2rem] flex items-center justify-center border border-white/10 bg-white/5 backdrop-blur-xl group-hover:bg-primary/20 group-hover:border-primary/40 transition-all duration-700 shadow-2xl", i === 0 ? "group-hover:shadow-primary/20" : "")}>
                  <item.icon className={cn("w-10 h-10 transition-transform duration-700 group-hover:scale-110", item.color)} />
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-4xl font-heading font-black text-white italic uppercase tracking-tighter leading-none group-hover:text-primary transition-colors duration-500">
                    {dict[item.key] ? dict[item.key].title : item.key}
                  </h3>
                  <p className="text-white/40 leading-relaxed text-[15px] font-medium italic uppercase tracking-tight group-hover:text-white transition-colors duration-500 max-w-[280px]">
                     {dict[item.key] ? dict[item.key].desc : "Protocolo de demostración encriptado."}
                  </p>
                </div>

                <div className="pt-6">
                  <button className="btn-elite w-full group py-6 h-20 bg-white/5 hover:bg-white border border-white/10 hover:border-transparent text-white hover:text-black transition-all rounded-[2rem]">
                    <span className="text-[14px] flex items-center justify-center gap-4">
                       <PlayCircle className="w-6 h-6 group-hover:rotate-12 transition-transform" /> 
                       {dict.cta || (locale === 'es' ? 'VER PROTOCOLO' : 'VIEW PROTOCOL')}
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
