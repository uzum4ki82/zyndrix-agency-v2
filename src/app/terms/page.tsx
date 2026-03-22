'use client';

import { motion } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/sections/Contacto';
import { SectionHeader } from '@/components/common/SectionHeader';
import { FileText, Cpu, AlertTriangle, Scale } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-base text-white font-body selection:bg-primary selection:text-base">
      <Navbar />
      
      <main className="relative z-10 pt-60 pb-40 px-6">
        <div className="max-w-4xl mx-auto">
          <SectionHeader title="Términos de Servicio" subtitle="Marco Operativo" />
          
          <div className="space-y-24 mt-40">
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="glass-premium p-12 rounded-[3.5rem] border border-white/5 relative overflow-hidden"
            >
              <div className="absolute top-10 right-10 opacity-10 rotate-12">
                <Scale className="w-32 h-32 text-primary" />
              </div>
              <h3 className="text-3xl font-black uppercase italic mb-8 flex items-center gap-4">
                <FileText className="text-primary w-8 h-8" /> 1. ACUERDO DE USO
              </h3>
              <p className="text-white/60 font-medium italic leading-relaxed text-lg">
                Al acceder a Zyndrix AI Agency, usted acepta los protocolos de operación que rigen nuestra IA. Los "Sistemas Nucleares" de Zyndrix se proporcionan para potenciar operaciones empresariales lícitas y éticas.
              </p>
            </motion.section>

            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="glass-premium p-12 rounded-[3.5rem] border border-white/5 relative overflow-hidden"
            >
              <div className="absolute top-10 right-10 opacity-10 -rotate-12">
                <Cpu className="w-32 h-32 text-primary" />
              </div>
              <h3 className="text-3xl font-black uppercase italic mb-8 flex items-center gap-4">
                <Cpu className="text-primary w-8 h-8" /> 2. PROPIEDAD INTELECTUAL
              </h3>
              <p className="text-white/60 font-medium italic leading-relaxed text-lg">
                El diseño, la interfaz (UI) y los algoritmos propietarios de Zyndrix son propiedad intelectual exclusiva. Los resultados generados por el sistema pertenecen al cliente sujeto a los términos del contrato de servicio individual.
              </p>
            </motion.section>

            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="glass-premium p-12 rounded-[3.5rem] border border-white/5 relative overflow-hidden"
            >
              <div className="absolute top-10 right-10 opacity-10">
                <AlertTriangle className="w-32 h-32 text-primary" />
              </div>
              <h3 className="text-3xl font-black uppercase italic mb-8 flex items-center gap-4">
                <AlertTriangle className="text-primary w-8 h-8" /> 3. LIMITACIÓN DE RESPONSABILIDAD
              </h3>
              <p className="text-white/60 font-medium italic leading-relaxed text-lg">
                Zyndrix AI no se hace responsable de las interpretaciones o decisiones tomadas por agentes autónomos basadas en datos incorrectos o incompletos suministrados por el usuario final.
              </p>
            </motion.section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
