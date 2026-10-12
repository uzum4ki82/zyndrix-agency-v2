import Image from 'next/image';
import Link from 'next/link';
import { container } from './ui';
import { PRODUCT_LIST } from '@/config/offer';

export function SiteFooter() {
  return (
    <footer className="border-t border-secondary/10 bg-surface-low">
      <div className={`${container} grid gap-10 py-12 md:grid-cols-[1.4fr_1fr_1fr]`}>
        <div className="max-w-sm">
          <Image src="/img/logo_raw.png" alt="Zyndrix" width={120} height={27} className="h-6 w-auto" />
          <p className="mt-4 text-[15px] leading-relaxed text-secondary/70">
            Agentes de IA para que los pequeños negocios atiendan WhatsApp y teléfono sin estar pendientes todo el día.
          </p>
        </div>
        <nav aria-label="Productos">
          <h2 className="text-sm font-semibold text-secondary">Productos</h2>
          <ul className="mt-3 space-y-2 text-[15px]">
            {PRODUCT_LIST.map((p) => (
              <li key={p.id}>
                <Link href={p.path} className="inline-block py-1.5 text-secondary/70 hover:text-primary">
                  {p.name} · {p.priceMonthly} €/mes
                </Link>
              </li>
            ))}
            <li>
              <Link href="/#contacto" className="inline-block py-1.5 text-secondary/70 hover:text-primary">
                Contacto
              </Link>
            </li>
          </ul>
        </nav>
        <nav aria-label="Legal">
          <h2 className="text-sm font-semibold text-secondary">Legal</h2>
          <ul className="mt-3 space-y-2 text-[15px]">
            <li><Link href="/aviso-legal" className="inline-block py-1.5 text-secondary/70 hover:text-primary">Aviso legal</Link></li>
            <li><Link href="/privacidad" className="inline-block py-1.5 text-secondary/70 hover:text-primary">Política de privacidad</Link></li>
            <li><Link href="/cookies" className="inline-block py-1.5 text-secondary/70 hover:text-primary">Política de cookies</Link></li>
          </ul>
        </nav>
      </div>
      <div className="border-t border-secondary/10">
        <p className={`${container} py-5 text-sm text-secondary/60`}>© {new Date().getFullYear()} Zyndrix</p>
      </div>
    </footer>
  );
}
