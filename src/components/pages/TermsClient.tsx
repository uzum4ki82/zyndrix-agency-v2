'use client';

import { motion } from 'framer-motion';
import { NavBar } from '@/components/common/NavBar';
import { Footer } from '@/components/sections/Contacto';
import { SectionHeader } from '@/components/common/SectionHeader';
import { FileText, Cpu, AlertTriangle, Scale } from 'lucide-react';

export default function TermsClient({ dict, locale }: { dict: any, locale: string }) {
  const icons = [FileText, Cpu, AlertTriangle];
  const sideIcons = [Scale, Cpu, AlertTriangle];

  return (
    <div className="min-h-screen bg-black text-white font-body selection:bg-primary selection:text-white">
      <NavBar dict={dict.nav} locale={locale} />
      
      <main className="relative z-10 pt-60 pb-40 px-6">
        <div className="max-w-4xl mx-auto">
          <SectionHeader title={dict.terms_page.title} subtitle={dict.terms_page.subtitle} />
          
          <div className="space-y-24 mt-40">
            {dict.terms_page.sections.map((section: any, i: number) => {
              const Icon = icons[i % icons.length];
              const SideIcon = sideIcons[i % sideIcons.length];
              
              return (
                <motion.section 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  className="glass-premium p-12 rounded-[3.5rem] border border-white/5 relative overflow-hidden"
                >
                  <div className="absolute top-10 right-10 opacity-10 rotate-12">
                    <SideIcon className="w-32 h-32 text-primary" />
                  </div>
                  <h3 className="text-3xl font-black uppercase italic mb-8 flex items-center gap-4">
                    <Icon className="text-primary w-8 h-8" /> {section.title}
                  </h3>
                  <p className="text-white/60 font-medium italic leading-relaxed text-lg">
                    {section.content}
                  </p>
                </motion.section>
              );
            })}
          </div>
        </div>
      </main>

      <Footer dict={dict.footer} locale={locale} />
    </div>
  );
}
