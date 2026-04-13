'use client';

import Link from 'next/link';
import Image from 'next/image';

export const Footer = ({ dict, locale }: { dict: any, locale: string }) => (
    <footer className="py-24 px-6 border-t border-secondary/5 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20 text-center md:text-left">
                {/* Brand Column */}
                <div className="col-span-1 lg:col-span-2 space-y-8">
                    <Link href="/" className="relative w-[450px] h-48 block">
                         <Image 
                            src="/img/logo_raw.png" 
                            alt="Zyndrix Logo" 
                            fill 
                            className="object-contain mix-blend-multiply scale-125"
                         />
                    </Link>
                    <p className="text-lg font-medium text-secondary/40 leading-relaxed max-w-sm mx-auto md:mx-0">
                        {dict.desc || "Digitalizando negocios locales con soluciones listas para vender. Sin tecnicismos, solo resultados."}
                    </p>
                    <div className="flex gap-8 justify-center md:justify-start">
                        {[
                          { l: "Sede", v: "Sant Antoni" },
                          { l: "Estatus", v: "Activo" }
                        ].map((item, idx) => (
                           <div key={idx} className="flex flex-col">
                              <span className="text-[10px] font-black text-secondary/20 uppercase tracking-widest">{item.l}</span>
                              <span className="text-[12px] font-bold text-secondary uppercase">{item.v}</span>
                           </div>
                        ))}
                    </div>
                </div>

                {/* Navigation Links */}
                <div className="space-y-6">
                    <div className="text-[11px] font-black uppercase tracking-[0.3em] text-primary">NAVEGACIÓN</div>
                    <div className="flex flex-col gap-4">
                        <Link href="#servicios" className="text-sm font-bold text-secondary/60 hover:text-primary transition-all uppercase">Servicios</Link>
                        <Link href="#precios" className="text-sm font-bold text-secondary/60 hover:text-primary transition-all uppercase">Precios</Link>
                        <Link href="#faq" className="text-sm font-bold text-secondary/60 hover:text-primary transition-all uppercase">Preguntas</Link>
                        <Link href="#contacto" className="text-sm font-bold text-secondary/60 hover:text-primary transition-all uppercase">Contacto</Link>
                    </div>
                </div>

                {/* Contact Links */}
                <div className="space-y-6">
                    <div className="text-[11px] font-black uppercase tracking-[0.3em] text-primary">CONTACTO</div>
                    <div className="flex flex-col gap-4">
                        <span className="text-sm font-bold text-secondary/60 uppercase">zyndrixia@gmail.com</span>
                    </div>
                </div>
            </div>

            <div className="pt-10 border-t border-secondary/5 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="text-[10px] font-bold text-secondary/20 uppercase tracking-[0.2em]">
                    © 2026 ZYNDRIX AGENCIA DIGITAL
                </div>
                
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3">
                       <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                       <span className="text-[10px] font-black uppercase tracking-widest text-secondary/30">Operaciones en Vivo</span>
                    </div>
                </div>
            </div>
        </div>
    </footer>
);
