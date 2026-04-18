# 🔍 AUDITORÍA PROFESIONAL - ZYNDRIX PLATFORM
**Fecha:** 18 de Abril, 2026  
**Nivel:** Senior/Producción  
**Estado:** MVP Avanzado → Listo para Pre-Producción (con riesgos)

---

## 📊 RESUMEN EJECUTIVO

**Verde (Go):**
- ✅ Arquitectura de servicios completamente implementada (searchService, stitchService, syncService)
- ✅ RLS bypass pattern establecido y documentado (Service Role Client)
- ✅ Daemon automation loop funcional con 4 fases (Discovery → Audit → Generation → Outreach)
- ✅ Email tracking webhook implementado (Resend integration)
- ✅ Visual DNA + Brand color extraction architecture en place

**Ámbar (Watch):**
- ⚠️ Variables de entorno críticas no validadas en tiempo de inicio
- ⚠️ Error handling inconsistente en daemon (fallbacks ad-hoc vs. retry logic)
- ⚠️ TypeScript types permisivos (`any`) en múltiples funciones críticas
- ⚠️ Database schema migration (STITCH_SCHEMA_FINAL.sql) no ejecutada
- ⚠️ RLS policies (FIX_1_RLS_POLICIES.sql) no aplicadas en Supabase

**Rojo (Blocker):**
- 🔴 CRÍTICO: Daemon lee `.env.local` con parsing manual (sin validación, sin tipos)
- 🔴 CRÍTICO: No hay retry logic en operaciones críticas (Stitch API, email send)
- 🔴 CRÍTICO: `SUPABASE_SERVICE_ROLE_KEY` es placeholder en el daemon si no existe

---

## 🏗️ ANÁLISIS TÉCNICO DETALLADO

### 1️⃣ INFRAESTRUCTURA DE BASE DE DATOS

#### Estado Actual:
```typescript
// zyndrix_daemon.js, línea 34-42
const supabaseServiceRole = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-key'  // ⚠️ RIESGO
);
```

#### Problemas Identificados:

| Problema | Severidad | Impacto | Solución |
|----------|-----------|--------|----------|
| Placeholder service key | 🔴 CRÍTICO | Daemon no puede persistir datos si env var no existe | Validar en startup, fallar early |
| Schema migration no ejecutada | 🟡 ÁMBAR | Columnas faltantes en tabla leads | Ejecutar STITCH_SCHEMA_FINAL.sql |
| RLS policies no aplicadas | 🟡 ÁMBAR | Service role bypass no funciona | Ejecutar FIX_1_RLS_POLICIES.sql |
| Sin validación de env vars | 🔴 CRÍTICO | Errores silenciosos en producción | Implementar schema validation (Zod) |

#### Schema Gaps (STITCH_SCHEMA_FINAL.sql):
```sql
-- Columnas requeridas (no verificadas si existen):
- stitch_preview_url TEXT
- stitch_project_id TEXT
- brand_palette JSONB
- engagement_score INT
- open_status TEXT
- extracted_colors JSONB
- business_dna JSONB
- whatsapp_sent BOOLEAN
- email_sent BOOLEAN
- opened_at TIMESTAMP
```

**Acción Inmediata:** 
1. Ejecutar STITCH_SCHEMA_FINAL.sql en Supabase SQL Editor
2. Ejecutar FIX_1_RLS_POLICIES.sql en Supabase SQL Editor
3. Verificar que service role key existe: `echo $SUPABASE_SERVICE_ROLE_KEY`

---

### 2️⃣ ARQUITECTURA DE SERVICIOS (BIEN HECHA ✅)

#### Patrón Implementado:
```
Routes (HTTP Layer)
  ↓
Services (Business Logic)
  ↓
Libraries (Utilities)
```

#### Servicios Completados:

**A. searchService.ts** (214 líneas)
- `performLeadSearch(niche, location, companyType)` → exports
- Lógica: Google Maps scan → deduplication → deep discovery → enrichment
- Fallback: Simulación de leads si no hay resultados reales
- **Evaluación:** ✅ Robusto, manejo de edge cases

**B. stitchService.ts** (170 líneas)  
- `performStitchGeneration(business, autoTrigger)` → exports
- Lógica: Construcción de prompt → llamada API Stitch → color extraction → DB persistence
- Fallback: Demo URL si STITCH_API_KEY no existe
- **Evaluación:** ✅ Estructura sólida, pero tipos débiles (`any`)

