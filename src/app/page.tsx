import { Hero } from '@/components/sections/Hero';
import { NavBar } from '@/components/common/NavBar';
import { TechStack } from '@/components/sections/TechStack';
import { headers } from 'next/headers';
import { getDictionary } from '@/lib/dictionaries';
import { Kernel } from '@/components/sections/Kernel';
import { Metodo } from '@/components/sections/Metodo';
import { EngineRoom } from '@/components/sections/EngineRoom';
import { Impacto } from '@/components/sections/Impacto';
import { BlueprintPromo } from '@/components/sections/BlueprintPromo';
import { Contacto } from '@/components/sections/Contacto';
import { Footer } from '@/components/common/Footer';
import { PainPoints } from '@/components/sections/PainPoints';
import { ROICalculator } from '@/components/sections/ROICalculator';
import { FAQ } from '@/components/sections/FAQ';

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
    <main className="min-h-screen bg-base text-primary relative selection:bg-black selection:text-white">
      <NavBar dict={dict.nav} locale={locale} />
      
      <Hero dict={dict.hero} />
      
      <TechStack dict={dict.tech_stack} />
      
      <div className="space-y-0 relative z-10">
        <PainPoints dict={dict.pain_points} system={dict.system} />
        <Kernel dict={dict.kernel} />
        <Metodo dict={dict.metodo} />
        <ROICalculator dict={dict.roi} />
        <Impacto dict={dict.impacto} />
        <EngineRoom dict={dict.engine_room} />
        <FAQ dict={dict.faq} />
        <BlueprintPromo dict={dict.blueprint_promo} />
        <Contacto dict={dict.contacto} locale={locale} />
      </div>

      <Footer dict={dict.footer} locale={locale} />
    </main>
  );
}


