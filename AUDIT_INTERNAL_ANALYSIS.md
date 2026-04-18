# 🔐 ANÁLISIS INTERNO - PLAN DE ACCIÓN POST-AUDITORÍA

**Destinado para:** Próximas sesiones / Desarrollo continuo  
**Creado:** 2026-04-18  
**Base:** AUDIT_EXHAUSTIVE_20260418.md

---

## PROBLEMAS CRÍTICOS - ACTION ITEMS

### P1: CREDENCIALES EXPUESTAS (🔴 CRÍTICA)

**Estado:** ACTIVO - RIESGO INMEDIATO

**Análisis Profundo:**
```
El archivo .env.local contiene:
- GOOGLE_MAPS_API_KEY (usable por cualquiera con acceso al repo)
- RESEND_API_KEY (podría enviar 10K+ emails maliciosos con coste)
- ANTHROPIC_API_KEY (podría consumir quota/generar costes)
- SUPABASE_SERVICE_ROLE_KEY (acceso a TODA la base de datos)

Si el repo es público o alguien con acceso lo expone:
1. Costes financieros ilimitados
2. Exfiltración de datos de 379 leads
3. Corrupción de datos (service role sin validación)
4. Reputación dañada (Resend banea la API)
```

**Plan de Fix:**
```bash
# Paso 1: Rotar keys (EN ORDEN)
1. Ir a Google Cloud Console → Regenerar GOOGLE_MAPS_API_KEY
2. Ir a Resend → API Keys → Disable old, create new RESEND_API_KEY
3. Ir a Anthropic Console → Create new ANTHROPIC_API_KEY
4. En Supabase → Settings → API Keys → Regenerar SUPABASE_SERVICE_ROLE_KEY

# Paso 2: Limpiar historial
git log --all --oneline --grep=env
git log --all --oneline -- ".env.local"
# Si fue comiteado: git filter-branch para remover (o rewrite history)

# Paso 3: Configurar .gitignore
echo ".env.local" >> .gitignore
echo ".env*.local" >> .gitignore
git add .gitignore
git commit -m "security: Add .env.local to gitignore"

# Paso 4: En Vercel, usar Variables de Entorno (no .env.local)
# Settings → Environment Variables → Add all 8 variables
```

**Verificación:**
```bash
git log --all -p -- ".env.local" | grep GOOGLE_MAPS_API_KEY
# Si retorna algo, el archivo fue comiteado y necesita history rewrite
```

---

### P2: STITCH_API_KEY NO CONFIGURADA (🔴 CRÍTICA)

**Estado:** ACTIVO - MALA UX

**Análisis Profundo:**
```
Situación actual:
- ✅ Daemon generando 100+ demos/día
- ❌ Todas las demos son fallback genérico (/demo/{id})
- ❌ Usuarios NO ven "su sitio transformado"
- ❌ Click-through rate probablemente <5%

Raíz del problema:
```typescript
if (!STITCH_API_KEY || !STITCH_ENDPOINT) {
  // Fallback: devuelve /demo/{id} genérica
  return { fallback: true, previewUrl: `/demo/${business.id}` };
}
```

No hay variables de entorno:
- STITCH_API_KEY → ???
- STITCH_MCP_ENDPOINT → ???
```

**Opciones de Fix:**

**Opción A: Configurar Stitch Real** (Recomendado si tienes API)
```bash
# 1. Obtener credenciales Stitch
STITCH_API_KEY=sk_live_xxxxx
STITCH_MCP_ENDPOINT=https://api.stitch-mcp.com

# 2. Agregar a .env.local
echo "STITCH_API_KEY=..." >> .env.local
echo "STITCH_MCP_ENDPOINT=..." >> .env.local

# 3. Test
curl -X POST https://api.stitch-mcp.com/projects/create \
  -H "Authorization: Bearer $STITCH_API_KEY" \
  -d '{"name":"Test"}'
```

