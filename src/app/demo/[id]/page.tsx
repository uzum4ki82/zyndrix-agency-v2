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

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans selection:bg-indigo-500 selection:text-white pb-32">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]" />
      </div>

      <nav className="relative z-10 px-10 py-8 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 bg-white rounded-lg flex items-center justify-center text-black font-black italic">Z</div>
          <span className="text-xl font-black tracking-tighter uppercase">Zyndrix <span className="text-indigo-500">I-Q</span></span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-[11px] font-black uppercase tracking-widest text-slate-400">
          <span className="text-indigo-500">Dossier #4829</span>
          <span>Arquitectura Digital</span>
          <span>Analítica Predictiva</span>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-10 mt-24">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }} 
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] mb-8">
              <Zap size={12} /> Exclusividad de Zona Detectada
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-8 uppercase">
              El Futuro Digital de <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-blue-400 to-emerald-400">
                {lead.name}
              </span>
            </h1>
            
            <p className="text-xl text-slate-400 leading-relaxed mb-12 max-w-xl font-light">
              Hemos diseñado una <span className="text-white font-medium italic underline decoration-indigo-500">herramienta de autoridad</span> proyectada para dominar el sector de {lead.category} en {lead.neighborhood || 'vuestra zona'}.
            </p>

            <div className="flex flex-wrap gap-6">
              <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-white text-black px-10 py-5 rounded-2xl font-black uppercase text-sm tracking-widest hover:bg-slate-100 transition-all flex items-center gap-3 group shadow-2xl shadow-white/5"
              >
                Activar Dominio <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
              </button>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-slate-900/50 backdrop-blur-xl border border-white/10 text-white px-10 py-5 rounded-2xl font-black uppercase text-sm tracking-widest hover:bg-slate-800 transition-all shadow-xl"
              >
                Agendar Consulta
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
               {/* Decorative layers */}
              <div className="absolute -inset-4 bg-gradient-to-tr from-indigo-500 to-blue-500 rounded-[3rem] blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
              
              <div className="relative bg-slate-900 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl aspect-[16/10]">
                 {lead.screenshot_url ? (
                   <img src={lead.screenshot_url} alt="Presencia Actual" className="w-full h-full object-cover opacity-60 grayscale hover:grayscale-0 transition-all duration-700" />
                 ) : (
                   <div className="w-full h-full flex items-center justify-center bg-slate-800/50">
                     <span className="text-slate-600 font-black italic uppercase text-2xl tracking-tighter">Capturando Digital Asset...</span>
                   </div>
                 )}
                 <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent" />
                 
                 {/* Scanning Line Animation */}
                 <motion.div 
                    animate={{ top: ['0%', '100%', '0%'] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                    className="absolute left-0 right-0 h-[2px] bg-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.8)] z-20 pointer-events-none"
                  />
                  
                  <div className="absolute top-6 left-6 flex items-center gap-2 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-[9px] font-black uppercase tracking-widest">
                     <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                     DIAGNÓSTICO EN TIEMPO REAL
                  </div>
                  
                  <HeatMapOverlay />
                 
                 <div className="absolute bottom-10 left-10 right-10">
                    <div className="flex items-center gap-4 bg-white/10 backdrop-blur-2xl border border-white/10 p-5 rounded-3xl">
                       <div className="h-12 w-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shrink-0 shadow-lg">
                          <TrendingUp size={24} />
                       </div>
                       <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400 leading-none mb-1">Impacto Proyectado</p>
                          <p className="text-lg font-bold text-white tracking-tight leadng-tight">Potencial incremento de ventas del 32% interanual</p>
                       </div>
                    </div>
                 </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Social Proof Integration */}
        <div className="mt-32">
          <SocialProof />
        </div>

        {/* Intelligence Grid */}
        <div className="mt-40 grid md:grid-cols-3 gap-8">
           {[
             { title: "Arquitectura TIER 1", icon: Shield, desc: "Desarrollo de baja latencia con seguridad militar integrada." },
             { title: "Captura Activa", icon: Zap, desc: "Embudo de ventas con inteligencia de respuesta inmediata vía WhatsApp." },
             { title: "Dominio Local", icon: Globe, desc: "Posicionamiento geo-específico para saturar búsquedas relevantes." }
           ].map((item, i) => (
             <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-10 rounded-[2rem] bg-slate-900/30 border border-white/5 backdrop-blur-sm hover:border-indigo-500/30 transition-all group"
             >
                <div className="h-14 w-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-8 group-hover:scale-110 transition-transform">
                  <item.icon size={28} />
                </div>
                <h3 className="text-xl font-bold mb-4 uppercase tracking-tighter leading-tight">{item.title}</h3>
                <p className="text-slate-400 font-light leading-relaxed">{item.desc}</p>
             </motion.div>
           ))}
        </div>

        {/* Audit Details */}
        <div className="mt-40 bg-slate-900/40 rounded-[3rem] border border-white/5 p-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[50%] h-full bg-indigo-500/5 rotate-12 blur-[100px]" />
          <div className="relative z-10 grid lg:grid-cols-2 gap-20 items-center">
             <div>
                <h2 className="text-4xl font-black tracking-tighter uppercase mb-6 leading-[0.9]">Diagnóstico de <br/>Fuga Comercial</h2>
                <div className="space-y-6">
                   {[
                     `Tecnología actual: ${lead.tech_stack || 'Infraestructura Legacy (TIER 3)'}`,
                     `Tiempo de carga: ${lead.load_time || '4.8s'} (Pérdida de retención crítica)`,
                     'Embudo de reservas: Manual / No escalable',
                     'Presencia social: Desvinculada de la captura directa'
                   ].map((text, j) => (
                     <div key={j} className="flex items-start gap-4">
                        <CheckCircle2 size={18} className="text-indigo-500 mt-1 shrink-0" />
                        <span className="text-slate-300 font-light">{text}</span>
                     </div>
                   ))}
                </div>
             </div>
             <div className="space-y-10">
                <div className="grid grid-cols-2 gap-6">
                   <div className="p-8 rounded-3xl bg-white/5 border border-white/5">
                      <p className="text-3xl font-black text-white leading-none mb-2">92%</p>
                      <p className="text-[10px] uppercase font-black text-slate-500 tracking-widest">Confianza Digital</p>
                   </div>
                   <div className="p-8 rounded-3xl bg-white/5 border border-white/5">
                      <p className="text-3xl font-black text-emerald-500 leading-none mb-2">+120%</p>
                      <p className="text-[10px] uppercase font-black text-slate-500 tracking-widest">Leads Proyectados</p>
                   </div>
                </div>
                <div className="p-10 rounded-3xl bg-indigo-600 text-white shadow-2xl shadow-indigo-500/20">
                   <p className="text-xl font-bold mb-4">Dictamen Final</p>
                   <p className="text-slate-100 font-light leading-relaxed opacity-90">
                     Su negocio presenta una oportunidad de escalado excepcional. La implementación de la Arquitectura Digital Zyndrix detendrá la fuga de clientes y profesionalizará su captura automática.
                   </p>
                </div>
             </div>
          </div>
        </div>
      </main>

      <footer className="mt-40 border-t border-white/5 pt-20 pb-10 px-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
           <div className="text-center md:text-left">
              <p className="text-[10px] uppercase font-black text-slate-500 tracking-[0.3em] mb-4">Protocolo de Exclusividad</p>
              <p className="text-slate-400 font-light">Este dossier ha sido generado específicamente para la Dirección de {lead.name}.</p>
           </div>
           <div className="flex items-center gap-6">
              <Globe size={20} className="text-slate-700" />
              <Laptop size={20} className="text-slate-700" />
              <Smartphone size={20} className="text-slate-700" />
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
