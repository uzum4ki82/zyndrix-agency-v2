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
                        <div className="relative w-full lg:w-[600px] h-[400px] bg-black/60 rounded-[4rem] border border-white/10 p-12 overflow-hidden shadow-[inset_0_0_50px_rgba(0,0,0,0.8)] group/canvas">
                            <div className="absolute inset-0 opacity-10 grainy-bg" />
                            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />
                            
                            {/* Animated Background Pulse Wave */}
                            <motion.div 
                               animate={{ 
                                 scale: [1, 1.2, 1],
                                 opacity: [0, 0.1, 0]
                               }}
                               transition={{ duration: 4, repeat: Infinity }}
                               className="absolute inset-0 bg-primary/20 blur-[120px] rounded-full"
                            />

                            {/* SVG Connections with 'Flowing' effect */}
                            <svg className="absolute inset-0 w-full h-full">
                                <defs>
                                    <linearGradient id="flow-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="transparent" />
                                        <stop offset="50%" stopColor="#38bdf8" />
                                        <stop offset="100%" stopColor="transparent" />
                                    </linearGradient>
                                </defs>
                                
                                <path 
                                    d="M 80 200 L 180 200 M 180 200 L 300 120 M 180 200 L 300 280 M 300 120 L 420 120 M 300 280 L 420 280 M 420 120 L 520 200 M 420 280 L 520 200"
                                    stroke="rgba(255,255,255,0.05)"
                                    strokeWidth="6"
                                    fill="transparent"
                                    strokeLinecap="round"
                                />

                                {/* Moving Light Path */}
                                <motion.path 
                                    d="M 80 200 L 180 200 L 300 120 L 420 120 L 520 200"
                                    stroke="url(#flow-gradient)"
                                    strokeWidth="3"
                                    fill="transparent"
                                    strokeDasharray="20 100"
                                    animate={{ strokeDashoffset: [-120, 0] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                />
                                
                                <motion.circle 
                                    r="6" 
                                    fill="#38bdf8"
                                    className="shadow-[0_0_20px_#38bdf8]"
                                    style={{ offsetPath: "path('M 80 200 L 180 200 L 300 120 L 420 120 L 520 200')" }}
                                >
                                    <animateMotion dur="4s" repeatCount="indefinite" path="M 80 200 L 180 200 L 300 120 L 420 120 L 520 200" />
                                </motion.circle>
                            </svg>

                            {/* Node points */}
                            <div className="absolute inset-0 flex items-center justify-between px-16">
                                {/* Trigger node */}
                                <div className="space-y-20 flex flex-col items-center">
                                    <motion.div 
                                      whileHover={{ scale: 1.1, rotate: -5 }}
                                      className="w-16 h-16 bg-white/5 rounded-2xl border border-white/20 flex flex-col items-center justify-center relative shadow-2xl backdrop-blur-xl group/node"
                                    >
                                        <Layers className="w-8 h-8 text-white/40 group-hover/node:text-white transition-colors" />
                                        <div className="absolute -bottom-8 text-[10px] font-black text-white/20 group-hover/node:text-white/40 uppercase tracking-widest transition-colors">TRIGGER</div>
                                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-black" />
                                    </motion.div>
                                </div>

                                {/* Core Logic node (Vibrant) */}
                                <motion.div 
                                    animate={{ boxShadow: ["0 0 20px rgba(56,189,248,0)", "0 0 40px rgba(56,189,248,0.4)", "0 0 20px rgba(56,189,248,0)"] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="w-24 h-24 bg-primary/20 rounded-3xl border-2 border-primary/60 flex flex-col items-center justify-center relative backdrop-blur-3xl"
                                >
                                    <Cpu className="w-12 h-12 text-primary animate-pulse" />
                                    <div className="absolute -bottom-10 text-[11px] font-black text-primary uppercase tracking-[0.2em] shadow-primary/50 text-shadow">CORE_AGENTS</div>
                                    <div className="absolute inset-0 bg-primary/20 blur-2xl -z-10 rounded-full animate-pulse" />
                                </motion.div>

                                {/* Support nodes */}
                                <div className="space-y-28 flex flex-col">
                                    <motion.div 
                                      whileHover={{ scale: 1.1, x: 5 }}
                                      className="w-16 h-16 bg-white/5 rounded-2xl border border-white/10 flex flex-col items-center justify-center relative backdrop-blur-xl group/subnode"
                                    >
                                        <Database className="w-7 h-7 text-white/20 group-hover/subnode:text-primary/60 transition-colors" />
                                        <div className="absolute -top-8 text-[9px] font-black text-white/20 uppercase tracking-widest">KNOWLEDGE</div>
                                    </motion.div>
                                    <motion.div 
                                      whileHover={{ scale: 1.1, x: 5 }}
                                      className="w-16 h-16 bg-white/5 rounded-2xl border border-white/10 flex flex-col items-center justify-center relative backdrop-blur-xl group/subnode"
                                    >
                                        <Terminal className="w-7 h-7 text-white/20 group-hover/subnode:text-primary/60 transition-colors" />
                                        <div className="absolute -bottom-8 text-[9px] font-black text-white/20 uppercase tracking-widest">TASKS</div>
                                    </motion.div>
                                </div>

                                {/* Output node (Final) */}
                                <motion.div 
                                  whileHover={{ scale: 1.1 }}
                                  className="w-20 h-20 bg-white/10 rounded-[2.5rem] border border-white/30 flex flex-col items-center justify-center relative shadow-2xl backdrop-blur-2xl group/final"
                                >
                                    <Server className="w-10 h-10 text-white/60 group-hover/final:text-white transition-colors" />
                                    <div className="absolute -right-16 text-[10px] font-black text-white/20 uppercase tracking-widest rotate-90">SUCCESS_SYNC</div>
                                    <motion.div 
                                       animate={{ opacity: [0, 1, 0], scale: [1, 1.5, 1] }}
                                       transition={{ duration: 3, repeat: Infinity }}
                                       className="absolute inset-0 bg-white/5 rounded-[2.5rem]" 
                                    />
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};
