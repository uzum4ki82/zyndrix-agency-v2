'use client';

import { Navbar } from '@/components/layout/Navbar';
import { Hero } from '@/components/sections/Hero';
import { Sistemas } from '@/components/sections/Sistemas';
import { Metodo, Impacto } from '@/components/sections/Metodo';
import { CasosExito } from '@/components/sections/Casos';
import { Testimonios } from '@/components/sections/Testimonios';
import { Planes } from '@/components/sections/Planes';
import { Contacto, Footer } from '@/components/sections/Contacto';

export default function LandingPage() {
  return (
    <div className="min-h-screen text-white font-body selection:bg-primary selection:text-base overflow-x-hidden">
      <Navbar />

      <main className="relative z-10">
        <Hero />
        
        {/* Logos Marquee (Integrated for flow) */}
        <div className="py-12 border-y border-white/5 bg-surface-low/30 overflow-hidden relative z-10">
           <p className="text-center text-[8px] font-black uppercase tracking-[1.5em] text-white/10 mb-8">Integraciones de Élite</p>
           <div className="flex whitespace-nowrap animate-marquee">
             {[1, 2, 3, 4].map((i) => (
               <div key={i} className="flex gap-40 items-center px-20 opacity-10 hover:opacity-100 transition-opacity duration-1000 grayscale invert">
                 <img src="/img/logopart_1.png" alt="Socio" className="h-8 w-auto" />
                 <span className="text-xl font-black italic tracking-tighter">NUCLEO_IA</span>
                 <img src="/img/logopart_2.png" alt="Socio" className="h-8 w-auto" />
                 <span className="text-xl font-black italic tracking-tighter">PROTOCOLO_X</span>
                 <img src="/img/logopart_3.png" alt="Socio" className="h-8 w-auto" />
                 <span className="text-xl font-black italic tracking-tighter text-primary">ZYNDRIX_OS</span>
               </div>
             ))}
           </div>
        </div>

        <Sistemas />
        <Metodo />
        <Impacto />
        <CasosExito />
        <Testimonios />
        <Planes />
        <Contacto />
      </main>

      <Footer />
    </div>
  );
}
