import { motion } from "framer-motion";
import { CheckCircle, Zap, Star, Crown, MessageCircle, X, ShieldCheck, Globe, ArrowRight, Download } from "lucide-react";
import { Business } from "@/types";
import Image from "next/image";
import { useState } from "react";
import { generatePDF } from "@/lib/pdf-generator";

export default function Presentation({ business, onClose }: { business: Business, onClose: () => void }) {
  const [isDownloading, setIsDownloading] = useState(false);
  if (!business) return null;

  const handleDownload = async () => {
    setIsDownloading(true);
    await generatePDF('presentation-content', `Proposal-${business.name.replace(/\s+/g, '-')}`);
    setIsDownloading(false);
  };

  const favicon = business.favicon || business.intel?.favicon || "/favicon.ico";

  const handleWhatsApp = () => {
    const text = encodeURIComponent(`Hola, he visto la propuesta de Zyndrix para ${business.name} y me interesa.`);
    window.open(`https://wa.me/34600000000?text=${text}`, '_blank');
  };

  const getTierContent = () => {
    switch (business.tier) {
      case 'TIER_1':
        return {
          badge: "VISIBILIDAD_CERO",
          headline: "ARQUITECTURA <br/> <span className='text-primary'>DIGITAL</span> <br/> INTEGRAL",
          description: `Análisis crítico para ${business.name}. Actualmente operando fuera del radar digital. Capturamos el 100% de la demanda orgánica que hoy se pierde en ${business.neighborhood}.`,
          insight: `"SIN PRESENCIA WEB, ${business.name} NO EXISTE PARA EL 85% DE LOS CLIENTES POTENCIALES EN ${business.neighborhood}."`,
          status: "INEXISTENTE"
        };
      case 'TIER_2':
        return {
          badge: "ESCAPE_RRSS",
          headline: "PROFESIONALIZACIÓN <br/> <span className='text-primary'>ESTRATÉGICA</span> <br/> DE IMPACTO",
          description: `Auditoría para ${business.name}. Su presencia en redes es un 'leak' de tráfico. Convertimos seguidores en clientes finales con una infraestructura propietaria de alta conversión.`,
          insight: `"LAS REDES SOCIALES SON ALQUERIDAS; SU WEB PROPIA ES EL ÚNICO ACTIVO QUE USTED CONTROLA TOTALMENTE."`,
          status: "FRAGMENTADA"
        };
      case 'TIER_3':
      default:
        return {
          badge: "RECONFIGURACIÓN_UX",
          headline: "EVOLUCIÓN <br/> <span className='text-primary'>VECTORIAL</span> <br/> DE MERCADO",
          description: `Optimización técnica para ${business.name}. Su web actual presenta una latencia crítica. Implementamos arquitectura de velocidad militar para eliminar el rebote del 40%.`,
          insight: `"CADA SEGUNDO DE CARGA ADICIONAL REDUCE SU CONVERSIÓN EN UN 7%. ESTAMOS AQUÍ PARA ELIMINAR ESA FRICCIÓN."`,
          status: "OBSOLETA"
        };
    }
  };

  const tierContent = getTierContent();

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/98 backdrop-blur-xl overflow-y-auto pt-20 pb-40"
    >
      <div className="max-w-7xl mx-auto px-6 relative">
        {/* Floating Close Button */}
        <button 
          onClick={onClose}
          className="fixed top-8 right-8 z-[110] w-12 h-12 flex items-center justify-center bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all active:scale-90 group"
          aria-label="Close Presentation"
        >
          <X size={24} className="group-hover:rotate-90 transition-transform duration-300" />
        </button>

        <div id="presentation-content" className="min-h-screen bg-background text-foreground font-mono p-6 sm:p-12 pb-40 overflow-hidden relative border border-white/5 shadow-2xl">
          <div className="crt-scanline" />

      {/* Header Bar */}
      <div className="max-w-7xl mx-auto mb-20 flex justify-between items-center border-b border-primary/20 pb-8 relative z-10">
        <div className="flex items-center gap-6 group">
          <img src="/logo-zyndrix.png" alt="Zyndrix Logo" className="h-14 w-auto object-contain brightness-0 invert" />
          <div className="h-10 w-px bg-white/10 hidden sm:block" />
          <div className="text-[10px] uppercase font-black tracking-[0.3em] text-white/40 mt-1 hidden sm:block">Análisis Operacional Estratégico // CORPORATE_READY</div>
        </div>
        
        <div className="hidden md:flex items-center gap-8">
           <div className="flex flex-col items-end">
              <div className="text-[10px] font-black text-primary/40 uppercase tracking-widest">OBJETIVO DE MISIÓN</div>
              <div className="text-sm font-black text-primary italic tracking-tighter uppercase">{business.name}</div>
           </div>
           <div className="h-10 w-px bg-primary/20" />
           <button 
             onClick={handleDownload}
             disabled={isDownloading}
             className="px-6 py-2.5 bg-primary/10 text-primary border border-primary/30 rounded-none text-[10px] font-black tracking-widest uppercase hover:bg-primary hover:text-black transition-all flex items-center gap-2"
           >
             {isDownloading ? (
               <div className="w-3 h-3 border-2 border-primary/20 border-t-primary rounded-none animate-spin" />
             ) : (
               <Download size={14} />
             )}
             EXPORT_DATA_PACKAGE
           </button>
           <div className="px-5 py-2.5 border border-secondary/30 text-secondary text-[10px] font-black tracking-widest uppercase">
              OP_CODE: ALPHA-2026
           </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center relative z-10">
        {/* Left Side: Strategic Value */}
        <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/5 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-wider mb-8">
            <ShieldCheck size={14} /> {tierContent.badge}: ENTIDAD EN RIESGO
          </div>
          
          <h1 className="text-6xl sm:text-7xl font-black leading-[0.85] mb-10 tracking-tighter uppercase italic" dangerouslySetInnerHTML={{ __html: tierContent.headline }} />

          <p className="text-primary/60 text-lg max-w-xl mb-12 leading-relaxed font-bold border-l-4 border-primary/30 pl-6">
            {tierContent.description}
          </p>

          <div className="grid grid-cols-2 gap-6 mb-12">
            <div className="terminal-card border-secondary/20">
               <div className="text-[10px] text-secondary/60 uppercase font-black tracking-widest mb-3">POSICIÓN SECTORIAL</div>
               <div className="text-4xl font-black text-secondary tracking-tighter italic neon-text-cyan">{tierContent.status}</div>
            </div>
            <div className="terminal-card border-primary/20 bg-primary/5">
               <div className="text-[10px] text-primary/60 uppercase font-black tracking-widest mb-3">DESPLIEGUE ESTIMADO</div>
               <div className="text-4xl font-black text-primary tracking-tighter italic neon-text-green">168 HORAS</div>
            </div>
          </div>

          <div className="space-y-4 mb-12">
             {[
                "ARQUITECTURA DE CONVERSIÓN MILITAR",
                "LATENCIA SUB-1S (HYPER-SPEED)",
                "REPUTACIÓN GEOLOCALIZADA (GMB SYNC)",
                "PROTOCOLO DE CIERRE DIRECTO (DP-WHATSAPP)"
             ].map((feature, i) => (
                <div key={i} className="flex items-center gap-4 group">
                  <div className="text-primary group-hover:translate-x-1 transition-transform">
                     <ArrowRight size={14} />
                  </div>
                  <span className="text-sm font-black text-primary/80 tracking-widest uppercase">{feature}</span>
                </div>
             ))}
          </div>
        </motion.div>

        {/* Right Side: Interactive Mockup */}
        <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 1, delay: 0.2 }}
           className="relative"
        >
          {/* Mockup Frame (Executive View) */}
          <div className="relative z-10 bg-black/40 border border-primary/30 p-2 shadow-[0_0_50px_rgba(0,255,156,0.1)] aspect-[4/5] lg:aspect-[3/4]">
            
            {/* Proposed Site UI */}
            <div className="h-full w-full bg-[#050505] overflow-hidden flex flex-col font-mono border border-primary/10">
               {/* Browser Status */}
               <div className="bg-primary/5 p-4 flex items-center justify-between border-b border-primary/20">
                 <div className="flex gap-2">
                   <div className="w-2 h-2 rounded-none bg-primary/20" />
                   <div className="w-2 h-2 rounded-none bg-primary/20" />
                   <div className="w-2 h-2 rounded-none bg-primary/20" />
                 </div>
                 <div className="bg-black border border-primary/30 rounded-none px-4 py-1.5 text-[8px] font-black text-primary/60 flex items-center gap-3">
                   <Globe size={10} className="text-secondary" />
                   <span>{business.website ? business.website.replace('https://', '') : "MISSION_TARGET.COM"}</span>
                 </div>
                 <div className="w-10" />
               </div>

               {/* Nav Mock */}
               <div className="p-6 flex justify-between items-center bg-black">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 border border-primary/30 p-2 flex items-center justify-center bg-primary/5">
                       <Image src={favicon} width={24} height={24} className="grayscale brightness-150" unoptimized alt="logo" />
                    </div>
                    <div className="font-black text-xs uppercase tracking-widest text-primary">{business.name}</div>
                 </div>
                 <div className="px-5 py-2.5 border border-primary text-primary text-[8px] font-black uppercase tracking-widest hover:bg-primary hover:text-black transition-all">
                    INIT_COMMS
                 </div>
               </div>

               {/* Hero Content Mock */}
               <div className="flex-1 px-8 pt-10 flex flex-col gap-8 relative bg-black/40">
                  <div className="relative z-10">
                    <div className="w-12 h-1 bg-secondary mb-6" />
                    <h2 className="text-4xl font-black leading-[1] tracking-tighter text-foreground mb-6 uppercase italic">
                       {business.name}: <br/> 
                       <span className="text-secondary neon-text-cyan">DOMINIO TOTAL.</span>
                    </h2>
                    <p className="text-sm font-bold text-primary/60 leading-tight max-w-xs mb-10 uppercase tracking-widest">
                       REDEFINIENDO EL ESTÁNDAR DE {business.neighborhood} // SIN FRICCIONES.
                    </p>
                    
                    <div className="flex flex-col gap-3">
                       <div className="h-14 bg-primary/5 border border-primary/10 flex items-center px-6 gap-4">
                          <Star size={14} className="text-primary" />
                          <div className="text-[9px] font-black uppercase text-primary tracking-widest">SECTOR_EXPERTISE: VERIFIED</div>
                       </div>
                       <div className="h-14 border border-secondary text-secondary flex items-center justify-between px-6 group cursor-pointer hover:bg-secondary hover:text-black transition-all">
                          <div className="text-[9px] font-black uppercase tracking-widest">LAUNCH_PORTFOLIO</div>
                          <ArrowRight size={14} />
                       </div>
                    </div>
                  </div>

                  {/* Visual Accents */}
                  <div className="absolute top-20 right-0 w-32 h-32 bg-primary/5 blur-3xl -z-10" />
               </div>

               {/* Trust Bar */}
               <div className="p-6 bg-primary/5 border-t border-primary/10 flex items-center justify-between">
                  <div>
                     <div className="text-[8px] font-black text-primary/40 uppercase mb-2">LATENCY_AUDIT</div>
                     <div className="flex gap-2">
                        <div className="px-3 py-1 bg-black border border-primary/20 text-[8px] font-bold text-primary">MOBILE: 98%</div>
                        <div className="px-3 py-1 bg-black border border-secondary/20 text-[8px] font-bold text-secondary">SEO: OPTIMAL</div>
                     </div>
                  </div>
                  <div className="flex flex-col items-end">
                     <div className="text-[8px] font-black text-primary/40 uppercase mb-1">MARKET_RANK</div>
                     <div className="text-lg font-black text-primary italic neon-text-green">#1_TARGET</div>
                  </div>
               </div>
            </div>

            {/* Float Badge */}
            <div className="absolute top-8 right-8 z-20 bg-secondary text-black px-4 py-2 rounded-none flex items-center gap-3 shadow-[0_0_20px_rgba(0,229,255,0.4)]">
               <Crown size={14} className="fill-black" />
               <span className="text-[9px] font-black uppercase tracking-tighter">ELITE_PROTOCOL</span>
            </div>

            {/* Strategic Insight */}
            <div className="absolute bottom-8 left-8 right-8 z-20 bg-black/80 backdrop-blur-md border border-primary/30 p-6 rounded-none">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-1.5 h-1.5 rounded-none bg-primary animate-pulse" />
                <span className="text-[9px] font-black uppercase tracking-widest text-primary/40">INTELLIGENCE_INSIGHT</span>
              </div>
              <div className="text-sm font-black leading-relaxed text-foreground italic uppercase tracking-tight">
                {tierContent.insight}
              </div>
            </div>
          </div>

          {/* Background Glow */}
          <div className="absolute -inset-10 bg-primary/5 blur-[120px] -z-10" />
        </motion.div>
      </div>

      {/* FIXED CONVERSION CTA */}
      <motion.div 
        initial={{ y: 200 }}
        animate={{ y: 0 }}
        className="fixed bottom-0 left-0 right-0 p-8 z-[100] flex justify-center"
      >
        <div className="w-full max-w-4xl bg-black/80 backdrop-blur-xl border border-primary/30 p-4 rounded-none shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col sm:flex-row gap-4">
            <button 
              onClick={handleWhatsApp}
              className="flex-1 bg-primary text-black py-5 rounded-none flex items-center justify-center gap-4 font-black text-xs uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(0,255,156,0.3)] hover:scale-[1.02] active:scale-95 transition-all group"
            >
              <MessageCircle size={18} className="group-hover:rotate-12 transition-transform" />
              SOLICITAR_TRANSFORMACIÓN_VECTORIAL
            </button>
            <button 
              onClick={() => window.open(`mailto:hola@zyndrix.dev?subject=Propuesta ${business.name}`)}
              className="px-10 border border-primary text-primary hover:bg-primary/10 py-5 rounded-none flex items-center justify-center gap-4 font-black text-xs uppercase tracking-widest transition-all active:scale-95"
            >
              CITA_VIRTUAL
            </button>
        </div>
      </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
