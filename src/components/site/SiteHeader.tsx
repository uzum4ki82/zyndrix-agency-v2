'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { btnPrimary, container } from './ui';
import { track } from '@/lib/analytics';

const NAV = [
  { href: '/', label: 'Inicio' },
  { href: '/agente-whatsapp', label: 'Agente WhatsApp' },
  { href: '/agente-voz', label: 'Agente de voz' },
  { href: '/#como-funciona', label: 'Cómo funciona' },
  { href: '/#preguntas', label: 'Preguntas frecuentes' },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname === href);

  return (
    <header className="sticky top-0 z-50 border-b border-secondary/10 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/85">
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-2 focus:z-50 focus:rounded focus:bg-white focus:px-3 focus:py-2 focus:text-secondary"
      >
        Saltar al contenido
      </a>
      <div className={`${container} flex h-16 items-center justify-between gap-4`}>
        <Link href="/" className="shrink-0" aria-label="Zyndrix, ir al inicio">
          <Image src="/img/logo_raw.png" alt="Zyndrix" width={132} height={30} priority className="h-7 w-auto" />
        </Link>

        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? 'page' : undefined}
                  className={`rounded-md px-3 py-2 text-[15px] font-medium transition-colors hover:bg-surface-low ${
                    isActive(item.href) ? 'text-primary' : 'text-secondary/80'
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/#contacto"
            className={`${btnPrimary} px-4 sm:px-5`}
            onClick={() => track('cta_click', { location: 'header' })}
          >
            Quiero mi agente
          </Link>
          <button
            ref={toggleRef}
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-secondary hover:bg-surface-low lg:hidden"
            aria-expanded={open}
            aria-controls="menu-movil"
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <nav id="menu-movil" aria-label="Menú móvil" className="border-t border-secondary/10 bg-white lg:hidden">
          <ul className={`${container} flex flex-col py-2`}>
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  aria-current={isActive(item.href) ? 'page' : undefined}
                  className="flex min-h-12 items-center rounded-md px-2 text-base font-medium text-secondary hover:bg-surface-low"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="pb-3 pt-2">
              <Link
                href="/#contacto"
                onClick={() => {
                  setOpen(false);
                  track('cta_click', { location: 'menu_movil' });
                }}
                className={`${btnPrimary} w-full`}
              >
                Quiero mi agente
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
