import { Hero } from '@/components/sections/Hero';
import { PainPoints } from '@/components/sections/PainPoints';
import { TechStack } from '@/components/sections/TechStack';
import { Sistemas } from '@/components/sections/Sistemas';
import { Impacto } from '@/components/sections/Impacto';
import { Metodo } from '@/components/sections/Metodo';
import { Planes } from '@/components/sections/Planes';
import { Contacto, Footer } from '@/components/sections/Contacto';
import { Demos } from '@/components/sections/Demos';
import { Beneficios } from '@/components/sections/Beneficios';
import { Offers } from '@/components/sections/Offers';
import { BlueprintPromo } from '@/components/sections/BlueprintPromo';
import { SectionConnector } from '@/components/common/SectionConnector';
import { ROICalculator } from '@/components/sections/ROICalculator';
import { EngineRoom } from '@/components/sections/EngineRoom';
import { FAQ } from '@/components/sections/FAQ';
import { headers } from 'next/headers';
import { getDictionary } from '@/lib/dictionaries';

export default async function Home() {
  const headerList = await headers();
  const locale = (headerList.get('x-zyndrix-lang') as string) || 'es';
  const dict = await getDictionary(locale);

  return (
    <main className="min-h-screen bg-base text-white">
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

      <Demos dict={dict.demos} />
      <SectionConnector />

      <Planes dict={dict.planes} />
      <SectionConnector />

      <FAQ dict={dict.faq} />
      <SectionConnector />

      <Contacto dict={dict.contacto} />
      <Footer dict={dict.footer} />
    </main>
  );
}
