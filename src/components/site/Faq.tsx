import { ChevronDown } from 'lucide-react';
import { container, eyebrow, h2 } from './ui';

export interface FaqItem {
  q: string;
  a: string;
}

export function Faq({ items, title = 'Preguntas frecuentes', id = 'preguntas' }: { items: FaqItem[]; title?: string; id?: string }) {
  return (
    <section id={id} aria-labelledby={`${id}-titulo`} className="scroll-mt-20 py-16 sm:py-24">
      <div className={`${container} grid gap-10 lg:grid-cols-[1fr_2fr]`}>
        <div>
          <p className={eyebrow}>Dudas habituales</p>
          <h2 id={`${id}-titulo`} className={`${h2} mt-2`}>{title}</h2>
        </div>
        <div className="divide-y divide-secondary/10 rounded-2xl border border-secondary/10 bg-white">
          {items.map((item) => (
            <details key={item.q} className="group px-5 sm:px-6">
              <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-4 text-left font-semibold text-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary [&::-webkit-details-marker]:hidden">
                <span>{item.q}</span>
                <ChevronDown
                  size={20}
                  aria-hidden="true"
                  className="shrink-0 text-secondary/50 transition-transform duration-150 group-open:rotate-180 motion-reduce:transition-none"
                />
              </summary>
              <p className="pb-5 text-[15px] leading-relaxed text-secondary/75">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
