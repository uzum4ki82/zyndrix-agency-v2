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

      setTimeout(() => {
        setStep('success');
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
    <div className="min-h-screen bg-base text-primary selection:bg-black selection:text-white relative overflow-hidden">
      <div className="arch-grid opacity-20" />
      <NavBar dict={dict.nav} locale={locale} />

      <main className="relative z-10 pt-32 md:pt-48 pb-24 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 md:gap-20 items-start">
          
          {/* Lado Izquierdo: Contexto */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-7 space-y-12"
          >
            <div className="space-y-6">
              <div className="text-[9px] font-black uppercase tracking-[0.5em] text-secondary mb-4 flex items-center gap-4">
                <div className="w-8 h-px bg-primary/10" />
                {dict.auditoria.badge}
              </div>
              <h1 className="text-5xl md:text-8xl font-heading font-black leading-[0.85] tracking-tighter uppercase mb-8">
                {dict.auditoria.title.split('IA')[0]}
                <span className="opacity-20">IA</span>
              </h1>
              <p className="text-lg md:text-xl text-secondary font-medium leading-relaxed max-w-xl border-l border-primary/10 pl-8">
                {dict.auditoria.subtitle}
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              {dict.auditoria.features.map((item: any, idx: number) => {
                const Icon = icons[idx];
                return (
                  <div key={idx} className="bg-white p-8 border border-primary/5 shadow-sm group hover:bg-slate-50 transition-all duration-500 relative overflow-hidden">
                    <div className="relative z-10">
                      <div className="w-10 h-10 bg-slate-100 border border-primary/5 flex items-center justify-center text-primary/40 group-hover:bg-black group-hover:text-white transition-all mb-6">
                        <Icon size={18} strokeWidth={1.5} />
                      </div>
                      <h3 className="text-sm font-black uppercase tracking-widest mb-3">{item.title}</h3>
                      <p className="text-xs text-secondary/60 font-medium leading-relaxed">{item.desc}</p>
                    </div>
                    <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.1] transition-opacity">
                       <Icon size={64} />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-8 border-t border-primary/5">
               <div className="flex gap-12">
                  {[
                    { l: "Protocol", v: "Z-AUDIT-v4" },
                    { l: "Sec Level", v: "MAXIMUM" },
                    { l: "Review", v: "EXECUTIVE" }
                  ].map((x, i) => (
                    <div key={i} className="flex flex-col gap-1">
                       <span className="text-[7px] font-black text-secondary/30 uppercase tracking-widest">{x.l}</span>
                       <span className="text-[10px] font-black text-primary uppercase">{x.v}</span>
                    </div>
                  ))}
               </div>
            </div>
          </motion.div>

          {/* Lado Derecho: Formulario */}
          <div className="lg:col-span-5 relative">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-8 md:p-12 border border-primary/5 shadow-2xl relative"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-primary/5" />
              
              <AnimatePresence mode="wait">
                {step === 'form' ? (
                  <motion.form 
                    key="form"
                    className="space-y-6"
                    onSubmit={handleSubmit}
                  >
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-1">
                           <label className="text-[8px] font-black text-primary/20 uppercase tracking-widest ml-2">ORGANIZATION</label>
                           <input 
                             required
                             type="text" 
                             placeholder={dict.auditoria.form.business}
                             className="bg-slate-50 border border-primary/5 w-full p-5 outline-none focus:bg-white focus:border-primary/20 transition-all text-[13px] font-bold uppercase placeholder:opacity-30"
                             value={formData.businessName}
                             onChange={e => setFormData({...formData, businessName: e.target.value})}
                           />
                        </div>
                        <div className="space-y-1">
                           <label className="text-[8px] font-black text-primary/20 uppercase tracking-widest ml-2">REPRESENTATIVE</label>
                           <input 
                             required
                             type="text" 
                             placeholder={dict.auditoria.form.name}
                             className="bg-slate-50 border border-primary/5 w-full p-5 outline-none focus:bg-white focus:border-primary/20 transition-all text-[13px] font-bold uppercase placeholder:opacity-30"
                             value={formData.personName}
                             onChange={e => setFormData({...formData, personName: e.target.value})}
                           />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input 
                          required
                          type="tel" 
                          placeholder={dict.auditoria.form.phone}
                          className="bg-slate-50 border border-primary/5 w-full p-5 outline-none focus:bg-white focus:border-primary/20 transition-all text-[13px] font-bold uppercase placeholder:opacity-30"
                          value={formData.phone}
                          onChange={e => setFormData({...formData, phone: e.target.value})}
                        />
                        <input 
                          required
                          type="email" 
                          placeholder={dict.auditoria.form.email}
                          className="bg-slate-50 border border-primary/5 w-full p-5 outline-none focus:bg-white focus:border-primary/20 transition-all text-[13px] font-bold uppercase placeholder:opacity-30"
                          value={formData.email}
                          onChange={e => setFormData({...formData, email: e.target.value})}
                        />
                      </div>
                      <input 
                        required
                        type="url" 
                        placeholder={dict.auditoria.form.web}
                        className="bg-slate-50 border border-primary/5 w-full p-5 outline-none focus:bg-white focus:border-primary/20 transition-all text-[13px] font-bold uppercase placeholder:opacity-30"
                        value={formData.website}
                        onChange={e => setFormData({...formData, website: e.target.value})}
                      />
                      <div className="relative">
                         <select 
                           required
                           className="bg-slate-50 border border-primary/5 w-full p-5 outline-none focus:bg-white focus:border-primary/20 transition-all text-[13px] font-bold uppercase appearance-none"
                           value={formData.budget}
                           onChange={e => setFormData({...formData, budget: e.target.value})}
                         >
                            <option value="" disabled>{dict.auditoria.form.budget}</option>
                            {dict.auditoria.budget_options.map((opt: any) => (
                              <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                         </select>
                         <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none opacity-20">
                            <Activity size={12} />
                         </div>
                      </div>
                      <textarea 
                        required
                        rows={3}
                        placeholder={dict.auditoria.form.problem}
                        className="bg-slate-50 border border-primary/5 w-full p-6 outline-none focus:bg-white focus:border-primary/20 transition-all text-[13px] font-bold uppercase placeholder:opacity-30 resize-none"
                        value={formData.problem}
                        onChange={e => setFormData({...formData, problem: e.target.value})}
                      />
                    </div>

                    <button
                      className="btn-executive w-full h-18 group shadow-xl"
                    >
                      <span className="text-[12px]">{dict.auditoria.form.button}</span>
                      <ArrowRight size={20} className="group-hover:translate-x-3 transition-transform duration-700" />
                    </button>
                    
                    <p className="text-center text-[10px] text-secondary/30 font-black uppercase tracking-[0.2em]">
                      {dict.auditoria.form.footer}
                    </p>
                  </motion.form>
                ) : step === 'processing' ? (
                  <motion.div 
                    key="processing"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="py-16 text-center space-y-10"
                  >
                    <div className="relative w-32 h-32 mx-auto">
                      <div className="absolute inset-0 border-[8px] border-primary/5 rounded-full" />
                      <div className="absolute inset-0 border-[8px] border-t-primary rounded-full animate-spin" />
                      <Activity className="absolute inset-0 m-auto text-primary animate-pulse" size={40} />
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-2xl font-black uppercase tracking-tighter">{dict.auditoria.processing}</h3>
                      <div className="flex items-center justify-center gap-4">
                         <div className="w-24 h-0.5 bg-primary/5 relative overflow-hidden">
                            <motion.div className="absolute inset-0 bg-primary" animate={{ x: ['-100%', '100%'] }} transition={{ repeat: Infinity, duration: 1.5 }} />
                         </div>
                         <p className="text-primary font-black text-lg tracking-widest">{progress}%</p>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="py-16 text-center space-y-10"
                  >
                    <div className="w-24 h-24 bg-black text-white rounded-full mx-auto flex items-center justify-center shadow-massive">
                      <CheckCircle2 size={48} strokeWidth={2.5} />
                    </div>
                    <div className="space-y-6">
                      <h2 className="text-4xl md:text-5xl font-heading font-black uppercase tracking-tighter leading-none">
                        {dict.auditoria.success.title}
                      </h2>
                      <p className="text-secondary font-medium px-4">
                        {dict.auditoria.success.desc}
                      </p>
                      <div className="flex justify-center gap-2">
                         <div className="w-2 h-2 bg-primary animate-bounce delay-0" />
                         <div className="w-2 h-2 bg-primary animate-bounce delay-75" />
                         <div className="w-2 h-2 bg-primary animate-bounce delay-150" />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
            
            <div className="mt-8 flex justify-between items-center opacity-10">
               <div className="text-[10px] font-black uppercase tracking-widest">ENCRYPTED_SSL</div>
               <div className="text-[10px] font-black uppercase tracking-widest">NODE_ZYNDRIX_01</div>
            </div>
          </div>

        </div>
      </main>

      <Footer dict={dict.footer} locale={locale} />
    </div>
  );
}