**C. syncService.ts** (195 líneas)
- 5 funciones de persistencia:
  - `persistAuditResults()` → webscan + tech stack
  - `persistEmailCampaign()` → email send tracking
  - `persistEmailOpen()` → email open tracking
  - `persistWhatsappInteraction()` → WhatsApp engagement
  - `persistLeadStatusTransition()` → lead status updates
- **Evaluación:** ✅ Patrón consistente, logging adecuado

#### Calificación: A+ (Arquitectura muy limpia, refactoring exitoso)

---

### 3️⃣ DAEMON AUTOMATION (CRÍTICO)

#### Pipeline de 4 Fases:

```javascript
// zyndrix_daemon.js - Main Loop (línea 522-549)
startCommander()
  ├─ Phase 1: runAutoScan() [24h interval]
  │   └─ Google Places search → newLeads insert
  │
  ├─ Phase 2: runAutoAudit() [every 30s]
  │   └─ Puppeteer audit → tech_stack, emails, colors
  │
  ├─ Phase 3: runAutoGeneration() [every 30s]
  │   └─ Stitch API call → preview_url persistence
  │
  └─ Phase 4: runAutoOutreach() [DISABLED]
      └─ Resend email send → status tracking
```

#### Problemas Críticos:

**A. Error Handling Inconsistente:**
```javascript
// Fase 2 - Good: Fallback on Puppeteer failure (línea 298-306)
} catch (err) {
    log('warning', `Failed to audit ${lead.name}: ${err.message}`);
    await updateLeadServiceRole(lead.id, { 
        tech_stack: 'Check Manual', 
        last_audit: new Date().toISOString()
    });
}

// Fase 1 - Bad: Silent failure on API call (línea 516-518)
} catch (err) {
    log('error', 'Discovery scan engine failed', err);
    // ❌ Retry? Backoff? Nothing.
}
```

**B. Sin Retry Logic:**
- Si Stitch API falla → lead se queda en limbo
- Si Supabase está down → daemon continúa ciega
- Si email service falla → no hay reintento

**C. Service Role Key Inseguro:**
```javascript
// línea 42: Placeholder por defecto ❌
const SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-key'

// Debería fallar en startup:
if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('CRITICAL: SUPABASE_SERVICE_ROLE_KEY not configured');
}
```

#### Recomendaciones:

1. **Implementar Retry Policy:**
```typescript
async function withRetry(fn, maxRetries = 3, delay = 1000) {
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await fn();
        } catch (err) {
            if (i === maxRetries - 1) throw err;
            await new Promise(r => setTimeout(r, delay * Math.pow(2, i)));
        }
    }
}
```

2. **Validar Environment Variables en Startup:**
```typescript
const REQUIRED_VARS = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
    'STITCH_API_KEY' // OPTIONAL pero log warning
];

function validateEnvironment() {
    const missing = REQUIRED_VARS.filter(v => !process.env[v]);
    if (missing.length > 0) {
        throw new Error(`Missing env vars: ${missing.join(', ')}`);
    }
}
```

3. **Circuit Breaker para APIs Externas:**
```typescript
class ApiCircuitBreaker {
    constructor(failureThreshold = 5, resetTimeout = 60000) {
        this.failures = 0;
        this.state = 'CLOSED'; // CLOSED → OPEN → HALF_OPEN
    }
    
    async call(fn) {
        if (this.state === 'OPEN') {
            throw new Error('Circuit breaker is OPEN - service unavailable');
        }
        try {
            const result = await fn();
            this.failures = 0;
            return result;
        } catch (err) {
            this.failures++;
            if (this.failures >= this.failureThreshold) {
                this.state = 'OPEN';
            }
            throw err;
        }
    }
}
```

**Calificación:** D+ (Funciona pero sin resiliencia de producción)

---

### 4️⃣ EMAIL & ENGAGEMENT TRACKING

#### Estado:

**Resend Webhook** (src/app/api/webhooks/resend/route.ts)
```typescript
// ✅ Implementado y funcional
- email.sent → log only
- email.delivered → engagement_score +10
- email.opened → engagement_score +25
- email.clicked → engagement_score +50
- email.bounced → engagement_score 0
- email.complained → engagement_score -100
```

**Problemas:**
1. Webhook URL no registrada en panel Resend → eventos no recibidos
2. No hay validación de firma Resend (security risk)
3. Engagement score es aritmética simple (no hay ML/decay)

