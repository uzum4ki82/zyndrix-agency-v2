'use client';

import Link from 'next/link';

export const Footer = ({ dict, locale }: { dict: any, locale: string }) => (
    <footer className="py-32 px-10 border-t border-white/5 overflow-hidden bg-[#03040a] relative">
        <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
        <div className="absolute inset-0 bg-mesh opacity-5 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto flex flex-col gap-24">
            <div className="flex flex-col lg:flex-row justify-between items-center lg:items-start gap-16">
                <div className="flex flex-col gap-8 items-center lg:items-start max-w-sm">
                    <Link href="/" className="flex items-center gap-4 group">
                        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center neon-blue shadow-[0_0_30px_rgba(56,189,248,0.5)] group-hover:rotate-12 transition-transform duration-700">
                            <span className="text-md font-black italic tracking-tighter text-white">Z</span>
                        </div>
                        <span className="text-2xl font-black italic tracking-tighter uppercase whitespace-nowrap text-white">ZYNDRIX <span className="text-primary">IA</span></span>
                    </Link>
                    <p className="text-[12px] font-black uppercase tracking-[0.4em] text-white/30 italic text-center lg:text-left leading-relaxed">{dict.desc}</p>
                </div>

                <div className="flex flex-wrap justify-center gap-16">
                     {dict.sections ? Object.values(dict.sections).map((col: any, i: number) => (
                        <div key={i} className="flex flex-col gap-6 text-center lg:text-left">
                            <div className="text-[12px] font-black uppercase tracking-[0.6em] text-primary">{col.title}</div>
                            <div className="flex flex-col gap-3">
                               {col.links.map((link: any, j: number) => (
                                  <Link key={j} href={link.href} className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 hover:text-white transition-all uppercase">{link.label}</Link>
                               ))}
                            </div>
                        </div>
                     )) : (
                        <div className="text-white/20 text-[10px] uppercase tracking-widest italic">Cargando protocolos de navegación...</div>
                     )}
                </div>
            </div>

            <div className="pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-[12px] font-black uppercase tracking-[0.5em] text-white/10 italic">ENGINEERING_DOMAIN // v2.0.42_PROD</div>
                <div className="flex items-center gap-6">
                     <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-glow" />
                     <span className="text-[12px] font-black uppercase tracking-[0.5em] text-white/20">ALL_SYSTEMS_OPERATIONAL</span>
                </div>
            </div>
        </div>
    </footer>
);
