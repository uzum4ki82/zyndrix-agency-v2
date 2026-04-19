'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getLeadById, Lead } from '@/lib/supabase';
import { 
  Shield, 
  Zap, 
  MapPin, 
  ArrowRight, 
  CheckCircle2, 
  Smartphone, 
  Globe, 
  ChevronRight,
  Star,
  Menu,
  Clock,
  Settings,
  X
} from 'lucide-react';
import ConsultationModal from '@/components/ConsultationModal';

export default function DemoPage() {
  const { id } = useParams();
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const fetchLead = async () => {
      const rawId = Array.isArray(id) ? id[0] : id;
      if (rawId && typeof rawId === 'string') {
        // Handle potential newline or carriage return in ID from URL params
        const cleanId = rawId.split('\r')[0].split('\n')[0].trim();
        const data = await getLeadById(cleanId);
        setLead(data);
        setLoading(false);
      }
    };
    fetchLead();

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [id]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-neutral-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-600 rounded-full animate-spin" />
          <p className="text-neutral-400 font-medium animate-pulse text-xs tracking-[0.3em] uppercase">Esculpiendo Activo Digital...</p>
        </div>
      </div>
    );
  }

  // If we have a real external preview (Stitch Project), show it FULL SCREEN with NO OVERLAYS.
  // Unless it's an internal /demo/ path
  if (lead?.stitch_preview_url && !lead.stitch_preview_url.includes('/demo/')) {
    return (
      <div className="fixed inset-0 w-screen h-screen bg-black overflow-hidden z-[9999]">
        <iframe 
          src={lead.stitch_preview_url} 
          className="w-full h-full border-none"
          title={lead.name}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
        {/* Floating CTA for the viewer */}
        <div className="fixed bottom-10 right-10 z-[10000]">
           <button 
             onClick={() => setIsModalOpen(true)}
             className="px-10 py-5 bg-blue-600 text-white rounded-full font-black uppercase tracking-widest shadow-2xl shadow-blue-500/40 hover:scale-105 transition-all"
           >
             Activar Mi Dominio
           </button>
        </div>
      </div>
    );
  }

  if (!lead) {
      return (
        <div className="h-screen w-full flex flex-col items-center justify-center bg-white text-neutral-950 p-10 text-center">
          <Shield size={64} className="text-neutral-200 mb-8" />
          <h1 className="text-xl font-black mb-4 uppercase tracking-[0.5em]">Digital Asset Not Found</h1>
          <p className="text-neutral-500 text-sm max-w-xs">El activo digital solicitado no existe o ha expirado.</p>
          <a href="/" className="mt-12 text-[10px] uppercase font-black tracking-widest text-blue-600">Volver al Inicio</a>
        </div>
      );
  }

  const heroImage = "/img/demos/workshop_hero.png";
  const diagImage = "/img/demos/diag_service.png";
  const mechImage = "/img/demos/mech_service.png";

  return (
    <div className="min-h-screen bg-white text-neutral-900 font-sans selection:bg-blue-600 selection:text-white overflow-x-hidden">
      {/* Navigation */}
      <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        isScrolled ? 'bg-white/80 backdrop-blur-xl border-b border-neutral-200 py-4 shadow-sm' : 'bg-transparent py-8'
      }`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-neutral-900 rounded-xl flex items-center justify-center rotate-3 shadow-lg group hover:rotate-0 transition-transform">
              <span className="text-white font-black text-xl">{lead.name.charAt(0).toUpperCase()}</span>
            </div>
            <span className="text-xl font-extrabold tracking-tighter text-neutral-900">
              {lead.name.toUpperCase()}
            </span>
          </div>

          <div className="hidden md:flex items-center gap-10">
            {['Inicio', 'Servicios', 'Cómo Trabajamos', 'Contacto'].map((item) => (
              <a key={item} href="#" className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-600 hover:text-blue-600 transition-colors">
                {item}
              </a>
            ))}
            <button 
              onClick={() => setIsModalOpen(true)}
              className="px-8 py-3 bg-blue-600 text-white rounded-full text-xs font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-blue-500/20"
            >
              Pide Cita
            </button>
          </div>

          <button className="md:hidden text-neutral-900">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Background Image with High-End Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src={heroImage} 
            alt="Premium Workshop" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-white/50 to-white" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center lg:text-left grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600/10 border border-blue-600/20 rounded-full mb-8">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
              <span className="text-blue-700 text-[10px] font-black uppercase tracking-[0.3em]">Tu taller de confianza en {lead.city || 'la zona'}</span>
            </div>

            <h1 className="text-[12vw] lg:text-[10rem] font-black leading-[0.85] tracking-[-0.06em] text-neutral-900 mb-8 uppercase drop-shadow-sm">
              CUIDAMOS <br/>
              <span className="text-blue-600 italic">TU</span> COCHE,<br/>
              CUIDAMOS DE <span className="text-blue-600">TI</span>.
            </h1>

            <p className="max-w-xl text-xl md:text-2xl text-neutral-600 font-medium leading-relaxed mb-12">
              En {lead.name} te ofrecemos mecánica de calidad, trato cercano y soluciones reales para tu día a día. Sin complicaciones, con total confianza.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-6">
              <button 
                onClick={() => setIsModalOpen(true)}
                className="group w-full sm:w-auto px-12 py-6 bg-blue-600 text-white rounded-full text-lg font-black uppercase tracking-widest hover:scale-105 hover:bg-blue-700 transition-all shadow-2xl shadow-blue-500/40 flex items-center justify-center gap-3"
              >
                Pide Cita Ahora
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="w-full sm:w-auto px-12 py-6 bg-white/80 backdrop-blur-md border border-neutral-200 text-neutral-900 rounded-full text-lg font-black uppercase tracking-widest hover:bg-white transition-all shadow-xl">
                ¿Qué hacemos?
              </button>
            </div>
          </div>
          
          {/* Side Visual element - Card floating */}
          <div className="hidden lg:block relative">
             <div className="bg-white/40 backdrop-blur-3xl border border-white/40 rounded-[3rem] p-12 shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-700">
               <div className="space-y-12">
                 <div className="flex items-start gap-6">
                    <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shrink-0">
                      <Zap className="text-white w-8 h-8 fill-current" />
                    </div>
                    <div>
                      <h4 className="text-2xl font-black text-neutral-900 mb-2 whitespace-nowrap">Diagnosis Digital</h4>
                      <p className="text-neutral-600 text-sm font-medium">Tecnología de última generación para identificar el 100% de los fallos.</p>
                    </div>
                 </div>
                 <div className="flex items-start gap-6">
                    <div className="w-16 h-16 bg-neutral-900 rounded-2xl flex items-center justify-center shrink-0">
                      <Shield className="text-white w-8 h-8" />
                    </div>
                    <div>
                      <h4 className="text-2xl font-black text-neutral-900 mb-2 whitespace-nowrap">Garantía Certificada</h4>
                      <p className="text-neutral-600 text-sm font-medium">Todas nuestras reparaciones cuentan con certificado de garantía oficial.</p>
                    </div>
                 </div>
               </div>
             </div>
          </div>
        </div>

        {/* Brand Bar - Large Cinematic List */}
        <div className="absolute bottom-0 inset-x-0 bg-white/95 backdrop-blur-sm border-t border-neutral-100 py-12 scroll-hide overflow-hidden">
          <div className="flex animate-marquee whitespace-nowrap">
            {['AUDI', 'RENAULT', 'PEUGEOT', 'TOYOTA', 'HYUNDAI', 'FORD', 'CITROËN', 'FIAT', 'MERCEDES', 'BMW', 'VOLKSWAGEN', 'SEAT'].map((brand, i) => (
              <span key={i} className="mx-12 text-4xl font-black tracking-tighter text-neutral-300 hover:text-blue-600 transition-colors cursor-default select-none">{brand}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section - Clean & High Contrast */}
      <section className="py-40 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mb-24">
            <span className="text-blue-600 font-black uppercase tracking-[0.4em] text-xs mb-6 block">Nuestros Pilares</span>
            <h2 className="text-6xl md:text-8xl font-black text-neutral-900 tracking-tighter leading-none mb-10">
              Soluciones de ingeniería <br/> para el día a día.
            </h2>
            <p className="text-xl text-neutral-500 font-medium leading-relaxed">
              En {lead.name} entendemos que tu coche no es solo una máquina, es tu herramienta vital. Por ello fusionamos precisión técnica con un trato humano excepcional.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {/* Service 1 */}
            <div className="group relative h-[600px] rounded-[3rem] overflow-hidden shadow-2xl">
              <img src={mechImage} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt="Mecánica" />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent" />
              <div className="absolute bottom-12 left-12 right-12">
                <span className="text-blue-400 font-black uppercase tracking-widest text-[10px] block mb-4">Ingeniería</span>
                <h3 className="text-white text-4xl font-black mb-4 tracking-tight">Mecánica General</h3>
                <p className="text-neutral-400 text-lg font-medium leading-snug">Desde el cambio de aceite hasta reconstrucción completa de motores.</p>
                <div className="mt-8 pt-6 border-t border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="text-white font-black uppercase tracking-widest text-xs flex items-center gap-2">Explorar <ArrowRight className="w-4 h-4"/></button>
                </div>
              </div>
            </div>

            {/* Service 2 */}
            <div className="group relative h-[600px] rounded-[3rem] overflow-hidden shadow-2xl">
              <img src={diagImage} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt="Diagnosis" />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent" />
              <div className="absolute bottom-12 left-12 right-12">
                <span className="text-emerald-400 font-black uppercase tracking-widest text-[10px] block mb-4">Tecnología</span>
                <h3 className="text-white text-4xl font-black mb-4 tracking-tight">Análisis Digital</h3>
                <p className="text-neutral-400 text-lg font-medium leading-snug">Detección anticipada de errores mediante software de diagnóstico OBD-II.</p>
                <div className="mt-8 pt-6 border-t border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="text-white font-black uppercase tracking-widest text-xs flex items-center gap-2">Explorar <ArrowRight className="w-4 h-4"/></button>
                </div>
              </div>
            </div>

            {/* Service 3: Values Card */}
            <div className="bg-neutral-950 rounded-[3rem] p-16 flex flex-col justify-between shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[80px] -mr-32 -mt-32" />
              <div>
                <h3 className="text-white text-4xl font-black mb-10 tracking-tight leading-tight">¿Por qué <span className="text-blue-600 italic">Tallers Bernat</span>?</h3>
                <div className="space-y-8">
                  {[
                    { t: 'Transparencia', d: 'Presupuestos cerrados sin sorpresas finales.' },
                    { t: 'Rapidez', d: 'Protocolos de entrega optimizados.' },
                    { t: 'Recambios', d: 'Solo utilizamos piezas originales certificadas.' }
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <div className="w-2 h-2 rounded-full bg-blue-600 mt-2" />
                      <div>
                        <h5 className="text-white font-black uppercase tracking-widest text-xs mb-1">{item.t}</h5>
                        <p className="text-neutral-500 font-medium text-sm">{item.d}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="w-full py-6 bg-white text-neutral-950 rounded-2xl font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all transform active:scale-95"
              >
                Solicitar Reservado
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Quote Section - Minimalist & Large */}
      <section className="py-60 bg-neutral-100 relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-neutral-300 to-transparent" />
        <div className="max-w-5xl mx-auto px-6 text-center">
          <div className="w-20 h-20 bg-white shadow-xl rounded-full flex items-center justify-center mx-auto mb-16 rotate-12">
             <Star className="w-8 h-8 text-blue-600 fill-current" />
          </div>
          <h2 className="text-5xl md:text-[5.5rem] font-black text-neutral-950 leading-[0.95] tracking-[-0.05em] mb-20 italic">
            "NO SOLO REPARAMOS<br/>
            MÁQUINAS. REPARAMOS<br/>
            <span className="text-blue-600 not-italic">VUESTRA TRANQUILIDAD.</span>"
          </h2>
          <div className="flex items-center justify-center gap-6">
            <div className="w-16 h-1 bg-neutral-300" />
            <span className="text-sm font-black uppercase tracking-[0.4em] text-neutral-500">Fundado en {lead.city || 'el año 2004'}</span>
            <div className="w-16 h-1 bg-neutral-300" />
          </div>
        </div>
      </section>

      {/* CTA - The Final Contact */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto bg-blue-700 rounded-[4rem] p-12 md:p-32 text-center text-white relative overflow-hidden shadow-3xl shadow-blue-500/30">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
          <div className="relative z-10 max-w-4xl mx-auto">
             <h2 className="text-6xl md:text-9xl font-black tracking-[-0.05em] leading-none mb-12 uppercase">
               ¿Listo para el <br/> siguiente kilómetro?
             </h2>
             <p className="text-white/60 text-xl md:text-2xl font-medium mb-16 max-w-2xl mx-auto">
               Asigne su plaza hoy mismo y experimente el servicio de mantenimiento premium que su vehículo merece.
             </p>
             <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="w-full sm:w-auto px-16 py-8 bg-white text-blue-700 rounded-[2rem] text-2xl font-black uppercase tracking-widest hover:scale-105 transition-all shadow-2xl"
                >
                  Reservar Ahora
                </button>
             </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-950 text-white pt-40 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-24 mb-40">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-12">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center rotate-3">
                  <span className="text-black font-black text-xl">{lead.name.charAt(0)}</span>
                </div>
                <span className="text-3xl font-black tracking-tighter uppercase">{lead.name}</span>
              </div>
              <p className="text-neutral-500 text-2xl font-medium max-w-sm mb-12 leading-relaxed">
                Referente en automoción y mecánica de precisión en {lead.city || 'vuestra provincia'}.
              </p>
              <div className="flex gap-4">
                {[Smartphone, MapPin, Globe].map((Icon, i) => (
                  <div key={i} className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-white text-neutral-400 hover:text-black transition-all cursor-pointer border border-white/10">
                    <Icon className="w-6 h-6" />
                  </div>
                ))}
              </div>
            </div>
            
            <div>
               <h4 className="text-sm font-black uppercase tracking-[0.3em] mb-12 text-blue-600">Compañía</h4>
               <ul className="space-y-6">
                 {['Inicio', 'Especialidades', 'Cómo Trabajamos', 'Equipo', 'Legal'].map(item => (
                   <li key={item}><a href="#" className="text-neutral-500 hover:text-white transition-colors text-lg font-medium">{item}</a></li>
                 ))}
               </ul>
            </div>

            <div>
               <h4 className="text-sm font-black uppercase tracking-[0.3em] mb-12 text-blue-600">Contacto</h4>
               <div className="space-y-8">
                 <div>
                   <p className="text-neutral-600 text-xs font-black uppercase tracking-widest mb-2">Ubicación</p>
                   <p className="text-neutral-300 font-medium">{lead.address || 'Polígono Industrial, Carrer 4'}</p>
                 </div>
                 <div>
                   <p className="text-neutral-600 text-xs font-black uppercase tracking-widest mb-2">Teléfono Directo</p>
                   <p className="text-neutral-300 font-medium">{lead.phone || '+34 930 000 000'}</p>
                 </div>
               </div>
            </div>
          </div>
          
          <div className="pt-20 border-t border-white/5 flex flex-col md:flex-row justify-between gap-10 items-center">
            <p className="text-neutral-700 font-black uppercase tracking-[0.3em] text-[10px]">© 2026 {lead.name.toUpperCase()} — TODOS LOS DERECHOS RESERVADOS</p>
            <div className="flex items-center gap-4 text-neutral-700 font-black uppercase tracking-[0.3em] text-[10px]">
               <span className="text-white/20">Desarrollo de Activos por Zyndrix</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Styles for animations */}
      <style jsx global>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: inline-flex;
          animation: marquee 40s linear infinite;
        }
        .scroll-hide::-webkit-scrollbar { display: none; }
      `}</style>

      {/* Consultation Modal */}
      <ConsultationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        leadName={lead.name}
      />
    </div>
  );
}
