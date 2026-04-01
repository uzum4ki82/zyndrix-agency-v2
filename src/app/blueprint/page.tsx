"use client";

import React, { useState } from 'react';
import Image from "next/image";
import { Background } from "@/components/common/Background";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle2, ArrowRight, ShieldCheck, Download, 
  Target, Cpu, Zap, Loader2, Award, ChevronRight
} from "lucide-react";

/**
 * ZYNDRIX LEAD MAGNET V12: "BRAND UNIFY"
 * - Sincronización total con la paleta oficial (globals.css).
 * - Background: #030712 (Deep Obsidian).
 * - Primario: #38bdf8 (Sky Blue).
 * - Secundario: #818cf8 (Indigo).
 * - Glassmorphism Premium: Blur 20px, Saturated.
 */

export default function BlueprintPageV12() {
  const [formData, setFormData] = useState({ name: '', email: '', company: '', teamSize: '', challenge: '' });
  const [step, setStep] = useState<'idle' | 'processing' | 'success'>('idle');
  const [progress, setProgress] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep('processing');
    
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setStep('success'), 400);
          return 100;
        }
        return prev + 20;
      });
    }, 50);

    try {
      await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name, 
          email: formData.email, 
          company_name: formData.company,
          message: `V12 BRAND - Team: ${formData.teamSize}, Challenge: ${formData.challenge}`,
          service: 'Blueprint V12 Final'
        })
      });
    } catch (error) { console.error(error); }
  };

  return (
    <div className="relative min-h-screen text-slate-200 bg-[#030712] overflow-x-hidden font-sans selection:bg-[#38bdf8] selection:text-black">
      {/* INTEGRACIÓN DE DISEÑO ZYNDRIX */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=Inter:wght@400;700;900&family=Space+Grotesk:wght@700&display=swap');
        
        :root {
          --zyndrix-base: #030712;
          --zyndrix-primary: #38bdf8;
          --zyndrix-secondary: #818cf8;
        }

        .font-legacy { font-family: 'Playfair Display', serif; }
        .font-heading { font-family: 'Space Grotesk', sans-serif; }
        .font-sans { font-family: 'Inter', sans-serif; }
        
        .glass-zyndrix {
          background: rgba(15, 23, 42, 0.4);
          backdrop-filter: blur(20px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.05);
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.8);
        }

        .input-zyndrix {
          width: 100%;
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid rgba(56, 189, 248, 0.1);
          padding: 0.9rem 1.25rem;
          font-size: 0.85rem;
          color: white;
          transition: all 0.3s ease;
          border-radius: 0.5rem;
        }
        .input-zyndrix:focus {
          outline: none;
          border-color: var(--zyndrix-primary);
          box-shadow: 0 0 20px rgba(56, 189, 248, 0.05);
        }
        
        .text-gradient-zyndrix {
          background: linear-gradient(135deg, var(--zyndrix-primary) 0%, var(--zyndrix-secondary) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        @keyframes float-subtle {
          0%, 100% { transform: translateY(0) rotate(1deg); }
          50% { transform: translateY(-10px) rotate(2deg); }
        }
        .animate-float-subtle { animation: float-subtle 8s ease-in-out infinite; }
      `}</style>

      <Background />
      
      {/* 1. HEADER: BRAND UNIFIED */}
      <header className="py-4 border-b border-white/5 bg-[#030712]/80 sticky top-0 z-50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-8 flex justify-between items-center">
          <Image 
            src="/img/zyndrix-live.png" 
            alt="Zyndrix" 
            width={240} 
            height={70} 
            className="h-16 sm:h-20 w-auto object-contain brightness-110"
            priority
          />
          <div className="hidden lg:flex items-center gap-8">
             <div className="text-right">
                <p className="text-[8px] font-black tracking-[0.4em] text-slate-500 uppercase mb-0.5">ESTABLISHED 2024</p>
                <div className="flex items-center gap-2">
                   <div className="h-1 w-1 rounded-full bg-primary animate-pulse" />
                   <p className="text-[10px] font-bold text-white tracking-widest uppercase italic font-legacy">Consultoría Sénior</p>
                </div>
             </div>
             <div className="h-8 w-px bg-white/5" />
             <div className="flex items-center gap-3 bg-[#38bdf8]/5 px-4 py-2 rounded-lg border border-[#38bdf8]/10">
                <ShieldCheck size={16} className="text-[#38bdf8]" />
                <span className="text-[9px] font-black uppercase tracking-widest text-[#38bdf8]/80">Official Asset</span>
             </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 pb-12 pt-6 relative z-10">
        
        {/* HERO ESTRUCTURA ZYNDRIX */}
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8 items-start">
          
          <div className="space-y-6 pt-4">
            <div className="space-y-4">
               <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/5 text-slate-500 text-[8px] font-black uppercase tracking-[0.5em]">
                 <Award size={10} /> RECURSO ESTRATÉGICO OFICIAL
               </div>

               <h1 className="text-5xl md:text-6xl lg:text-7xl font-legacy leading-none tracking-tight text-white italic">
                 La Estructura <br /> 
                 <span className="text-gradient-zyndrix not-italic font-heading">de la</span> <br />
                 Autonomía.
               </h1>

               <p className="text-lg text-slate-400 leading-relaxed max-w-sm font-medium border-l border-[#38bdf8]/20 pl-6">
                 Documento maestro de ingeniería para CEOs que exigen <span className="text-white italic">eficiencia absoluta</span>.
               </p>
            </div>

            {/* PRODUCT MOCKUP: ZYNDRIX STYLE */}
            <div className="relative group max-w-[280px]">
               <div className="absolute -inset-16 bg-[#38bdf8]/20 blur-[100px] rounded-full opacity-10 group-hover:opacity-20 transition-all duration-1000" />
               <div className="relative rounded-lg overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.9)] border border-white/5 animate-float-subtle transform rotate-1">
                  <Image 
                    src="/img/blueprint-cover.png" 
                    alt="Blueprint" 
                    width={320} 
                    height={400} 
                    className="w-full h-auto object-cover brightness-105"
                  />
                  {/* Glare effect */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />
               </div>
            </div>
          </div>

          {/* FORMULARIO ZYNDRIX: BRAND COLORS */}
          <div className="sticky top-24 z-20">
            <div className="glass-zyndrix rounded-[2rem] p-0.5 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-[#818cf8]/10 blur-[60px]" />
               <div className="bg-[#030712]/95 rounded-[1.9rem] p-10 relative z-10">
                 
                 <AnimatePresence mode="wait">
                    {step === 'idle' ? (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                         <div className="space-y-2 text-center">
                            <h2 className="text-3xl font-legacy text-white italic leading-tight uppercase tracking-tighter">Solicitar Auditoría</h2>
                            <p className="text-[9px] font-black text-slate-500 tracking-[0.4em] uppercase">Documentación Técnica v2.4</p>
                            <div className="h-0.5 w-12 bg-gradient-to-r from-[#38bdf8] to-[#818cf8] mx-auto rounded-full" />
                         </div>

                         <form onSubmit={handleSubmit} className="space-y-3">
                            <div className="space-y-3">
                               <input required type="text" placeholder="Nombre Completo" className="input-zyndrix" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                               <input required type="email" placeholder="Email Corporativo" className="input-zyndrix" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                               <input required type="text" placeholder="Entidad / Organización" className="input-zyndrix" value={formData.company} onChange={(e) => setFormData({...formData, company: e.target.value})} />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-3">
                               <select required className="input-zyndrix text-[8px] uppercase font-black tracking-widest bg-[#0f172a] appearance-none" value={formData.teamSize} onChange={(e) => setFormData({...formData, teamSize: e.target.value})}>
                                  <option value="" disabled>Equipo</option>
                                  <option value="1-10">1-10 Pax</option>
                                  <option value="10-50">10-50 Pax</option>
                                  <option value="50+">50+ Corp</option>
                               </select>
                               <select required className="input-zyndrix text-[8px] uppercase font-black tracking-widest bg-[#0f172a] appearance-none" value={formData.challenge} onChange={(e) => setFormData({...formData, challenge: e.target.value})}>
                                  <option value="" disabled>Prioridad</option>
                                  <option value="leads">Ventas</option>
                                  <option value="ops">Ops IA</option>
                                  <option value="ia">Escalar</option>
                               </select>
                            </div>

                            <button type="submit" className="w-full py-4.5 bg-white text-black font-black uppercase text-[10px] tracking-[0.4em] hover:bg-[#38bdf8] transition-all duration-500 flex items-center justify-center gap-3 mt-4 group h-14">
                               DESCARGAR BLUEPRINT <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                         </form>

                         <div className="pt-6 border-t border-white/5 flex flex-col items-center text-center space-y-3 opacity-60 grayscale hover:grayscale-0 transition-all duration-1000">
                            <div className="flex -space-x-1.5">
                               {[1,2,3].map(i => (
                                 <div key={i} className="w-6 h-6 rounded-full border border-black bg-slate-800 overflow-hidden ring-1 ring-white/10 text-[6px] flex items-center justify-center font-bold text-slate-500">
                                    <Image src={`/img/user-${i}.png`} alt="Client" width={24} height={24} className="w-full h-full object-cover" />
                                 </div>
                               ))}
                               <div className="w-6 h-6 rounded-full border border-black bg-slate-900 overflow-hidden ring-1 ring-white/10 flex items-center justify-center text-[7px] font-black text-primary italic">
                                  +
                               </div>
                            </div>
                            <p className="text-[7px] text-slate-500 font-bold uppercase tracking-widest leading-none italic italic">Sincronización de Procesos Zyndrix ©</p>
                         </div>
                      </motion.div>
                    ) : step === 'processing' ? (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-24 text-center space-y-8">
                         <div className="relative w-16 h-16 mx-auto">
                            <div className="absolute inset-0 border border-white/5 rounded-full" />
                            <svg className="absolute inset-0 rotate-[-90deg] w-full h-full" viewBox="0 0 100 100">
                               <circle cx="50" cy="50" r="48" fill="none" stroke="#38bdf8" strokeWidth="4" strokeDasharray="301" strokeDashoffset={301 - (3.01 * progress)} className="transition-all duration-300 ease-out" />
                            </svg>
                            <Loader2 className="animate-spin text-[#38bdf8] absolute inset-0 m-auto" size={20} />
                         </div>
                         <div className="space-y-1">
                            <p className="text-white text-[9px] font-black uppercase tracking-[0.4em]">Auditando...</p>
                            <p className="text-[#38bdf8] text-[8px] font-bold tracking-[0.2em]">{progress}%</p>
                         </div>
                      </motion.div>
                    ) : (
                      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="py-16 text-center space-y-8">
                         {/* Elite Success Visual */}
                         <div className="relative w-24 h-24 mx-auto mb-10">
                            <motion.div 
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring", damping: 10 }}
                              className="absolute inset-0 bg-[#38bdf8] rounded-[32px] blur-2xl opacity-20"
                            />
                            <div className="relative w-full h-full bg-[#030712] rounded-[32px] border border-[#38bdf8]/30 flex items-center justify-center text-[#38bdf8] shadow-2xl shadow-black">
                               <motion.div 
                                 initial={{ pathLength: 0, opacity: 0 }}
                                 animate={{ pathLength: 1, opacity: 1 }}
                                 transition={{ duration: 0.8, delay: 0.2 }}
                               >
                                  <CheckCircle2 size={42} strokeWidth={1.5} />
                               </motion.div>
                               
                               {/* Rotating light ray */}
                               <motion.div 
                                 animate={{ rotate: 360 }}
                                 transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                                 className="absolute inset-0 border-t-2 border-r-2 border-[#38bdf8]/20 rounded-[32px]"
                               />
                            </div>
                         </div>

                         <div className="space-y-3">
                            <div className="text-[8px] font-black text-[#38bdf8] tracking-[0.6em] uppercase">Vínculo Seguro Establecido</div>
                            <h3 className="text-3xl font-legacy text-white italic tracking-tighter uppercase leading-none">Acceso Validado</h3>
                            <p className="text-slate-500 text-[9px] font-black uppercase tracking-[0.3em] leading-relaxed max-w-[220px] mx-auto">Su blueprint de ingeniería ya está disponible para revisión técnica.</p>
                         </div>

                         <div className="pt-4">
                            <a 
                              href="/pdf/zyndrix-blueprint-2026.pdf" 
                              download 
                              className="w-full inline-flex items-center justify-center gap-3 bg-white text-black px-10 py-5 font-black uppercase text-[11px] tracking-[0.4em] hover:bg-[#38bdf8] transition-all duration-500 shadow-2xl shadow-[#38bdf8]/10 group overflow-hidden relative"
                            >
                              <div className="relative z-10 flex items-center gap-3">
                                DESCARGAR AHORA <Download size={20} className="group-hover:translate-y-0.5 transition-transform" />
                              </div>
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#38bdf8]/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                            </a>
                         </div>

                         <div className="flex items-center justify-center gap-2 opacity-30 mt-6 group cursor-default">
                           <div className="h-0.5 w-4 bg-slate-700" />
                           <span className="text-[7px] font-bold text-slate-500 uppercase tracking-[0.2em] group-hover:text-[#38bdf8] transition-colors">Zyndrix Strategic Asset</span>
                           <div className="h-0.5 w-4 bg-slate-700" />
                         </div>
                      </motion.div>
                    )}
                 </AnimatePresence>
               </div>
            </div>
          </div>
        </div>

        {/* 2. SUCCESS REPLICA: ARQUITECTURA DEL ÉXITO (BENTO GRID) */}
        <section className="mt-40 mb-20">
           <div className="text-center mb-16 space-y-3">
              <h2 className="text-4xl md:text-5xl font-legacy text-white italic leading-none uppercase tracking-tighter">Arquitectura de la Réplica</h2>
              <p className="text-[9px] font-black text-slate-500 tracking-[0.5em] uppercase">Ecosistema Autónomo Zyndrix v2.0</p>
              <div className="h-0.5 w-16 bg-gradient-to-r from-[#38bdf8] to-[#818cf8] mx-auto rounded-full" />
           </div>

           <div className="grid grid-cols-1 md:grid-cols-6 gap-6 auto-rows-[280px]">
              {/* Card 1: Core Engine */}
              <div className="col-span-1 md:col-span-3 glass-zyndrix rounded-[2.5rem] p-10 flex flex-col justify-between group overflow-hidden relative">
                 <div className="absolute -right-20 -top-20 w-64 h-64 bg-[#38bdf8]/5 rounded-full blur-[80px] group-hover:bg-[#38bdf8]/10 transition-all duration-1000" />
                 <div className="relative z-10">
                    <div className="w-12 h-12 rounded-xl bg-[#38bdf8]/10 border border-[#38bdf8]/20 flex items-center justify-center mb-8 text-[#38bdf8]">
                       <Cpu size={24} />
                    </div>
                    <h3 className="text-2xl font-legacy text-white italic mb-4">Córtex Operacional</h3>
                    <p className="text-sm text-slate-400 font-medium leading-relaxed max-w-xs italic opacity-80">Orquestación de modelos LLM propietarios con memoria persistente para toma de decisiones autónoma.</p>
                 </div>
                 <div className="flex items-center gap-2 text-[8px] font-black uppercase tracking-[0.3em] text-[#38bdf8]/40 mt-4 group-hover:text-[#38bdf8] transition-colors">
                    LATENCIA <span className="text-white">&lt;0.5ms</span> <span className="mx-2">•</span> ENTRÓPICA <span className="text-white">OPTIMIZADA</span>
                 </div>
              </div>

              {/* Card 2: Lead Scoring (The "Qualification" key) */}
              <div className="col-span-1 md:col-span-3 glass-zyndrix rounded-[2.5rem] p-10 flex flex-col justify-between group relative border-white/10">
                 <div className="absolute inset-0 bg-gradient-to-br from-transparent via-[#818cf8]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                 <div className="relative z-10">
                    <div className="w-12 h-12 rounded-xl bg-[#818cf8]/10 border border-[#818cf8]/20 flex items-center justify-center mb-8 text-[#818cf8]">
                       <Target size={24} />
                    </div>
                    <h3 className="text-2xl font-legacy text-white italic mb-4">Ingeniería de Captación</h3>
                    <p className="text-sm text-slate-400 font-medium leading-relaxed max-w-xs italic opacity-80">Sistemas de cualificación de alta intensidad que ejecutan scoring en tiempo real para maximizar el ROI comercial.</p>
                 </div>
                 <div className="flex justify-between items-end relative z-10">
                    <div className="flex gap-1">
                       {[1,2,3,4,5].map(i => <div key={i} className="h-1 w-4 bg-[#818cf8]/20 rounded-full overflow-hidden"><motion.div animate={{ width: i*20 + "%" }} className="h-full bg-[#818cf8]" transition={{ delay: i*0.1 }} /></div>)}
                    </div>
                    <span className="text-[10px] font-black text-white italic font-legacy">Precision 99%</span>
                 </div>
              </div>

              {/* Card 3: Deep Insights */}
              <div className="col-span-1 md:col-span-2 glass-zyndrix rounded-[2.5rem] p-8 flex flex-col justify-center items-center text-center gap-4 group">
                 <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-500 group-hover:text-[#38bdf8] group-hover:border-[#38bdf8]/30 transition-all">
                    <Zap size={18} />
                 </div>
                 <h4 className="text-xs font-black uppercase tracking-[0.4em] text-white/40 group-hover:text-white transition-colors">Ejecución Reactiva</h4>
                 <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed">Arquitecturas basadas en eventos que reaccionan al mercado en milisegundos.</p>
              </div>

              {/* Card 4: Future Scale (Big Feature) */}
              <div className="col-span-1 md:col-span-4 bg-gradient-to-r from-[#0f172a] to-[#030712] rounded-[2.5rem] border border-white/5 p-10 flex flex-col md:flex-row items-center gap-10 group relative overflow-hidden">
                 <div className="flex-1 space-y-6 relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#38bdf8]/10 rounded-full text-[#38bdf8] text-[8px] font-black uppercase tracking-widest border border-[#38bdf8]/20">
                       <ShieldCheck size={10} /> SECURITY_PROTOCOL_VERIFIED
                    </div>
                    <h3 className="text-3xl font-legacy text-white italic leading-none uppercase">Visión de Escalo <br /> <span className="text-[#38bdf8] not-italic font-heading">Nivel Enterprise</span></h3>
                    <p className="text-xs text-slate-400 font-medium leading-relaxed max-w-sm italic">La réplica no es un documento estático, es la base técnica para un despliegue industrial que soporta más de 1M de operaciones mensuales.</p>
                 </div>
                 <div className="w-40 h-40 relative group-hover:scale-110 transition-transform duration-1000 hidden md:block">
                    <div className="absolute inset-0 bg-[#38bdf8]/20 rounded-full blur-3xl opacity-30 animate-pulse" />
                    <Cpu size={160} className="text-white/5 relative z-10" />
                 </div>
              </div>
           </div>
        </section>

        {/* STATS FINALES: PALETA UNIFICADA */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-3">
           {[
             { t: "EFICIENCIA IA", v: "98.2%", d: "Precisión de respuesta" },
             { t: "PROYECTADO", v: "4.5x", d: "ROI del primer trimestre" },
             { t: "AUTONOMÍA", v: "100%", d: "Flujos desatendidos" },
           ].map((stat, i) => (
             <div key={i} className="bg-white/[0.01] border border-white/5 p-5 rounded-lg text-center space-y-1 hover:bg-[#38bdf8]/5 transition-all group">
                <p className="text-[7px] font-black text-slate-600 tracking-[0.3em] uppercase group-hover:text-[#38bdf8] transition-colors">{stat.t}</p>
                <p className="text-3xl font-legacy italic text-white leading-none">{stat.v}</p>
                <p className="text-[8px] font-bold text-slate-600 tracking-wider opacity-0 group-hover:opacity-100 transition-all duration-500">{stat.d}</p>
             </div>
           ))}
        </div>

      </main>

      <footer className="py-10 px-8 border-t border-white/5 bg-[#030712]">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-6">
          <Image src="/img/zyndrix-live.png" alt="Zyndrix" width={180} height={50} className="h-7 w-auto opacity-10 grayscale" />
          <div className="flex flex-wrap justify-center gap-8 text-[7px] font-black text-slate-800 tracking-[0.5em] uppercase">
             <span>Strategic Consulting</span>
             <span className="w-1 h-1 rounded-full bg-slate-800" />
             <span>Security Protocol</span>
             <span className="w-1 h-1 rounded-full bg-slate-800" />
             <span>Enterprise AI Solutions</span>
          </div>
          <p className="text-[7px] text-slate-900 font-bold tracking-[1em] uppercase">ZYNDRIX AGENCY • EST. 2024</p>
        </div>
      </footer>
    </div>
  );
}
