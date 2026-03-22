'use client';

import { motion } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/sections/Contacto';
import { SectionHeader } from '@/components/common/SectionHeader';
import { Zap, Activity, HardDrive, Network, Globe } from 'lucide-react';

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-base text-white font-body selection:bg-primary selection:text-base">
      <Navbar />
      
      <main className="relative z-10 pt-60 pb-40 px-6">
        <div className="max-w-4xl mx-auto">
          <SectionHeader title="Protocolos de Seguridad" subtitle="Infraestructura de Élite" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-40">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="glass-premium p-12 rounded-[3.5rem] border border-white/5 relative group"
            >
              <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mb-10 border border-primary/30 group-hover:bg-primary/30 transition-all">
                <HardDrive className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-3xl font-black uppercase italic mb-6">ALMACENAMIENTO</h3>
              <p className="text-white/60 font-medium italic leading-relaxed">
                Encriptación AES-256 en reposo con gestión de claves HSM gestionada por cada cliente de forma aislada.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="glass-premium p-12 rounded-[3.5rem] border border-white/5 relative group"
            >
              <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mb-10 border border-primary/30 group-hover:bg-primary/30 transition-all">
                <Network className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-3xl font-black uppercase italic mb-6">RED</h3>
              <p className="text-white/60 font-medium italic leading-relaxed">
                Firewalls de última generación con filtrado de paquetes en tiempo real y detección de intrusos basada en anomalías de IA.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="glass-premium p-12 rounded-[3.5rem] border border-white/5 relative group"
            >
              <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mb-10 border border-primary/30 group-hover:bg-primary/30 transition-all">
                <Globe className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-3xl font-black uppercase italic mb-6">CÓDIGO</h3>
              <p className="text-white/60 font-medium italic leading-relaxed">
                Firmas digitales y escaneos de vulnerabilidades SAST/DAST diarios en cada actualización de nuestros Sistemas Nucleares.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="glass-premium p-12 rounded-[3.5rem] border border-white/5 relative group"
            >
              <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mb-10 border border-primary/30 group-hover:bg-primary/30 transition-all">
                <Activity className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-3xl font-black uppercase italic mb-6">MONITOREO</h3>
              <p className="text-white/60 font-medium italic leading-relaxed">
                Observabilidad total 24/7 con alertas de latencia milimétricas y protocolos de remediación automatizados por n8n.
              </p>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
