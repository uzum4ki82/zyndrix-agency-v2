import type { Metadata } from 'next';
import { FileText, Headphones, PhoneIncoming, PhoneMissed } from 'lucide-react';
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
import { FAQ_VOZ } from '@/content/faqs';

const P = PRODUCTS.voz;

export const metadata: Metadata = {
  title: 'Agente de voz con IA: atención telefónica para tu negocio · 75 €/mes | Zyndrix',
  description:
    'Un agente telefónico con IA que coge las llamadas que no puedes atender, responde lo habitual y te deja un resumen de cada llamada. 75 €/mes.',
  alternates: { canonical: P.path },
  openGraph: { title: 'Agente de voz con IA · 75 €/mes', description: P.tagline, url: P.path },
};

const CALL_FLOW = [
  { icon: PhoneIncoming, title: 'Coge la llamada', text: 'Saluda con el nombre de tu negocio y avisa de que es un asistente virtual.' },
  { icon: Headphones, title: 'Entiende el motivo', text: 'Pide cita, quiere un precio, pregunta un horario… Responde lo que está en tu información.' },
  { icon: FileText, title: 'Toma nota', text: 'Recoge nombre, teléfono y lo que necesita, y se despide.' },
  { icon: PhoneMissed, title: 'Te deja el resumen', text: 'Recibes por escrito quién ha llamado y qué quiere, para devolver la llamada si hace falta.' },
];

const DIFFS = [
  ['Inmediato', 'El cliente habla y recibe respuesta en el momento, sin esperar a que leas un mensaje.'],
  ['Para quien prefiere llamar', 'Muchos clientes no escriben: llaman. Si nadie coge, cuelgan.'],
  ['Más coste por uso', 'Cada minuto de voz y de línea cuesta, por eso la cuota es mayor y los minutos incluidos se fijan antes de empezar.'],
];

export default function AgenteVozPage() {
  return (
    <>
      <SiteHeader />
      <ViewTracker product="voz" />
      <main id="contenido" className="bg-white text-secondary">
        <section className="border-b border-secondary/10 bg-gradient-to-b from-surface-low to-white">
          <div className={`${container} grid items-center gap-12 py-14 sm:py-20 lg:grid-cols-[1.15fr_1fr]`}>
            <div>
              <p className={eyebrow}>{P.name}</p>
              <h1 className="mt-3 font-heading text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl">
                Atiende las llamadas que tú no puedes coger
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-secondary/75">
                Un agente telefónico con IA que contesta con voz natural, resuelve las preguntas habituales y te deja
                por escrito quién ha llamado y qué necesita.
              </p>
              <p className="mt-6 flex flex-wrap items-baseline gap-x-2 gap-y-1">
                <span className="whitespace-nowrap font-heading text-4xl font-bold">{P.priceMonthly} €</span>
                <span className="text-secondary/60">/mes + uso de telefonía según volumen</span>
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <TrackedLink href="/?producto=voz#contacto" className={btnPrimary} eventParams={{ product: 'voz', location: 'hero_producto' }}>
                  Quiero el agente de voz
                </TrackedLink>
                <TrackedLink href="#precio" className={btnSecondary} eventParams={{ product: 'voz', location: 'hero_ver_precio' }}>
                  Ver qué incluye
                </TrackedLink>
              </div>
            </div>
            <ConversationExample
              kind="voz"
              title="Llamada a una barbería"
              turns={[
                { from: 'agente', text: 'Barbería Norte, le atiende el asistente virtual. ¿En qué puedo ayudarle?' },
                { from: 'cliente', text: 'Quería saber si hacéis arreglo de barba y cuánto cuesta.' },
                { from: 'agente', text: 'Sí, el arreglo de barba cuesta 12 €. ¿Quiere que le pidan cita? Dígame su nombre y un teléfono.' },
                { from: 'cliente', text: 'Sí, soy Andrés, el 600 000 000.' },
                { from: 'agente', text: 'Anotado, Andrés. Le llamarán para confirmar la hora. Gracias por llamar.' },
              ]}
              footnote="Transcripción de ejemplo con datos inventados."
            />
          </div>
        </section>

        <section aria-labelledby="flujo-titulo" className="py-16 sm:py-24">
          <div className={container}>
            <p className={eyebrow}>Durante la llamada</p>
            <h2 id="flujo-titulo" className={`${h2} mt-2 max-w-2xl`}>Lo que hace el agente cuando suena el teléfono</h2>
            <ol className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {CALL_FLOW.map(({ icon: Icon, title, text }, i) => (
                <li key={title} className="rounded-2xl border border-secondary/10 bg-white p-6">
                  <div className="flex items-center gap-3">
                    <Icon size={22} className="text-primary" aria-hidden="true" />
                    <span className="text-sm font-semibold text-secondary/60">Paso {i + 1}</span>
                  </div>
                  <h3 className="mt-4 font-heading text-lg font-bold">{title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-secondary/70">{text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section aria-labelledby="diferencias-titulo" className="bg-surface-low py-16 sm:py-24">
          <div className={`${container} grid gap-10 lg:grid-cols-2`}>
            <div>
              <p className={eyebrow}>Voz frente a WhatsApp</p>
              <h2 id="diferencias-titulo" className={`${h2} mt-2`}>¿Por qué un agente de voz y no solo WhatsApp?</h2>
              <p className={`${lead} mt-4`}>
                Si casi todos tus clientes te escriben, empieza por{' '}
                <TrackedLink href="/agente-whatsapp" className="font-semibold text-primary underline-offset-4 hover:underline" eventParams={{ location: 'voz_a_whatsapp' }}>
                  el agente de WhatsApp
                </TrackedLink>
                . Si lo que se te escapa son llamadas, este es el tuyo.
              </p>
            </div>
            <dl className="space-y-4">
              {DIFFS.map(([t, d]) => (
                <div key={t} className="rounded-2xl border border-secondary/10 bg-white p-5">
                  <dt className="font-heading font-bold">{t}</dt>
                  <dd className="mt-1 text-[15px] leading-relaxed text-secondary/75">{d}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <ProductPlan product={P} />

        <Faq items={FAQ_VOZ} title="Preguntas sobre el agente de voz" />
        <CtaBand
          title="¿Cuántas llamadas se te escapan a la semana?"
          text="Cuéntanos cuándo te llaman y qué te preguntan. Te decimos si el agente de voz te compensa."
          href="/?producto=voz#contacto"
          label="Consultar mi caso"
          product="voz"
        />
      </main>
      <SiteFooter />
    </>
  );
}
