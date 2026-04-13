'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, HelpCircle } from 'lucide-react';

export const FAQ = ({ dict = {} }: { dict: any }) => {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section id="faq" className="py-24 px-6 relative overflow-hidden bg-white">
            <div className="max-w-4xl mx-auto relative z-10">
                <div className="flex flex-col items-center text-center mb-16">
                    <div className="text-[10px] font-bold uppercase tracking-[0.5em] text-primary mb-6">{dict.badge}</div>
                    <h2 className="text-5xl md:text-7xl font-heading font-black text-secondary mb-6 tracking-tight uppercase leading-[0.9]">{dict.title}</h2>
                    <p className="text-xl text-secondary/40 leading-relaxed font-medium max-w-2xl">{dict.subtitle}</p>
                </div>

                <div className="space-y-4">
                    {dict?.items?.map((item: any, i: number) => {
                        const isOpen = openIndex === i;

                        return (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className={`rounded-3xl border transition-all duration-500 overflow-hidden ${isOpen ? 'border-primary bg-primary/5 shadow-xl' : 'border-secondary/5 bg-white hover:border-primary/30'}`}
                            >
                                <button
                                    onClick={() => setOpenIndex(isOpen ? null : i)}
                                    className="w-full p-8 md:p-10 flex items-center justify-between text-left gap-6"
                                >
                                    <div className="flex items-center gap-6">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${isOpen ? 'bg-primary text-white' : 'bg-secondary/5 text-secondary/40'}`}>
                                            <HelpCircle size={20} />
                                        </div>
                                        <span className={`text-xl md:text-2xl font-heading font-black tracking-tight uppercase transition-colors leading-tight ${isOpen ? 'text-secondary' : 'text-secondary/60 group-hover:text-primary'}`}>
                                            {item.q}
                                        </span>
                                    </div>
                                    <div className={`flex-shrink-0 w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-500 ${isOpen ? 'rotate-180 border-primary bg-primary text-white' : 'border-secondary/10 text-secondary/20'}`}>
                                        {isOpen ? <Minus size={14} /> : <Plus size={14} />}
                                    </div>
                                </button>

                                <AnimatePresence>
                                    {isOpen && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="px-8 md:px-10 pb-10 overflow-hidden"
                                        >
                                            <div className="pl-18 border-l-2 border-primary/20">
                                                <p className="text-lg text-secondary/60 leading-relaxed font-medium">
                                                    {item.a}
                                                </p>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        );
                    })}
                </div>
                
                <div className="mt-16 p-10 rounded-[3rem] bg-secondary text-white flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="text-2xl font-heading font-black uppercase italic tracking-tight">¿Alguna otra duda?</div>
                    <a
                      href="https://wa.me/34637729266"
                      className="px-10 py-5 bg-primary text-white font-black uppercase tracking-widest text-xs rounded-xl hover:bg-white hover:text-secondary transition-all duration-300"
                    >
                      PREGÚNTAME POR WHATSAPP
                    </a>
                </div>
            </div>
        </section>
    );
};
