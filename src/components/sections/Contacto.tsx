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
            <div className="max-w-7xl mx-auto relative z-10 grid lg:grid-cols-2 gap-32 items-center">
                
                {/* Left Side: Business Message */}
                <div className="flex flex-col">
                    <div className="text-[12px] font-black uppercase tracking-[0.4em] text-primary mb-8 flex items-center gap-4">
                        <div className="w-12 h-[2px] bg-primary" />
                        {dict.badge}
                    </div>
                    
                    <h2 className="text-6xl md:text-7xl font-heading font-black uppercase tracking-tight leading-[1] md:leading-[0.9] mb-10 text-secondary max-w-md">
                        {dict.title_part1}<br />
                        <span className="text-primary italic italic-font">{dict.title_part2}</span>
                    </h2>
                    
                    <p className="text-2xl font-medium text-secondary/50 leading-relaxed mb-12 max-w-lg">
                        {dict.subtitle}
                    </p>

                    <div className="space-y-6 pt-10 border-t border-secondary/5">
                        <a href="https://wa.me/34637729266" className="flex items-center gap-6 group cursor-pointer hover:no-underline">
                            <div className="w-14 h-14 rounded-2xl bg-secondary/5 flex items-center justify-center text-secondary group-hover:bg-[#25D366] group-hover:text-white transition-all duration-300">
                                <svg 
                                    viewBox="0 0 24 24" 
                                    className="w-7 h-7 fill-current" 
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413"/>
                                </svg>
                            </div>
                            <div>
                                <div className="text-[10px] font-black text-secondary/30 uppercase tracking-[0.2em] mb-1">RESPUESTA RÁPIDA</div>
                                <div className="text-xl font-black text-secondary uppercase">Hablemos por WhatsApp</div>
                            </div>
                        </a>
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
