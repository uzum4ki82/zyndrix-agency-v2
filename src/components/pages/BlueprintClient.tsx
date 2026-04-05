"use client";

import React, { useState, useEffect } from 'react';
import Image from "next/image";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { 
  CheckCircle2, ArrowRight, ShieldCheck, Download, 
  Zap, Loader2, DollarSign, Rocket, Shield, Activity, Users, TrendingDown, Scan, Cpu, Radio, Network
} from "lucide-react";
import { NavBar } from '@/components/common/NavBar';

interface BlueprintClientProps {
  dict: any;
  locale: string;
}

export default function BlueprintClient({ dict, locale }: BlueprintClientProps) {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', company: '', teamSize: '', challenge: '', budget: '' });
  const [step, setStep] = useState<'idle' | 'processing' | 'success'>('idle');
  const [progress, setProgress] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  
  const [staffSize, setStaffSize] = useState(10);
  const hourlyRate = 42; 
  
  const getMultiplier = (sector: string) => {
    switch(sector) {
      case 'ecommerce': return 1.55; 
      case 'servicios': return 1.18; 
      case 'tech': return 1.32;      
      case 'realestate': return 1.68; 
      default: return 1.0;
    }
  };

  const multiplier = getMultiplier(formData.teamSize);
  const monthlyLeak = Math.round(staffSize * hourlyRate * 4.3 * 8 * 0.48 * multiplier);

  useEffect(() => {
    setIsScanning(true);
    const timer = setTimeout(() => setIsScanning(false), 900);
    return () => clearTimeout(timer);
  }, [staffSize, formData.teamSize]);

  const { scrollY } = useScroll();
  const backgroundY = useTransform(scrollY, [0, 1000], [0, -200]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0.4]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep('processing');
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) { clearInterval(interval); setTimeout(() => setStep('success'), 400); return 100; }
        return prev + 4;
      });
    }, 50);

    try {
      await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name, 
          email: formData.email, 
          phone: formData.phone,
          company: formData.company,
          budget: formData.budget,
          message: `Staff: ${staffSize}, Sector: ${formData.teamSize}, Fuga: ${monthlyLeak}€, Desafío: ${formData.challenge}`,
          service: 'Blueprint Diamond 3.0 Final'
        })
      });
    } catch (error) { console.error(error); }
  };

  return (
    <div className="relative min-h-screen text-slate-300 overflow-x-hidden font-sans selection:bg-[#38bdf8] selection:text-black" 
         style={{ 
           background: 'radial-gradient(circle at 50% 50%, #0c112b 0%, #03040a 100%)' 
         }}>
      
      {/* CINE NOISE TEXTURE */}
      <div className="fixed inset-0 pointer-events-none z-[60] opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />

      {/* PARALLAX GRID */}
      <motion.div style={{ y: backgroundY }} className="fixed inset-0 pointer-events-none z-0 opacity-20">
        <div className="absolute inset-0" style={{ backgroundImage: `linear-gradient(to right, rgba(56, 189, 248, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(56, 189, 248, 0.05) 1px, transparent 1px)`, backgroundSize: '60px 60px', maskImage: 'radial-gradient(ellipse at center, black, transparent 90%)' }} />
      </motion.div>

      <NavBar dict={dict.nav} locale={locale} />

      <main className="max-w-[1440px] mx-auto px-8 pb-32 pt-32 md:pt-48 relative z-10">
        
        {/* HERO COMPACTO */}
        <motion.div style={{ opacity: heroOpacity }} className="text-center mb-16 max-w-5xl mx-auto space-y-6">
           <div className="inline-flex items-center gap-4 px-6 py-2 rounded-full bg-white/[0.03] border border-white/10 text-[#38bdf8] text-[10px] font-bold uppercase tracking-[0.8em] backdrop-blur-xl">
              <Network size={14} className="animate-spin-slow" /> {dict.blueprint_page.badge}
           </div>
           <h1 className="text-6xl md:text-[125px] font-black leading-[0.85] tracking-[-0.09em] text-white uppercase text-center">
             {dict.blueprint_page.title.split(' ')[0]} <br /> 
             {dict.blueprint_page.title.split(' ')[1]} <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#38bdf8] to-white italic">{dict.blueprint_page.title.split(' ')[2]}</span>
           </h1>
           <p className="text-lg md:text-2xl text-slate-500 max-w-2xl mx-auto font-medium">{dict.blueprint_page.subtitle}</p>
        </motion.div>

        {/* MASTER CAPSULE */}
        <div className="relative group p-[1px] rounded-[4.5rem] overflow-hidden bg-white/10 shadow-massive-3xl">
           <motion.div animate={{ rotate: 360 }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }} className="absolute inset-[-100%] bg-[conic-gradient(from_0deg,transparent_0deg,transparent_300deg,#38bdf8_360deg)] z-0 opacity-15" />

           <div className="w-full grid lg:grid-cols-2 gap-0 bg-[#030610]/98 rounded-[4.45rem] overflow-hidden relative z-10 ring-1 ring-white/10 backdrop-blur-4xl shadow-2xl">
              
              {/* IZQUIERDA: DIAGNÓSTICO */}
              <div className="p-12 lg:p-20 space-y-12 border-r border-white/5 bg-gradient-to-br from-white/[0.04] to-transparent relative overflow-hidden">
                 <div className="space-y-12 relative z-20">
                    <div className="flex items-center gap-6">
                       <div className="w-16 h-16 rounded-3xl bg-[#38bdf8]/10 flex items-center justify-center text-[#38bdf8] border border-[#38bdf8]/30 font-black text-2xl shadow-xl">01</div>
                       <div className="flex flex-col"><h3 className="text-[13px] font-black uppercase tracking-[0.6em] text-white">{dict.blueprint_page.scanner.title}</h3><span className="text-[11px] text-[#818cf8] font-bold uppercase tracking-[0.4em] pt-1">{dict.blueprint_page.scanner.module}</span></div>
                    </div>
                    
                    <div className="space-y-12">
                       <div className="bg-slate-950/80 p-10 rounded-[4rem] border border-white/5 space-y-10 shadow-inner">
                          <div className="flex justify-between items-center text-[11px] font-black text-slate-500 uppercase tracking-[0.6em]"><span>{dict.blueprint_page.scanner.staff}</span><span className="text-[#38bdf8] bg-[#38bdf8]/10 px-6 py-2 rounded-full border border-[#38bdf8]/40 shadow-glow-sm">{staffSize}</span></div>
                          <input type="range" min="1" max="100" value={staffSize} onChange={(e) => setStaffSize(parseInt(e.target.value))} className="w-full h-3 bg-white/5 rounded-full appearance-none accent-[#38bdf8] cursor-pointer" />
                       </div>
                       
                       <motion.div className="p-20 rounded-[5rem] bg-gradient-to-br from-[#38bdf8]/15 via-[#030712] to-transparent border border-[#38bdf8]/30 flex flex-col items-center text-center space-y-6 relative overflow-hidden group/box">
                          <AnimatePresence>{isScanning && <motion.div initial={{ top: "-5%" }} animate={{ top: "105%" }} exit={{ opacity: 0 }} transition={{ duration: 0.6, ease: "easeInOut" }} className="absolute left-0 right-0 h-[2px] bg-[#38bdf8] shadow-[0_0_40px_#38bdf8] z-30" />}</AnimatePresence>
                          <TrendingDown size={42} className="text-rose-500 opacity-60 mb-2 animate-bounce" />
                          <span className="text-[15px] font-black text-[#818cf8] uppercase tracking-[1em] relative z-20">{dict.blueprint_page.scanner.label}</span>
                          <span className="text-8xl md:text-[110px] font-black text-white tracking-tighter relative z-20 drop-shadow-[0_0_60px_rgba(56,189,248,0.5)]">{monthlyLeak.toLocaleString()}€</span>
                       </motion.div>
                    </div>
                 </div>
                 <div className="relative aspect-[16/10] rounded-[3.5rem] overflow-hidden border border-white/10 shadow-2xl bg-[#030712]">
                    <video 
                      src="/videos/blueprint-bg.mp4" 
                      autoPlay 
                      loop 
                      muted 
                      playsInline 
                      preload="metadata"
                      className="p-2 w-full h-full object-cover opacity-60 grayscale hover:grayscale-0 transition-all duration-1000 scale-105" 
                    />
                    <div className="absolute top-10 left-10 z-20"><Scan className="text-[#38bdf8] animate-pulse" size={32} /></div>
                 </div>
              </div>

              {/* DERECHA: FORMULARIO */}
              <div id="contacto" className="p-12 lg:p-20 bg-gradient-to-tr from-[#38bdf8]/[0.05] via-[#020610] to-transparent flex flex-col justify-start pt-36 relative overflow-hidden">
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#38bdf8]/10 rounded-full blur-[180px] animate-pulse pointer-events-none" />
                 
                 <AnimatePresence mode="wait">
                    {step === 'idle' ? (
                      <motion.div key="form" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} className="space-y-12 relative z-20">
                         <div className="space-y-6">
                            <div className="flex items-center gap-4 justify-center lg:justify-start">
                               <div className="w-1.5 h-1.5 rounded-full bg-[#38bdf8] shadow-[0_0_15px_#38bdf8]" />
                               <span className="text-[#38bdf8] text-[13px] font-black tracking-[1.2em] uppercase">{dict.blueprint_page.form.badge}</span>
                            </div>
                            <h2 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-[0.85] uppercase">{dict.blueprint_page.form.title.split(' ')[0]} <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#38bdf8] via-[#a78bfa] to-[#f472b6] animate-gradient-x">{dict.blueprint_page.form.title.split(' ')[1]}</span></h2>
                            <p className="text-[15px] font-medium text-slate-500 leading-relaxed max-w-sm">{dict.blueprint_page.form.desc}</p>
                         </div>

                         <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                               <input required type="text" placeholder={dict.blueprint_page.form.name} className="w-full bg-white/[0.03] border border-white/5 p-5 rounded-[2.2rem] outline-none focus:border-[#38bdf8]/40 transition-all text-sm text-white placeholder:text-slate-600 font-black px-8 shadow-inner" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                               <input required type="text" placeholder={dict.blueprint_page.form.company} className="w-full bg-white/[0.03] border border-white/5 p-5 rounded-[2.2rem] outline-none focus:border-[#38bdf8]/40 transition-all text-sm text-white placeholder:text-slate-600 font-black px-8 shadow-inner" value={formData.company} onChange={(e) => setFormData({...formData, company: e.target.value})} />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                               <input required type="email" placeholder={dict.blueprint_page.form.email} className="w-full bg-white/[0.03] border border-white/5 p-5 rounded-[2.2rem] outline-none font-black px-8 text-sm text-white placeholder:text-slate-600" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                               <input required type="tel" placeholder={dict.blueprint_page.form.phone} className="w-full bg-white/[0.03] border border-white/5 p-5 rounded-[2.2rem] outline-none font-black px-8 text-sm text-white placeholder:text-slate-600" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                               <select required className="w-full bg-[#030612] border border-white/10 p-5 rounded-[2.2rem] text-[9px] font-black uppercase tracking-[0.1em] outline-none focus:border-[#38bdf8]/40 text-slate-500 cursor-pointer shadow-xl appearance-none text-center" value={formData.teamSize} onChange={(e) => setFormData({...formData, teamSize: e.target.value})}>
                                  <option value="" disabled>{dict.blueprint_page.form.sector}</option>
                                  {Object.entries(dict.blueprint_page.sectors).map(([k, v]: any) => (
                                    <option key={k} value={k}>{v}</option>
                                  ))}
                                </select>
                               <select required className="w-full bg-[#030612] border border-white/10 p-5 rounded-[2.2rem] text-[9px] font-black uppercase tracking-[0.1em] outline-none focus:border-[#38bdf8]/40 text-slate-500 cursor-pointer shadow-xl appearance-none text-center" value={formData.challenge} onChange={(e) => setFormData({...formData, challenge: e.target.value})}>
                                  <option value="" disabled>{dict.blueprint_page.form.priority}</option>
                                  {Object.entries(dict.blueprint_page.priorities).map(([k, v]: any) => (
                                    <option key={k} value={k}>{v}</option>
                                  ))}
                               </select>
                               <select required className="w-full bg-[#030612] border border-white/10 p-5 rounded-[2.2rem] text-[9px] font-black uppercase tracking-[0.1em] outline-none focus:border-[#38bdf8]/40 text-slate-500 cursor-pointer shadow-xl appearance-none text-center" value={formData.budget} onChange={(e) => setFormData({...formData, budget: e.target.value})}>
                                  <option value="" disabled>{dict.blueprint_page.form.budget}</option>
                                  {dict.blueprint_page.budget_options.map((opt: any) => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                  ))}
                                </select>
                            </div>
                            <motion.button whileHover={{ scale: 1.02, boxShadow: "0 0 60px rgba(56,189,248,0.5)" }} whileTap={{ scale: 0.98 }} type="submit" className="w-full py-7 bg-[#38bdf8] text-black font-black uppercase text-base tracking-[0.7em] transition-all duration-700 flex items-center justify-center gap-6 mt-4 rounded-[2.5rem] group relative shadow-2xl">
                               <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 skew-x-12" />
                               {dict.blueprint_page.form.button} <ArrowRight size={28} className="group-hover:translate-x-4 transition-transform duration-500" />
                            </motion.button>
                         </form>
                      </motion.div>
                    ) : step === 'processing' ? (
                      <motion.div key="processing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-24 text-center space-y-16 flex flex-col items-center justify-center relative z-20">
                         <div className="relative w-48 h-48">
                            <div className="absolute inset-0 border-[14px] border-[#38bdf8]/5 rounded-full" />
                            <div className="absolute inset-0 border-[14px] border-t-[#38bdf8] rounded-full animate-spin shadow-[0_0_60px_rgba(56,189,248,0.5)]" />
                            <Cpu className="absolute inset-0 m-auto text-[#38bdf8] animate-pulse" size={64} />
                         </div>
                         <p className="text-[#38bdf8] text-[20px] font-black uppercase tracking-[1.6em] animate-pulse">{dict.blueprint_page.processing} {progress}%</p>
                      </motion.div>
                    ) : (
                      <motion.div key="success" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="py-20 text-center space-y-16 relative z-20">
                         <div className="w-48 h-48 bg-gradient-to-br from-[#38bdf8] to-[#c084fc] rounded-[4.5rem] mx-auto flex items-center justify-center text-black shadow-massive animate-pulse"><CheckCircle2 size={100} strokeWidth={2.5} /></div>
                         <h3 className="text-8xl font-black text-white tracking-tighter uppercase leading-none">{dict.blueprint_page.success.title.split(' ')[0]} <br/><span className="text-[#38bdf8]">{dict.blueprint_page.success.title.split(' ')[1]}</span></h3>
                         <motion.a whileHover={{ x: 20 }} href="/pdf/zyndrix-blueprint-2026.pdf" download className="flex items-center justify-between bg-white text-black px-16 py-8 font-black uppercase text-[16px] tracking-[0.6em] hover:bg-[#38bdf8] transition-all rounded-[3.5rem] shadow-heavy">{dict.blueprint_page.success.button} <Download size={36} /></motion.a>
                      </motion.div>
                    )}
                 </AnimatePresence>
              </div>
           </div>
        </div>
      </main>

      <footer className="py-24 text-center border-t border-white/5 opacity-50"><p className="text-[13px] font-black text-slate-600 tracking-[3em] uppercase">ZYNDRIX • ARQUITECTURA DE AUTONOMÍA</p></footer>
      <style jsx>{`
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin-slow 12s linear infinite; }
      `}</style>
    </div>
  );
}
