'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Twitter, Linkedin, Share2, ShieldCheck, FileText, Lock, Loader2 } from 'lucide-react';
import Link from 'next/link';

export const Contacto = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        budget: '',
        message: ''
    });
    const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('sending');
        try {
            const response = await fetch('/api/lead', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    company: 'Direct Contact', // Home form usually doesn't have company in this version
                    problem: formData.message, // Map message to problem if not separate
                    service: 'General/Consultoría',
                    source: 'Home Contact Form'
                })
            });
            if (response.ok) setStatus('success');
            else setStatus('error');
        } catch (error) {
            console.error(error);
            setStatus('error');
        }
    };

    return (
        <section id="contacto" className="py-80 px-10 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.05)_0%,transparent_100%)]" />
            <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row gap-40">
                <div className="md:w-1/2">
                    <span className="text-[10px] font-black uppercase tracking-[0.5em] text-primary mb-6 block">ENTRADA_DATOS</span>
                    <h2 className="text-6xl md:text-9xl font-heading font-black uppercase italic tracking-tighter leading-none mb-20 drop-shadow-[0_0_80px_rgba(56,189,248,0.2)]">TRANSFORMA<br/><span className="text-white/20 hover:text-white transition-colors">EL FUTURO</span></h2>
                    <div className="space-y-12">
                        <p className="text-2xl font-black italic tracking-tighter text-white uppercase max-w-sm">INICIA TU PROTOCOLO DE AUTOMATIZACIÓN DE ÉLITE HOY MISMO.</p>
                        <div className="flex gap-10">
                            <Link href="#" className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center hover:bg-white hover:text-black transition-all group">
                                <Twitter className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                            </Link>
                            <Link href="#" className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center hover:bg-white hover:text-black transition-all group">
                                <Linkedin className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                            </Link>
                        </div>
                    </div>
                </div>
                
                <div className="md:w-1/2">
                    <form onSubmit={handleSubmit} className="glass-premium p-16 rounded-[4.5rem] border border-white/5 flex flex-col gap-10 relative overflow-hidden">
                        <div className="absolute top-0 right-10 opacity-5">
                          <Send className="w-64 h-64 text-primary" />
                        </div>
                        {status === 'success' ? (
                            <div className="text-center py-20 animate-in fade-in zoom-in duration-500">
                                <ShieldCheck className="w-24 h-24 text-primary mx-auto mb-8" />
                                <h3 className="text-4xl font-black italic uppercase tracking-tight text-white mb-4">PROTOCOLO ACTIVADO</h3>
                                <p className="text-white/40 font-black italic uppercase text-xs tracking-widest">ENVIANDO RESPUESTA EN 24MS...</p>
                                <button type="button" onClick={() => setStatus('idle')} className="mt-8 text-[10px] font-black uppercase tracking-widest text-primary border-b border-primary/20">VOLVER A ENVIAR</button>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 mb-4 block">IDENTIDAD_AGENTE</label>
                                        <input 
                                            required
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-white text-lg font-black italic focus:border-primary outline-none transition-all hover:bg-white/10" 
                                            placeholder="NOMBRE COMPLETO" 
                                            name="name"
                                            value={formData.name}
                                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 mb-4 block">CANAL_COMUNICACION</label>
                                        <input 
                                            required
                                            type="email"
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-white text-lg font-black italic focus:border-primary outline-none transition-all hover:bg-white/10" 
                                            placeholder="EMAIL DE EMPRESA" 
                                            name="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 mb-4 block">TELEFONO_CONTACTO</label>
                                        <input 
                                            required
                                            type="tel"
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-white text-lg font-black italic focus:border-primary outline-none transition-all hover:bg-white/10" 
                                            placeholder="+34 000 000 000" 
                                            name="phone"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 mb-4 block">NIVEL_INVERSION</label>
                                        <select 
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-white text-lg font-black italic focus:border-primary outline-none transition-all hover:bg-white/10 appearance-none" 
                                            name="budget"
                                            value={formData.budget}
                                            onChange={(e) => setFormData({...formData, budget: e.target.value})}
                                        >
                                            <option value="" disabled className="bg-black text-white">PRESUPUESTO</option>
                                            <option value="<1k" className="bg-black text-white">MENOS DE 1.000€</option>
                                            <option value="1k-3k" className="bg-black text-white">1.000€ - 3.000€</option>
                                            <option value="3k-5k" className="bg-black text-white">3.000€ - 5.000€</option>
                                            <option value=">5k" className="bg-black text-white">MÁS DE 5.000€</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 mb-4 block">MATRIZ_CONSULTA</label>
                                    <textarea 
                                        required
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-white text-lg font-black italic min-h-[150px] focus:border-primary outline-none transition-all hover:bg-white/10" 
                                        placeholder="¿QUÉ NECESITAS AUTOMATIZAR?" 
                                        name="message"
                                        value={formData.message}
                                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                                    />
                                </div>
                                <button 
                                    disabled={status === 'sending'}
                                    className="w-full py-8 bg-white text-black rounded-3xl font-heading font-black uppercase italic tracking-[0.6em] text-[14px] hover:bg-primary hover:text-white transition-all duration-500 shadow-[0_40px_80px_rgba(0,0,0,0.4)] hover:shadow-primary/30 flex items-center justify-center gap-4 disabled:opacity-50"
                                >
                                    {status === 'sending' ? (
                                        <>PROCESANDO <Loader2 className="animate-spin" /></>
                                    ) : (
                                        'ENVIAR_PROTOCOLO'
                                    )}
                                </button>
                                {status === 'error' && <p className="text-red-500 text-[10px] font-black uppercase text-center">ERROR DE CONEXIÓN CON EL NÚCLEO</p>}
                            </>
                        )}
                    </form>
                </div>
            </div>
        </section>
    );
};

export const Footer = () => (
    <footer className="py-40 px-10 border-t border-white/5 overflow-hidden relative">
        <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-20">
            <div className="flex flex-col gap-6 items-center md:items-start">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center neon-blue group-hover:rotate-12 transition-transform duration-500">
                        <span className="text-xs font-black italic tracking-tighter text-white">Z</span>
                    </div>
                    <span className="text-xl font-black italic tracking-tighter uppercase whitespace-nowrap">ZYNDRIX <span className="text-primary font-black">AI</span></span>
                </Link>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 italic">DOMINIO DE INGENIERÍA © 2026. TODOS LOS DERECHOS RESERVADOS.</p>
            </div>

            <div className="flex flex-wrap justify-center gap-12">
                <Link href="/privacy" className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-white/40 hover:text-white transition-all">
                    <ShieldCheck className="w-4 h-4 text-primary" /> PRIVACIDAD
                </Link>
                <Link href="/terms" className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-white/40 hover:text-white transition-all">
                    <FileText className="w-4 h-4 text-primary" /> TÉRMINOS
                </Link>
                <Link href="/security" className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-white/40 hover:text-white transition-all">
                    <Lock className="w-4 h-4 text-primary" /> SEGURIDAD
                </Link>
            </div>
            
            <div className="flex gap-10 opacity-20 hover:opacity-100 transition-opacity">
               <Twitter className="w-4 h-4 cursor-pointer hover:text-primary" />
               <Linkedin className="w-4 h-4 cursor-pointer hover:text-primary" />
               <Share2 className="w-4 h-4 cursor-pointer hover:text-primary" />
            </div>
        </div>
    </footer>
);

