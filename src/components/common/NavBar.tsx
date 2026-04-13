'use client';

import { useState, useEffect } from 'react';
import { Menu, X, ArrowRight } from 'lucide-react';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

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

  const navLinks = [
    { label: 'Servicios', id: 'servicios' },
    { label: 'Precios', id: 'precios' },
    { label: 'FAQ', id: 'faq' }
  ];

  return (
    <>
      <nav className={cn(
        "fixed top-0 left-0 right-0 z-[100] transition-all duration-700 py-6 md:py-8",
        isScrolled ? "bg-white py-4 md:py-5 shadow-sm" : "bg-transparent"
      )}>
        {/* Scroll Progress Indicator */}
        <motion.div 
            className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary origin-left z-20"
            style={{ scaleX }}
        />

        <div className="max-w-7xl mx-auto px-6 md:px-10 flex items-center justify-between">
          <a href="/" className="flex items-center flex-shrink-0 bg-white px-3 py-1 rounded">
             <img
                src="/img/logo_raw.png"
                alt="Zyndrix Logo"
                className="h-10 md:h-14 w-auto object-contain"
             />
          </a>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-12">
            {navLinks.map((link, idx) => (
               <a
                 key={idx}
                 href={getLink(link.id)}
                 className="text-[11px] font-black uppercase tracking-[0.3em] text-secondary/50 hover:text-primary transition-all duration-300"
               >
                 {link.label}
               </a>
            ))}
          </div>

          <div className="flex items-center gap-8">
            <a href={`#${contactId}`} className="hidden md:flex items-center gap-4 text-[10px] font-black uppercase tracking-widest px-10 py-5 bg-primary text-white hover:bg-secondary transition-all shadow-xl shadow-primary/10 rounded-2xl">
              <span>{dict.connect || "HABLEMOS"}</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <button 
              className="lg:hidden w-10 h-10 flex items-center justify-center text-secondary"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
            {isMobileMenuOpen && (
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="lg:hidden fixed inset-0 top-0 bg-white z-[200] flex flex-col p-10"
                >
                    <div className="flex justify-between items-center mb-20">
                         <div className="bg-white px-3 py-1 rounded">
                            <img
                              src="/img/logo_raw.png"
                              alt="Zyndrix Logo"
                              className="h-20 w-auto object-contain"
                            />
                         </div>
                        <button
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="w-12 h-12 flex items-center justify-center text-secondary"
                        >
                            <X size={28} />
                        </button>
                    </div>

                    <div className="flex flex-col gap-10 mb-12">
                        {navLinks.map((link, i) => (
                          <a 
                            key={i}
                            href={getLink(link.id)} 
                            onClick={() => setIsMobileMenuOpen(false)} 
                            className="text-5xl font-heading font-black uppercase tracking-tighter text-secondary flex items-center justify-between group"
                          >
                            <span>{link.label}</span>
                            <ArrowRight size={32} className="text-primary" />
                          </a>
                        ))}
                    </div>
                    
                    <a 
                      href={`#${contactId}`} 
                      onClick={() => setIsMobileMenuOpen(false)} 
                      className="mt-auto w-full text-center py-8 bg-primary text-white font-black uppercase tracking-widest text-sm rounded-3xl"
                    >
                      {dict.connect || "COMENZAR PROYECTO"}
                    </a>
                </motion.div>
            )}
        </AnimatePresence>
      </nav>
    </>
  );
};


