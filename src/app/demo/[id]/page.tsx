"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Lead } from '@/lib/supabase';
import { MapPin, Phone, Instagram, Facebook, Globe, ArrowRight } from 'lucide-react';
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
          const cleanId = id.split('\r')[0].split('\n')[0].trim();
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
      <div className="h-screen w-full flex items-center justify-center bg-[#0e0e0e]">
        <motion.div 
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-[10px] font-black uppercase tracking-[1em] text-white/20"
        >
          Loading Instance...
        </motion.div>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-[#0e0e0e] text-white p-10 text-center">
        <h1 className="text-xl font-black mb-4 uppercase tracking-[0.5em] text-rose-500">Not Found</h1>
      </div>
    );
  }

  // If we have a real external preview, show it FULL SCREEN with NO OVERLAYS.
  if (lead.stitch_preview_url) {
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

  // FALLBACK Landing Page: Architectural Silence (Standalone Business Version)
  return (
    <div className="min-h-screen bg-[#070d1f] text-[#dfe4ff] font-sans selection:bg-white selection:text-black overflow-x-hidden">
      <main>
        {/* HERO - PURE MASS */}
        <section className="relative h-screen flex items-center justify-center bg-[#070d1f]">
          <div className="absolute inset-0 overflow-hidden">
             <img 
               src={lead.screenshot_url || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1600"} 
               className="w-full h-full object-cover opacity-20 grayscale brightness-50"
               alt="Background"
             />
             <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#070d1f]/50 to-[#070d1f]" />
          </div>

          <div className="container mx-auto px-10 relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <h1 className="text-8xl md:text-[180px] font-black leading-[0.75] tracking-[-0.08em] uppercase mb-12">
                {lead.name}
              </h1>
              <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-20 mt-20">
                <div className="flex items-center gap-4 text-[12px] font-black uppercase tracking-[0.6em] opacity-40">
                  <MapPin size={14} /> {lead.city || 'Denver'}
                </div>
                <div className="w-1 h-1 bg-white/20 rounded-full hidden md:block" />
                <div className="text-[12px] font-black uppercase tracking-[0.6em] opacity-40">
                   Institutional Grade
                </div>
              </div>
            </motion.div>
          </div>
          
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-20">
            <span className="text-[10px] font-black tracking-[1em] uppercase">Scroll</span>
            <div className="w-[1px] h-20 bg-gradient-to-b from-white to-transparent" />
          </div>
        </section>

        {/* MONOLITHIC CONTENT SECTION */}
        <section className="py-80 bg-[#070d1f]">
          <div className="container mx-auto px-10">
            <div className="max-w-6xl mx-auto space-y-60">
              
              {/* BRAND STATEMENT */}
              <div className="grid lg:grid-cols-2 gap-40 items-start">
                 <div className="space-y-12">
                   <h2 className="text-6xl md:text-9xl font-black uppercase tracking-tighter leading-[0.8]">
                     The <br/> New <br/> Standard.
                   </h2>
                   <p className="text-2xl text-[#dfe4ff]/60 leading-relaxed font-light italic max-w-lg">
                     Redefining the architectural essence of {lead.category || 'your sector'} in the heart of Colorado.
                   </p>
                 </div>
                 <div className="pt-20">
                    <div className="bg-[#09122b] p-20 space-y-10">
                       <p className="text-xl leading-relaxed">
                         We provide unparalleled quality and strategic value through our meticulous attention to detail and commitment to exceptional service.
                       </p>
                       <button 
                         onClick={() => setIsModalOpen(true)}
                         className="px-10 py-5 bg-[#c4c7c9] text-[#070d1f] text-[10px] font-black uppercase tracking-[0.5em] hover:bg-white transition-all outline-none border-none"
                       >
                         Initialize Contact
                       </button>
                    </div>
                 </div>
              </div>

              {/* LOCATION BLOCK */}
              <div className="bg-[#0b1d48] p-[1px] gap-0">
                 <div className="bg-[#070d1f] p-20 md:p-40 grid lg:grid-cols-2 gap-40 items-center">
                    <div className="space-y-10">
                       <h3 className="text-4xl font-black uppercase tracking-widest">Global <br/> Presence</h3>
                       <p className="text-[#dfe4ff]/40 text-lg leading-relaxed">
                         Strategic operations hub located at <br/>
                         <span className="text-[#dfe4ff] font-bold">{lead.address}</span>
                       </p>
                       <div className="flex gap-6 mt-10">
                          <Phone className="opacity-20" />
                          <Globe className="opacity-20" />
                          <Facebook className="opacity-20" />
                       </div>
                    </div>
                    <div className="relative aspect-video bg-[#09122b] overflow-hidden grayscale opacity-40">
                       <img 
                         src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=1200" 
                         className="w-full h-full object-cover"
                         alt="Map"
                       />
                    </div>
                 </div>
              </div>

            </div>
          </div>
        </section>

        {/* FINAL CTA - FULL BLEED */}
        <section className="bg-[#c4c7c9] py-80 px-10 text-center">
            <h2 className="text-[#070d1f] text-4xl md:text-8xl font-black uppercase tracking-tight mb-20 italic">
               Ready to expand <br/> the horizon?
            </h2>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="px-20 py-10 bg-[#070d1f] text-white text-xs font-black uppercase tracking-[1em] hover:scale-110 transition-transform outline-none border-none"
            >
              Request Access
            </button>
        </section>
      </main>

      <ConsultationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        businessName={lead.name}
      />

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Gantari:wght@100;300;500;900&display=swap');
        
        body {
          font-family: 'Gantari', sans-serif;
          background-color: #070d1f;
          margin: 0;
          padding: 0;
        }
      `}</style>
    </div>
  );
}
