'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, X } from 'lucide-react';

export const CookieConsent = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('zyndrix-cookie-consent');
        if (!consent) {
            const timer = setTimeout(() => setIsVisible(true), 1500);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('zyndrix-cookie-consent', 'accepted');
        setIsVisible(false);
    };

    const handleDecline = () => {
        localStorage.setItem('zyndrix-cookie-consent', 'declined');
        setIsVisible(false);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 100 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 100 }}
                    className="fixed bottom-10 left-10 z-[200] max-w-[450px] pointer-events-none"
                >
                    <div className="bg-secondary p-10 rounded-[2.5rem] shadow-[0_30px_90px_rgba(0,0,0,0.3)] border border-white/5 pointer-events-auto relative overflow-hidden">
                        {/* Glass/Glow Effect */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl -z-1" />
                        
                        <div className="flex items-start gap-8">
                            <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center flex-shrink-0 text-primary border border-white/10">
                                <ShieldCheck size={28} />
                            </div>
                            
                            <div className="flex flex-col">
                                <h4 className="text-[12px] font-black uppercase tracking-[0.4em] text-white opacity-40 mb-3 ml-1">Protocolo de Privacidad</h4>
                                <h3 className="text-xl font-black text-white uppercase tracking-tight leading-tight mb-4">Control de Datos y Cookies</h3>
                                <p className="text-[14px] font-medium text-white/50 leading-relaxed mb-10">
                                    Utilizamos cookies propias y de terceros para analizar su navegación y mejorar su experiencia ejecutiva en Zyndrix. No vendemos sus datos a terceros.
                                </p>
                                
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <button 
                                        onClick={handleAccept}
                                        className="bg-primary hover:bg-white text-white hover:text-secondary px-8 h-14 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-500 whitespace-nowrap"
                                    >
                                        ACEPTAR TODO
                                    </button>
                                    <button 
                                        onClick={handleDecline}
                                        className="bg-white/5 hover:bg-white/10 text-white/60 hover:text-white px-8 h-14 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-300"
                                    >
                                        RECHAZAR
                                    </button>
                                </div>
                            </div>
                        </div>

                        <button 
                            onClick={() => setIsVisible(false)}
                            className="absolute top-8 right-8 text-white/20 hover:text-white transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
