import type { Metadata } from 'next';
import { BellRing, Clock, MessageSquareText, UserRoundCheck } from 'lucide-react';
import { SiteHeader } from '@/components/site/SiteHeader';
import { SiteFooter } from '@/components/site/SiteFooter';
import { ConversationExample } from '@/components/site/ConversationExample';
import { ProductPlan } from '@/components/site/ProductPlan';
import { Faq } from '@/components/site/Faq';
import { CtaBand } from '@/components/site/CtaBand';
import { TrackedLink } from '@/components/site/TrackedLink';
import { ViewTracker } from '@/components/site/ViewTracker';
import { btnPrimary, btnSecondary, container, eyebrow, h2, lead } from '@/components/site/ui';
import { PRODUCTS } from '@/config/offer';
import { FAQ_WHATSAPP } from '@/content/faqs';

const P = PRODUCTS.whatsapp;

export const metadata: Metadata = {
  title: 'Agente de WhatsApp con IA para empresas y autónomos · 50 €/mes | Zyndrix',
  description:
    'Un agente de IA que responde el WhatsApp de tu negocio con tu información, recoge los datos de quien escribe y te avisa cuando hace falta. 50 €/mes.',
  alternates: { canonical: P.path },
  openGraph: { title: 'Agente de WhatsApp con IA · 50 €/mes', description: P.tagline, url: P.path },
};

const PROBLEMS = [
  { icon: Clock, title: 'Te escriben cuando no puedes mirar el móvil', text: 'Con un cliente delante, conduciendo o fuera de horario. La respuesta llega horas después.' },
  { icon: MessageSquareText, title: 'Siempre las mismas preguntas', text: 'Precios, horarios, dónde estáis, si hay hueco. Contestar cada una lleva su tiempo.' },
  { icon: UserRoundCheck, title: 'Solicitudes que se quedan sin seguimiento', text: 'Si nadie responde a tiempo, quien preguntaba suele acabar escribiendo a otro negocio.' },
];

const STEPS = [
  'Un cliente escribe a tu WhatsApp.',
  'El agente responde con la información que nos has dado: precios, horarios, servicios, ubicación.',
  'Si quiere cita, presupuesto o algo concreto, el agente toma su nombre, teléfono y lo que necesita.',
  'Te llega el aviso con los datos para que confirmes tú. Si no sabe algo, te lo pasa en lugar de inventar.',
];

