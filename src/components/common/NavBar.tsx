'use client';

import { useState, useEffect } from 'react';
import { Menu, X, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export const NavBar = ({ dict, locale, contactId = "contacto" }: { dict: any, locale: string, contactId?: string }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getLink = (id: string) => {
    // If we are on a subpage, we need the full path to the home section
    const isHome = typeof window !== 'undefined' && window.location.pathname === '/';
    if (isHome) return `#${id}`;
    return `/#${id}`;
  };

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-[100] transition-all duration-300 py-6",
      isScrolled ? "bg-black/80 backdrop-blur-3xl border-b border-white/5 py-4" : "bg-transparent"
    )}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <a href="/" className="flex items-center gap-3">
          <img src="/img/zyndrix-live.png" alt="Zyndrix Logo" className="h-12 w-auto brightness-110" />
        </a>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-12 bg-white/5 border border-white/10 px-8 py-3 rounded-full backdrop-blur-xl">
          <a href={getLink('servicios')} className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 hover:text-white transition-all">{dict.servicios}</a>
          <a href={getLink('ofertas')} className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 hover:text-white transition-all">{dict.oferta}</a>
          <a href={getLink('proceso')} className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 hover:text-white transition-all">{dict.proceso}</a>
          <a href={getLink('precios')} className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 hover:text-white transition-all">{dict.precios}</a>
          <a href={getLink('faq')} className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 hover:text-white transition-all">{dict.faq}</a>
        </div>

        <div className="flex items-center gap-6">
          <a href={`#${contactId}`} className="hidden md:flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.3em] px-10 py-3 bg-white text-black rounded-full hover:bg-primary transition-all">
            {dict.connect} <ArrowRight className="w-4 h-4" />
          </a>

          <button 
            className="lg:hidden text-white p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-black border-t border-white/5 p-12 flex flex-col gap-10 items-center animate-in fade-in slide-in-from-top-4 duration-500">
          <a href={getLink('servicios')} onClick={() => setIsMobileMenuOpen(false)} className="text-[14px] font-black uppercase tracking-[0.4em] text-white uppercase">{dict.servicios}</a>
          <a href={getLink('ofertas')} onClick={() => setIsMobileMenuOpen(false)} className="text-[14px] font-black uppercase tracking-[0.4em] text-white uppercase">{dict.oferta}</a>
          <a href={getLink('proceso')} onClick={() => setIsMobileMenuOpen(false)} className="text-[14px] font-black uppercase tracking-[0.4em] text-white uppercase">{dict.proceso}</a>
          <a href={`#${contactId}`} onClick={() => setIsMobileMenuOpen(false)} className="w-full text-center py-5 bg-white text-black font-black uppercase tracking-[0.4em] rounded-full">CONTACTO</a>
        </div>
      )}
    </nav>
  );
};
