import { Hero } from '@/components/sections/Hero';
import { NavBar } from '@/components/common/NavBar';
import { headers } from 'next/headers';
import { getDictionary } from '@/lib/dictionaries';
import { Contacto } from '@/components/sections/Contacto';
import { Footer } from '@/components/common/Footer';
import { PainPoints } from '@/components/sections/PainPoints';
import { FAQ } from '@/components/sections/FAQ';
import { Sistemas } from '@/components/sections/Sistemas';
import { Planes } from '@/components/sections/Planes';
import { Metodo } from '@/components/sections/Metodo';
import { Ahorros } from '@/components/sections/Ahorros';
import { Casos } from '@/components/sections/Casos';

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
    <main className="min-h-screen bg-base text-primary relative selection:bg-primary selection:text-white">
      <NavBar dict={dict.nav} locale={locale} />
      
      <Hero dict={dict.hero} />
      
      <div className="space-y-0 relative z-10">
        <PainPoints dict={dict.pain_points} system={dict.system} />
        <Sistemas dict={dict.sistemas} system={dict.system} />
        <Metodo dict={dict.metodo} />
        <Ahorros dict={dict.ahorros} />
        <Planes dict={dict.planes} system={dict.system} />
        <FAQ dict={dict.faq} />
        <Casos dict={dict.casos} />
        <Contacto dict={dict.contacto} locale={locale} />
      </div>

      <Footer dict={dict.footer} locale={locale} />
    </main>
  );
}