**Opción B: Crear Demo Mock Realista** (Si no tienes Stitch)
```typescript
// Reemplazar fallback en stitchService.ts línea 31-36:
if (!STITCH_API_KEY) {
  return {
    projectId: `zyndrix_${business.id}`,
    // Generar demo MÁS realista (no solo /demo/{id})
    previewUrl: `${process.env.NEXT_PUBLIC_APP_URL}/demo/${business.id}?mode=ai-transformed`,
    fallback: true,
    // Incluir datos de negocio para que se vea más real
    businessContext: {
      name: business.name,
      colors: business.brand_palette,
      painPoints: business.pain_points
    }
  };
}
```

Luego crear página `/demo/[id]?mode=ai-transformed` que:
- Muestre brand_palette.primary, secondary
- Incluya pain_points en el diseño
- Tenga CTA personalizado

**Decision Recomendada:** Opción B (más rápido) AHORA + Opción A later (si obtienes Stitch real)

---

### P3: PUPPETEER SIN TIMEOUT (🔴 CRÍTICA - RELIABILITY)

**Estado:** ACTIVO - RIESGO DE HANG

**Análisis:**
```javascript
// zyndrix_daemon.js - PELIGROSO:
const page = await browser.newPage();
await page.goto(url);  // ← Sin timeout
// Si sitio está DOWN o es muy lento, daemon se congela INDEFINIDAMENTE
```

**Fix Directo (2 líneas):**
```javascript
// ANTES:
await page.goto(url);

// DESPUÉS:
await page.goto(url, {
  timeout: 30000,  // 30 segundos máximo
  waitUntil: 'networkidle2'  // No esperes a document.ready
});

// Con try-catch:
try {
  await page.goto(url, { timeout: 30000, waitUntil: 'networkidle2' });
} catch (err) {
  log('warning', `[PUPPETEER] Timeout o error navegando ${url}: ${err.message}`);
  // Continuar con datos parciales o skip el lead
}
```

**Verificación en daemon.log después de fix:**
```
[2026-04-18T12:00:00.000Z] [TIMEOUT] Page.goto exceeded 30s for https://example.com
[2026-04-18T12:00:00.500Z] [INFO] Continuing with next lead...
```

---

### P4: RATE LIMITING NO HANDLED (🟠 ALTA)

**Estado:** ACTIVO - RIESGO DE BLOQUEO

**Análisis:**
```
Daemon hace ~200 requests/ciclo:
- 5-10 Google Maps API calls (Maps search)
- 10-20 Puppeteer requests (website audits)
- 5-10 Supabase queries
- 10-20 Resend API (emails)
- 2-5 Anthropic API (color extraction)

Google Maps free tier:
- ~25K requests/día por API key
- Si daemon corre 2880 ciclos/día → 14.4K requests
- ⚠️ Cerca del límite, podría hitter durante peak hours

Resend free tier:
- 100 emails/día
- Daemon puede generar 50-100+ emails/día
- ⚠️ Probablemente hit el límite ya
```

**Fix:**
```javascript
// Agregar función de throttle:
const GOOGLE_MAPS_REQUESTS_PER_SECOND = 5;
const RESEND_REQUESTS_PER_SECOND = 10;

const throttle = (fn, delayMs) => {
  let lastCall = Date.now();
  return async (...args) => {
    const now = Date.now();
    if (now - lastCall < delayMs) {
      await new Promise(resolve => setTimeout(resolve, delayMs - (now - lastCall)));
    }
    lastCall = Date.now();
    return fn(...args);
  };
};

const googleMapsThrottled = throttle(
  (query) => fetch(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}`),
  1000 / GOOGLE_MAPS_REQUESTS_PER_SECOND  // 200ms entre requests
);