export default function AgenteWhatsAppPage() {
  return (
    <>
      <SiteHeader />
      <ViewTracker product="whatsapp" />
      <main id="contenido" className="bg-white text-secondary">
        <section className="border-b border-secondary/10 bg-gradient-to-b from-surface-low to-white">
          <div className={`${container} grid items-center gap-12 py-14 sm:py-20 lg:grid-cols-[1.15fr_1fr]`}>
            <div>
              <p className={eyebrow}>{P.name}</p>
              <h1 className="mt-3 font-heading text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl">
                Contesta tu WhatsApp mientras tú trabajas
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-secondary/75">
                Responde las preguntas de siempre con la información de tu negocio, toma los datos de quien te escribe y
                te avisa cuando hace falta que intervengas.
              </p>
              <p className="mt-6 flex flex-wrap items-baseline gap-x-2 gap-y-1">
                <span className="whitespace-nowrap font-heading text-4xl font-bold">{P.priceMonthly} €</span>
                <span className="text-secondary/60">/mes</span>
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <TrackedLink href={`/?producto=whatsapp#contacto`} className={btnPrimary} eventParams={{ product: 'whatsapp', location: 'hero_producto' }}>
                  Empezar con WhatsApp
                </TrackedLink>
                <TrackedLink href="#precio" className={btnSecondary} eventParams={{ product: 'whatsapp', location: 'hero_ver_precio' }}>
                  Ver qué incluye
                </TrackedLink>
              </div>
            </div>
            <ConversationExample
              kind="whatsapp"
              title="Taller · WhatsApp"
              turns={[
                { from: 'cliente', text: 'Buenas, ¿hacéis cambio de aceite? ¿Cuánto cuesta?' },
                { from: 'agente', text: 'Hola. Sí, el cambio de aceite y filtro está desde 69 € según el modelo. ¿Qué coche tienes?' },
                { from: 'cliente', text: 'Un Seat León de 2018, diésel.' },
                { from: 'agente', text: 'Perfecto. ¿Me dejas tu nombre y teléfono? Javier te escribe para darte precio exacto y hora.' },
              ]}
              footnote="Ejemplo ilustrativo con precios inventados. Tu agente usa tu información."
            />
          </div>
        </section>

        <section aria-labelledby="problema-titulo" className="py-16 sm:py-24">
          <div className={container}>
            <p className={eyebrow}>El problema</p>
            <h2 id="problema-titulo" className={`${h2} mt-2 max-w-2xl`}>WhatsApp es donde te preguntan. No siempre puedes contestar.</h2>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {PROBLEMS.map(({ icon: Icon, title, text }) => (
                <div key={title} className="rounded-2xl border border-secondary/10 bg-white p-6">
                  <Icon size={22} className="text-primary" aria-hidden="true" />
                  <h3 className="mt-4 font-heading text-lg font-bold">{title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-secondary/70">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="funcionamiento" aria-labelledby="funcionamiento-titulo" className="scroll-mt-20 bg-surface-low py-16 sm:py-24">
          <div className={`${container} grid gap-10 lg:grid-cols-2`}>
            <div>
              <p className={eyebrow}>Cómo funciona</p>
              <h2 id="funcionamiento-titulo" className={`${h2} mt-2`}>Qué pasa cuando alguien te escribe</h2>
              <p className={`${lead} mt-4`}>
                El agente solo responde con lo que nos has contado de tu negocio. Lo que no sabe, no se lo inventa.
              </p>
            </div>
            <ol className="space-y-4">
              {STEPS.map((s, i) => (
                <li key={s} className="flex gap-4 rounded-2xl border border-secondary/10 bg-white p-5">
                  <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white" aria-hidden="true">
                    {i + 1}
                  </span>
                  <p className="text-[15px] leading-relaxed text-secondary/85">{s}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section aria-labelledby="no-sabe-titulo" className="py-16 sm:py-24">
          <div className={`${container} grid items-center gap-10 lg:grid-cols-2`}>
            <div>
              <BellRing size={24} className="text-primary" aria-hidden="true" />
              <h2 id="no-sabe-titulo" className={`${h2} mt-3`}>Cuando no sabe la respuesta, te avisa</h2>
              <p className={`${lead} mt-4`}>
                Si alguien pregunta algo que no está en tu información, como un caso especial o una queja, el agente se
                lo dice con naturalidad, toma sus datos y te pasa la conversación. Tú decides cómo seguir.
              </p>
            </div>
            <ConversationExample
              kind="whatsapp"
              title="Clínica · WhatsApp"
              turns={[
                { from: 'cliente', text: '¿Me podéis decir si este tratamiento es compatible con mi medicación?' },
                { from: 'agente', text: 'Esa pregunta debe responderla el equipo de la clínica. Les paso tu consulta ahora. ¿Me confirmas tu nombre?' },
              ]}
            />
          </div>
        </section>

        <ProductPlan product={P} />

        <section aria-labelledby="contratar-titulo" className="py-16 sm:py-24">
          <div className={container}>
            <p className={eyebrow}>Contratación</p>
            <h2 id="contratar-titulo" className={`${h2} mt-2`}>Cómo se contrata</h2>
            <ol className="mt-8 grid gap-6 md:grid-cols-3">
              {[
                ['Nos escribes', 'Con el formulario o por WhatsApp. Te contactamos para ver tu caso.'],
                ['Recibes la propuesta', 'Por escrito: cuota, volumen incluido, alta si la hubiera e impuestos.'],
                ['Lo configuramos y lo pruebas', 'Cuando te convence, lo activamos en tu WhatsApp.'],
              ].map(([t, d], i) => (
                <li key={t} className="rounded-2xl border border-secondary/10 bg-white p-6">
                  <span className="text-sm font-semibold text-primary">Paso {i + 1}</span>
                  <h3 className="mt-2 font-heading text-lg font-bold">{t}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-secondary/70">{d}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <div className="bg-surface-low">
          <Faq items={FAQ_WHATSAPP} title="Preguntas sobre el agente de WhatsApp" />
        </div>
        <CtaBand
          title="¿Te escriben más de lo que puedes contestar?"
          text="Cuéntanos qué te preguntan tus clientes y te decimos cómo lo resolvería el agente."
          href="/?producto=whatsapp#contacto"
          label="Consultar mi caso"
          product="whatsapp"
        />
      </main>
      <SiteFooter />
    </>
  );
}
