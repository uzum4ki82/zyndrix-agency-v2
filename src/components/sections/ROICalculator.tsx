'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, TrendingDown, Clock, AlertTriangle, ArrowRight, Gauge } from 'lucide-react';
import { SectionHeader } from '../common/SectionHeader';

export const ROICalculator = ({ dict }: { dict: any }) => {
    const [hours, setHours] = useState(40);
    const [rate, setRate] = useState(10);
    const [employees, setEmployees] = useState(1);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const monthlyLeak = Math.round(hours * rate * 4.34 * employees);
    const yearlyLeak = monthlyLeak * 12;

    if (!mounted) return null;

    return (
        <section id="eficiencia" className="py-12 px-10 relative overflow-hidden bg-white border-y border-primary/10">
            <div className="arch-grid opacity-10" />
            
            <div className="max-w-7xl mx-auto relative z-10">
                <SectionHeader 
                    title={dict.title || "ANÁLISIS DE EFICIENCIA"} 
                    badge={dict.badge || "EFFICIENCY_AUDIT_v4"} 
                    subtitle={dict.subtitle || "Cuantifique el coste del trabajo manual en su arquitectura actual."}
                />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start mt-10">
                    {/* Control Panel */}
                    <div className="lg:col-span-5 bg-slate-50 border border-primary/10 p-10 md:p-14 transition-all duration-700 hover:shadow-2xl space-y-12">
                        <div className="flex items-center gap-4 border-b border-primary/10 pb-8">
                           <div className="w-10 h-10 bg-black text-white flex items-center justify-center">
                              <Gauge size={18} />
                           </div>
                           <div className="text-[10px] font-black uppercase tracking-[0.5em] text-primary">SCANNER_PARAMETERS</div>
                        </div>

                        <div className="space-y-10">
                            {[
                              { label: dict.labels.hours, val: hours, unit: "H", min: 1, max: 100, set: setHours },
                              { label: dict.labels.cost, val: rate, unit: "€", min: 10, max: 200, set: setRate },
                              { label: dict.labels.employees, val: employees, unit: "PK", min: 1, max: 50, set: setEmployees }
                            ].map((s, idx) => (
                              <div key={idx} className="space-y-8">
                                  <div className="flex justify-between items-end gap-6">
                                      <label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">{s.label}</label>
                                      <span className="text-4xl font-heading font-black text-primary tracking-tighter italic">{s.val}{s.unit}</span>
                                  </div>
                                  <input
                                      type="range" min={s.min} max={s.max} value={s.val}
                                      onChange={(e) => s.set(parseInt(e.target.value))}
                                      className="w-full h-2 bg-slate-300 rounded-none appearance-none cursor-pointer accent-black hover:accent-primary transition-all"
                                  />
                              </div>
                            ))}
                        </div>

                        <div className="pt-8 flex items-start gap-6 border-t border-primary/10 group">
                            <AlertTriangle className="w-5 h-5 text-red-500 mt-1" />
                            <div className="text-[11px] font-bold uppercase tracking-widest text-slate-500 leading-relaxed italic">
                                {dict.warning.part1} <span className="text-red-600 font-black underline decoration-red-200 underline-offset-4">{dict.warning.highlight}</span> {dict.warning.part2}
                            </div>
                        </div>
                    </div>

                    {/* Result Panel */}
                    <div className="lg:col-span-7 grid md:grid-cols-2 gap-8">
                        <div className="bg-white border border-primary/10 p-14 md:p-16 relative overflow-hidden group">
                             <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                                <TrendingDown size={140} />
                             </div>

                             <div className="relative z-10 space-y-8">
                                <div className="text-[11px] font-black uppercase tracking-[0.5em] text-slate-400">{dict.labels.monthly}</div>
                                <div className="text-7xl md:text-8xl font-heading font-black text-slate-600 tracking-tighter italic group-hover:text-red-600 transition-colors leading-none">
                                    {monthlyLeak}€
                                </div>
                                <p className="text-[12px] text-slate-500 font-medium leading-relaxed">Inversión perdida mensual en fricción operativa.</p>
                             </div>
                        </div>

                        <div className="bg-black p-12 relative overflow-hidden group shadow-2xl">
                             <div className="absolute -bottom-10 -right-10 p-8 opacity-10 group-hover:opacity-20 transition-all duration-1000 group-hover:scale-110">
                                <Calculator size={240} className="text-white" />
                             </div>
                             
                             <div className="relative z-10 space-y-8">
                                <div className="text-[10px] font-black uppercase tracking-[0.5em] text-white/30">{dict.labels.yearly}</div>
                                <div className="text-7xl font-heading font-black text-white tracking-tighter italic">
                                    {yearlyLeak.toLocaleString('es-ES')}€
                                </div>
                                <div className="pt-8 flex flex-col gap-4">
                                   <div className="h-1 w-full bg-white/10 overflow-hidden">
                                      <motion.div 
                                        className="h-full bg-primary"
                                        initial={{ width: 0 }}
                                        whileInView={{ width: "100%" }}
                                        transition={{ duration: 1.5, ease: "circOut" }}
                                      />
                                   </div>
                                   <span className="text-[8px] font-black text-white/40 uppercase tracking-[0.3em]">REVENUE_DRAIN_DETECTION_v4.2</span>
                                </div>
                             </div>
                        </div>

                        <div className="md:col-span-2 pt-8">
                             <a href="#contacto" className="inline-flex items-center gap-6 bg-slate-900 text-white p-8 group hover:bg-primary transition-all duration-500 w-full md:w-fit">
                                <span className="text-sm font-black uppercase tracking-[0.3em]">{dict.cta}</span>
                                <div className="w-12 h-12 bg-white/10 flex items-center justify-center group-hover:bg-black transition-colors">
                                   <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                                </div>
                             </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
