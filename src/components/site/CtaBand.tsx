import { TrackedLink } from './TrackedLink';
import { btnPrimary, container } from './ui';

export function CtaBand({
  title,
  text,
  href = '/#contacto',
  label = 'Consultar mi caso',
  product,
}: {
  title: string;
  text: string;
  href?: string;
  label?: string;
  product?: string;
}) {
  return (
    <section className="py-16 sm:py-20">
      <div className={container}>
        <div className="flex flex-col items-start gap-6 rounded-2xl bg-secondary p-8 sm:p-12 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl">
            <h2 className="font-heading text-2xl font-bold text-white sm:text-3xl">{title}</h2>
            <p className="mt-3 text-[16px] leading-relaxed text-white/75">{text}</p>
          </div>
          <TrackedLink href={href} className={`${btnPrimary} shrink-0`} eventParams={{ location: 'banda_cta', product: product ?? 'general' }}>
            {label}
          </TrackedLink>
        </div>
      </div>
    </section>
  );
}
