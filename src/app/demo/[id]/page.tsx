"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Lead } from '@/lib/supabase';
import { 
  MapPin, Phone, Instagram, Facebook, Globe, 
  ArrowRight, Shield, Zap, Sparkles, MessageSquare, 
  Menu, X, CheckCircle2, Star, Clock, Trophy
} from 'lucide-react';
import ConsultationModal from '@/components/ConsultationModal';

export default function DemoPage() {
  const { id } = useParams();
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    async function load() {
      const rawId = Array.isArray(id) ? id[0] : id;
      if (rawId && typeof rawId === 'string') {
        try {
          const cleanId = rawId.split('\r')[0].split('\n')[0].trim();
          const res = await fetch(`/api/leads/${cleanId}`);
          if (res.ok) {
            const data = await res.json();
            setLead(data);
          }
        } catch (err) {
          console.error('Error fetching lead:', err);
        }
      }
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#020617]">
        <div className="flex flex-col items-center gap-6">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            className="w-10 h-10 border-t-2 border-indigo-500 rounded-full"
          />
        </div>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-[#020617] text-white p-10 text-center">
        <Shield size={64} className="text-rose-500/20 mb-8" />
        <h1 className="text-xl font-black mb-4 uppercase tracking-[0.5em] text-rose-500">Instance Not Found</h1>
        <p className="text-slate-500 text-sm max-w-xs">The requested digital asset does not exist.</p>
        <a href="/" className="mt-12 text-[10px] uppercase font-black tracking-widest text-indigo-400">Return Home</a>
      </div>
    );
  }

  // If we have a real external preview, show it FULL SCREEN with NO OVERLAYS.
  if (lead.stitch_preview_url && !lead.stitch_preview_url.includes('/demo/')) {
    return (
      <div className="fixed inset-0 w-screen h-screen bg-black overflow-hidden z-[9999]">
        <iframe 
          src={lead.stitch_preview_url} 
          className="w-full h-full border-none"
          title={lead.name}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  const primaryColor = lead.extracted_colors?.primary || '#6366f1';
  const secondaryColor = lead.extracted_colors?.secondary || '#10b981';
  const bgColor = lead.extracted_colors?.background || '#020617';

  const services = [
    { title: "Servicios de Precisión", desc: "Gestión avanzada de todos los requerimientos con los más altos estándares.", icon: <Shield size={24} /> },
    { title: "Excelencia Operativa", desc: "Optimización continua y atención al detalle en cada fase del proceso.", icon: <Zap size={24} /> },
    { title: "Compromiso de Calidad", desc: "Integración perfecta de tradición y tecnologías modernas de alto nivel.", icon: <Star size={24} /> }
  ];

  const stats = [
    { label: "Años de Experiencia", value: "20+" },
    { label: "Clientes Satisfechos", value: "1.5k+" },
    { label: "Proyectos Realizados", value: "3k+" },
    { label: "Garantía de Calidad", value: "100%" }
  ];

  return (
    <div 
      className="min-h-screen text-slate-200 font-sans selection:bg-indigo-500 selection:text-white overflow-x-hidden"
      style={{ backgroundColor: bgColor }}
    >
      {/* RADIANT DEPTH BACKGROUND */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div 
          className="absolute -top-[25%] -left-[25%] w-[100%] h-[100%] rounded-full opacity-30 blur-[150px]"
          style={{ background: `radial-gradient(circle, ${primaryColor} 0%, transparent 70%)` }}
        />
        <div 
          className="absolute -bottom-[25%] -right-[25%] w-[100%] h-[100%] rounded-full opacity-20 blur-[150px]"
          style={{ background: `radial-gradient(circle, ${secondaryColor} 0%, transparent 70%)` }}
        />
      </div>

      {/* NAVIGATION - GLASSMORPHISM */}
      <nav className="fixed top-0 left-0 right-0 z-[100] backdrop-blur-md bg-black/30 border-b border-white/10">
        <div className="container mx-auto px-8 h-24 flex items-center justify-between">
          <div className="text-2xl font-black tracking-tighter uppercase flex items-center gap-4">
             <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: primaryColor }}>
                <Zap size={20} className="text-black" />
             </div>
             <span className="hidden sm:inline">{lead.name}</span>
          </div>

          <div className="hidden lg:flex items-center gap-10 font-bold text-[11px] uppercase tracking-[0.2em]">
             <a href="#experiencia" className="hover:text-white transition-colors text-white/60">Experiencia</a>
             <a href="#servicios" className="hover:text-white transition-colors text-white/60">Servicios</a>
             <a href="#contacto" className="hover:text-white transition-colors text-white/60">Ubicación</a>
             <button 
                onClick={() => setIsModalOpen(true)}
                className="px-8 py-3.5 rounded-full border border-white/20 hover:bg-white hover:text-black transition-all group flex items-center gap-2"
             >
                Contactar <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
             </button>
          </div>

          <button className="lg:hidden text-white p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={32} /> : <Menu size={32} />}
          </button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[150] bg-[#020617] p-12 lg:hidden flex flex-col justify-center gap-10"
          >
            <button className="absolute top-10 right-10 text-white" onClick={() => setIsMenuOpen(false)}>
              <X size={40} />
            </button>
            <a href="#experiencia" className="text-5xl font-black uppercase tracking-tighter" onClick={() => setIsMenuOpen(false)}>Experiencia</a>
            <a href="#servicios" className="text-5xl font-black uppercase tracking-tighter" onClick={() => setIsMenuOpen(false)}>Servicios</a>
            <a href="#contacto" className="text-5xl font-black uppercase tracking-tighter" onClick={() => setIsMenuOpen(false)}>Localización</a>
            <button 
              onClick={() => { setIsModalOpen(true); setIsMenuOpen(false); }}
              className="mt-10 px-12 py-6 bg-white text-black text-xs font-black uppercase tracking-[0.2em] rounded-2xl"
            >
              Solicitar Información
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="relative z-10">
        {/* HERO - IMMERSIVE 100VH */}
        <section className="relative min-h-screen flex items-center justify-center pt-24 overflow-hidden">
          <div className="absolute inset-0 z-0">
             <img 
               src={lead.screenshot_url || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070"} 
               className="w-full h-full object-cover"
               alt="Background"
             />
             <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
             <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#020617]" style={{ backgroundImage: `linear-gradient(to bottom, transparent, transparent, ${bgColor})` }} />
          </div>

          <div className="container mx-auto px-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-6xl"
            >
              <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/10 border border-white/10 text-[11px] font-bold uppercase tracking-[0.3em] text-white/70 mb-10 backdrop-blur-sm">
                <Sparkles size={14} className="text-indigo-400" /> Líder en {lead.category || 'Servicios Profesionales'}
              </div>
              
              <h1 className="text-7xl md:text-[min(12vw,140px)] font-black leading-[0.9] tracking-[-0.05em] uppercase mb-12 text-white">
                {lead.name}
              </h1>
              
              <p className="text-xl md:text-3xl text-slate-300/80 max-w-3xl mb-16 font-light leading-snug">
                Definiendo el estándar de excelencia en <span className="text-white font-medium">{lead.city || 'la región'}</span> a través de precisión, calidad y compromiso absoluto.
              </p>

              <div className="flex flex-wrap gap-8 items-center">
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="px-10 py-5 bg-white text-black text-xs font-black uppercase tracking-[0.2em] hover:scale-105 transition-all shadow-2xl rounded-xl"
                >
                  Hablar con nosotros
                </button>
                <div className="flex items-center gap-4 text-[12px] font-black uppercase tracking-[0.4em] text-white/40">
                  <span className="w-12 h-[1px] bg-white/20" /> {lead.category || 'Empresa'} Consolidada
                </div>
              </div>
            </motion.div>
          </div>
          
          <div className="absolute bottom-12 right-12 flex items-center gap-6 opacity-30 group cursor-pointer">
            <span className="text-[10px] font-black tracking-[0.5em] uppercase group-hover:text-white transition-colors">Saber Más</span>
            <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
          </div>
        </section>

        {/* TRUST BAR / BRANDS */}
        <div className="py-16 border-y border-white/5 bg-black/40 backdrop-blur-sm overflow-hidden">
          <div className="container mx-auto px-8">
            <p className="text-center text-[10px] font-black uppercase tracking-[0.5em] text-slate-500 mb-8">Marcas de Confianza & Aliados Estratégicos</p>
            <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
               <span className="text-2xl font-black italic tracking-tighter">PREMIUM</span>
               <span className="text-2xl font-black italic tracking-tighter">EXCELLENCE</span>
               <span className="text-2xl font-black italic tracking-tighter">PRECISION</span>
               <span className="text-2xl font-black italic tracking-tighter">AUTHORITY</span>
               <span className="text-2xl font-black italic tracking-tighter">DOMINANCE</span>
            </div>
          </div>
        </div>

        {/* STATS SECTION */}
        <section id="experiencia" className="py-40 px-8">
          <div className="container mx-auto max-w-7xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-24">
              {stats.map((stat, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="space-y-4"
                >
                  <div className="text-6xl md:text-8xl font-black tracking-tighter block text-white" style={{ color: primaryColor }}>{stat.value}</div>
                  <div className="text-[10px] uppercase font-black tracking-[0.4em] text-slate-500">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* BRAND STATEMENT - FULL BLEED SPLIT */}
        <section className="py-60 md:py-80 px-8 bg-white/5">
          <div className="container mx-auto max-w-7xl">
            <div className="grid lg:grid-cols-2 gap-32 items-center">
               <motion.div 
                 initial={{ opacity: 0, x: -50 }}
                 whileInView={{ opacity: 1, x: 0 }}
                 className="space-y-12"
               >
                 <span className="text-xs font-black uppercase tracking-[1em] text-indigo-500">Nuestra Filosofía</span>
                 <h2 className="text-6xl md:text-9xl font-black uppercase tracking-[-0.04em] leading-[0.8] text-white">
                   Más que <br/> un servicio.
                 </h2>
                 <p className="text-2xl text-slate-400 font-light leading-relaxed max-w-lg">
                    Estamos redefiniendo la experiencia de {lead.category || 'servicio'} en {lead.city || 'el área'}. Un legado construido sobre resultados reales.
                 </p>
               </motion.div>
               <motion.div 
                 initial={{ opacity: 0, x: 50 }}
                 whileInView={{ opacity: 1, x: 0 }}
                 className="space-y-10"
               >
                  <div className="backdrop-blur-2xl bg-white/[0.03] border border-white/10 p-16 rounded-[3rem]">
                     <p className="text-2xl leading-relaxed font-semibold text-white mb-8">
                       Ofrecemos una autoridad incomparable a través de una atención meticulosa al detalle en cada operación.
                     </p>
                     <div className="space-y-6">
                        {[
                          "Compromiso total con la excelencia técnica.",
                          "Atención personalizada a cada necesidad.",
                          "Resultados validados por años de experiencia."
                        ].map((text, i) => (
                          <div key={i} className="flex items-start gap-4">
                            <CheckCircle2 size={24} className="text-emerald-500 shrink-0" />
                            <span className="text-slate-400 font-medium">{text}</span>
                          </div>
                        ))}
                     </div>
                  </div>
               </motion.div>
            </div>
          </div>
        </section>

        {/* SERVICES GRID */}
        <section id="servicios" className="py-40 md:py-60 px-8">
          <div className="container mx-auto max-w-7xl">
             <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-32">
                <div className="space-y-6">
                   <span className="text-xs font-black uppercase tracking-[1em] text-white/30">Nuestros Pilares</span>
                   <h3 className="text-6xl md:text-8xl font-black uppercase tracking-tighter text-white">Excelencia <br/> Especializada</h3>
                </div>
                <div className="flex flex-col items-start gap-6">
                   <p className="text-slate-400 text-lg max-w-xs leading-relaxed">
                      Despliegue táctico de servicios especializados para asegurar la máxima calidad.
                   </p>
                </div>
             </div>

             <div className="grid md:grid-cols-3 gap-10">
                {services.map((s, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.2 }}
                    className="p-14 border border-white/5 rounded-[3rem] bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/20 transition-all group overflow-hidden relative"
                  >
                     <div className="absolute -right-10 -bottom-10 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity scale-[3]">
                        {s.icon}
                     </div>
                     <div 
                        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-12 group-hover:scale-110 transition-transform"
                        style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}
                     >
                        {s.icon}
                     </div>
                     <h4 className="text-2xl font-black uppercase tracking-tight mb-6 text-white">{s.title}</h4>
                     <p className="text-slate-400 text-lg leading-relaxed">{s.desc}</p>
                  </motion.div>
                ))}
             </div>
          </div>
        </section>

        {/* LOCATION / MAP - FULL WIDTH FEEL */}
        <section id="contacto" className="py-40 md:py-60 px-8">
          <div className="container mx-auto max-w-7xl">
            <div className="bg-white/[0.02] rounded-[4rem] overflow-hidden border border-white/10">
               <div className="grid lg:grid-cols-2 gap-0 items-stretch">
                  <div className="p-16 md:p-24 space-y-16">
                     <div className="space-y-6">
                        <span className="text-xs font-black uppercase tracking-[1em] text-white/20">Ubicación</span>
                        <h3 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-tight text-white">Nuestra <br/> Sede</h3>
                        <p className="text-slate-400 text-2xl font-light">
                          Visítanos en nuestro centro operativo principal en: <br/>
                          <span className="text-white font-bold block mt-6 text-4xl tracking-tight">{lead.address}</span>
                        </p>
                     </div>
                     
                     <div className="grid sm:grid-cols-2 gap-12">
                        <div className="space-y-4">
                           <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Contacto</span>
                           <p className="text-xl font-bold flex items-center gap-4 text-white">
                             <Phone size={20} className="text-indigo-500" /> {lead.phone || 'Privado'}
                           </p>
                        </div>
                        <div className="space-y-4">
                           <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Horarios</span>
                           <p className="text-xl font-bold flex items-center gap-4 text-white">
                             <Clock size={20} className="text-indigo-500" /> Lunes - Viernes
                           </p>
                        </div>
                     </div>
                  </div>
                  <div className="relative min-h-[500px]">
                     <img 
                       src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=1200" 
                       className="w-full h-full object-cover grayscale brightness-50 contrast-125"
                       alt="Location"
                     />
                     <div className="absolute inset-0 bg-indigo-500/10 mix-blend-overlay" />
                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        <div className="w-12 h-12 bg-indigo-500 rounded-full animate-ping absolute opacity-40" />
                        <div className="w-12 h-12 bg-white rounded-full relative z-10 border-8 border-indigo-500 shadow-3xl" />
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </section>

        {/* FINAL CTA - HYPER IMPACT */}
        <section className="relative py-80 px-10 text-center overflow-hidden bg-white">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="relative z-10"
            >
              <h2 className="text-black text-7xl md:text-[min(15vw,180px)] font-black uppercase tracking-tighter mb-20 italic leading-[0.75]">
                 Construye tu <br/> Dominio Comercial.
              </h2>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="px-16 py-8 bg-black text-white text-[11px] font-black uppercase tracking-[1em] hover:scale-110 active:scale-95 transition-all shadow-4xl rounded-2xl"
              >
                Comenzar ahora
              </button>
            </motion.div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="py-32 border-t border-white/5 bg-black/60 relative z-10">
         <div className="container mx-auto px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-24">
               <div className="col-span-2 space-y-10">
                  <div className="text-4xl font-black tracking-tighter uppercase text-white">{lead.name}</div>
                  <p className="text-slate-500 text-lg leading-relaxed max-w-sm">
                    Dedicados a proporcionar estándares de excelencia y resultados estratégicos para cada uno de nuestros clientes.
                  </p>
                  <div className="flex gap-8 text-white/40">
                      <Instagram size={24} className="hover:text-white cursor-pointer" />
                      <Facebook size={24} className="hover:text-white cursor-pointer" />
                      <Globe size={24} className="hover:text-white cursor-pointer" />
                  </div>
               </div>
               <div className="space-y-8">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Páginas</span>
                  <ul className="space-y-5 text-lg text-slate-500 font-medium">
                     <li className="hover:text-white cursor-pointer transition-colors">Servicios</li>
                     <li className="hover:text-white cursor-pointer transition-colors">Proyectos</li>
                     <li className="hover:text-white cursor-pointer transition-colors">Nosotros</li>
                  </ul>
               </div>
               <div className="space-y-8">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Legal</span>
                  <ul className="space-y-5 text-lg text-slate-500 font-medium">
                     <li className="hover:text-white cursor-pointer transition-colors">Privacidad</li>
                     <li className="hover:text-white cursor-pointer transition-colors">Aviso Legal</li>
                     <li className="hover:text-white cursor-pointer transition-colors">Cookies</li>
                  </ul>
               </div>
            </div>
            <div className="mt-40 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-10">
               <span className="text-[10px] font-black uppercase tracking-[0.6em] text-slate-600">© 2026 {lead.name} | Desarrollado para la Excelencia</span>
               <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-slate-700">
                  <Shield size={14} /> Activo Digital Verificado
               </div>
            </div>
         </div>
      </footer>

      <ConsultationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        businessName={lead.name}
      />

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@100;300;400;600;700;800;900&display=swap');
        
        body {
          font-family: 'Inter', sans-serif;
          background-color: #020617;
          margin: 0;
          padding: 0;
          scroll-behavior: smooth;
        }

        h1, h2, h3, h4 {
           letter-spacing: -0.05em;
        }

        .shadow-3xl {
          box-shadow: 0 50px 100px -20px rgba(0, 0, 0, 0.8);
        }

        .shadow-4xl {
          box-shadow: 0 30px 60px -12px rgba(0, 0, 0, 0.5);
        }

        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: #020617;
        }
        ::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
}
