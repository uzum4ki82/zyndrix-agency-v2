'use client';

import { useState } from 'react';
import { Send, CheckCircle2, Loader2, ArrowRight, MessageSquare } from 'lucide-react';

export const Contacto = ({ dict, locale }: { dict: any, locale: string }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
        hp: '' // Honeypot field
    });
    
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if (formData.hp) {
            setIsSuccess(true);
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
                    message: formData.message,
                    locale: locale,
                    service: 'Pack Digital Zyndrix'
                })
            });

            if (res.ok) {
                setIsSuccess(true);
                setFormData({ name: '', email: '', message: '', hp: '' });
                setTimeout(() => setIsSuccess(false), 5000);
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section id="contacto" className="py-24 px-6 relative bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto relative z-10 grid lg:grid-cols-2 gap-20 items-center">
                
                {/* Left Side: Business Message */}
                <div className="flex flex-col">
                    <div className="text-[12px] font-black uppercase tracking-[0.4em] text-primary mb-8 flex items-center gap-4">
                        <div className="w-12 h-[2px] bg-primary" />
                        {dict.badge}
                    </div>
                    
                    <h2 className="text-6xl md:text-8xl font-heading font-black uppercase tracking-tight leading-[1] md:leading-[0.9] mb-10 text-secondary">
                        {dict.title_part1}<br />
                        <span className="text-primary italic italic-font">{dict.title_part2}</span>
                    </h2>
                    
                    <p className="text-2xl font-medium text-secondary/50 leading-relaxed mb-12 max-w-lg">
                        {dict.subtitle}
                    </p>

                    <div className="space-y-6 pt-10 border-t border-secondary/5">
                        <div className="flex items-center gap-6 group cursor-pointer">
                            <div className="w-14 h-14 rounded-2xl bg-secondary/5 flex items-center justify-center text-secondary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                                <MessageSquare size={24} />
                            </div>
                            <div>
                                <div className="text-[10px] font-black text-secondary/30 uppercase tracking-[0.2em] mb-1">RESPUESTA RÁPIDA</div>
                                <div className="text-xl font-black text-secondary uppercase">Hablemos por WhatsApp</div>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Right Side: Clean Form */}
                <div className="bg-secondary p-10 md:p-16 rounded-[4rem] relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] -z-1" />

                    <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                        <div className="hidden">
                           <input type="text" name="hp" value={formData.hp} onChange={e => setFormData({...formData, hp: e.target.value})} />
                        </div>

                        <div className="space-y-3">
                            <label className="text-[11px] font-bold uppercase tracking-[0.3em] text-white/40 ml-2">
                                {dict.labels.name}
                            </label>
                            <input
                                required
                                className="w-full bg-white/5 border border-white/10 p-6 text-white outline-none focus:bg-white/10 focus:border-primary transition-all font-bold rounded-2xl placeholder:opacity-20"
                                placeholder={dict.placeholders.name}
                                name="name"
                                value={formData.name}
                                onChange={e => setFormData({...formData, name: e.target.value})}
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="text-[11px] font-bold uppercase tracking-[0.3em] text-white/40 ml-2">
                                {dict.labels.email}
                            </label>
                            <input
                                type="email"
                                className="w-full bg-white/5 border border-white/10 p-6 text-white outline-none focus:bg-white/10 focus:border-primary transition-all font-bold rounded-2xl placeholder:opacity-20"
                                placeholder={dict.placeholders.email}
                                name="email"
                                value={formData.email}
                                onChange={e => setFormData({...formData, email: e.target.value})}
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="text-[11px] font-bold uppercase tracking-[0.3em] text-white/40 ml-2">
                                {dict.labels.message}
                            </label>
                            <textarea
                                required
                                rows={4}
                                className="w-full bg-white/5 border border-white/10 p-6 text-white outline-none focus:bg-white/10 focus:border-primary transition-all font-bold rounded-2xl placeholder:opacity-20 resize-none"
                                placeholder={dict.placeholders.message}
                                name="message"
                                value={formData.message}
                                onChange={e => setFormData({...formData, message: e.target.value})}
                            />
                        </div>
                        
                        <button
                            disabled={isSubmitting || isSuccess}
                            className={`w-full flex items-center justify-center gap-4 h-20 rounded-2xl font-black text-xs tracking-[0.3em] uppercase transition-all duration-500 ${isSuccess ? 'bg-success text-white' : 'bg-primary text-white hover:bg-white hover:text-secondary'}`}
                        >
                            {isSubmitting ? (
                                <Loader2 className="w-6 h-6 animate-spin" />
                            ) : isSuccess ? (
                                <div className="flex items-center gap-3">
                                   <CheckCircle2 size={24} />
                                   <span>{dict.success_message}</span>
                                </div>
                            ) : (
                                <>
                                    <span>{dict.button}</span>
                                    <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
};
