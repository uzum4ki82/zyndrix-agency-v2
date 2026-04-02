'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, ArrowRight, ShieldCheck, 
  Cpu, Activity, Users, Send, Globe, MessageSquare, ClipboardCheck,
  Zap, Loader2
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';

export default function AuditoriaPage() {
  const [formData, setFormData] = useState({
    businessName: '',
    personName: '',
    phone: '',
    email: '',
    website: '',
    problem: ''
  });
  const [step, setStep] = useState<'form' | 'processing' | 'success'>('form');
  const [progress, setProgress] = useState(0);

  const CALENDLY_URL = 'https://calendly.com/zyndrix/auditoria'; // Adjust if a specific link exists

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep('processing');
    
    // Fake progress bar
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 50);

    try {
      const response = await fetch('/api/audit-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },

        body: JSON.stringify({
          name: formData.personName,
          email: formData.email,
          phone: formData.phone,
          company: formData.businessName,
          website: formData.website,
          problem: formData.problem,
          message: `AUDITORÍA SOLICITADA. Web: ${formData.website}. Problema: ${formData.problem}`,
          service: 'Auditoría IA',
          source: 'Landing Page Auditoria'
        })
      });

      if (response.ok) {
        setTimeout(() => {
          setStep('success');
          // Redirect to Calendly after 2 seconds
          setTimeout(() => {
            window.location.href = CALENDLY_URL;
          }, 2500);
        }, 1500);
      } else {
        throw new Error('Error al enviar el formulario');
      }
    } catch (error) {
      console.error(error);
      setStep('form');
      alert('Hubo un error al procesar tu solicitud. Por favor, inténtalo de nuevo.');
    }
  };

  return (
    <div className="relative min-h-screen text-slate-300 overflow-x-hidden font-sans selection:bg-[#38bdf8] selection:text-black bg-[#030610]">
      {/* Dark Grid Background */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-10">
        <div className="absolute inset-0" style={{ backgroundImage: `linear-gradient(to right, rgba(56, 189, 248, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(56, 189, 248, 0.05) 1px, transparent 1px)`, backgroundSize: '60px 60px' }} />
      </div>

      <nav className="w-full border-b border-white/5 bg-[#030610]/95 sticky top-0 z-[100] backdrop-blur-4xl px-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center h-24 md:h-[120px]">
          <a href="/" className="transition-transform active:scale-95">
             <Image 
                src="/img/zyndrix-ultimate.png" 
                alt="Zyndrix" 
                width={320} 
                height={120} 
                priority={true}
                className="h-16 md:h-[120px] w-auto object-contain brightness-110 drop-shadow-[0_0_30px_rgba(56,189,248,0.2)]"
             />
          </a>
          <div className="hidden lg:flex items-center gap-12">
            {['Servicios', 'Casos', 'Proceso'].map((item) => (
              <a key={item} href={`/#${item.toLowerCase()}`} className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 hover:text-[#38bdf8] transition-all">{item}</a>
            ))}
            <div className="w-1 h-1 rounded-full bg-white/20" />
            <a href="/auditoria" className="text-[10px] font-black uppercase tracking-[0.3em] text-[#38bdf8] border-b-2 border-[#38bdf8]/30 pb-1">Auditoría</a>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden xl:flex items-center gap-3 bg-white/5 px-6 py-2 rounded-full border border-white/10 backdrop-blur-xl">
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]" />
               <span className="text-[9px] font-black uppercase tracking-[0.5em] text-emerald-500/80">CORE: ACTIVE</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-[1200px] mx-auto px-8 pt-20 pb-32 relative z-10">
        <div className="grid lg:grid-cols-2 gap-20 items-start">
          
          {/* Text Content */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-12"
          >
            <div className="inline-flex items-center gap-4 px-6 py-2 rounded-full bg-white/[0.03] border border-white/10 text-[#38bdf8] text-[10px] font-bold uppercase tracking-[0.8em] backdrop-blur-xl">
              <Activity size={14} className="animate-pulse" /> Auditoría de Sistemas IA
            </div>
            
            <div className="space-y-6">
              <h1 className="text-6xl md:text-8xl font-black leading-tight tracking-tighter text-white uppercase italic" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
                Escala tu <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#38bdf8] to-[#818cf8]">Operativa.</span>
              </h1>
              <p className="text-xl md:text-2xl text-slate-500 max-w-lg font-medium leading-relaxed">
                Analizamos tu negocio para detectar puntos de fuga y oportunidades de automatización de élite.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-8 pt-8 border-t border-white/5">
              <div className="space-y-2">
                <div className="text-[#38bdf8] font-black text-4xl">15+</div>
                <div className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600">Puntos de control</div>
              </div>
              <div className="space-y-2">
                <div className="text-white font-black text-4xl">48h</div>
                <div className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600">Respuesta promedio</div>
              </div>
            </div>

            <div className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20">
                  <ShieldCheck size={20} />
                </div>
                <div className="text-[11px] font-black uppercase tracking-[0.3em] text-white">Confidencialidad Garantizada</div>
              </div>
              <p className="text-xs text-slate-500">Sus datos están protegidos por cifrado de extremo a extremo y protocolos de seguridad de grado militar.</p>
            </div>
          </motion.div>

          {/* Form Content */}
          <div className="relative">
            <div className="absolute inset-0 bg-[#38bdf8]/10 rounded-[3.5rem] blur-[100px] pointer-events-none" />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative p-12 bg-[#030610]/80 border border-white/10 rounded-[3.5rem] backdrop-blur-4xl shadow-massive overflow-hidden"
            >
              <AnimatePresence mode="wait">
                {step === 'form' ? (
                  <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-10">
                    <div className="space-y-2">
                      <h3 className="text-4xl font-black text-white italic tracking-tighter uppercase">Protocolo de Acceso</h3>
                      <p className="text-xs font-medium text-slate-600 uppercase tracking-[0.3em]">Completa los campos para iniciar el escaneo</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em] ml-4">Nombre Negocio</label>
                          <input 
                            required 
                            type="text" 
                            name="businessName"
                            placeholder="Empresa S.L." 
                            className="w-full bg-white/[0.03] border border-white/10 p-5 rounded-[1.8rem] outline-none focus:border-[#38bdf8]/40 text-sm text-white placeholder:text-slate-700 font-bold px-8 transition-all"
                            value={formData.businessName}
                            onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em] ml-4">Nombre Persona</label>
                          <input 
                            required 
                            type="text" 
                            name="personName"
                            placeholder="John Doe" 
                            className="w-full bg-white/[0.03] border border-white/10 p-5 rounded-[1.8rem] outline-none focus:border-[#38bdf8]/40 text-sm text-white placeholder:text-slate-700 font-bold px-8 transition-all"
                            value={formData.personName}
                            onChange={(e) => setFormData({...formData, personName: e.target.value})}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em] ml-4">Teléfono</label>
                          <input 
                            required 
                            type="tel" 
                            name="phone"
                            placeholder="+34 600 000 000" 
                            className="w-full bg-white/[0.03] border border-white/10 p-5 rounded-[1.8rem] outline-none focus:border-[#38bdf8]/40 text-sm text-white placeholder:text-slate-700 font-bold px-8 transition-all"
                            value={formData.phone}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em] ml-4">Email</label>
                          <input 
                            required 
                            type="email" 
                            name="email"
                            placeholder="ejemplo@web.com" 
                            className="w-full bg-white/[0.03] border border-white/10 p-5 rounded-[1.8rem] outline-none focus:border-[#38bdf8]/40 text-sm text-white placeholder:text-slate-700 font-bold px-8 transition-all"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em] ml-4">Web</label>
                        <input 
                          required 
                          type="url" 
                          name="website"
                          placeholder="https://www.tuweb.com" 
                          className="w-full bg-white/[0.03] border border-white/10 p-5 rounded-[1.8rem] outline-none focus:border-[#38bdf8]/40 text-sm text-white placeholder:text-slate-700 font-bold px-8 transition-all"
                          value={formData.website}
                          onChange={(e) => setFormData({...formData, website: e.target.value})}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em] ml-4">Problema Principal</label>
                        <select 
                          required 
                          name="problem"
                          className="w-full bg-[#030612] border border-white/10 p-5 rounded-[1.8rem] text-xs font-black uppercase tracking-[0.2em] outline-none focus:border-[#38bdf8]/40 text-slate-500 cursor-pointer appearance-none px-8 shadow-xl"
                          value={formData.problem}
                          onChange={(e) => setFormData({...formData, problem: e.target.value})}
                        >

                          <option value="" disabled>Selecciona una opción</option>
                          <option value="No tengo web">No tengo web</option>
                          <option value="No tengo clientes">No tengo clientes</option>
                          <option value="Pierdo clientes">Pierdo clientes</option>
                          <option value="Quiero automatizar">Quiero automatizar</option>
                          <option value="Otro">Otro</option>
                        </select>
                      </div>

                      <motion.button 
                        whileHover={{ scale: 1.02, boxShadow: "0 0 40px rgba(56,189,248,0.3)" }}
                        whileTap={{ scale: 0.98 }}
                        type="submit" 
                        className="w-full py-6 bg-white text-black font-black uppercase text-[11px] tracking-[0.5em] transition-all flex items-center justify-center gap-4 mt-6 rounded-[1.8rem] shadow-massive"
                      >
                        RECLAMAR AUDITORÍA <Send size={18} />
                      </motion.button>
                    </form>
                  </motion.div>
                ) : step === 'processing' ? (
                  <motion.div key="processing" className="py-24 flex flex-col items-center justify-center space-y-12 text-center">
                    <div className="relative w-32 h-32">
                      <div className="absolute inset-0 border-8 border-white/5 rounded-full" />
                      <div className="absolute inset-0 border-8 border-t-[#38bdf8] rounded-full animate-spin shadow-[0_0_30px_rgba(56,189,248,0.4)]" />
                      <Cpu className="absolute inset-0 m-auto text-[#38bdf8] animate-pulse" size={40} />
                    </div>
                    <div className="space-y-2">
                      <p className="text-[#38bdf8] text-sm font-black uppercase tracking-[1em] animate-pulse italic">Escaneando Infraestructura</p>
                      <p className="text-4xl text-white font-black tracking-tighter">{progress}%</p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="py-24 text-center space-y-12">
                    <div className="w-32 h-32 bg-emerald-500/10 border border-emerald-500/30 rounded-[2.5rem] mx-auto flex items-center justify-center text-emerald-500 shadow-glow-sm animate-bounce"><CheckCircle2 size={60} /></div>
                    <div className="space-y-4">
                      <h3 className="text-5xl font-black text-white italic tracking-tighter uppercase leading-none">DATOS <br/><span className="text-[#38bdf8]">ENVIADOS</span></h3>
                      <p className="text-sm font-medium text-slate-500">Redirigiendo a Calendly para agendar tu sesión...</p>
                    </div>
                    <div className="pt-8">
                       <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 2 }}
                            className="h-full bg-emerald-500"
                          />
                       </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

        </div>
      </main>

      <footer className="py-20 text-center border-t border-white/5 opacity-40">
        <p className="text-[10px] font-black text-slate-600 tracking-[2em] uppercase">ZYNDRIX • PROTOCOLO DE EXCELENCIA</p>
      </footer>
    </div>
  );
}
