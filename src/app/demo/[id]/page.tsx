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
        const data = await getLeadById(id);
        setLead(data);
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

  // DYNAMIC DESIGN SYSTEM BASED ON NICHE
  const getDesignSystem = () => {
    const cat = lead.category?.toLowerCase() || '';
    if (cat.includes('restaurante') || cat.includes('comida') || cat.includes('gastronom')) {
      return {
        primary: '#f43f5e', // Rose
        accent: '#fbbf24', // Amber
        bg: 'bg-rose-500/10',
        border: 'border-rose-500/20',
        text: 'text-rose-400',
        hero: 'Gastronomía de Vanguardia',
        vibe: 'Sabor que Domina el Mercado'
      };
    }
    if (cat.includes('clinic') || cat.includes('dent') || cat.includes('salud') || cat.includes('med')) {
      return {
        primary: '#06b6d4', // Cyan
        accent: '#10b981', // Emerald
        bg: 'bg-cyan-500/10',
        border: 'border-cyan-500/20',
        text: 'text-cyan-400',
        hero: 'Excelencia Clínica Digital',
        vibe: 'Tecnología Humana de Alta Precisión'
      };
    }
    if (cat.includes('reforma') || cat.includes('taller') || cat.includes('construc') || cat.includes('mecanic')) {
      return {
        primary: '#f97316', // Orange
        accent: '#3b82f6', // Blue
        bg: 'bg-orange-500/10',
        border: 'border-orange-500/20',
        text: 'text-orange-400',
        hero: 'Infraestructura de Potencia',
        vibe: 'Ingeniería Digital de Alto Rendimiento'
      };
    }
    // Default: Luxury/Architectural (Indigo)
    return {
      primary: '#6366f1',
      accent: '#10b981',
      bg: 'bg-indigo-500/10',
      border: 'border-indigo-500/20',
      text: 'text-indigo-400',
      hero: 'Arquitectura Digital TIER 1',
      vibe: 'Autoridad Digital en Tiempo Real'
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
        {layoutSeed === 2 ? (
          // VARIATION 2: CENTERED HERO
          <div className="flex flex-col items-center text-center mb-32">
            <motion.div 
              initial={{ opacity: 0, y: 30 }} 
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl"
            >
              <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full ${ds.bg} border ${ds.border} ${ds.text} text-[10px] font-black uppercase tracking-[0.2em] mb-8`}>
                <Zap size={12} /> {ds.vibe}
              </div>
              
              <h1 className="text-6xl md:text-9xl font-black tracking-tighter leading-[0.85] mb-8 uppercase">
                Revolución <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r" style={{ backgroundImage: `linear-gradient(to right, ${ds.primary}, ${ds.accent}, #10b981)` }}>
                  {lead.name}
                </span>
              </h1>
              
              <p className="text-2xl text-slate-400 leading-relaxed mb-12 font-light">
                No una web. Una <span className="text-white font-medium italic underline" style={{ textDecorationColor: ds.primary }}>máquina de dominación</span> para {lead.category} en {lead.neighborhood || 'vuestra área'}.
              </p>

              <div className="flex justify-center gap-6 mb-20">
                <button onClick={() => setIsModalOpen(true)} className="bg-white text-black px-12 py-6 rounded-2xl font-black uppercase text-sm tracking-widest hover:scale-105 transition-all shadow-2xl">Activar Ahora</button>
              </div>

              <div className="relative aspect-video max-w-5xl mx-auto rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl">
                 <img src={lead.screenshot_url || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200"} className="w-full h-full object-cover opacity-50" />
                 <div className="absolute inset-0 bg-gradient-to-t from-[#020617] to-transparent" />
                 <motion.div 
                    animate={{ top: ['0%', '100%', '0%'] }}
                    transition={{ duration: 5, repeat: Infinity }}
                    className="absolute left-0 right-0 h-[3px] z-20"
                    style={{ backgroundColor: ds.primary, boxShadow: `0 0 20px ${ds.primary}` }}
                  />
              </div>
            </motion.div>
          </div>
        ) : (
          // VARIATION 0/1: SPLIT HERO (Default)
          <div className="grid lg:grid-cols-2 gap-20 items-center mb-32">
            <motion.div 
              initial={{ opacity: 0, x: -30 }} 
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full ${ds.bg} border ${ds.border} ${ds.text} text-[10px] font-black uppercase tracking-[0.2em] mb-8`}>
                <Zap size={12} /> {ds.vibe}
              </div>
              
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-8 uppercase">
                {layoutSeed === 1 ? 'El Nuevo' : 'El Futuro'} Digital de <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r" style={{ backgroundImage: `linear-gradient(to right, ${ds.primary}, ${ds.accent}, #10b981)` }}>
                  {lead.name}
                </span>
              </h1>
              
              <p className="text-xl text-slate-400 leading-relaxed mb-12 max-w-xl font-light">
                Hemos diseñado una <span className="text-white font-medium italic underline" style={{ textDecorationColor: ds.primary }}>herramienta de autoridad</span> proyectada para dominar el sector de {lead.category || 'Servicios Premium'} en {lead.neighborhood || 'vuestra zona'}.
              </p>

              <div className="flex flex-wrap gap-6">
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="bg-white text-black px-10 py-5 rounded-2xl font-black uppercase text-sm tracking-widest hover:bg-slate-100 transition-all flex items-center gap-3 group shadow-2xl shadow-white/5"
                >
                  Activar Dominio <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                </button>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9, rotateY: -15 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="relative perspective-1000"
            >
              <div className="relative group">
                <div className="absolute -inset-4 rounded-[3rem] blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" style={{ backgroundColor: ds.primary }} />
                <div className="relative bg-slate-900 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl aspect-[16/10]">
                   {lead.screenshot_url ? (
                     <img src={lead.screenshot_url} alt="Presencia Actual" className="w-full h-full object-cover opacity-60 grayscale hover:grayscale-0 transition-all duration-700" />
                   ) : (
                     <div className="w-full h-full flex items-center justify-center bg-slate-800/50">
                       <span className="text-slate-600 font-black italic uppercase text-2xl tracking-tighter">Capturando Digital Asset...</span>
                     </div>
                   )}
                   <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent" />
                   <motion.div 
                      animate={{ top: ['0%', '100%', '0%'] }}
                      transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                      className="absolute left-0 right-0 h-[2px] z-20 pointer-events-none"
                      style={{ backgroundColor: `${ds.primary}80`, boxShadow: `0 0 15px ${ds.primary}` }}
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
