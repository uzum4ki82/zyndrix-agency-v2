import type { Metadata } from 'next';
import { Check } from 'lucide-react';
import { SiteHeader } from '@/components/site/SiteHeader';
import { SiteFooter } from '@/components/site/SiteFooter';
import { ProductCards } from '@/components/site/ProductCards';
import { Comparison } from '@/components/site/Comparison';
import { HowItWorks } from '@/components/site/HowItWorks';
import { Sectors } from '@/components/site/Sectors';
import { Faq } from '@/components/site/Faq';
import { LeadForm } from '@/components/site/LeadForm';
import { ConversationExample } from '@/components/site/ConversationExample';
import { TrackedLink } from '@/components/site/TrackedLink';
import { btnPrimary, btnSecondary, container } from '@/components/site/ui';
import { FAQ_GENERAL } from '@/content/faqs';

export const metadata: Metadata = {
  title: 'Agentes de IA para WhatsApp y teléfono para pequeños negocios | Zyndrix',
  description:
    'Un agente de IA que atiende el WhatsApp (50 €/mes) o el teléfono (75 €/mes) de tu negocio con tu información: responde lo habitual y te avisa de lo importante.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Tu negocio responde, incluso cuando tú estás ocupado',
    description: 'Agentes de IA para atender WhatsApp y teléfono. Desde 50 €/mes.',
    url: '/',
  },
};

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="contenido" className="bg-white text-secondary">
        {/* Hero */}
        <section className="border-b border-secondary/10 bg-gradient-to-b from-surface-low to-white">
          <div className={`${container} grid items-center gap-12 py-14 sm:py-20 lg:grid-cols-[1.15fr_1fr]`}>
            <div>
              <p className="text-sm font-semibold text-primary">Para peluquerías, clínicas, talleres, restaurantes y autónomos</p>
              <h1 className="mt-3 font-heading text-4xl font-bold leading-[1.1] tracking-tight text-secondary sm:text-5xl lg:text-[56px]">
                Tu negocio responde, incluso cuando tú estás ocupado
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-secondary/75 sm:text-xl">
                Agentes de IA que atienden tu WhatsApp y tu teléfono con la información de tu negocio. Desde{' '}
                <strong className="font-semibold text-secondary">50 €/mes</strong>.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <TrackedLink href="/agente-whatsapp" className={btnPrimary} eventParams={{ product: 'whatsapp', location: 'hero' }}>
                  Ver agente de WhatsApp
                </TrackedLink>
                <TrackedLink href="/agente-voz" className={btnSecondary} eventParams={{ product: 'voz', location: 'hero' }}>
                  Ver agente de voz
                </TrackedLink>
              </div>
              <ul className="mt-8 flex flex-col gap-2 text-[15px] text-secondary/75 sm:flex-row sm:gap-6">
                {['Precio mensual cerrado', 'Lo configuramos nosotros', 'Lo pruebas antes de activarlo'].map((t) => (
                  <li key={t} className="flex items-center gap-2">
                    <Check size={16} className="text-accent" aria-hidden="true" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <ConversationExample
              kind="whatsapp"
              title="Peluquería · WhatsApp"
              turns={[
                { from: 'cliente', text: 'Hola, ¿cuánto cuesta un corte y peinado? ¿Tenéis algo el sábado?' },
                { from: 'agente', text: 'Hola. El corte y peinado cuesta 25 €. Los sábados abrimos de 9:00 a 14:00. ¿Me dices tu nombre y a qué hora te vendría bien?' },
                { from: 'cliente', text: 'Laura, sobre las 11.' },
                { from: 'agente', text: 'Gracias, Laura. Le paso tu petición a Marta para que te confirme la hora por aquí.' },
              ]}
              footnote="Precios y horarios de ejemplo. El agente usa los de tu negocio."
            />
          </div>
        </section>

        <ProductCards />
        <Comparison />
        <HowItWorks />
        <Sectors />
        <Faq items={FAQ_GENERAL} />
        <div className="border-t border-secondary/10 bg-surface-low">
          <LeadForm />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