// Use: await googleMapsThrottled(searchQuery);
```

**Monitoreo:**
```bash
# En daemon.log, buscar:
grep "429\|rate.limit\|Too.many" daemon.log
# Si aparece, bajamos agresividad
```

---

## PROBLEMAS DE ALTA PRIORIDAD

### P3: Webhook Resend Sin Validación (🟠 ALTA)

**Estado:** PENDIENTE - BAJO RIESGO ahora

**Análisis:**
```typescript
// webhooks/resend/route.ts línea 20-30 - NO VALIDA ORIGEN
export async function POST(request: Request) {
  const event = (await request.json()) as ResendEvent;
  // ← Cualquiera puede enviar datos JSON
  
  // Podría recibir:
  {
    "type": "email.opened",
    "email_id": "fake",
    "to": "victim@example.com",
    "tags": [{"name": "lead_id", "value": "ChIJX7GHEOiNuhIR1h-14Rwu5no"}]
  }
  
  // Y el daemon actualizaría engagement score a true
}
```

**Fix (si Resend proporciona webhook secret):**
```typescript
import crypto from 'crypto';

const RESEND_WEBHOOK_SECRET = process.env.RESEND_WEBHOOK_SECRET;

export async function POST(request: Request) {
  const signature = request.headers.get('x-resend-signature');
  const body = await request.text();
  
  // Validar firma
  const expectedSignature = crypto
    .createHmac('sha256', RESEND_WEBHOOK_SECRET)
    .update(body)
    .digest('hex');
  
  if (signature !== `sha256=${expectedSignature}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const event = JSON.parse(body);
  // ... rest del código
}
```

---

## PROBLEMAS MEDIA PRIORIDAD

### P6: Queries Supabase Ineficientes

**Archivo:** src/lib/supabase.ts línea 255

**Antes:**
```typescript
const { data, error } = await supabase
  .from('leads')
  .select('*')  // ← Selecciona 40+ columnas
  .order('created_at', { ascending: false });
```

**Después:**
```typescript
const { data, error } = await supabase
  .from('leads')
  .select('id, name, category, email_sent, status, stitch_preview_url, updated_at')  // Solo lo necesario
  .order('created_at', { ascending: false });
```

**Impacto:** ~20-30% menos ancho de banda

---

### P7: Health Endpoint Falta

**Implementación sugerida:**

```typescript
// src/app/api/health/route.ts
export async function GET(request: Request) {
  const checks = {
    supabase: await checkSupabaseHealth(),
    googleMaps: await checkGoogleMapsHealth(),
    resend: await checkResendHealth(),
    anthropic: await checkAnthropicHealth(),
    daemon: await checkDaemonHealth()
  };
  
  const isHealthy = Object.values(checks).every(c => c.status === 'ok');
  
  return Response.json({
    status: isHealthy ? 'ok' : 'degraded',
    checks,
    timestamp: new Date().toISOString()
  }, {
    status: isHealthy ? 200 : 503
  });
}
```

Usar en:
- Vercel Status checks
- Uptime monitoring (Pingdom, etc.)
- Alertas si status !== 'ok'

---

## DOCUMENTACIÓN PENDIENTE

### .env.example
```bash
# Crear src/.env.example (sin values reales)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
GOOGLE_MAPS_API_KEY=your-google-maps-key
ANTHROPIC_API_KEY=your-anthropic-key
RESEND_API_KEY=your-resend-key
RESEND_FROM_EMAIL="Your Name <your-email@domain.com>"
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
STITCH_API_KEY=your-stitch-key (OPTIONAL - uses fallback if not set)
STITCH_MCP_ENDPOINT=https://api.stitch.dev (OPTIONAL)
```

---

## TESTING PENDIENTE

### Test Suite Críticos
```bash
# 1. Puppeteer timeout test
npm test -- daemon.timeout

# 2. Rate limiting test
npm test -- daemon.ratelimit

# 3. Webhook validation test
npm test -- webhooks.resend

# 4. Service role RLS bypass test
npm test -- db.rls-bypass

# 5. Demo generation test
npm test -- stitch.generation
```

---

## MÉTRICAS A MONITOREAR POST-FIXES

```
Métrica                     Baseline    Target
================================================
Daemon Uptime              100%        100%
Puppeteer Timeout Rate     0%          <1%
Google Maps Rate Limits    0           0 (throttle antes)
Resend Delivery Rate       100%        >95%
Stitch Demo Quality        Fallback    Real (cuando configures)
Webhook Event Processing   N/A         >99%
API Response Time (p99)    500ms       <300ms
Database Query Time        100ms       <50ms
```

---

## TIMELINE RECOMENDADO

```
Hoy (2026-04-18):
- [ ] P1: Rotar credentials (INMEDIATO)
- [ ] P2: Decidir entre Stitch real vs. mock mejorado
- [ ] P4: Resend webhook verification
- [ ] Deploy a Vercel con env vars correctas

Mañana (2026-04-19):
- [ ] P3: Agregar Puppeteer timeout
- [ ] P4: Implementar rate limiting
- [ ] Monitoreo en vivo de daemon.log

Próxima Semana:
- [ ] P6: Optimizar queries Supabase
- [ ] P7: Health endpoint
- [ ] Testing suite
- [ ] Documentación (.env.example, README)
- [ ] Audit de seguridad externo

Próximo Sprint:
- [ ] Sentry integration
- [ ] Distributed tracing
- [ ] Load testing
- [ ] Disaster recovery
```

---

## DECISIONES PENDIENTES DEL USUARIO

### Decision 1: STITCH Configuración
```
Opción A: Obtain real Stitch API + configure
  Pros: Demos realmente personalizadas
  Cons: Tiempo, posible coste
  Timeline: 1-2 días

Opción B: Mejorar demo fallback (mockup más realista)
  Pros: Rápido, demo mejorada visiblemente
  Cons: No es real personalización (aún)
  Timeline: 2-4 horas
  
Recomendación: Opción B AHORA + Opción A después
```

### Decision 2: Monitoreo
```
Opción A: Sentry (error tracking + performance)
  Pros: Completo, integración Next.js fácil
  Cons: Coste (€20/mes)
  
Opción B: LogRocket (session replay + errors)
  Pros: Ve exactamente qué hace el usuario
  Cons: Privacy concerns, coste (€99/mes)
  
Opción C: Datadog (full observability)
  Pros: Enterprise-grade
  Cons: Caro, overkill para MVP
  
Recomendación: Opción A (Sentry) para inicio
```

---

## RIESGOS RESIDUALES POST-FIXES

```
Riesgo                          Mitigación
================================================
Stitch API aún no real          Demo mejorada en fallback
Rate limits hit picos           Monitoreo + alertas
Webhook eventos perdidos        Logging exhaustivo + retries
Daemon crash (timeout)          Systemd restart automático
Datos corruptos                 RLS policies + audit logs
Costes API spike                Budget alerts en GCP/Resend
```

---

## NOTAS PARA FUTURO

1. **Stitch Integration:** Cuando tengas STITCH_API_KEY, actualiza stitchService.ts línea 26-37 y test con:
```bash
curl https://api.stitch.dev/test -H "Authorization: Bearer $STITCH_API_KEY"
```

2. **Performance:** Una vez estable, profile con:
```bash
node --prof zyndrix_daemon.js
# Genera isolate-*.log
# Analizar con clinic.js o DevTools
```

3. **Scaling:** Si leads >5K, considera:
   - Database sharding (por región)
   - Daemon clustering (múltiples instancias)
   - Queue-based processing (Bull, RabbitMQ)

4. **Legal/Compliance:**
   - GDPR: Lead deletion policy
   - CAN-SPAM: Unsubscribe links en emails
   - CCPA: Privacy policy actualizada

---

**Documento completado:** 2026-04-18  
**Próxima revisión:** Después de implementar 5 fixes críticos

