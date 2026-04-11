'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Cpu, Database, Activity, Terminal, Shield, Layers, Box, Maximize, Lock, Globe } from 'lucide-react';

const icons: any = {
  Activity,
  Cpu,
  Database,
  Terminal,
  Shield,
  Layers,
  Box,
  Maximize
};

const LiveTerminal = () => {
    const [lines, setLines] = useState<string[]>([]);
    
    useEffect(() => {
        const logs = [
            "INIT_CORE_v4.2",
            "SYNCING_NODES...",
            "DB_UPLINK_STABLE",
            "LATENCY: 0.12ms",
            "AGENT_01: ACTIVE",
            "ENCRYPTING_TUNNEL",
            "DASHBOARD_LIVE",
            "REVENUE_DRAIN: 0%",
            "PROTOCOL_SECURE",
            "KERNEL_RECOVERY: OFF"
        ];
        
        let i = 0;
        const interval = setInterval(() => {
            setLines(prev => [...prev.slice(-4), logs[i % logs.length]]);
            i++;
        }, 3000);
        
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="font-mono text-[7px] text-primary/30 space-y-1 tracking-widest uppercase">
            {lines.map((line, idx) => (
                <motion.div 
                    key={idx + line} 
                    initial={{ opacity: 0, x: -5 }} 
                    animate={{ opacity: 1, x: 0 }}
                >
                    {`> ${line}`}
                </motion.div>
            ))}
        </div>
    );
};

export const EngineRoom = ({ dict }: { dict: any }) => {
  return (
    <section id="ingenieria" className="py-12 px-10 relative bg-white overflow-hidden border-t border-primary/10">
      <div className="arch-grid opacity-10" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-end mb-10">
          <div>
            <div className="text-[10px] font-black uppercase tracking-[0.6em] text-slate-400 mb-8 flex items-center gap-4">
              <div className="w-12 h-[1px] bg-primary/20" />
              {dict.badge}
            </div>
            <h2 className="text-4xl md:text-[5.5rem] font-heading font-black text-primary mb-0 tracking-[-0.05em] uppercase leading-[0.85]">
              {dict.title}<br />
              <span className="text-slate-200">DAT_SYNC_v4</span>
            </h2>
          </div>
          <div className="relative p-12 bg-slate-50 border border-primary/10 shadow-sm border-l-4 border-l-black">
             <p className="text-lg md:text-xl font-medium tracking-tight text-slate-600 leading-relaxed italic pr-10">
               "{dict.subtitle}"
             </p>
             <div className="absolute bottom-4 right-8 opacity-5">
                <Shield size={60} />
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {dict?.cards?.map((card: any, i: number) => {
            const Icon = icons[card.icon] || Cpu;
            const clusterLoad = 70 + i * 5;

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-12 border border-primary/5 group hover:border-primary/10 hover:shadow-2xl transition-all duration-700 relative overflow-hidden"
              >
                <div className="h-full flex flex-col justify-between">
                  <div>
                    <div className="w-12 h-12 flex items-center justify-center bg-slate-50 border border-primary/10 text-primary/40 group-hover:bg-black group-hover:text-white transition-all duration-500 mb-12">
                       <Icon strokeWidth={1.2} size={22} />
                    </div>
                    <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight text-primary mb-4 group-hover:text-black transition-colors leading-tight">
                      {card.title}
                    </h3>
                    <p className="text-[13px] text-slate-500 leading-relaxed font-medium mb-12">
                      {card.desc}
                    </p>
                  </div>

                  <div className="space-y-6 pt-4">
                     <div className="flex justify-between items-center">
                        <span className="text-[9px] font-black text-primary/30 tracking-[0.3em] uppercase">CLUSTER_LOAD</span>
                        <span className="text-3xl font-black text-primary tracking-tighter">{clusterLoad}%</span>
                     </div>
                     <div className="h-1.5 w-full bg-slate-200 overflow-hidden">
                        <motion.div
                           initial={{ width: 0 }}
                           whileInView={{ width: `${clusterLoad}%` }}
                           transition={{ duration: 1.5, delay: 0.5 }}
                           className="h-full bg-primary group-hover:bg-black transition-colors"
                        />
                     </div>
                  </div>
                </div>

                <div className="absolute top-10 right-10">
                   <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.6)]" />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Extended Technical Module */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 bg-black p-12 md:p-16 relative group overflow-hidden shadow-2xl">
                 <div className="absolute -bottom-20 -right-20 opacity-5 group-hover:opacity-10 transition-all duration-1000 group-hover:scale-110">
                    <Database size={400} className="text-white" />
                 </div>
                 
                 <div className="relative z-10">
                    <div className="flex flex-col md:flex-row justify-between gap-12 md:items-end">
                       <div className="max-w-xl">
                          <h3 className="text-3xl md:text-5xl font-heading font-black text-white uppercase tracking-tight mb-8 leading-none">
                             {dict.main_title}
                          </h3>
                          <p className="text-lg text-white/40 font-medium leading-relaxed mb-12 italic translate-y-[-10px]">
                             {dict.main_desc}
                          </p>
                          
                          <div className="grid grid-cols-2 gap-10 border-t border-white/5 pt-10">
                             {[
                               { l: "Core Clusters", v: "12X_NODE" },
                               { l: "Encryption", v: "AES_256_IA" },
                               { l: "Uptime", v: "99.998%" },
                               { l: "Throughput", v: "4.2TB/s" }
                             ].map((m, idx) => (
                               <div key={idx} className="flex flex-col gap-2">
                                  <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.5em]">{m.l}</span>
                                  <span className="text-2xl font-heading font-black text-white tracking-tighter">{m.v}</span>
                               </div>
                             ))}
                          </div>
                       </div>
                       
                       <div className="bg-white/5 border border-white/10 p-8 w-full md:w-64 space-y-6">
                          <div className="flex items-center gap-3">
                             <Lock size={14} className="text-white/40" />
                             <span className="text-[9px] font-black text-white/60 tracking-[0.3em] uppercase">SYSTEM_STATE</span>
                          </div>
                          <div className="h-px bg-white/10" />
                          <LiveTerminal />
                          <button className="w-full h-12 bg-white text-black text-[10px] font-black uppercase tracking-widest hover:bg-primary transition-colors">
                             DISCONNECT
                          </button>
                       </div>
                    </div>
                 </div>
            </div>

            <div className="lg:col-span-4 bg-slate-50 border border-primary/5 p-4 relative group overflow-hidden">
                <div className="relative w-full h-[400px] lg:h-full overflow-hidden grayscale hover:grayscale-0 transition-all duration-1000 group-hover:scale-105">
                   <Image 
                      src="/img/zyndrix_control_center_v4.png" 
                      alt="Zyndrix Control Center" 
                      fill
                      className="object-cover"
                   />
                   <div className="absolute inset-0 bg-black/20" />
                   <div className="absolute top-10 left-10 z-10">
                       <div className="p-4 bg-black/80 backdrop-blur-md border border-white/10 text-white font-mono text-[8px] tracking-[0.4em] uppercase">
                          LOCATION: CLOUD_LOCAL
                       </div>
                   </div>
                </div>
            </div>
        </div>
      </div>
    </section>
  );
};

