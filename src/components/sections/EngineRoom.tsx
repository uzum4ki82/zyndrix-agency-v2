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

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mt-12">
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
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1, duration: 0.8 }}
                                className="bg-[#050508] p-10 rounded-[3rem] border border-white/5 relative group overflow-hidden flex flex-col h-full"
                            >
                                <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-10 transition-opacity">
                                    <Icon className="w-40 h-40" />
                                </div>
                                
                                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20 mb-10 group-hover:bg-primary/20 transition-all shadow-xl shadow-primary/5">
                                    <Icon className="w-7 h-7 text-primary" />
                                </div>

                                <h3 className="text-xl font-heading font-black text-white italic mb-4 leading-none uppercase tracking-tighter group-hover:text-primary transition-colors">
                                    {step.title}
                                </h3>
                                <p className="text-[14px] text-white/60 font-medium italic mb-10 leading-relaxed uppercase tracking-tight group-hover:text-white transition-colors flex-grow">
                                    {step.desc}
                                </p>

                                <div className="space-y-3 font-mono text-[12px] text-primary/40 uppercase tracking-[0.2em] pt-6 border-t border-white/5 mt-auto">
                                    {logs[i].map((log, j) => (
                                        <div key={j} className="flex items-center gap-4">
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary/30" />
                                            {log}
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Workflow Visualization Mockup */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    className="mt-20 p-10 bg-[#050508] border border-white/5 rounded-[4rem] relative overflow-hidden group shadow-[0_0_100px_rgba(0,0,0,0.5)]"
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
