import { Check, Info, Minus } from 'lucide-react';
import type { Product } from '@/config/offer';
import { TERMS_NOTICE } from '@/config/offer';
import { TrackedLink } from './TrackedLink';
import { btnPrimary, container, eyebrow, h2 } from './ui';

/** Bloque de precio y condiciones de un producto: qué incluye, qué no y costes externos. */
export function ProductPlan({ product }: { product: Product }) {
  return (
    <section id="precio" aria-labelledby="precio-titulo" className="scroll-mt-20 bg-surface-low py-16 sm:py-24">
      <div className={container}>
        <p className={eyebrow}>Precio y condiciones</p>
        <h2 id="precio-titulo" className={`${h2} mt-2`}>
          {product.priceMonthly} € al mes. Esto es lo que incluye.
        </h2>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          <div className="rounded-2xl border border-secondary/10 bg-white p-6 lg:col-span-2 sm:p-8">
            <p className="flex items-baseline gap-1 text-secondary">
              <span className="font-heading text-5xl font-bold">{product.priceMonthly} €</span>
              <span className="text-lg text-secondary/60">/mes</span>
            </p>
            <h3 className="mt-8 font-semibold text-secondary">Incluido en la cuota</h3>
            <ul className="mt-3 space-y-3 text-[15px] text-secondary/85">
              {product.includes.map((i) => (
                <li key={i} className="flex gap-3">
                  <Check size={18} className="mt-0.5 shrink-0 text-accent" aria-hidden="true" />
                  <span>{i}</span>
                </li>
              ))}
            </ul>
            <h3 className="mt-8 font-semibold text-secondary">No incluido</h3>
            <ul className="mt-3 space-y-3 text-[15px] text-secondary/75">
              {product.notIncluded.map((i) => (
                <li key={i} className="flex gap-3">
                  <Minus size={18} className="mt-0.5 shrink-0 text-secondary/40" aria-hidden="true" />
                  <span>{i}</span>
                </li>
              ))}
            </ul>
            <TrackedLink
              href={`/?producto=${product.id}#contacto`}
              className={`${btnPrimary} mt-8 w-full sm:w-auto`}
              eventParams={{ product: product.id, location: 'precio' }}
            >
              {product.ctaPrimary}
            </TrackedLink>
          </div>

          <aside className="rounded-2xl border border-primary/20 bg-primary/5 p-6 sm:p-8" aria-labelledby="costes-titulo">
            <h3 id="costes-titulo" className="flex items-center gap-2 font-semibold text-secondary">
              <Info size={18} className="text-primary" aria-hidden="true" />
              Costes externos y condiciones
            </h3>
            <ul className="mt-4 space-y-4 text-[15px] leading-relaxed text-secondary/80">
              {product.externalCosts.map((c) => (
                <li key={c}>{c}</li>
              ))}
              <li>{TERMS_NOTICE}</li>
            </ul>
          </aside>
        </div>
      </div>
    </section>
  );
}
