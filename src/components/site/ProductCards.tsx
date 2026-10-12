import { Check, MessageCircle, PhoneCall } from 'lucide-react';
import { PRODUCT_LIST, TERMS_NOTICE } from '@/config/offer';
import { TrackedLink } from './TrackedLink';
import { btnPrimary, btnSecondary, container, eyebrow, h2, lead } from './ui';

const ICONS = { whatsapp: MessageCircle, voz: PhoneCall } as const;

export function ProductCards({ id = 'agentes' }: { id?: string }) {
  return (
    <section id={id} aria-labelledby={`${id}-titulo`} className="scroll-mt-20 py-16 sm:py-24">
      <div className={container}>
        <div className="max-w-2xl">
          <p className={eyebrow}>Dos agentes, precio cerrado</p>
          <h2 id={`${id}-titulo`} className={`${h2} mt-2`}>
            Elige por dónde te escriben o te llaman tus clientes
          </h2>
          <p className={`${lead} mt-4`}>
            Cada agente se configura con la información de tu negocio. No tienes que instalar nada ni aprender a usar
            otra herramienta.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {PRODUCT_LIST.map((p) => {
            const Icon = ICONS[p.id];
            return (
              <article
                key={p.id}
                className="flex flex-col rounded-2xl border border-secondary/10 bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:p-8"
              >
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon size={22} aria-hidden="true" />
                  </span>
                  <h3 className="font-heading text-xl font-bold text-secondary">{p.name}</h3>
                </div>
                <p className="mt-5 flex items-baseline gap-1 text-secondary">
                  <span className="font-heading text-4xl font-bold">{p.priceMonthly} €</span>
                  <span className="text-base text-secondary/60">/mes</span>
                </p>
                <p className="mt-3 text-[16px] leading-relaxed text-secondary/75">{p.summary}</p>
                <ul className="mt-6 space-y-3 text-[15px] text-secondary/85">
                  {p.includes.slice(0, 4).map((item) => (
                    <li key={item} className="flex gap-3">
                      <Check size={18} className="mt-0.5 shrink-0 text-accent" aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-auto flex flex-col gap-3 pt-8 sm:flex-row">
                  <TrackedLink href={p.path} className={btnPrimary} eventParams={{ product: p.id, location: 'tarjeta' }}>
                    Ver agente de {p.shortName === 'Voz' ? 'voz' : 'WhatsApp'}
                  </TrackedLink>
                  <TrackedLink
                    href={`/?producto=${p.id}#contacto`}
                    className={btnSecondary}
                    eventParams={{ product: p.id, location: 'tarjeta_consulta' }}
                  >
                    Consultar mi caso
                  </TrackedLink>
                </div>
              </article>
            );
          })}
        </div>
        <p className="mt-6 text-sm text-secondary/60">{TERMS_NOTICE}</p>
      </div>
    </section>
  );
}
