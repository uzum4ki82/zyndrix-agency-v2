'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, TrendingDown, Clock, AlertTriangle, ArrowRight } from 'lucide-react';
import { SectionHeader } from '../common/SectionHeader';

export const ROICalculator = ({ dict }: { dict: any }) => {
    const [hours, setHours] = useState(20);
    const [rate, setRate] = useState(30);
    const [employees, setEmployees] = useState(3);

    const monthlyLeak = hours * rate * employees * 4;
    const yearlyLeak = monthlyLeak * 12;

    return (
        <section id="roi" className="py-24 px-10 relative overflow-hidden bg-[#03040a]">
            {/* Warning Background Ambient */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-red-500/5 blur-[160px] rounded-full pointer-events-none" />
            
            <div className="max-w-7xl mx-auto relative z-10">
                <SectionHeader 
                    title={dict.title} 
                    badge={dict.badge} 
                    subtitle={dict.subtitle}
                />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mt-12">
                    <div className="glass-premium p-10 md:p-14 rounded-[3.5rem] border border-white/10 space-y-12">
                        <div className="space-y-8">
                            <div className="space-y-4">
                                <div className="flex justify-between items-center px-4">
                                    <label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">{dict.labels.hours}</label>
                                    <span className="text-xl font-heading font-black text-primary">{hours}H</span>
                                </div>
                                <input 
                                    type="range" min="1" max="100" value={hours} 
                                    onChange={(e) => setHours(parseInt(e.target.value))}
                                    className="w-full h-1.5 bg-white/5 rounded-full appearance-none cursor-pointer accent-primary" 
                                />
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center px-4">
                                    <label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">{dict.labels.cost}</label>
                                    <span className="text-xl font-heading font-black text-primary">{rate}€</span>
                                </div>
                                <input 
                                    type="range" min="10" max="200" value={rate} 
                                    onChange={(e) => setRate(parseInt(e.target.value))}
                                    className="w-full h-1.5 bg-white/5 rounded-full appearance-none cursor-pointer accent-primary" 
                                />
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center px-4">
                                    <label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">{dict.labels.employees}</label>
                                    <span className="text-xl font-heading font-black text-primary">{employees} PK</span>
                                </div>
                                <input 
                                    type="range" min="1" max="50" value={employees} 
                                    onChange={(e) => setEmployees(parseInt(e.target.value))}
                                    className="w-full h-1.5 bg-white/5 rounded-full appearance-none cursor-pointer accent-primary" 
                                />
                            </div>
                        </div>

                        <div className="p-8 bg-white/5 rounded-3xl border border-white/5 flex items-center gap-6 group">
                            <div className="w-12 h-12 bg-red-500/10 rounded-2xl flex items-center justify-center border border-red-500/20 group-hover:scale-110 transition-transform">
                               <TrendingDown className="w-6 h-6 text-red-500" />
                            </div>
                            <div className="text-[11px] font-black uppercase tracking-[0.2em] text-white/40 italic leading-relaxed">
                                {dict.warning.split('quemando capital')[0]} <span className="text-red-500">{dict.warning.includes('quemando capital') ? 'quemando capital' : 'burning capital'}</span> {dict.warning.split('quemando capital')[1] || dict.warning.split('burning capital')[1]}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-10">
                        <div className="relative p-12 rounded-[4rem] bg-gradient-to-br from-white/10 to-transparent border border-white/10 group overflow-hidden">
                             <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
                                <AlertTriangle className="w-40 h-40 text-red-500" />
                             </div>
                             
                             <div className="relative z-10 space-y-4">
                                <div className="text-[11px] font-black uppercase tracking-[0.5em] text-white/20">{dict.labels.monthly}</div>
                                <div className="text-7xl md:text-8xl font-heading font-black text-red-500 tracking-tighter italic">
                                    {monthlyLeak.toLocaleString()}€
                                </div>
                             </div>
                        </div>

                        <div className="relative p-12 rounded-[4rem] border border-primary/20 bg-primary/5 group overflow-hidden shadow-2xl shadow-primary/10">
                             <div className="absolute top-0 right-0 p-10 opacity-5">
                                <TrendingDown className="w-40 h-40 text-primary" />
                             </div>
                             
                             <div className="relative z-10 space-y-4">
                                <div className="text-[11px] font-black uppercase tracking-[0.5em] text-primary/40">{dict.labels.yearly}</div>
                                <div className="text-7xl md:text-8xl font-heading font-black text-white tracking-tighter italic">
                                    {yearlyLeak.toLocaleString()}€
                                </div>
                             </div>
                        </div>

                        <div className="pt-4 px-4">
                             <a href="#contacto" className="btn-elite group h-20 w-fit px-12">
                                <Calculator className="w-5 h-5" />
                                <span className="text-[14px]">{dict.cta}</span>
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-3 transition-transform" />
                             </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
