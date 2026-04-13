'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Servicios', href: '/#servicios' },
        { name: 'Precios', href: '/#precios' },
        { name: 'FAQ', href: '/#faq' },
        { name: 'Contacto', href: '/#contacto' }
    ];

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className={`fixed top-0 w-full z-50 transition-all duration-500 ${
                scrolled 
                ? 'bg-white/80 backdrop-blur-2xl py-4 shadow-sm' 
                : 'bg-transparent py-8'
            }`}
        >
            <div className="max-w-7xl mx-auto px-6 md:px-10 flex justify-between items-center">
                <Link href="/" className="flex items-center gap-2 group">
                    <span className="text-2xl font-heading font-black tracking-tighter uppercase text-secondary">
                        ZYND<span className="text-primary italic italic-font">RIX</span>
                    </span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-10">
                    {navLinks.slice(0, 3).map((link) => (
                        <Link 
                            key={link.name} 
                            href={link.href}
                            className="text-[11px] font-black uppercase tracking-[0.3em] text-secondary/40 hover:text-primary transition-colors"
                        >
                            {link.name}
                        </Link>
                    ))}
                    <Link 
                        href="/#contacto" 
                        className="flex items-center gap-3 px-8 py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-secondary transition-all duration-300 shadow-lg shadow-primary/20"
                    >
                        HABLEMOS <ArrowRight className="w-3 h-3" />
                    </Link>
                </div>

                {/* Mobile Toggle */}
                <button className="md:hidden text-secondary" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="fixed inset-0 top-[72px] bg-white z-40 md:hidden p-10"
                    >
                        <div className="flex flex-col gap-8">
                            {navLinks.map((link) => (
                                <Link 
                                    key={link.name} 
                                    href={link.href}
                                    onClick={() => setIsOpen(false)}
                                    className="text-5xl font-heading font-black uppercase tracking-tighter text-secondary flex items-center justify-between group"
                                >
                                    <span>{link.name}</span>
                                    <ArrowRight size={32} className="opacity-0 group-hover:opacity-100 -translate-x-10 group-hover:translate-x-0 transition-all text-primary" />
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
};
