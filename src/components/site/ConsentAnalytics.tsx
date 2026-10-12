'use client';

import Link from 'next/link';
import Script from 'next/script';
import { useSyncExternalStore } from 'react';

const KEY = 'zyndrix-consent-v2';
const EVENT = 'zyndrix:consent';
type Snapshot = 'granted' | 'denied' | 'none' | 'ssr';

let memoryChoice: Snapshot = 'none'; // respaldo si el navegador bloquea el almacenamiento

function getSnapshot(): Snapshot {
  try {
    const v = localStorage.getItem(KEY);
    return v === 'granted' || v === 'denied' ? v : 'none';
  } catch {
    return memoryChoice;
  }
}

function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb);
  window.addEventListener('zyndrix:open-consent', cb);
  window.addEventListener('storage', cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener('zyndrix:open-consent', cb);
    window.removeEventListener('storage', cb);
  };
}

/**
 * Banner de consentimiento + carga de Google Analytics SOLO tras aceptar.
 * Sin aceptación no se carga ningún script de analítica.
 */
export function ConsentAnalytics({ gaId }: { gaId?: string }) {
  const consent = useSyncExternalStore(subscribe, getSnapshot, () => 'ssr' as Snapshot);

  const choose = (v: 'granted' | 'denied') => {
    try {
      localStorage.setItem(KEY, v);
    } catch {
      memoryChoice = v;
    }
    window.dispatchEvent(new Event(EVENT));
  };

  return (
    <>
      {gaId && consent === 'granted' && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
          <Script id="ga-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config','${gaId}',{anonymize_ip:true});`}
          </Script>
        </>
      )}

      {consent === 'none' && (
        <div
          role="region"
          aria-label="Aviso de cookies"
          className="fixed inset-x-0 bottom-0 z-[60] border-t border-secondary/10 bg-white p-4 shadow-[0_-4px_24px_rgba(15,23,42,0.08)] sm:inset-x-auto sm:bottom-4 sm:left-4 sm:max-w-md sm:rounded-2xl sm:border"
        >
          <p className="text-[15px] leading-relaxed text-secondary/80">
            Usamos cookies de analítica para saber qué páginas son útiles. Solo se activan si las aceptas.{' '}
            <Link href="/cookies" className="font-semibold text-primary underline-offset-4 hover:underline">
              Más información
            </Link>
          </p>
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={() => choose('granted')}
              className="inline-flex min-h-11 flex-1 items-center justify-center rounded-lg bg-primary px-4 text-[15px] font-semibold text-white hover:bg-[#0052cc]"
            >
              Aceptar
            </button>
            <button
              type="button"
              onClick={() => choose('denied')}
              className="inline-flex min-h-11 flex-1 items-center justify-center rounded-lg border border-secondary/20 px-4 text-[15px] font-semibold text-secondary hover:bg-surface-low"
            >
              Rechazar
            </button>
          </div>
        </div>
      )}
    </>
  );
}