#### Acciones Necesarias:
- [ ] Registrar webhook URL en Resend dashboard: `https://zyndrix.dev/api/webhooks/resend`
- [ ] Validar firma del webhook (Resend proporciona X-Resend-Signature)
- [ ] Verificar dominio zyndrix.dev en Resend (SPF, DKIM, DMARC)

**Calificación:** B (Estructura OK, setup pendiente)

---

### 5️⃣ VISUAL DNA & COLOR EXTRACTION

#### Estado:
```typescript
// agent-brain.ts → VisualDNAAgent class (líneas 76-100)
async extractBrandIdentity(lead): Promise<BrandPalette>
  → Llama extractBrandColors(screenshot_url, name, category)
  → Claude Vision API para analizar colores
  → Retorna { primary, secondary, confidence }
```

#### Evaluación:
- ✅ Claude Vision integration implementada
- ⚠️ No hay fallback si vision API falla
- ⚠️ No hay caché de resultados (re-procesa same screenshot)

#### Mejora Sugerida:
```typescript
// Agregar caché y fallback
class BrandExtractionService {
    private cache = new Map<string, BrandPalette>();
    
    async extract(screenshotUrl, name, category) {
        if (this.cache.has(screenshotUrl)) {
            return this.cache.get(screenshotUrl);
        }
        
        try {
            const palette = await extractBrandColors(screenshotUrl, name, category);
            this.cache.set(screenshotUrl, palette);
            return palette;
        } catch (err) {
            log('warning', `Color extraction failed, using defaults`);
            return FALLBACK_PALETTE; // { primary: '#6366f1', secondary: '#10b981' }
        }
    }
}
```

**Calificación:** B+ (Bien implementado, necesita resiliencia)

---

## 🚀 PRODUCCIÓN (VERCEL)

### Checklist Pre-Deploy:

