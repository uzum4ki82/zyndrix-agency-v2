'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { CONTACT } from '@/config/offer';
import { track } from '@/lib/analytics';
import { btnPrimary, container, eyebrow, h2, lead } from './ui';

type Producto = 'whatsapp' | 'voz' | 'no_lo_se';
type Fields = { nombre: string; negocio: string; contacto: string; producto: Producto; mensaje: string; privacidad: boolean };
type Errors = Partial<Record<keyof Fields, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^\+?[0-9\s().-]{9,20}$/;

function validate(f: Fields): Errors {
  const e: Errors = {};
  if (f.nombre.trim().length < 2) e.nombre = 'Escribe tu nombre para saber cómo dirigirnos a ti.';
  const c = f.contacto.trim();
  if (!c) e.contacto = 'Necesitamos un email o un teléfono para responderte.';
  else if (!EMAIL_RE.test(c) && !PHONE_RE.test(c)) e.contacto = 'Revisa el formato: un email (nombre@negocio.com) o un teléfono de 9 cifras.';
  if (!f.privacidad) e.privacidad = 'Marca la casilla para que podamos usar tus datos y responderte.';
  return e;
}

export function LeadForm() {
  const [f, setF] = useState<Fields>({ nombre: '', negocio: '', contacto: '', producto: 'no_lo_se', mensaje: '', privacidad: false });
  const [touched, setTouched] = useState<Partial<Record<keyof Fields, boolean>>>({});
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'ok' | 'error'>('idle');
  const [hp, setHp] = useState('');
  const startedAt = useRef<number>(Date.now());
  const started = useRef(false);
  const successRef = useRef<HTMLDivElement>(null);
  const errorSummaryRef = useRef<HTMLParagraphElement>(null);

  // Preselección del producto desde ?producto=whatsapp|voz
  useEffect(() => {
    const p = new URLSearchParams(window.location.search).get('producto');
    if (p === 'whatsapp' || p === 'voz') setF((prev) => ({ ...prev, producto: p }));
    startedAt.current = Date.now();
  }, []);

  useEffect(() => {
    if (status === 'ok') successRef.current?.focus();
    if (status === 'error') errorSummaryRef.current?.focus();
  }, [status]);

  const update = <K extends keyof Fields>(key: K, value: Fields[K]) => {
    if (!started.current) {
      started.current = true;
      track('form_start');
    }
    const next = { ...f, [key]: value };
    setF(next);
    // Si el campo tenía error, se limpia en cuanto se corrige
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: validate(next)[key] }));
  };

  const onBlur = (key: keyof Fields) => {
    setTouched((t) => ({ ...t, [key]: true }));
    setErrors((prev) => ({ ...prev, [key]: validate(f)[key] }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'sending') return;
    const v = validate(f);
    setErrors(v);
    setTouched({ nombre: true, contacto: true, privacidad: true });
    if (Object.keys(v).length) {
      const first = Object.keys(v)[0];
      document.getElementById(`lead-${first}`)?.focus();
      return;
    }
    setStatus('sending');
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...f, website: hp, elapsedMs: Date.now() - startedAt.current }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus('ok');
      track('form_submit', { product: f.producto });
    } catch {
      setStatus('error');
      track('form_error', { product: f.producto });
    }
  };

  const fieldCls = (k: keyof Fields) =>
    `mt-2 block w-full rounded-lg border bg-white px-4 py-3 text-[16px] text-secondary outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 ${
      touched[k] && errors[k] ? 'border-red-600' : 'border-secondary/20'
    }`;

  const waHref = `https://wa.me/${CONTACT.whatsappNumber}`;

  return (
    <section id="contacto" aria-labelledby="contacto-titulo" className="scroll-mt-20 py-16 sm:py-24">
      <div className={`${container} grid gap-10 lg:grid-cols-[1fr_1.2fr]`}>
        <div>
          <p className={eyebrow}>Contacto</p>
          <h2 id="contacto-titulo" className={`${h2} mt-2`}>Cuéntanos tu caso</h2>
          <p className={`${lead} mt-4`}>
            Te respondemos para entender qué consultas recibes y decirte qué agente te encaja. Sin compromiso y sin
            pagar nada por preguntar.
          </p>
          <ul className="mt-6 space-y-2 text-[15px] text-secondary/75">
            <li>1. Nos dejas tus datos.</li>
            <li>2. Te contactamos para ver tu caso.</li>
            <li>3. Te enviamos las condiciones por escrito antes de empezar.</li>
          </ul>
          <p className="mt-8 text-[15px] text-secondary/75">
            ¿Prefieres escribirnos directamente?{' '}
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-primary underline-offset-4 hover:underline"
              onClick={() => track('whatsapp_contact_click', { location: 'contacto' })}
            >
              Escríbenos por WhatsApp
            </a>
          </p>
        </div>

        <div className="rounded-2xl border border-secondary/10 bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:p-8">
          {status === 'ok' ? (
            <div ref={successRef} tabIndex={-1} role="status" className="flex flex-col items-start gap-3 outline-none">
              <CheckCircle2 size={32} className="text-accent" aria-hidden="true" />
              <h3 className="font-heading text-xl font-bold text-secondary">Solicitud recibida</h3>
              <p className="text-[15px] leading-relaxed text-secondary/75">
                Gracias, {f.nombre.split(' ')[0]}. Hemos recibido tus datos y te contactaremos por el medio que nos has
                indicado.
              </p>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate aria-describedby={status === 'error' ? 'lead-error' : undefined}>
              {status === 'error' && (
                <p
                  id="lead-error"
                  ref={errorSummaryRef}
                  tabIndex={-1}
                  role="alert"
                  className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-[15px] text-red-800 outline-none"
                >
                  No hemos podido enviar tu solicitud. Tus datos siguen en el formulario: vuelve a intentarlo en un
                  momento o{' '}
                  <a href={waHref} target="_blank" rel="noopener noreferrer" className="font-semibold underline">
                    escríbenos por WhatsApp
                  </a>
                  .
                </p>
              )}

              {/* Campo trampa para bots: oculto a personas y lectores de pantalla */}
              <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
                <label htmlFor="lead-website">Web</label>
                <input id="lead-website" name="website" tabIndex={-1} autoComplete="off" value={hp} onChange={(e) => setHp(e.target.value)} />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="lead-nombre" className="text-sm font-semibold text-secondary">Nombre</label>
                  <input
                    id="lead-nombre"
                    name="nombre"
                    autoComplete="name"
                    value={f.nombre}
                    onChange={(e) => update('nombre', e.target.value)}
                    onBlur={() => onBlur('nombre')}
                    aria-invalid={!!(touched.nombre && errors.nombre)}
                    aria-describedby={errors.nombre ? 'lead-nombre-err' : undefined}
                    className={fieldCls('nombre')}
                  />
                  {touched.nombre && errors.nombre && (
                    <p id="lead-nombre-err" className="mt-1.5 text-sm text-red-700">{errors.nombre}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="lead-negocio" className="text-sm font-semibold text-secondary">
                    Negocio <span className="font-normal text-secondary/60">(opcional)</span>
                  </label>
                  <input
                    id="lead-negocio"
                    name="negocio"
                    autoComplete="organization"
                    value={f.negocio}
                    onChange={(e) => update('negocio', e.target.value)}
                    className={fieldCls('negocio')}
                  />
                </div>
              </div>

              <div className="mt-5">
                <label htmlFor="lead-contacto" className="text-sm font-semibold text-secondary">Email o teléfono</label>
                <input
                  id="lead-contacto"
                  name="contacto"
                  autoComplete="email"
                  value={f.contacto}
                  onChange={(e) => update('contacto', e.target.value)}
                  onBlur={() => onBlur('contacto')}
                  aria-invalid={!!(touched.contacto && errors.contacto)}
                  aria-describedby={errors.contacto ? 'lead-contacto-err' : undefined}
                  className={fieldCls('contacto')}
                />
                {touched.contacto && errors.contacto && (
                  <p id="lead-contacto-err" className="mt-1.5 text-sm text-red-700">{errors.contacto}</p>
                )}
              </div>

              <fieldset className="mt-5">
                <legend className="text-sm font-semibold text-secondary">¿Qué te interesa?</legend>
                <div className="mt-2 grid gap-2 sm:grid-cols-3">
                  {([
                    ['whatsapp', 'WhatsApp · 50 €/mes'],
                    ['voz', 'Voz · 75 €/mes'],
                    ['no_lo_se', 'Aún no lo sé'],
                  ] as const).map(([value, label]) => (
                    <label
                      key={value}
                      className={`flex min-h-12 cursor-pointer items-center gap-2 rounded-lg border px-3 text-[15px] transition-colors ${
                        f.producto === value ? 'border-primary bg-primary/5 text-secondary' : 'border-secondary/20 text-secondary/80'
                      }`}
                    >
                      <input
                        type="radio"
                        name="producto"
                        value={value}
                        checked={f.producto === value}
                        onChange={() => update('producto', value)}
                        className="accent-primary"
                      />
                      {label}
                    </label>
                  ))}
                </div>
              </fieldset>

              <div className="mt-5">
                <label htmlFor="lead-mensaje" className="text-sm font-semibold text-secondary">
                  ¿Qué consultas recibes? <span className="font-normal text-secondary/60">(opcional)</span>
                </label>
                <textarea
                  id="lead-mensaje"
                  name="mensaje"
                  rows={3}
                  maxLength={1500}
                  value={f.mensaje}
                  onChange={(e) => update('mensaje', e.target.value)}
                  className={fieldCls('mensaje')}
                />
                <p className="mt-1.5 text-sm text-secondary/60">Por ejemplo: «Me preguntan mucho precios y si hay hueco el sábado».</p>
              </div>

              <div className="mt-5">
                <label className="flex items-start gap-3 text-[15px] text-secondary/80">
                  <input
                    id="lead-privacidad"
                    type="checkbox"
                    checked={f.privacidad}
                    onChange={(e) => update('privacidad', e.target.checked)}
                    onBlur={() => onBlur('privacidad')}
                    aria-invalid={!!(touched.privacidad && errors.privacidad)}
                    aria-describedby={errors.privacidad ? 'lead-privacidad-err' : undefined}
                    className="mt-1 h-5 w-5 shrink-0 accent-primary"
                  />
                  <span>
                    He leído la{' '}
                    <Link href="/privacidad" className="font-semibold text-primary underline-offset-4 hover:underline">
                      política de privacidad
                    </Link>{' '}
                    y acepto que Zyndrix use estos datos para responder a mi solicitud.
                  </span>
                </label>
                {touched.privacidad && errors.privacidad && (
                  <p id="lead-privacidad-err" className="mt-1.5 text-sm text-red-700">{errors.privacidad}</p>
                )}
              </div>

              <button type="submit" className={`${btnPrimary} mt-6 w-full`} aria-disabled={status === 'sending'}>
                {status === 'sending' ? (
                  <>
                    <Loader2 size={18} className="animate-spin motion-reduce:animate-none" aria-hidden="true" />
                    Enviando…
                  </>
                ) : (
                  'Enviar mi solicitud'
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
