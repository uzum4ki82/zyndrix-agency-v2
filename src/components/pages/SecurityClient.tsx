'use client';

import { motion } from 'framer-motion';
import { NavBar } from '@/components/common/NavBar';
import { Footer } from '@/components/common/Footer';
import { SectionHeader } from '@/components/common/SectionHeader';
import { HardDrive, Network, Globe, Activity } from 'lucide-react';

export default function SecurityClient({ dict, locale }: { dict: any, locale: string }) {
  const icons = [HardDrive, Network, Globe, Activity];

  return (
    <div className="min-h-screen bg-black text-white font-body selection:bg-primary selection:text-white">
      <NavBar dict={dict.nav} locale={locale} />
      
      <main className="relative z-10 pt-60 pb-40 px-6">
        <div className="max-w-4xl mx-auto">
          <SectionHeader title={dict.security_page.title} subtitle={dict.security_page.subtitle} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-40">
            {dict.security_page.items.map((item: any, i: number) => {
              const Icon = icons[i % icons.length];
              
              return (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  className="glass-premium p-12 rounded-[3.5rem] border border-white/5 relative group"
                >
                  <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mb-10 border border-primary/30 group-hover:bg-primary/30 transition-all">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-3xl font-black uppercase italic mb-6">{item.title}</h3>
                  <p className="text-white/60 font-medium italic leading-relaxed">
                    {item.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </main>

      <Footer dict={dict.footer} locale={locale} />
    </div>
  );
}
