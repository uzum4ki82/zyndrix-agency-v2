'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowUpRight } from 'lucide-react';
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
        { name: 'Impacto', href: '/#impacto' },
        { name: 'Casos', href: '/#casos' },
        { name: 'Proceso', href: '/#proceso' },
        { name: 'FAQ', href: '/#faq' }
    ];

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className={`fixed top-0 w-full z-100 transition-all duration-500 border-b ${
                scrolled 
                ? 'bg-base/80 backdrop-blur-2xl py-4 border-white/5' 
                : 'bg-transparent py-8 border-transparent'
            }`}
        >
            <div className="max-w-7xl mx-auto px-6 md:px-10 flex justify-between items-center">
                <Link href="/" className="flex items-center gap-2 group">
                    <img 
                        src="/img/zyndrix-logo-v15.png" 
                        alt="Zyndrix AI" 
                        className="h-12 w-auto object-contain transition-all duration-300"
                    />
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-12">
                    {navLinks.map((link) => (
                        <Link 
                            key={link.name} 
                            href={link.href}
                            className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 hover:text-white transition-colors"
                        >
                            {link.name}
                        </Link>
                    ))}
                    <Link 
                        href="/#contacto" 
                        className="flex items-center gap-2 px-8 py-4 bg-white text-black rounded-2xl font-black uppercase italic tracking-[0.2em] text-[10px] hover:bg-primary hover:text-white transition-all duration-500 shadow-xl"
                    >
                        PROTOCOL_INIT <ArrowUpRight className="w-3 h-3" />
                    </Link>
                </div>

                {/* Mobile Toggle */}
                <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X size={32} /> : <Menu size={32} />}
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-surface-low border-b border-white/5"
                    >
                        <div className="px-10 py-20 flex flex-col gap-10">
                            {navLinks.map((link) => (
                                <Link 
                                    key={link.name} 
                                    href={link.href}
                                    onClick={() => setIsOpen(false)}
                                    className="text-4xl font-black italic uppercase tracking-tighter text-white"
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
};
