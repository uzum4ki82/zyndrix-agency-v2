'use client';

import { motion } from 'framer-motion';
import { Cpu, Database, Activity, Code, Server, GitBranch, Terminal, Layers } from 'lucide-react';
import { SectionHeader } from '../common/SectionHeader';

export const EngineRoom = ({ dict }: { dict: any }) => {
    return (
        <section id="ingenieria" className="py-24 px-10 relative overflow-hidden bg-base border-y border-white/5">
            <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
            <div className="absolute inset-0 bg-mesh opacity-10 pointer-events-none" />
            
            <div className="max-w-7xl mx-auto relative z-10">
                <SectionHeader 
                    title={dict.title} 
                    badge={dict.badge} 
                    subtitle={dict.subtitle}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
                    {dict.cards.map((step: any, i: number) => {
                        const iconsList = [Activity, Cpu, Database, Terminal];
                        const Icon = iconsList[i % iconsList.length];
                        const logs = [
                            ['SIGNAL_DETECTED', 'AUTH_VALIDATED', 'DATA_READY'],
                            ['PROMPT_SENT', 'INTENT_FOUND', 'VEC_SEARCH_OK'],
                            ['COLLECTION_W_OK', 'VECTOR_INDEXING', 'SYNC_CLOUD'],
                            ['ACTION_SENT', 'CODE_200_OK', 'SESSION_END']
                        ];
                        
                        return (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.15, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                                whileHover={{ scale: 1.02, y: -5 }}
                                className="group relative"
                            >
                                {/* Card Body */}
                                <div className="glass-premium p-10 rounded-[3.5rem] border border-white/5 relative overflow-hidden flex flex-col h-full bg-gradient-to-b from-white/[0.03] to-transparent group-hover:from-primary/10 transition-all duration-700">
                                    {/* Scanline Effect */}
                                    <div className="absolute inset-0 bg-scanline opacity-0 group-hover:opacity-10 pointer-events-none transition-opacity duration-700" />
                                    
                                    {/* Abstract Background Icon */}
                                    <div className="absolute -top-10 -right-10 p-8 opacity-[0.02] group-hover:opacity-10 transition-all duration-1000 group-hover:scale-150 rotate-12">
                                        <Icon className="w-48 h-48" />
                                    </div>

                                    {/* Icon Container */}
                                    <div className="relative mb-12">
                                        <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center border border-white/10 group-hover:border-primary/50 group-hover:bg-primary/20 transition-all duration-500 shadow-2xl relative z-10">
                                            <Icon className="w-7 h-7 text-white group-hover:text-primary transition-colors" />
                                        </div>
                                        {/* Glow effect behind icon */}
                                        <div className="absolute inset-0 bg-primary/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                                    </div>

                                    <h3 className="text-2xl font-heading font-black text-white italic mb-4 leading-none uppercase tracking-tighter group-hover:text-primary transition-colors duration-500 drop-shadow-md">
                                        {step.title}
                                    </h3>
                                    
                                    <p className="text-[14px] text-white/40 font-medium italic mb-12 leading-relaxed uppercase tracking-tight group-hover:text-white/80 transition-colors duration-500 flex-grow">
                                        {step.desc}
                                    </p>

                                    {/* Technical Logs with animated dot */}
                                    <div className="space-y-4 pt-10 border-t border-white/5 mt-auto relative z-10">
                                        {logs[i].map((log, j) => (
                                            <div key={j} className="flex items-center gap-4 group/log">
                                                <div className="relative">
                                                    <div className="w-2 h-2 rounded-full bg-primary/20 group-hover/log:bg-primary transition-colors" />
                                                    {j === 0 && (
                                                        <div className="absolute inset-0 rounded-full bg-primary animate-ping opacity-60" />
                                                    )}
                                                </div>
                                                <span className="font-mono text-[11px] text-primary/40 uppercase tracking-[0.3em] group-hover/log:text-primary/80 transition-colors">
                                                    {log}
                                                </span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Interactive Border Glow */}
                                    <div className="absolute inset-0 border border-primary/0 group-hover:border-primary/20 rounded-[3.5rem] transition-colors duration-700 pointer-events-none" />
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    className="mt-20 p-10 md:p-20 glass-premium rounded-[4rem] relative overflow-hidden group shadow-[0_0_150px_rgba(0,0,0,0.6)]"
                >
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                    
                    <div className="flex flex-col md:flex-row justify-between items-center gap-10">
                        <div className="space-y-6 max-w-xl">
                            <div className="flex items-center gap-4">
                                <GitBranch className="w-8 h-8 text-primary" />
                                <div className="text-[12px] font-black uppercase tracking-[0.5em] text-white/20">ORQUESTACIÓN N8N MASTER_WORKFLOW</div>
                            </div>
                            <h2 className="text-4xl font-heading font-black text-white uppercase italic tracking-tighter leading-none">
                                {dict.main_title}
                            </h2>
                            <p className="text-[14px] text-white/60 font-medium italic uppercase tracking-tight leading-relaxed max-w-md group-hover:text-white transition-colors">
                                {dict.main_desc}
                            </p>
                            <div className="pt-6">
                                <a href="#contacto" className="text-[12px] font-black uppercase tracking-[0.5em] text-primary hover:text-white transition-all flex items-center gap-4 group">
                                   {dict.cta} <Code className="w-5 h-5 group-hover:scale-125 transition-transform" />
                                </a>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
                            {[
                                { t: 'APIs', v: 'CUSTOM_NODE' },
                                { t: 'LATENCY', v: '0.15 MS' },
                                { t: 'UPTIME', v: '99.99%' },
                                { t: 'SECURITY', v: 'SOC2_READY' }
                            ].map((s, i) => (
                                <div key={i} className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl group-hover:border-primary/20 transition-all">
                                    <div className="text-[12px] font-black uppercase tracking-[0.4em] text-white/20 mb-2">{s.t}</div>
                                    <div className="text-lg font-heading font-black text-white italic tracking-tighter">{s.v}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};
