'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, Shield, Zap, Key, Database, ArrowRight } from 'lucide-react';
import { SectionHeader } from '../common/SectionHeader';

const icons = [Shield, Zap, Key, Database];

export const FAQ = ({ dict = {} }: { dict: any }) => {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section id="faq" className="py-12 px-10 relative overflow-hidden bg-white border-y border-primary/10">
            <div className="arch-grid opacity-10" />
            
            <div className="max-w-4xl mx-auto relative z-10">
                <SectionHeader 
                    title={dict.title || "PROTOCOLOS DE DUDA"} 
                    badge={dict.badge || "SOPORTE_TÉCNICO"} 
                    subtitle={dict.subtitle || "Respuesta de ingeniería para ejecutivos."}
                />

                <div className="mt-12 space-y-5">
                    {dict?.items?.map((item: any, i: number) => {
                        const Icon = icons[i % icons.length];
                        const isOpen = openIndex === i;

                        return (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className={`group border ${isOpen ? 'border-primary/30 bg-slate-50 shadow-lg' : 'border-primary/10 bg-white'} transition-all duration-500 hover:border-primary/20`}
                            >
                                <button
                                    onClick={() => setOpenIndex(isOpen ? null : i)}
                                    className="w-full p-10 md:p-12 flex items-center justify-between text-left gap-10"
                                >
                                    <div className="flex items-center gap-10">
                                        <div className={`w-16 h-16 flex items-center justify-center border-2 transition-all duration-500 ${isOpen ? 'bg-black text-white border-black' : 'bg-slate-50 text-primary/50 border-primary/20 group-hover:border-primary/40'}`}>
                                            <Icon strokeWidth={1.5} size={24} />
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-[11px] font-black text-primary/30 tracking-[0.5em] uppercase mb-3">QUERY_LOG_{String(i+1).padStart(2, '0')}</div>
                                            <span className={`text-lg md:text-2xl font-heading font-black tracking-tight uppercase transition-colors leading-tight ${isOpen ? 'text-primary' : 'text-slate-600 group-hover:text-primary'}`}>
                                                {item.q}
                                            </span>
                                        </div>
                                    </div>
                                    <div className={`flex-shrink-0 w-10 h-10 rounded-full border-2 border-primary/20 flex items-center justify-center transition-all duration-500 ${isOpen ? 'rotate-180 bg-primary border-primary text-white' : 'group-hover:border-primary/40'}`}>
                                        {isOpen ? <Minus size={16} className="text-white" /> : <Plus size={16} className="text-primary/40" />}
                                    </div>
                                </button>

                                <AnimatePresence>
                                    {isOpen && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="px-10 md:px-12 pb-12 overflow-hidden bg-slate-50/50"
                                        >
                                            <div className="pl-24 border-l-4 border-primary/20 ml-8">
                                                <p className="text-[15px] md:text-[16px] text-slate-700 leading-relaxed font-medium mb-8">
                                                    {item.a}
                                                </p>
                                                <div className="pt-8 border-t border-primary/10 flex items-center gap-4 text-[10px] font-black text-primary/40 uppercase tracking-[0.4em]">
                                                   <div className="w-12 h-px bg-primary/20" />
                                                   ✓ Verified Protocol v4.2
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};
