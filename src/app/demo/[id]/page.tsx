"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { getLeadById, Lead } from '@/lib/supabase';
import { Shield, Zap, TrendingUp, ArrowRight, CheckCircle2, Globe, Laptop, Smartphone, Eye } from 'lucide-react';
import SocialProof from '@/components/SocialProof';
import HeatMapOverlay from '@/components/HeatMapOverlay';
import ConsultationModal from '@/components/ConsultationModal';

export default function DemoPage() {
  const { id } = useParams();
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    async function load() {
      if (typeof id === 'string') {
        try {
          const res = await fetch(`/api/leads/${id}`);
          if (res.ok) {
            const data = await res.json();
            setLead(data);
          } else {
            console.error('Failed to load lead via API', await res.text());
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
        <motion.div 
          animate={{ rotate: 360 }} 
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full" 
        />
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-[#020617] text-white p-10 text-center">
        <h1 className="text-4xl font-bold mb-4 italic">Error de Acceso</h1>
        <p className="text-slate-400 max-w-md">Este Active Digital ha expirado o no ha sido generado correctamente para este ID.</p>
      </div>
    );
  }

  // DYNAMIC DESIGN SYSTEM BASED ON REAL AUDIT (ADAPTIVE DNA)
  const getDesignSystem = () => {
    const cat = lead.category?.toLowerCase() || '';
    
    // Priority 1: CUSTOM DATA from Audit (if available)
    const auditPrimary = lead.extracted_colors?.primary;
    const auditFont = lead.business_dna?.vibe;

    if (cat.includes('clinic') || cat.includes('dent') || cat.includes('salud') || cat.includes('med')) {
      return {
        id: 'clinic',
        primary: auditPrimary || '#06b6d4',
        accent: '#10b981',
        bg: 'bg-[#f8fafc]',
        textMain: 'text-slate-900',
        textSub: 'text-slate-500',
        font: 'font-sans',
        hero: 'Precisión Arquitectónica Digital',
        tagline: 'Excelencia asistencial proyectada a través de tecnología TIER 1.',
        vibe: 'CLINICAL PRECISION'
      };
    }

    if (cat.includes('restaurante') || cat.includes('comida') || cat.includes('gastronom') || cat.includes('hotel') || cat.includes('peluquer')) {
      return {
        id: 'sensory',
        primary: auditPrimary || '#f43f5e',
        accent: '#fbbf24',
        bg: 'bg-[#0f172a]',
        textMain: 'text-white',
        textSub: 'text-slate-400',
        font: 'font-serif', // We'll need a serif font loaded
        hero: 'Inmersión Sensorial Digital',
        tagline: 'Diseño emocional para marcas que definen el estilo de vida contemporáneo.',
        vibe: 'SENSORY LUXURY'
      };
    }

    // Default: INDUSTRIAL POWER / CORPORATE
    return {
      id: 'industrial',
      primary: auditPrimary || '#6366f1',
      accent: '#10b981',
      bg: 'bg-[#020617]',
      textMain: 'text-white',
      textSub: 'text-slate-400',
      font: 'font-mono',
      hero: 'Infraestructura de Alto Rendimiento',
      tagline: 'Ingeniería digital blindada para la dominación de mercado.',
      vibe: 'INDUSTRIAL POWER'
    };
  };

  const ds = getDesignSystem();

  // Layout variation seed
  const layoutSeed = (id?.toString().length || 0) % 3;

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans selection:bg-indigo-500 selection:text-white pb-32">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full blur-[120px]`} style={{ backgroundColor: `${ds.primary}15` }} />
        <div className={`absolute bottom-[20%] right-[10%] w-[40%] h-[40%] rounded-full blur-[120px]`} style={{ backgroundColor: `${ds.accent}15` }} />
        {layoutSeed === 1 && <div className="absolute top-[40%] left-[30%] w-[30%] h-[30%] bg-white/5 rounded-full blur-[100px]" />}
      </div>

      <nav className="relative z-10 px-10 py-8 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 bg-white rounded-lg flex items-center justify-center text-black font-black italic shadow-lg shadow-white/10">Z</div>
          <span className="text-xl font-black tracking-tighter uppercase">Zyndrix <span style={{ color: ds.primary }}>I-Q</span></span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-[11px] font-black uppercase tracking-widest text-slate-400">
          <span style={{ color: ds.primary }}>Dossier #{id?.toString().substring(0,4) || '729'}</span>
          <span>{ds.hero}</span>
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span>SISTEMA ACTIVO</span>
          </div>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-10 mt-24">
        {ds.id === 'clinic' ? (
          // TEMPLATE: CLINICAL PRECISION
          <div className="flex flex-col items-center">
            <motion.div 
              initial={{ opacity: 0, y: 30 }} 
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-24"
            >
              <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-cyan-500/5 border border-cyan-500/10 text-cyan-600 text-[10px] font-black uppercase tracking-[0.3em] mb-12 shadow-sm">
                 <Shield size={14} /> {ds.vibe}
              </div>
              <h1 className="text-7xl md:text-[140px] font-thin tracking-tighter text-slate-900 leading-[0.85] mb-12">
                EL FUTURO <br/>
                <span className="font-black italic" style={{ color: ds.primary }}>CLÍNICO</span> DE <br/>
                <span className="font-black text-slate-900 uppercase tracking-tighter">{lead.name}</span>
              </h1>
              <p className="text-2xl text-slate-500 max-w-3xl mx-auto font-light leading-relaxed mb-16">
                Redefiniendo el estándar asistencial en <span className="text-slate-900 font-medium italic underline decoration-cyan-500/30">{lead.neighborhood || 'vuestra área'}</span> a través de una <span className="text-slate-900 font-medium">arquitectura de precisión digital</span>.
              </p>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-slate-900 text-white px-14 py-6 rounded-full font-black uppercase text-xs tracking-widest hover:bg-cyan-600 transition-all shadow-xl shadow-cyan-500/10"
              >
                Solicitar Expediente Técnico
              </button>
            </motion.div>

            <div className="w-full relative py-20 mb-40">
               <div className="absolute inset-0 bg-slate-100 rounded-[5rem] -rotate-1 shadow-inner" />
               <div className="relative z-10 grid lg:grid-cols-2 gap-32 items-center p-20">
                  <div className="space-y-12">
                     <h2 className="text-5xl font-black text-slate-900 leading-tight tracking-tighter uppercase italic">DIAGNÓSTICO:<br/>BRECHA DIGITAL</h2>
                     <div className="space-y-4">
                        {lead.pain_points?.slice(0, 3).map((p, i) => (
                          <div key={i} className="flex items-center gap-4 text-slate-500 bg-white p-6 rounded-2xl border border-slate-200 hover:shadow-lg transition-shadow">
                             <div className="h-6 w-6 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center font-bold text-xs shrink-0">!</div>
                             <span className="text-sm uppercase tracking-tight font-light">{p}</span>
                          </div>
                        ))}
                     </div>
                  </div>
                  <div className="relative">
                    <div className="aspect-[4/5] bg-white rounded-[4rem] shadow-2xl overflow-hidden border border-slate-200">
                        <img src={lead.screenshot_url || "https://images.unsplash.com/photo-1576091160550-21733b091f8d?w=1200"} className="w-full h-full object-cover grayscale opacity-10" />
                        <div className="absolute inset-0 flex items-center justify-center">
                           <div className="text-center p-12">
                              <Eye size={64} className="mx-auto mb-6 text-cyan-500 opacity-80" />
                              <p className="text-slate-900 font-black uppercase text-3xl tracking-tighter leading-none">PROTOCOLOS DE <br/>MODERNIZACIÓN</p>
                              <div className="h-1 w-12 bg-cyan-500 mx-auto mt-6" />
                              <p className="text-slate-400 font-light mt-8 italic text-sm">Analizando ADN estructural para la clínica...</p>
                           </div>
                        </div>
                    </div>
                  </div>
               </div>
            </div>
          </div>
        ) : ds.id === 'sensory' ? (
          // TEMPLATE: SENSORY LUXURY (For Restaurants)
          <div className="min-h-screen">
             <div className="fixed top-0 left-0 w-full h-screen opacity-60 pointer-events-none">
                <img src={lead.screenshot_url || "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=1200"} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-b from-[#0f172a] via-[#0f172a]/80 to-[#0f172a]" />
             </div>
             
             <div className="relative pt-20 flex flex-col items-center text-center mb-64">
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                  <span className="text-[14px] font-black uppercase tracking-[0.6em] text-rose-500 mb-8 block">GASTRONOMÍA & LUJO DIGITAL</span>
                  <h1 className="text-8xl md:text-[180px] font-thin text-white leading-[0.75] mb-12 italic tracking-tighter">
                    {lead.name.split(' ')[0]} <br/>
                    <span className="font-black not-italic tracking-tighter uppercase" style={{ color: ds.primary }}>{lead.name.split(' ').slice(1).join(' ')}</span>
                  </h1>
                  <p className="text-3xl text-slate-300 max-w-3xl mx-auto leading-relaxed italic opacity-80 mb-20">
                    Rediseñando la experiencia del sector {lead.category} con una <span className="text-white border-b-2 font-medium" style={{ borderColor: ds.primary }}>presencia inmersiva</span> que define el nuevo estándar del mercado.
                  </p>
                  <button 
                    onClick={() => setIsModalOpen(true)}
                    className="group relative px-20 py-10 overflow-hidden rounded-full shadow-2xl"
                  >
                    <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-700" />
                    <div className="relative border-2 border-white/20 text-white group-hover:text-black font-black uppercase text-xs tracking-[0.4em] px-10">
                       REVELAR PROYECTO EXCLUSIVO
                    </div>
                  </button>
                </motion.div>
             </div>
          </div>
        ) : (
          // TEMPLATE: INDUSTRIAL POWER (Default)
          <div className="grid lg:grid-cols-2 gap-20 items-center mb-64">
            <motion.div 
              initial={{ opacity: 0, x: -30 }} 
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className={`inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white/5 border border-white/10 text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mb-12`}>
                <Zap size={14} style={{ color: ds.primary }} /> {ds.vibe}
              </div>
              
              <h1 className="text-6xl md:text-[110px] font-black tracking-tighter leading-[0.8] mb-12 uppercase text-white">
                EL FUTURO <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r" style={{ backgroundImage: `linear-gradient(to right, ${ds.primary}, ${ds.accent}, #10b981)` }}>
                  {lead.name}
                </span>
              </h1>
              
              <p className="text-2xl text-slate-400 leading-relaxed mb-16 max-w-xl font-light">
                Infraestructura blindada para dominar el sector de <span className="font-bold underline decoration-indigo-500/50 italic uppercase tracking-tighter" style={{ color: ds.primary }}>{lead.category}</span> en vuestra zona de influencia.
              </p>

              <div className="flex flex-wrap gap-6">
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="bg-white text-black px-16 py-8 rounded-3xl font-black uppercase text-xs tracking-[0.3em] hover:bg-slate-100 transition-all flex items-center gap-4 group shadow-2xl shadow-white/5"
                >
                  Activar Dominio <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                </button>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9, rotateY: -15 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 1.2, delay: 0.2 }}
              className="relative perspective-1000"
            >
              <div className="relative group">
                <div className="absolute -inset-8 rounded-[4rem] blur-3xl opacity-20 group-hover:opacity-40 transition-opacity" style={{ backgroundColor: ds.primary }} />
                <div className="relative bg-black border border-white/10 rounded-[3.5rem] overflow-hidden shadow-2xl aspect-[16/10]">
                   {lead.screenshot_url ? (
                     <img src={lead.screenshot_url} alt="Presencia Actual" className="w-full h-full object-cover opacity-50 grayscale" />
                   ) : (
                     <div className="w-full h-full flex items-center justify-center bg-slate-900">
                       <span className="text-slate-600 font-black italic uppercase text-3xl tracking-tighter">Asset Discovery...</span>
                     </div>
                   )}
                   <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                   <motion.div 
                      animate={{ top: ['0%', '100%', '0%'] }}
                      transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
                      className="absolute left-0 right-0 h-[3px] z-20 pointer-events-none"
                      style={{ backgroundColor: `${ds.primary}80`, boxShadow: `0 0 30px ${ds.primary}` }}
                    />
                   <HeatMapOverlay />
                </div>
              </div>
            </motion.div>
          </div>
        )}
        
        <div className="mt-32">
          <SocialProof />
        </div>
        
        <div className="mt-40 grid md:grid-cols-3 gap-8">
           {[
             { title: ds.hero, icon: Shield, desc: `Infraestructura diseñada específicamente para el sector de ${lead.category || 'Servicios'}.` },
             { title: "Captura Activa", icon: Zap, desc: "Embudo de ventas con inteligencia de respuesta inmediata vía WhatsApp." },
             { title: "Dominio Local", icon: Globe, desc: `Posicionamiento geo-específico en ${lead.neighborhood || 'tu área'} para saturar búsquedas.` }
           ].map((item, i) => (
             <motion.div key={i} className="p-10 rounded-[2rem] bg-slate-900/30 border border-white/5 backdrop-blur-sm transition-all group hover:border-white/20">
                <div className={`h-14 w-14 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`} style={{ backgroundColor: `${ds.primary}15`, border: `1px solid ${ds.primary}30`, color: ds.primary }}>
                   <item.icon size={28} />
                </div>
                <h3 className="text-xl font-bold mb-4 uppercase tracking-tighter leading-tight">{item.title}</h3>
                <p className="text-slate-400 font-light leading-relaxed">{item.desc}</p>
             </motion.div>
           ))}
        </div>
      </main>
      
      <footer className="mt-40 border-t border-white/5 pt-20 pb-10 px-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10 text-center md:text-left">
           <div>
              <p className="text-[10px] uppercase font-black text-slate-500 tracking-[0.3em] mb-4">Protocolo de Exclusividad</p>
              <p className="text-slate-400 font-light max-w-md">Este dossier ha sido generado específicamente para la Dirección de {lead.name} de forma única.</p>
           </div>
           <div className="flex items-center gap-6 text-slate-700">
              <Globe size={20} />
              <Laptop size={20} />
              <Smartphone size={20} />
           </div>
        </div>
      </footer>

      <ConsultationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        businessName={lead.name}
      />
    </div>
  );
}
