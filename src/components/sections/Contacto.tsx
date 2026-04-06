'use client';

import { useState } from 'react';
import { Send, Twitter, Linkedin, Facebook, Instagram, Share2, ShieldCheck, FileText, Lock, Loader2, Globe, Cpu, Database } from 'lucide-react';
import Link from 'next/link';
import { Activity } from 'lucide-react';

export const Contacto = ({ dict, locale }: { dict: any, locale: string }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        company: '',
        phone: '',
        budget: '',
        message: '',
        hp: '' // Honeypot field
    });
    
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        // 1. HONEYPOT VALIDATION (Anti-Spam)
        if (formData.hp) {
            console.warn('Bot detected via honeypot');
            setIsSuccess(true); // Engañar al bot
            return;
        }

        // 2. EMAIL FORMAT VALIDATION
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
             alert(dict.labels?.email_error || 'Por favor, introduce un email corporativo válido.');
             return;
        }

        setIsSubmitting(true);
        try {
            const res = await fetch('/api/lead', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    company: formData.company,
                    phone: formData.phone,
                    budget: formData.budget,
                    message: formData.message,
                    locale: locale,
                    service: 'General - Landing Home'
                })
            });

            if (res.ok) {
                setIsSuccess(true);
                setFormData({
                    name: '',
                    email: '',
                    company: '',
                    phone: '',
                    budget: '',
                    message: '',
                    hp: ''
                });
                
                // RESET DESPUÉS DE 5 SEGUNDOS
                setTimeout(() => setIsSuccess(false), 5000);
            }
        } catch (error) {
            console.error('Error submitting contact form:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section id="contacto" className="py-20 px-10 relative overflow-hidden bg-base">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.1)_0%,transparent_100%)] opacity-30 pointer-events-none" />
            <div className="max-w-7xl mx-auto relative z-10 flex flex-col lg:flex-row gap-20">
                <div className="lg:w-1/2">
                    <span className="text-[12px] font-black uppercase tracking-[0.6em] text-primary mb-8 block px-6 py-2 bg-primary/5 rounded-full border border-primary/20 w-fit drop-shadow-[0_0_15px_rgba(56,189,248,0.2)]">{dict.badge}</span>
                    <h2 className="text-5xl md:text-8xl font-heading font-black uppercase italic tracking-tighter leading-none mb-12 text-white drop-shadow-2xl">
                        {dict.title_part1}<br/>
                        <span className="text-primary hover:text-white transition-colors duration-700">{dict.title_part2}</span>
                    </h2>
                    
                    <div className="space-y-12">
                        <p className="text-xl md:text-3xl font-black italic tracking-tighter text-white/40 uppercase max-w-sm leading-tight hover:text-white transition-colors">
                           {dict.subtitle}
                        </p>
                        
                        <div className="flex gap-8">
                            {[Twitter, Linkedin, Instagram].map((Icon, i) => (
                                <Link key={i} href="#" className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center hover:bg-primary hover:text-black transition-all group shadow-xl hover:shadow-primary/40">
                                    <Icon className="w-5 h-5 group-hover:rotate-12 transition-transform duration-500" />
                                </Link>
                            ))}
                        </div>

                        {/* High-End Technical Indicator */}
                        <div className="hidden lg:block pt-10">
                             <div className="flex items-center gap-4 font-mono text-[12px] text-white/20 uppercase tracking-[0.5em]">
                                <Activity className="w-4 h-4 text-primary animate-pulse" />
                                ZYNDRIX_ENCRYPTION_LAYER_V15 : ACTIVE_SESSION
                             </div>
                        </div>
                    </div>
                </div>
                
                <div className="lg:w-1/2">
                    <form onSubmit={handleSubmit} className="glass-premium p-10 md:p-14 rounded-[4rem] border border-white/10 flex flex-col gap-8 relative overflow-hidden group shadow-[0_0_100px_rgba(0,0,0,0.5)]">
                        {/* Honeypot field (hidden from users) */}
                        <div className="hidden">
                           <input type="text" name="hp" value={formData.hp} onChange={e => setFormData({...formData, hp: e.target.value})} />
                        </div>

                        {/* Glow Ambient Form */}
                        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/20 blur-[80px] rounded-full pointer-events-none group-hover:bg-primary/30 transition-all duration-700" />
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                            <div>
                                <label className="text-[12px] font-black uppercase tracking-[0.4em] text-white/40 mb-3 block">{dict.labels.name}</label>
                                <input required className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-white text-[16px] font-black italic focus:border-primary outline-none transition-all hover:bg-white/10 placeholder:text-white/20" placeholder={dict.placeholders.name} name="name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                            </div>
                            <div>
                                <label className="text-[12px] font-black uppercase tracking-[0.4em] text-white/40 mb-3 block">{dict.labels?.email_title || 'Email Corporativo'}</label>
                                <input required type="email" className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-white text-[16px] font-black italic focus:border-primary outline-none transition-all hover:bg-white/10 placeholder:text-white/20" placeholder={dict.placeholders.email} name="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                            <div>
                                <label className="text-[12px] font-black uppercase tracking-[0.4em] text-white/40 mb-3 block">{dict.labels?.company || 'Empresa / Negocio'}</label>
                                <input required className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-white text-[16px] font-black italic focus:border-primary outline-none transition-all hover:bg-white/10 placeholder:text-white/20" placeholder={dict.placeholders?.company || 'Nombre de tu empresa'} name="company" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} />
                            </div>
                            <div>
                                <label className="text-[12px] font-black uppercase tracking-[0.4em] text-white/40 mb-3 block">{dict.labels.phone}</label>
                                <input required className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-white text-[16px] font-black italic focus:border-primary outline-none transition-all hover:bg-white/10 placeholder:text-white/20" placeholder={dict.placeholders.phone} name="phone" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-1 gap-8 relative z-10">
                            <div>
                                <label className="text-[12px] font-black uppercase tracking-[0.4em] text-white/40 mb-3 block">{dict.labels.budget}</label>
                                <select required className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-white text-[16px] font-black italic focus:border-primary outline-none transition-all hover:bg-white/10 placeholder:text-white/20 appearance-none" name="budget" value={formData.budget} onChange={e => setFormData({...formData, budget: e.target.value})}>
                                    <option value="" disabled className="bg-black text-white">{dict.placeholders.budget}</option>
                                    {dict.budget_options.map((opt: any) => (
                                        <option key={opt.value} value={opt.value} className="bg-black text-white">{opt.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        
                        <div className="relative z-10">
                            <label className="text-[12px] font-black uppercase tracking-[0.4em] text-white/40 mb-3 block">{dict.labels.message}</label>
                            <textarea required className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-white text-[16px] font-black italic min-h-[150px] focus:border-primary outline-none transition-all hover:bg-white/10 placeholder:text-white/20 resize-none" placeholder={dict.placeholders.message} name="message" value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} />
                        </div>
                        
                        <button 
                            disabled={isSubmitting || isSuccess} 
                            className={`w-full py-8 rounded-3xl font-heading font-black uppercase italic tracking-[0.6em] text-[16px] transition-all duration-700 shadow-massive flex items-center justify-center gap-6 relative z-10 active:scale-95 group/btn overflow-hidden ${isSuccess ? 'bg-green-500 text-white shadow-green-500/40' : 'bg-white text-black hover:bg-primary hover:shadow-primary/40'}`}
                        >
                            <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000 skew-x-12" />
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                    <span>{dict.button_loading}</span>
                                </>
                            ) : isSuccess ? (
                                <>
                                    <ShieldCheck className="w-6 h-6 animate-bounce" />
                                    <span>MENSAJE RECIBIDO CORRECTAMENTE!</span>
                                </>
                            ) : (
                                <>
                                    <span>{dict.button}</span>
                                    <Send size={20} className="group-hover/btn:translate-x-2 group-hover/btn:-translate-y-2 transition-transform duration-500" />
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
};

export const Footer = ({ dict }: { dict: any }) => (
    <footer className="py-32 px-10 border-t border-white/5 overflow-hidden bg-[#03040a] relative">
        <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
        <div className="absolute inset-0 bg-mesh opacity-5 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto flex flex-col gap-24">
            <div className="flex flex-col lg:flex-row justify-between items-center lg:items-start gap-16">
                <div className="flex flex-col gap-8 items-center lg:items-start max-w-sm">
                    <Link href="/" className="flex items-center gap-4 group">
                        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center neon-blue shadow-[0_0_30px_rgba(56,189,248,0.5)] group-hover:rotate-12 transition-transform duration-700">
                            <span className="text-md font-black italic tracking-tighter text-white">Z</span>
                        </div>
                        <span className="text-2xl font-black italic tracking-tighter uppercase whitespace-nowrap text-white">ZYNDRIX <span className="text-primary">IA</span></span>
                    </Link>
                    <p className="text-[12px] font-black uppercase tracking-[0.4em] text-white/30 italic text-center lg:text-left leading-relaxed">{dict.desc}</p>
                </div>

                <div className="flex flex-wrap justify-center gap-16">
                     {[
                        { title: 'Protocolo', links: [dict.links.privacy, dict.links.terms, dict.links.security] },
                        { title: 'Sistemas', links: ['Lead Gen', 'Agents', 'Workflow Core'] },
                        { title: 'Contacto', links: ['Instagram', 'LinkedIn', 'X (Twitter)'] }
                     ].map((col, i) => (
                        <div key={i} className="flex flex-col gap-6 text-center lg:text-left">
                            <div className="text-[12px] font-black uppercase tracking-[0.6em] text-primary">{col.title}</div>
                            <div className="flex flex-col gap-3">
                               {col.links.map((ln, j) => (
                                  <Link key={j} href="#" className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 hover:text-white transition-all">{ln}</Link>
                               ))}
                            </div>
                        </div>
                     ))}
                </div>
            </div>

            <div className="pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="text-[12px] font-black uppercase tracking-[0.5em] text-white/10 italic">BUILD_VERSION_2026.04.05.MASTER_STABLE</div>
                <div className="flex items-center gap-6">
                     <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-glow" />
                     <span className="text-[12px] font-black uppercase tracking-[0.5em] text-white/20">ALL_SYSTEMS_OPERATIONAL</span>
                </div>
            </div>
        </div>
    </footer>
);

function ArrowRight(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  )
}
