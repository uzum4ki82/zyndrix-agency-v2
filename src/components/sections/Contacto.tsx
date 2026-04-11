'use client';

import { useState } from 'react';
import { Send, ShieldCheck, Loader2, Activity } from 'lucide-react';

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
                    service: 'Zyndrix Architecture Audit'
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
        <section id="contacto" className="py-24 px-6 relative bg-white border-t border-primary/10 overflow-hidden">
      <div className="arch-grid opacity-20" />
      
      <div className="max-w-7xl mx-auto relative z-10 grid lg:grid-cols-12 gap-16 items-start">
        
        {/* Left Side: Context */}
        <div className="lg:col-span-5 flex flex-col pt-4">
            <div className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400 mb-8 flex items-center gap-4">
                <div className="w-10 h-[1px] bg-primary/20" />
                {dict.badge}
            </div>
            
            <h2 className="text-4xl md:text-8xl font-heading font-black uppercase tracking-[-0.05em] leading-[0.85] mb-8 text-primary">
                {dict.title_part1}<br />
                <span className="opacity-10">{dict.title_part2}</span>
            </h2>
            
            <p className="text-xl md:text-2xl font-medium tracking-tight text-slate-700 leading-relaxed border-l-4 border-black pl-8 mb-12 max-w-md italic">
                {dict.subtitle}
            </p>

            <div className="space-y-4 pt-12 border-t border-primary/10">
                <div className="flex items-center justify-between">
                   <span className="text-[8px] font-black text-slate-300 tracking-[0.4em] uppercase">SYSTEM_NODE</span>
                   <span className="text-[11px] font-black text-primary">ZYNDRIX_CORE_01</span>
                </div>
                <div className="flex items-center justify-between">
                   <span className="text-[8px] font-black text-slate-300 tracking-[0.4em] uppercase">SECURE_LEVEL</span>
                   <span className="text-[11px] font-black text-primary uppercase">MAX_TRUST</span>
                </div>
                <div className="flex items-center justify-between">
                   <span className="text-[8px] font-black text-slate-300 tracking-[0.4em] uppercase">HQ_LOCATION</span>
                   <span className="text-[11px] font-black text-primary uppercase">BCN_SANT_ANTONI</span>
                </div>
            </div>
        </div>
        
        {/* Right Side: Form */}
        <div className="lg:col-span-7 bg-white border border-primary/10 p-10 md:p-16 shadow-3xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-black" />
            <div className="absolute top-0 right-0 p-8 opacity-5">
               <Activity size={32} className="animate-pulse" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-10 relative z-10">
                <div className="hidden">
                   <input type="text" name="hp" value={formData.hp} onChange={e => setFormData({...formData, hp: e.target.value})} />
                </div>

                <div className="grid md:grid-cols-2 gap-10">
                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-600 ml-2">
                            {dict.labels.name}
                        </label>
                        <input
                            required
                            className="w-full bg-slate-50 border-2 border-primary/10 p-6 text-[15px] text-primary outline-none focus:bg-white focus:border-black transition-all font-bold uppercase placeholder:opacity-30 rounded-sm"
                            placeholder={dict.placeholders.name}
                            name="name"
                            value={formData.name}
                            onChange={e => setFormData({...formData, name: e.target.value})}
                        />
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-600 ml-2">
                            {dict.labels.email}
                        </label>
                        <input
                            required
                            type="email"
                            className="w-full bg-slate-50 border-2 border-primary/10 p-6 text-[15px] text-primary outline-none focus:bg-white focus:border-black transition-all font-bold uppercase placeholder:opacity-30 rounded-sm"
                            placeholder={dict.placeholders.email}
                            name="email"
                            value={formData.email}
                            onChange={e => setFormData({...formData, email: e.target.value})}
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-600 ml-2">
                        {dict.labels.message}
                    </label>
                    <textarea
                        required
                        rows={6}
                        className="w-full bg-slate-50 border-2 border-primary/10 p-6 text-[15px] text-primary outline-none focus:bg-white focus:border-black transition-all font-bold uppercase placeholder:opacity-30 resize-none rounded-sm"
                        placeholder={dict.placeholders.message}
                        name="message"
                        value={formData.message}
                        onChange={e => setFormData({...formData, message: e.target.value})}
                    />
                </div>
                
                <button
                    disabled={isSubmitting || isSuccess}
                    className={`btn-executive w-full flex items-center justify-center gap-8 h-24 group transition-all duration-700 font-black text-[14px] tracking-[0.3em] uppercase ${isSuccess ? 'bg-green-700 text-white' : 'bg-black text-white hover:bg-slate-900'}`}
                >
                    {isSubmitting ? (
                        <Loader2 className="w-6 h-6 animate-spin" />
                    ) : isSuccess ? (
                        <div className="flex items-center gap-6">
                           <ShieldCheck className="w-7 h-7 text-white" />
                           <span>{dict.success_message}</span>
                        </div>
                    ) : (
                        <>
                            <span>{dict.button}</span>
                            <ArrowRight size={22} className="group-hover:translate-x-4 transition-transform duration-700" />
                        </>
                    )}
                </button>
            </form>

            <div className="mt-12 flex justify-between items-center opacity-30 group">
               <span className="text-[9px] font-black uppercase tracking-[0.5em] text-slate-700">SECURE_ENCRYPTION_v4</span>
               <div className="flex gap-3">
                  <div className="w-2 h-2 bg-black rounded-full group-hover:animate-pulse" />
                  <div className="w-1.5 h-1.5 bg-black/40 rounded-full" />
               </div>
               <span className="text-[9px] font-black uppercase tracking-[0.5em] text-slate-700">BARCELONA_HQ</span>
            </div>
        </div>
      </div>
    </section>



    );
};


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