- [ ] **Environment Variables:**
  - [ ] NEXT_PUBLIC_SUPABASE_URL ✓
  - [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY ✓
  - [ ] SUPABASE_SERVICE_ROLE_KEY ← **CRÍTICO**
  - [ ] STITCH_API_KEY (opcional, fallback a demo)
  - [ ] STITCH_MCP_ENDPOINT
  - [ ] GOOGLE_MAPS_API_KEY
  - [ ] RESEND_API_KEY
  - [ ] ANTHROPIC_API_KEY (para Claude Vision)
  - [ ] NEXT_PUBLIC_APP_URL (para callbacks)

- [ ] **Database:**
  - [ ] STITCH_SCHEMA_FINAL.sql ejecutado
  - [ ] FIX_1_RLS_POLICIES.sql ejecutado
  - [ ] Backups configurados en Supabase

- [ ] **Daemon:**
  - [ ] zyndrix_daemon.js running como proceso separado (PM2, systemd, etc.)
  - [ ] Logs persistentes (rotación diaria)
  - [ ] Health check endpoint: `GET /api/admin/daemon-status`

- [ ] **Email:**
  - [ ] Dominio zyndrix.dev verificado en Resend
  - [ ] Webhook URL registrada en Resend
  - [ ] SPF, DKIM, DMARC configurado

- [ ] **API Security:**
  - [ ] Rate limiting en `/api/engine/*` endpoints
  - [ ] CORS configurado (origin whitelist)
  - [ ] API keys en Vercel Secrets, no en .env.local

- [ ] **Monitoring:**
  - [ ] Sentry integration para error tracking
  - [ ] Datadog/CloudWatch para logs centralizados
  - [ ] Alertas para daemon crashes

**Calificación:** C (Infraestructura OK, pero setup crítico pendiente)

---

## 📋 PLAN DE ACCIÓN (96 HORAS)

### Día 1: Crítico (4 horas)

```
1. Validar y ejecutar migraciones de esquema
   ├─ STITCH_SCHEMA_FINAL.sql en Supabase
   ├─ FIX_1_RLS_POLICIES.sql en Supabase
   └─ Verificar columnas: stitch_preview_url, brand_palette, engagement_score

2. Validar environment variables
   ├─ Verificar SUPABASE_SERVICE_ROLE_KEY existe y es válido
   ├─ Verificar STITCH_API_KEY (si existe, si no → ok con fallback)
   └─ Crear script de validación en CI/CD

3. Mejorar daemon startup
   ├─ Reemplazar placeholder-service-key con validación en startup
   ├─ Fallar rápido si vars críticas faltan
   └─ Agregar health check endpoint
```

### Día 2: Resiliencia (4 horas)

```
1. Implementar retry logic en daemon
   ├─ Wrapper withRetry() para operaciones críticas
   ├─ Exponential backoff (1s, 2s, 4s, 8s)
   └─ Max 3 retries para Stitch API, 5 para Supabase

2. Implementar circuit breaker
   ├─ Para Stitch API (failureThreshold=3, resetTimeout=60s)
   ├─ Para Google Maps API
   └─ Para Resend API

3. Mejorar error handling
   ├─ Logging estructurado en JSON
   ├─ Context en every log line (leadId, phase, duration)
   └─ Alertas críticas a Slack/Email
```

### Día 3: Email & Tracking (4 horas)

```
1. Resend Setup
   ├─ Registrar webhook URL en dashboard Resend
   ├─ Verificar dominio zyndrix.dev (SPF/DKIM/DMARC)
   └─ Test email send end-to-end

2. Webhook Security
   ├─ Validar firma X-Resend-Signature
   ├─ Agregar rate limiting al webhook
   └─ Test bounce/complaint handling

3. Dashboard Metrics
   ├─ Mostrar engagement_score en LeadsTable
   ├─ Filtrar por open_status (opened/bounced/complained)
   └─ Reportes de email performance
```

### Día 4: Producción (4 horas)

```
1. Vercel Setup
   ├─ Agregar todos los env vars en Project Settings
   ├─ Test deploy en staging
   ├─ Verificar daemon puede conectar a Supabase desde Vercel
   └─ Monitor primera hora de producción

2. Monitoring & Alerting
   ├─ Configurar Sentry para error tracking
   ├─ Alertas para SIGTERM, critical errors
   ├─ Dashboard de daemon health
   └─ Health check con pings periódicos

3. Documentación
   ├─ Runbook para daemon troubleshooting
   ├─ Escalation procedure si daemon está down
   ├─ Rollback plan en caso de issue
```

---

## 🔐 SECURITY AUDIT

| Aspecto | Estado | Riesgo | Acción |
|--------|--------|--------|--------|
| RLS bypass pattern | ✅ Implementado | Medio (si keys se exponen) | Usar Supabase secrets manager |
| Email webhook signature | ❌ No validado | Alto | Validar X-Resend-Signature |
| API rate limiting | ❌ No implementado | Alto | Implementar en /api/engine/* |
| Environment variables | ⚠️ Placeholders | Crítico | Fallar en startup si faltan |
| Puppeteer sandbox | ✅ `--no-sandbox` | Medio (si untrusted input) | OK para URLs de Google Places |
| CORS | ? No revisado | Medio | Verificar origen whitelist |
| Logs sensitive data | ⚠️ Email addresses logged | Bajo | Redact en producción |

---

## 📊 MÉTRICAS CLAVE

```
Salud del Daemon:
├─ Uptime: Target 99.5% (30 min/mes máximo downtime)
├─ Cycle Time: 30s audit + 30s generation (60s total)
├─ Success Rate: >95% leads completados sin manual intervention
└─ Engagement: >30% email open rate, >10% click rate

Leads Pipeline:
├─ Discovery: 50-100 nuevos leads/día (24h scan)
├─ Audit: 20 leads/ciclo (máximo 30s)
├─ Generation: 10 demos/ciclo (máximo 30s)
└─ Outreach: DISABLED (preparado para activar)

System Health:
├─ DB connections: <50 concurrent (Supabase limit)
├─ API errors: <2% rate
├─ Stitch API availability: >99% (fallback a demo)
└─ Email delivery: >95% (bounce rate <3%)
```

---

## 🎯 CONCLUSIÓN

### Resumen:
- **Arquitectura:** A+ (servicios limpios, separación de concerns)
- **Funcionalidad:** B+ (MVP funcional, falta resiliencia)
- **Producción:** D+ (setup crítico pendiente, sin monitoring)
- **Security:** C (baseline OK, webhooks inseguros, rate limiting falta)

### Timeline Recomendado:
- **Hoy (4h):** Ejecutar migraciones DB + validar env vars
- **Mañana (4h):** Implementar retry logic + circuit breaker
- **Pasado (4h):** Resend setup + webhook security
- **+4 días:** Vercel deploy + monitoring 24/7

### Owner Responsabilidades:
1. **DBA:** Ejecutar migraciones SQL, backups, monitoring
2. **Backend Senior:** Retry logic, circuit breaker, error handling
3. **DevOps:** Vercel setup, secrets management, alerting
4. **Product:** Testing end-to-end, monitoring de métricas

---

**Documento Preparado Por:** Auditoría Profesional Senior  
**Próxima Revisión:** Después de Vercel Deploy (72h)

