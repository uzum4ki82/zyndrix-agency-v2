'use client';

import { motion } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/sections/Contacto';
import { SectionHeader } from '@/components/common/SectionHeader';
import { Shield, Eye, Lock, Database } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-base text-white font-body selection:bg-primary selection:text-base">
      <Navbar />
      
      <main className="relative z-10 pt-60 pb-40 px-6">
        <div className="max-w-4xl mx-auto">
          <SectionHeader title="Políticas de Privacidad" subtitle="Escudo de Seguridad" />
          
          <div className="space-y-24 mt-40">
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="glass-premium p-12 rounded-[3.5rem] border border-white/5 relative overflow-hidden"
            >
              <div className="absolute top-10 right-10 opacity-10">
                <Shield className="w-32 h-32 text-primary" />
              </div>
              <h3 className="text-3xl font-black uppercase italic mb-8 flex items-center gap-4">
                <Eye className="text-primary w-8 h-8" /> RECOLECCIÓN DE DATOS
              </h3>
              <div className="space-y-6 text-white/60 font-medium italic leading-relaxed text-lg">
                <p>En Zyndrix, la soberanía de los datos es nuestra prioridad absoluta. Recopilamos información únicamente para optimizar el rendimiento de nuestros agentes de IA y la experiencia del usuario.</p>
                <ul className="list-disc pl-10 space-y-4">
                  <li>Datos de contacto suministrados en formularios de protocolo.</li>
                  <li>Métricas de interacción técnica para refinamiento de LLMs.</li>
                  <li>Logs de seguridad automatizados en tiempo real.</li>
                </ul>
              </div>
            </motion.section>

            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="glass-premium p-12 rounded-[3.5rem] border border-white/5 relative overflow-hidden"
            >
              <div className="absolute top-10 right-10 opacity-10">
                <Lock className="w-32 h-32 text-primary" />
              </div>
              <h3 className="text-3xl font-black uppercase italic mb-8 flex items-center gap-4">
                <Lock className="text-primary w-8 h-8" /> USO DE INFORMACIÓN
              </h3>
              <p className="text-white/60 font-medium italic leading-relaxed text-lg">
                Toda la información procesada por nuestros Sistemas Nucleares se mantiene bajo encriptación de grado industrial. No vendemos, intercambiamos ni transferimos sus datos a entidades externas fuera de los protocolos de operación estrictamente necesarios para el servicio.
              </p>
            </motion.section>

            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="glass-premium p-12 rounded-[3.5rem] border border-white/5 relative overflow-hidden"
            >
              <div className="absolute top-10 right-10 opacity-10">
                <Database className="w-32 h-32 text-primary" />
              </div>
              <h3 className="text-3xl font-black uppercase italic mb-8 flex items-center gap-4">
                <Database className="text-primary w-8 h-8" /> ALMACENAMIENTO SEGURO
              </h3>
              <p className="text-white/60 font-medium italic leading-relaxed text-lg">
                Nuestros servidores utilizan protocolos de latencia cero con redundancia geográfica total. Los datos son eliminados automáticamente tras la finalización de los ciclos de entrenamiento si así lo requiere el protocolo del cliente.
              </p>
            </motion.section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
