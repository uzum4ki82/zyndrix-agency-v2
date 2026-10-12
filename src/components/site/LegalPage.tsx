import type { ReactNode } from 'react';
import { SiteHeader } from './SiteHeader';
import { SiteFooter } from './SiteFooter';
import { container } from './ui';
import { LEGAL, legalPending } from '@/config/legal';

export const val = (v: string, label: string) => v || `[${label} pendiente de completar]`;

export function LegalPage({ title, updated, children }: { title: string; updated: string; children: ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main id="contenido" className="bg-white py-14 text-secondary sm:py-20">
        <article className={`${container} max-w-3xl`}>
          <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
          <p className="mt-2 text-sm text-secondary/60">Última actualización: {updated}</p>
          {legalPending.length > 0 && (
            <p role="note" className="mt-6 rounded-lg border border-amber-300 bg-amber-50 p-4 text-[15px] text-amber-900">
              Faltan datos del titular ({legalPending.join(', ')}). Este texto es una base que debe revisar un profesional antes de publicarse.
            </p>
          )}
          <div className="legal mt-8 space-y-5 text-[16px] leading-relaxed text-secondary/85 [&_h2]:mt-10 [&_h2]:font-heading [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-secondary [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6">
            {children}
          </div>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}

export { LEGAL };
