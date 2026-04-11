'use client';

import { useState, useEffect } from 'react';
import { Menu, X, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { cn } from '@/lib/utils';
import Image from 'next/image';

export const NavBar = ({ dict, locale, contactId = "contacto" }: { dict: any, locale: string, contactId?: string }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getLink = (id: string) => {
    if (!mounted) return `/#${id}`;
    const isHome = window.location.pathname === '/';
    if (isHome) return `#${id}`;
    return `/#${id}`;
  };

  return (
    <>
      <nav className={cn(
        "fixed top-0 left-0 right-0 z-[100] transition-all duration-700 py-6 md:py-10",
        isScrolled ? "bg-white/90 backdrop-blur-2xl border-b border-primary/10 py-4 md:py-6 shadow-sm" : "bg-transparent"
      )}>
        {/* Scroll Progress Indicator */}
        <motion.div 
            className="absolute bottom-0 left-0 right-0 h-[2px] bg-black origin-left z-20"
            style={{ scaleX }}
        />

        <div className="max-w-7xl mx-auto px-10 flex items-center justify-between">
          <a href="/" className="flex items-center gap-4 group">
            <div className="relative w-40 h-10 overflow-hidden">
                <Image 
                    src="/img/zyndrix-live.png" 
                    alt="Zyndrix Logo" 
                    fill
                    priority
                    className="object-contain invert brightness-0 group-hover:scale-105 transition-transform duration-700" 
                />
            </div>
          </a>

          {/* Desktop Navigation HUB */}
          <div className="hidden lg:flex items-center gap-14 border-x border-primary/10 px-20 h-14 bg-slate-50 shadow-inner">
            {[
               { id: 'kernel', label: dict.servicios },
               { id: 'impacto', label: dict.casos },
               { id: 'faq', label: dict.faq },
               { id: 'ingenieria', label: dict.proceso }
            ].map((link, idx) => (
               <a
                 key={idx}
                 href={getLink(link.id)}
                 className="text-[10px] font-black uppercase tracking-[0.7em] text-slate-500 hover:text-black transition-all duration-300 relative group/link"
               >
                 {link.label}
                 <span className="absolute -bottom-2 left-0 w-0 h-[2px] bg-black group-hover/link:w-full transition-all duration-500" />
               </a>
            ))}
          </div>

          <div className="flex items-center gap-10">
            <div className="hidden xl:flex items-center gap-3">
               <ShieldCheck size={14} className="text-primary/20" />
               <span className="text-[7px] font-black tracking-[0.4em] text-primary/10 uppercase">ENCRYPTED_SESSION_v4</span>
            </div>

            <a href={`#${contactId}`} className="hidden md:flex items-center gap-6 text-[11px] font-black uppercase tracking-[0.5em] px-12 py-6 bg-black text-white hover:bg-slate-800 transition-all shadow-2xl relative overflow-hidden group">
              <span className="relative z-10">{dict.connect}</span>
              <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-700" />
              <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-3 transition-transform" />
            </a>

            <button 
              className="lg:hidden w-12 h-12 border border-primary/10 flex items-center justify-center bg-white hover:bg-slate-50 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Control HUD */}
        <motion.div 
            initial={false}
            animate={isMobileMenuOpen ? { opacity: 1, x: 0 } : { opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="lg:hidden fixed inset-0 top-0 bg-white z-[200] flex flex-col"
        >
            <div className="p-10 border-b border-primary/5 flex justify-between items-center">
                <Image src="/img/zyndrix-live.png" alt="Logo" width={140} height={42} className="h-9 w-auto invert brightness-0" />
                <button 
                  onClick={() => setIsMobileMenuOpen(false)} 
                  className="w-14 h-14 border border-primary/10 flex items-center justify-center rounded-none bg-black text-white"
                >
                    <X size={24} />
                </button>
            </div>

            <div className="flex-1 p-10 flex flex-col justify-center gap-12">
               <div className="text-[10px] font-black text-primary/20 tracking-[1em] mb-4 uppercase">MAIN_PROTOCOLS</div>
                {[
                  { label: dict.servicios, id: 'kernel' },
                  { label: dict.casos, id: 'impacto' },
                  { label: dict.proceso, id: 'proceso' },
                  { label: dict.faq, id: 'faq' }
                ].map((link, i) => (
                  <motion.a 
                    key={i}
                    href={getLink(link.id)} 
                    initial={{ x: 20, opacity: 0 }}
                    animate={isMobileMenuOpen ? { x: 0, opacity: 1 } : {}}
                    transition={{ delay: i * 0.1 }}
                    onClick={() => setIsMobileMenuOpen(false)} 
                    className="text-4xl font-heading font-black uppercase tracking-tighter text-slate-300 hover:text-black transition-all flex items-center gap-6"
                  >
                    <span className="text-[12px] font-mono text-primary/10">0{i+1}</span>
                    {link.label}
                  </motion.a>
                ))}
            </div>
            
            <div className="p-10 border-t border-primary/5 bg-slate-50 space-y-10">
                <a 
                  href={`#${contactId}`} 
                  onClick={() => setIsMobileMenuOpen(false)} 
                  className="w-full text-center py-10 bg-black text-white font-black uppercase tracking-[0.5em] block text-sm shadow-2xl"
                >
                  {dict.connect}
                </a>

                <div className="flex justify-between items-center">
                   <div className="text-[8px] font-black tracking-[0.6em] uppercase text-primary/20">SYSTEM_CORE_v4.2</div>
                   <LiveTerminalSmall />
                </div>
            </div>
        </motion.div>
      </nav>
    </>
  );
};

const LiveTerminalSmall = () => {
    return (
        <div className="flex items-center gap-2">
            <div className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[8px] font-mono text-primary/30 uppercase tracking-widest">ENCRYPTED_LIVE</span>
        </div>
    );
};

