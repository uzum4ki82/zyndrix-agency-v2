import { NextResponse } from 'next/server';

/**
 * Recepción de solicitudes del formulario público.
 * - Valida en servidor, filtra bots (campo trampa + tiempo mínimo) y limita la frecuencia por IP.
 * - Guarda en Supabase y avisa al flujo de n8n desde el servidor (nada sensible llega al navegador).
 * - Solo responde éxito si al menos uno de los dos destinos ha recibido el lead.
 */

const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://vrvfftftnlspajplqjye.supabase.co';
const SB_KEY = process.env.SUPABASE_LEADS_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_04ivizRHZPLg2eH6YkQUtw_MJG7DXfE';
const N8N_LEAD_WEBHOOK = process.env.N8N_LEAD_WEBHOOK_URL || 'https://n8n.zyndrix.dev/webhook/zyndrix-lead-scoring';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^\+?[0-9\s().-]{9,20}$/;
const PRODUCTS: Record<string, string> = {
  whatsapp: 'Agente de WhatsApp (50 €/mes)',
  voz: 'Agente de voz (75 €/mes)',
  no_lo_se: 'Sin decidir',
};

// Límite simple en memoria por instancia: 5 envíos cada 10 minutos por IP.
const hits = new Map<string, number[]>();
function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < 10 * 60_000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 5;
}

const clean = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

async function withTimeout(url: string, init: RequestInit, ms = 8000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  try {
    return await fetch(url, { ...init, signal: ctrl.signal });
  } finally {
    clearTimeout(t);
  }
}

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }

  // Bots: campo trampa relleno o envío demasiado rápido → respuesta neutra sin procesar
  const elapsed = Number(body.elapsedMs) || 0;
  if (clean(body.website, 200) || elapsed < 2500) {
    return NextResponse.json({ ok: true }, { status: 202 });
  }

  const ip = (req.headers.get('x-forwarded-for') || '').split(',')[0].trim() || 'unknown';
  if (rateLimited(ip)) {
    return NextResponse.json({ error: 'rate_limited' }, { status: 429 });
  }

  const nombre = clean(body.nombre, 120);
  const negocio = clean(body.negocio, 160);
  const contacto = clean(body.contacto, 160);
  const mensaje = clean(body.mensaje, 1500);
  const producto = PRODUCTS[clean(body.producto, 20)] ? clean(body.producto, 20) : 'no_lo_se';
  const isEmail = EMAIL_RE.test(contacto);
  const isPhone = !isEmail && PHONE_RE.test(contacto);

  if (nombre.length < 2 || (!isEmail && !isPhone) || body.privacidad !== true) {
    return NextResponse.json({ error: 'validation' }, { status: 422 });
  }

  const record = {
    name: nombre,
    email: isEmail ? contacto.toLowerCase() : null,
    phone: isPhone ? contacto : null,
    company_name: negocio || null,
    message: mensaje || '(sin mensaje)',
    service: PRODUCTS[producto],
    language_preference: 'es',
    status: 'new',
  };

  let leadId: string | null = null;
  let stored = false;
  try {
    const sb = await withTimeout(`${SB_URL}/rest/v1/leads`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: SB_KEY,
        Authorization: `Bearer ${SB_KEY}`,
        Prefer: 'return=representation',
      },
      body: JSON.stringify(record),
    });
    if (sb.ok) {
      stored = true;
      const data = await sb.json().catch(() => null);
      leadId = Array.isArray(data) ? data[0]?.id ?? null : data?.id ?? null;
    } else {
      console.error('lead: supabase status', sb.status);
    }
  } catch (err) {
    console.error('lead: supabase error', (err as Error).name);
  }

  let notified = false;
  try {
    const wh = await withTimeout(N8N_LEAD_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        source: 'web_agentes_ia',
        record: { id: leadId ?? `web-${Date.now()}`, ...record, product: producto, source: 'web_agentes_ia' },
      }),
    });
    notified = wh.ok;
    if (!wh.ok) console.error('lead: n8n status', wh.status);
  } catch (err) {
    console.error('lead: n8n error', (err as Error).name);
  }

  if (!stored && !notified) {
    return NextResponse.json({ error: 'delivery_failed' }, { status: 502 });
  }
  return NextResponse.json({ ok: true }, { status: 201 });
}
