'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, ArrowRight, Activity, Users, Globe, ClipboardCheck, Zap
} from 'lucide-react';
import { NavBar } from '@/components/common/NavBar';
import { Footer } from '@/components/common/Footer';

interface AuditoriaClientProps {
  dict: any;
  locale: string;
}

export default function AuditoriaClient({ dict, locale }: AuditoriaClientProps) {
  const [formData, setFormData] = useState({
    businessName: '',
    personName: '',
    phone: '',
    email: '',
    website: '',
    problem: '',
    budget: ''
  });
  const [step, setStep] = useState<'form' | 'processing' | 'success'>('form');
  const [progress, setProgress] = useState(0);
  const calendlyUrl = dict.config?.calendly || 'https://calendly.com/omontesquesada/zyndrix'; 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep('processing');
    
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
          company: formData.businessName,
          phone: formData.phone,
          website: formData.website,
          problem: formData.problem,
          budget: formData.budget,
          locale: locale,
          service: locale === 'es' ? 'Auditoría de Sistemas IA' : 'AI Systems Audit'
        })
      });

      if (!response.ok) throw new Error('API_ERROR');

      // ESPERAR AL PROGRESO ANTES DE MOSTRAR ÉXITO
      setTimeout(() => {
        setStep('success');
        // Redirigir a Calendly después de que el usuario vea el éxito
        setTimeout(() => {
          window.location.href = calendlyUrl;
        }, 3500);
      }, 1500);
    } catch (error) {
      console.error('Error submitting form:', error);
      alert(locale === 'es' ? 'Error al procesar el protocolo. Reintentando...' : 'Error processing protocol. Retrying...');
      setStep('form');
    }
  };

  const icons = [Activity, Globe, Users, ClipboardCheck];

  return (
    <div className="min-h-screen bg-black text-white font-body selection:bg-[#38bdf8] selection:text-black">
      <NavBar dict={dict.nav} locale={locale} />

      <main className="relative z-10 pt-48 md:pt-60 pb-32 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-24 items-start">
          
          {/* Lado Izquierdo: Contexto */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-16"
          >
            <div className="space-y-8">
              <div className="inline-flex items-center gap-4 px-6 py-2 rounded-full bg-white/5 border border-white/10 text-[#38bdf8] text-[10px] font-bold uppercase tracking-[0.6em] backdrop-blur-xl">
                <Activity size={14} className="animate-pulse" /> {dict.auditoria.badge}
              </div>
              <h1 className="text-5xl md:text-8xl font-black leading-[0.9] tracking-tighter uppercase italic">
                {dict.auditoria.title.split('IA')[0]}
                <span className="text-[#38bdf8]">IA</span>
              </h1>
              <p className="text-xl md:text-2xl text-slate-500 font-medium italic leading-relaxed max-w-xl">
                {dict.auditoria.subtitle}
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-8">
              {dict.auditoria.features.map((item: any, idx: number) => {
                const Icon = icons[idx];
                return (
                  <div key={idx} className="glass-premium p-8 rounded-[2.5rem] border border-white/5 space-y-4">
                    <div className="w-12 h-12 bg-[#38bdf8]/10 rounded-2xl flex items-center justify-center text-[#38bdf8]">
                      <Icon size={24} />
                    </div>
                    <h3 className="text-sm font-black uppercase tracking-wider">{item.title}</h3>
                    <p className="text-xs text-slate-500 font-medium italic">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Lado Derecho: Formulario */}
          <div id="contacto" className="relative">
            <div className="absolute inset-0 bg-[#38bdf8]/10 blur-[150px] -z-10 animate-pulse" />
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-premium p-10 md:p-16 rounded-[4rem] border border-white/10 shadow-massive"
            >
              <AnimatePresence mode="wait">
                {step === 'form' ? (
                  <motion.form 
                    key="form"
                    className="space-y-8"
                    onSubmit={handleSubmit}
                  >
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input 
                          required
                          type="text" 
                          placeholder={dict.auditoria.form.business}
                          className="bg-white/5 border border-white/5 w-full p-6 rounded-3xl outline-none focus:border-[#38bdf8]/30 transition-all text-sm font-bold italic"
                          value={formData.businessName}
                          onChange={e => setFormData({...formData, businessName: e.target.value})}
                        />
                        <input 
                          required
                          type="text" 
                          placeholder={dict.auditoria.form.name}
                          className="bg-white/5 border border-white/5 w-full p-6 rounded-3xl outline-none focus:border-[#38bdf8]/30 transition-all text-sm font-bold italic"
                          value={formData.personName}
                          onChange={e => setFormData({...formData, personName: e.target.value})}
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input 
                          required
                          type="tel" 
                          placeholder={dict.auditoria.form.phone}
                          className="bg-white/5 border border-white/5 w-full p-6 rounded-3xl outline-none focus:border-[#38bdf8]/30 transition-all text-sm font-bold italic"
                          value={formData.phone}
                          onChange={e => setFormData({...formData, phone: e.target.value})}
                        />
                        <input 
                          required
                          type="email" 
                          placeholder={dict.auditoria.form.email}
                          className="bg-white/5 border border-white/5 w-full p-6 rounded-3xl outline-none focus:border-[#38bdf8]/30 transition-all text-sm font-bold italic"
                          value={formData.email}
                          onChange={e => setFormData({...formData, email: e.target.value})}
                        />
                      </div>
                      <input 
                        required
                        type="url" 
                        placeholder={dict.auditoria.form.web}
                        className="bg-white/5 border border-white/5 w-full p-6 rounded-3xl outline-none focus:border-[#38bdf8]/30 transition-all text-sm font-bold italic"
                        value={formData.website}
                        onChange={e => setFormData({...formData, website: e.target.value})}
                      />
                      <select 
                        required
                        className="bg-white/5 border border-white/5 w-full p-6 rounded-3xl outline-none focus:border-[#38bdf8]/30 transition-all text-sm font-bold italic appearance-none text-slate-400"
                        value={formData.budget}
                        onChange={e => setFormData({...formData, budget: e.target.value})}
                      >
                         <option value="" disabled>{dict.auditoria.form.budget}</option>
                         {dict.auditoria.budget_options.map((opt: any) => (
                           <option key={opt.value} value={opt.value} className="bg-black text-white">{opt.label}</option>
                         ))}
                      </select>
                      <textarea 
                        required
                        rows={4}
                        placeholder={dict.auditoria.form.problem}
                        className="bg-white/5 border border-white/5 w-full p-8 rounded-[2.5rem] outline-none focus:border-[#38bdf8]/30 transition-all text-sm font-bold italic resize-none"
                        value={formData.problem}
                        onChange={e => setFormData({...formData, problem: e.target.value})}
                      />
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02, boxShadow: '0 0 50px rgba(56,189,248,0.4)' }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-[#38bdf8] text-black py-8 rounded-[2.5rem] font-black uppercase tracking-[0.4em] italic text-base flex items-center justify-center gap-6 shadow-2xl transition-all"
                    >
                      {dict.auditoria.form.button} <ArrowRight size={24} />
                    </motion.button>
                    
                    <p className="text-center text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">
                      {dict.auditoria.form.footer}
                    </p>
                  </motion.form>
                ) : step === 'processing' ? (
                  <motion.div 
                    key="processing"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="py-20 text-center space-y-12"
                  >
                    <div className="relative w-40 h-40 mx-auto">
                      <div className="absolute inset-0 border-[10px] border-[#38bdf8]/10 rounded-full" />
                      <div className="absolute inset-0 border-[10px] border-t-[#38bdf8] rounded-full animate-spin" />
                      <Zap className="absolute inset-0 m-auto text-[#38bdf8] animate-pulse" size={48} />
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-3xl font-black uppercase italic tracking-tighter">{dict.auditoria.processing}</h3>
                      <p className="text-[#38bdf8] font-black text-xl italic tracking-[0.5em]">{progress}%</p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="py-12 md:py-20 text-center space-y-12"
                  >
                    <div className="w-40 h-40 bg-[#38bdf8] rounded-[3rem] mx-auto flex items-center justify-center text-black shadow-massive animate-pulse">
                      <CheckCircle2 size={70} strokeWidth={3} />
                    </div>
                    <div className="space-y-6">
                      <h2 className="text-5xl md:text-6xl font-black uppercase italic italic tracking-tighter leading-none">
                        {dict.auditoria.success.title.split(' ')[0]} <br />
                        <span className="text-[#38bdf8]">{dict.auditoria.success.title.split(' ')[1]}</span>
                      </h2>
                      <p className="text-slate-400 font-medium italic px-4">
                        {dict.auditoria.success.desc}
                      </p>
                      <div className="pt-8">
                         <div className="w-1.5 h-1.5 bg-[#38bdf8] rounded-full mx-auto animate-ping" />
                       </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

        </div>
      </main>

      <Footer dict={dict.footer} locale={locale} />
    </div>
  );
}
