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
                                    <div className="absolute inset-0 bg-scanline opacity-0 group-hover:opacity-10 pointer-events-none transition-opacity duration-700" />
                                    
                                    <div className="absolute -top-10 -right-10 p-8 opacity-[0.02] group-hover:opacity-10 transition-all duration-1000 group-hover:scale-150 rotate-12">
                                        <Icon className="w-48 h-48" />
                                    </div>

                                    <div className="relative mb-12">
                                        <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center border border-white/10 group-hover:border-primary/50 group-hover:bg-primary/20 transition-all duration-500 shadow-2xl relative z-10">
                                            <Icon className="w-7 h-7 text-white group-hover:text-primary transition-colors" />
                                        </div>
                                        <div className="absolute inset-0 bg-primary/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                                    </div>

                                    <h3 className="text-2xl font-heading font-black text-white italic mb-4 leading-none uppercase tracking-tighter group-hover:text-primary transition-colors duration-500 drop-shadow-md">
                                        {step.title}
                                    </h3>
                                    
                                    <p className="text-[14px] text-white/40 font-medium italic mb-12 leading-relaxed uppercase tracking-tight group-hover:text-white/80 transition-colors duration-500 flex-grow">
                                        {step.desc}
                                    </p>

                                    {/* Sequential technical logs */}
                                    <div className="space-y-4 pt-10 border-t border-white/5 mt-auto relative z-10">
                                        {logs[i].map((log, j) => (
                                            <motion.div 
                                              key={j} 
                                              initial={{ opacity: 0.2, x: -10 }}
                                              whileInView={{ opacity: 1, x: 0 }}
                                              transition={{ 
                                                delay: (i * 0.2) + (j * 0.4), 
                                                duration: 0.5,
                                                repeat: Infinity,
                                                repeatType: "reverse",
                                                repeatDelay: 3
                                              }}
                                              className="flex items-center gap-4 group/log"
                                            >
                                                <div className="relative">
                                                    <div className="w-2 h-2 rounded-full bg-primary/60" />
                                                    <motion.div 
                                                      animate={{ scale: [1, 2, 1], opacity: [0.6, 0, 0.6] }}
                                                      transition={{ duration: 2, repeat: Infinity }}
                                                      className="absolute inset-0 rounded-full bg-primary" 
                                                    />
                                                </div>
                                                <span className="font-mono text-[11px] text-primary/60 uppercase tracking-[0.3em] group-hover/log:text-primary transition-colors">
                                                    {log}
                                                </span>
                                            </motion.div>
                                        ))}
                                    </div>

                                    <div className="absolute inset-0 border border-primary/0 group-hover:border-primary/20 rounded-[3.5rem] transition-colors duration-700 pointer-events-none" />
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Workflow Reproduction Mockup (n8n Style) */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    className="mt-20 p-10 md:p-20 glass-premium rounded-[5rem] relative overflow-hidden group shadow-[0_0_150px_rgba(0,0,0,0.6)] border border-white/10"
                >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.03)_0%,transparent_70%)]" />
                    
                    <div className="flex flex-col lg:flex-row justify-between items-center gap-20 relative z-10">
                        <div className="space-y-8 max-w-xl text-left">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-primary/10 rounded-xl border border-primary/20">
                                    <GitBranch className="w-6 h-6 text-primary animate-pulse" />
                                </div>
                                <div className="text-[11px] font-black uppercase tracking-[0.5em] text-white/40">ZYN_ENGINE 2.0 // MASTER_WORKFLOW</div>
                            </div>
                            <h2 className="text-5xl lg:text-7xl font-heading font-black text-white uppercase italic tracking-tighter leading-none">
                                {dict.main_title}
                            </h2>
                            <p className="text-[14px] text-white/40 font-medium italic uppercase tracking-tight leading-relaxed max-w-md group-hover:text-white/60 transition-colors">
                                {dict.main_desc}
                            </p>
                            <div className="pt-4">
                                <a href="#contacto" className="btn-elite px-10 py-5 h-auto group bg-white/5 border border-white/10 hover:bg-white text-white hover:text-black">
                                   <span className="text-[14px]">{dict.cta}</span> 
                                   <Code className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                                </a>
                            </div>
                        </div>

                        {/* n8n Workflow Visualization Reproduction */}
                        <div className="relative w-full lg:w-[500px] h-[350px] bg-black/40 rounded-[3rem] border border-white/5 p-10 overflow-hidden shadow-inner">
                            <div className="absolute inset-0 opacity-20 grainy-bg" />
                            
                            {/* SVG Connections */}
                            <svg className="absolute inset-0 w-full h-full opacity-30">
                                <motion.path 
                                    d="M 50 175 L 150 175 M 150 175 L 250 100 M 150 175 L 250 250 M 250 100 L 350 100 M 250 250 L 350 250 M 350 100 L 450 175 M 350 250 L 450 175"
                                    stroke="rgba(56,189,248,0.5)"
                                    strokeWidth="2"
                                    fill="transparent"
                                    strokeDasharray="4 4"
                                    initial={{ pathLength: 0 }}
                                    whileInView={{ pathLength: 1 }}
                                    transition={{ duration: 3, repeat: Infinity }}
                                />
                                {/* Active Signal Path */}
                                <motion.circle 
                                    r="4" 
                                    fill="#38bdf8"
                                    style={{ offsetPath: "path('M 50 175 L 150 175 L 250 100 L 350 100 L 450 175')" }}
                                >
                                    <animateMotion dur="4s" repeatCount="indefinite" path="M 50 175 L 150 175 L 250 100 L 350 100 L 450 175" />
                                </motion.circle>
                            </svg>

                            {/* Node points */}
                            <div className="absolute inset-0 flex items-center justify-between px-10">
                                <div className="space-y-20 flex flex-col items-center">
                                    <div className="w-12 h-12 bg-white/10 rounded-xl border border-white/20 flex items-center justify-center relative shadow-[0_0_20px_rgba(255,255,255,0.05)]">
                                        <Layers className="w-6 h-6 text-white/40" />
                                        <div className="absolute -bottom-6 text-[8px] font-black text-white/20 whitespace-nowrap uppercase tracking-widest">TRIGGER</div>
                                    </div>
                                </div>

                                <div className="w-16 h-16 bg-primary/20 rounded-2xl border border-primary/40 flex items-center justify-center relative shadow-[0_0_40px_rgba(56,189,248,0.2)]">
                                    <Cpu className="w-8 h-8 text-primary animate-pulse" />
                                    <div className="absolute -bottom-8 text-[8px] font-black text-primary uppercase tracking-widest">CORE_LOGIC</div>
                                </div>

                                <div className="space-y-32 flex flex-col">
                                    <div className="w-12 h-12 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center relative">
                                        <Database className="w-6 h-6 text-white/20" />
                                        <div className="absolute -top-6 text-[8px] font-black text-white/20 uppercase tracking-widest">VECTOR_DB</div>
                                    </div>
                                    <div className="w-12 h-12 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center relative">
                                        <Terminal className="w-6 h-6 text-white/20" />
                                        <div className="absolute -bottom-6 text-[8px] font-black text-white/20 uppercase tracking-widest">SCRAPER</div>
                                    </div>
                                </div>

                                <div className="w-14 h-14 bg-white/10 rounded-2xl border border-white/20 flex items-center justify-center relative">
                                    <Server className="w-7 h-7 text-white/40" />
                                    <div className="absolute -right-12 text-[8px] font-black text-white/20 uppercase tracking-widest rotate-90">OUTPUT</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};
