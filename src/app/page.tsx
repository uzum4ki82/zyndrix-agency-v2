import { Hero } from '@/components/sections/Hero';
import { NavBar } from '@/components/common/NavBar';
import { TechStack } from '@/components/sections/TechStack';
import { SectionConnector } from '@/components/common/SectionConnector';
import { headers } from 'next/headers';
import { getDictionary } from '@/lib/dictionaries';
import { ROICalculator } from '@/components/sections/ROICalculator';
import { PainPoints } from '@/components/sections/PainPoints';
import { Sistemas } from '@/components/sections/Sistemas';
import { EngineRoom } from '@/components/sections/EngineRoom';
import { Impacto } from '@/components/sections/Impacto';
import { Offers } from '@/components/sections/Offers';
import { BlueprintPromo } from '@/components/sections/BlueprintPromo';
import { Beneficios } from '@/components/sections/Beneficios';
import { Metodo } from '@/components/sections/Metodo';
import { Demos } from '@/components/sections/Demos';
import { Planes } from '@/components/sections/Planes';
import { FAQ } from '@/components/sections/FAQ';
import { Guarantee } from '@/components/sections/Guarantee';
import { Contacto } from '@/components/sections/Contacto';
import { Footer } from '@/components/common/Footer';

export async function generateMetadata() {
  const headerList = await headers();
  const locale = (headerList.get('x-zyndrix-lang') as string) || 'es';
  const dict = await getDictionary(locale);
  const m = dict.metadata.home;

  return {
    title: m.title,
    description: m.description,
    keywords: dict.metadata.keywords.split(', '),
  };
}

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
      
      <PainPoints dict={dict.pain_points} system={dict.system} />
      <SectionConnector />
      
      <Sistemas dict={dict.sistemas} system={dict.system} />
      <SectionConnector />

      <EngineRoom dict={dict.engine_room} system={dict.system} />
      <SectionConnector />

      <Impacto dict={dict.impacto} system={dict.system} />
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

      <Planes dict={dict.planes} system={dict.system} />
      <SectionConnector />

      <FAQ dict={dict.faq} />
      <SectionConnector />

      <Guarantee dict={dict.guarantee} />
      <SectionConnector />

      <Contacto dict={dict.contacto} locale={locale} />
      <Footer dict={dict.footer} locale={locale} />
    </main>
  );
}
