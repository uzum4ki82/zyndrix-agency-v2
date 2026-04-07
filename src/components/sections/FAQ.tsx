'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, Shield, Zap, Key, Database } from 'lucide-react';
import { SectionHeader } from '../common/SectionHeader';

const icons = [Shield, Zap, Key, Database];

export const FAQ = ({ dict = {} }: { dict: any }) => {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section id="faq" className="py-12 md:py-20 px-10 relative overflow-hidden bg-[#03040a]">
            {/* Background Glow */}
            <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-primary/5 blur-[140px] rounded-full pointer-events-none opacity-20" />
            
            <div className="max-w-4xl mx-auto relative z-10">
                <SectionHeader 
                    title={dict.title} 
                    badge={dict.badge} 
                    subtitle={dict.subtitle}
                />

                <div className="mt-12 space-y-6">
                    {dict?.items?.map((item: any, i: number) => {
                        const Icon = icons[i % icons.length];
                        return (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, scale: 0.98 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                className={`group border ${openIndex === i ? 'border-primary/40 bg-white/5' : 'border-white/5 bg-white/[0.02]'} rounded-[2.5rem] overflow-hidden transition-all duration-500 hover:border-primary/20`}
                            >
                                <button 
                                    onClick={() => setOpenIndex(openIndex === i ? null : i)}
                                    className="w-full p-10 flex items-center justify-between text-left gap-8"
                                >
                                    <div className="flex items-center gap-6">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all ${openIndex === i ? 'bg-primary/20 border-primary/40' : 'bg-white/5 border-white/10 group-hover:bg-white/10'}`}>
                                            <Icon className={`w-6 h-6 ${openIndex === i ? 'text-primary' : 'text-white/20 group-hover:text-white/40'}`} />
                                        </div>
                                        <span className={`text-lg md:text-xl font-heading font-black uppercase italic tracking-tighter transition-colors ${openIndex === i ? 'text-white' : 'text-white/40 group-hover:text-white/60'}`}>
                                            {item.q}
                                        </span>
                                    </div>
                                    <div className={`flex-shrink-0 transition-transform duration-500 ${openIndex === i ? 'rotate-180' : ''}`}>
                                        {openIndex === i ? <Minus className="text-primary" /> : <Plus className="text-white/20" />}
                                    </div>
                                </button>

                                <AnimatePresence>
                                    {openIndex === i && (
                                        <motion.div 
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="px-10 pb-10 overflow-hidden"
                                        >
                                            <p className="text-[14px] md:text-[16px] text-white/40 leading-relaxed font-medium italic uppercase tracking-tight pl-[4.5rem]">
                                                {item.a}
                                            </p>
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
