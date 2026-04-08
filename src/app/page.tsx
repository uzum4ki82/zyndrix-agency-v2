import { Hero } from '@/components/sections/Hero';
import { NavBar } from '@/components/common/NavBar';
import { TechStack } from '@/components/sections/TechStack';
import { SectionConnector } from '@/components/common/SectionConnector';
import { headers } from 'next/headers';
import { getDictionary } from '@/lib/dictionaries';
import dynamic from 'next/dynamic';

// DYNAMIC IMPORTS FOR PERFORMANCE - CLASE EJECUTIVA
// Only SSR needed for above-the-fold content
const ROICalculator = dynamic(() => import('@/components/sections/ROICalculator').then(mod => mod.ROICalculator), { ssr: false });
const PainPoints = dynamic(() => import('@/components/sections/PainPoints').then(mod => mod.PainPoints), { ssr: false });
const Sistemas = dynamic(() => import('@/components/sections/Sistemas').then(mod => mod.Sistemas), { ssr: false });
const EngineRoom = dynamic(() => import('@/components/sections/EngineRoom').then(mod => mod.EngineRoom), { ssr: false });
const Impacto = dynamic(() => import('@/components/sections/Impacto').then(mod => mod.Impacto), { ssr: false });
const Offers = dynamic(() => import('@/components/sections/Offers').then(mod => mod.Offers), { ssr: false });
const BlueprintPromo = dynamic(() => import('@/components/sections/BlueprintPromo').then(mod => mod.BlueprintPromo), { ssr: false });
const Beneficios = dynamic(() => import('@/components/sections/Beneficios').then(mod => mod.Beneficios), { ssr: false });
const Metodo = dynamic(() => import('@/components/sections/Metodo').then(mod => mod.Metodo), { ssr: false });
const Demos = dynamic(() => import('@/components/sections/Demos').then(mod => mod.Demos), { ssr: false });
const Planes = dynamic(() => import('@/components/sections/Planes').then(mod => mod.Planes), { ssr: false });
const FAQ = dynamic(() => import('@/components/sections/FAQ').then(mod => mod.FAQ), { ssr: false });
const Contacto = dynamic(() => import('@/components/sections/Contacto').then(mod => mod.Contacto), { ssr: false });
const Footer = dynamic(() => import('@/components/sections/Contacto').then(mod => mod.Footer), { ssr: false });

export default async function Home() {
  const headerList = await headers();
  const locale = (headerList.get('x-zyndrix-lang') as string) || 'es';
  const dict = await getDictionary(locale);

  return (
    <main className="min-h-screen bg-base text-white">
      <NavBar dict={dict.nav} locale={locale} />
      <Hero dict={dict.hero} />
      
      <TechStack dict={dict.tech_stack} />
      <SectionConnector />
      
      <ROICalculator dict={dict.roi} />
      <SectionConnector />
      
      <PainPoints dict={dict.pain_points} />
      <SectionConnector />
      
      <Sistemas dict={dict.sistemas} />
      <SectionConnector />

      <EngineRoom dict={dict.engine_room} />
      <SectionConnector />

      <Impacto dict={dict.impacto} />
      <SectionConnector />

      <Offers dict={dict.offers} />
      <SectionConnector />
      
      <BlueprintPromo dict={dict.blueprint_promo} />
      <SectionConnector />

      <Beneficios dict={dict.beneficios} />
      <SectionConnector />

      <Metodo dict={dict.metodo} />
      <SectionConnector />

      <Demos dict={dict.demos} locale={locale} />
      <SectionConnector />

      <Planes dict={dict.planes} />
      <SectionConnector />

      <FAQ dict={dict.faq} />
      <SectionConnector />

      <Contacto dict={dict.contacto} locale={locale} />
      <Footer dict={dict.footer} locale={locale} />
    </main>
  );
}
