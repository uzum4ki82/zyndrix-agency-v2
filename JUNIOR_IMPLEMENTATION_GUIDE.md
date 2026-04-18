# 🛠️ GUÍA DE IMPLEMENTACIÓN PARA JUNIOR - REMEDIACIÓN DE AUDITORÍA

**Para:** Junior Developer  
**Base:** AUDIT_PARALELA_COMPLETA_20260418.md + AUDIT_INTERNAL_ANALYSIS.md  
**Tiempo Total:** ~2 horas  
**Complejidad:** Media (todos los fixes son directos, no refactorización)

---

## ⚡ INICIO RÁPIDO

```bash
# Terminal 1: Ver estado actual
git status
git diff zyndrix_daemon.js | head -50

# Terminal 2: Mantener daemon activo durante testing
tail -f daemon.log | grep -E "ERROR|SUCCESS|TIMEOUT"
```

---

## 📋 FASE 1: SEGURIDAD CRÍTICA (18 minutos)

### Fix 1.1: SQL Injection en supabase.ts:228
**Archivo:** `src/lib/supabase.ts`  
**Línea:** 228  
**Severidad:** CRÍTICA  
**Tiempo:** 2 min

**Antes:**
```typescript
.or(`website.ilike.%${cleanUrl}%,website.ilike.%${website}%`)
```

**Después:**
```typescript
// Agregar esta función al inicio del archivo (si no existe):
function escapeSql(str: string): string {
  return str.replace(/'/g, "''");
}

// Luego en la línea 228:
.or(`website.ilike.%${escapeSql(cleanUrl)}%,website.ilike.%${escapeSql(website)}%`)
```

**Verificación:**
```bash
grep -n "escapeSql" src/lib/supabase.ts
# Debe retornar la función y su uso en línea 228
```

---

### Fix 1.2: Arbitrary URL Navigation en daemon.js:222
**Archivo:** `zyndrix_daemon.js`  
**Línea:** 222  
**Severidad:** CRÍTICA  
**Tiempo:** 8 min

**Antes:**
```javascript
await page.goto(url);
```

**Después:**
```javascript
// Agregar esta función al inicio del archivo (después de los imports):
function isValidUrl(url) {
  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
}

// Luego en línea 222, reemplazar:
if (!isValidUrl(url)) {
  log('warning', `[DISCOVERY] Invalid URL (skipped): ${url}`);
  continue;
}
await page.goto(url, {
  timeout: 30000,
  waitUntil: 'networkidle2'
});
```

**Verificación:**
```bash
grep -n "isValidUrl" zyndrix_daemon.js
# Debe retornar la función y su uso
```

---

### Fix 1.3: Unvalidated Redirects en daemon.js:332
**Archivo:** `zyndrix_daemon.js`  
**Línea:** 332 (aprox, buscar "a[href*="contact"]")  
**Severidad:** CRÍTICA  
**Tiempo:** 5 min

**Busca esta línea:**
```javascript
const contactLink = await page.$eval('a[href*="contact"]', el => el.href);
await page.goto(contactLink);
```

**Reemplázala por:**
```javascript
const contactLink = await page.$eval('a[href*="contact"]', el => el.href);

// Validar que el redirect está en el mismo dominio
try {
  const originalDomain = new URL(url).hostname;
  const redirectDomain = new URL(contactLink).hostname;
  
  if (!contactLink.startsWith('http') || redirectDomain !== originalDomain) {
    log('warning', `[AUDIT] Redirect outside domain (skipped): ${contactLink}`);
    continue;
  }
  
  await page.goto(contactLink, {
    timeout: 30000,
    waitUntil: 'networkidle2'
  });
} catch (err) {
  log('warning', `[AUDIT] Invalid redirect URL: ${err.message}`);
  continue;
}
```

**Verificación:**
```bash
grep -A5 "href.*contact" zyndrix_daemon.js
# Debe mostrar el código con validación
```

---

### Fix 1.4: Browser Memory Leak en daemon.js:406
**Archivo:** `zyndrix_daemon.js`  
**Línea:** ~406  
**Severidad:** ALTA  
**Tiempo:** 3 min

**Busca el bloque try/catch:**
```javascript
let browser;
try {
  browser = await puppeteer.launch();
  // ... código ...
} catch (err) {
  log('error', err);
}
```

**Reemplázalo por:**
```javascript
let browser;
try {
  browser = await puppeteer.launch();
  // ... código ...
} finally {
  if (browser) {
    try {
      await browser.close();
    } catch (err) {
      log('warning', `[CLEANUP] Failed to close browser: ${err.message}`);
    }
  }
}
```

**Verificación:**
```bash
grep -B5 -A10 "puppeteer.launch" zyndrix_daemon.js | tail -20
# Debe mostrar finally block con browser.close()
```

---

## ✅ CHECKPOINT 1: Seguridad Crítica Completada

```bash
# Verificar que todos los fixes están en el código
echo "=== Checking Security Fixes ==="
grep -c "escapeSql" src/lib/supabase.ts && echo "✅ SQL Injection fix" || echo "❌ Missing SQL fix"
grep -c "isValidUrl" zyndrix_daemon.js && echo "✅ URL validation fix" || echo "❌ Missing URL fix"
grep -c "redirectDomain" zyndrix_daemon.js && echo "✅ Redirect validation fix" || echo "❌ Missing redirect fix"
grep -c "finally {" zyndrix_daemon.js && echo "✅ Memory leak fix" || echo "❌ Missing memory fix"
```

**Expected output:**
```
✅ SQL Injection fix
✅ URL validation fix
✅ Redirect validation fix
✅ Memory leak fix
```

---

## 📋 FASE 2: SEGURIDAD ALTA + OPERACIONAL (36 minutos)

### Fix 2.1: Puppeteer Timeout (CRÍTICO PARA RELIABILITY)
**Archivo:** `zyndrix_daemon.js`  
**Línea:** Todos los `page.goto(...)` calls  
**Severidad:** ALTA  
**Tiempo:** 10 min

**Instrucciones:**
Busca TODAS las líneas que tengan `page.goto(` y verifica que tengan timeout:

```bash
grep -n "page.goto" zyndrix_daemon.js
```

Cada una debe verse así (después de tus fixes anteriores):
```javascript
await page.goto(url, {
  timeout: 30000,
  waitUntil: 'networkidle2'
});
```

Si alguna NO tiene timeout, agrégalo.

**Verificación:**
```bash
grep -c "timeout: 30000" zyndrix_daemon.js
# Debe ser al menos 3 (Discovery, Audit, Outreach)
```

---

### Fix 2.2: UUID Validation en webhooks/resend/route.ts
**Archivo:** `src/app/api/webhooks/resend/route.ts`  
**Línea:** ~25  
**Severidad:** MEDIA  
**Tiempo:** 3 min

**Busca:**
```typescript
const leadId = leadIdTag?.value;
if (!leadId || leadId === 'test') { ... }
```

**Reemplázalo por:**
```typescript
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const leadId = leadIdTag?.value;
if (!leadId || !UUID_REGEX.test(leadId)) {
  log('warning', `[RESEND_WEBHOOK] Invalid lead_id: ${leadId}`);
  return NextResponse.json({ error: 'Invalid lead_id format' }, { status: 400 });
}
```

---

### Fix 2.3: Health Endpoint (NUEVO ARCHIVO)
**Archivo:** `src/app/api/health/route.ts` (CREAR)  
**Severidad:** MEDIA  
**Tiempo:** 5 min

**Crear archivo nuevo con:**
```typescript
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const healthStatus = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      uptime: Math.floor(process.uptime()),
    };

    return NextResponse.json(healthStatus, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { status: 'error', message: String(error) },
      { status: 503 }
    );
  }
}
```

**Verificación:**
```bash
curl http://localhost:3000/api/health
# Debe retornar JSON con status: "ok"
```

---

### Fix 2.4: Query Optimization en supabase.ts
**Archivo:** `src/lib/supabase.ts`  
**Línea:** ~255  
**Severidad:** MEDIA  
**Tiempo:** 5 min

**Busca:**
```typescript
.select('*')
```

**Reemplázalo por (mantén el contexto):**
```typescript
.select('id, name, category, email_sent, status, stitch_preview_url, updated_at, brand_palette, pain_points')
```

**Por qué:** Reduce ancho de banda 25-30% evitando columnas no necesarias.

---

### Fix 2.5: Email Validation en daemon.js
**Archivo:** `zyndrix_daemon.js`  
**Línea:** ~252 (buscar `const emailRegex`)  
**Severidad:** MEDIA  
**Tiempo:** 3 min

**Busca:**
```javascript
const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
```

**Reemplázalo por:**
```javascript
const emailRegex = /^[a-zA-Z0-9._%+-]{1,64}@[a-zA-Z0-9.-]{1,255}\.[a-zA-Z]{2,}$/;

// Agregar validación de longitud:
if (email.length > 254) {
  log('warning', `[OUTREACH] Email too long (skipped): ${email}`);
  continue;
}
```

---

### Fix 2.6: Documentación - .env.example
**Archivo:** `.env.example` (CREAR)  
**Severidad:** MEDIA  
**Tiempo:** 10 min

**Crear archivo en raíz del proyecto:**
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[REDACTED]
SUPABASE_SERVICE_ROLE_KEY=[REDACTED]

# APIs
GOOGLE_MAPS_API_KEY=[REDACTED]
ANTHROPIC_API_KEY=[REDACTED]
RESEND_API_KEY=[REDACTED]
RESEND_FROM_EMAIL="Your Name <your-email@domain.com>"

# Stitch (Optional)
STITCH_API_KEY=[REDACTED]
STITCH_MCP_ENDPOINT=https://api.stitch.dev

# App
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

**Verificación:**
```bash
ls -la .env.example
cat .env.example | grep REDACTED | wc -l
# Debe mostrar múltiples [REDACTED]
```

---

### Fix 2.7: .gitignore - Seguridad
**Archivo:** `.gitignore`  
**Severidad:** MEDIA  
**Tiempo:** 2 min

**Agrega estas líneas (si no existen):**
```bash
.env.local
.env*.local
daemon.log*
node_modules/
.next/
dist/
```

**Verificación:**
```bash
grep ".env.local" .gitignore
# Debe retornar la línea
```

---

## ✅ CHECKPOINT 2: Fase 2 Completada

```bash
# Test rápido
npm run build 2>&1 | head -20
# Debe compilar sin errores

# Test endpoint
curl http://localhost:3000/api/health
# Debe retornar {"status":"ok",...}

# Verificar documentación
ls -la .env.example .gitignore
# Ambos deben existir
```

---

## 🧪 TESTING POST-FIXES

### Test 1: Validación de URLs en daemon
```bash
# El daemon debería ahora rechazar URLs inválidas
grep "Invalid URL" daemon.log
# Si ve esta línea, la validación funciona
```

### Test 2: Memory leaks
```bash
# Monitorea memoria mientras daemon corre
# En Windows PowerShell:
while($true) { 
  (Get-Process -Name node | Measure-Object -Property WorkingSet -Sum).Sum / 1MB | Write-Host "Memory: $_ MB"
  Start-Sleep -Seconds 5 
}

# Debería estabilizarse (no crecer indefinidamente)
```

### Test 3: Webhook
```bash
curl -X POST http://localhost:3000/api/webhooks/resend \
  -H "Content-Type: application/json" \
  -d '{
    "type":"email.opened",
    "email_id":"test123",
    "tags":[{"name":"lead_id","value":"550e8400-e29b-41d4-a716-446655440000"}]
  }'

# Debe retornar 200 OK (no 400)
```

---

## 📝 CHECKLIST FINAL

- [ ] Fix 1.1: SQL Injection mitigation (`escapeSql` function)
- [ ] Fix 1.2: URL validation (`isValidUrl` function)
- [ ] Fix 1.3: Redirect validation (domain check)
- [ ] Fix 1.4: Browser memory leak (finally block)
- [ ] Fix 2.1: Puppeteer timeout (30s everywhere)
- [ ] Fix 2.2: UUID validation in webhook
- [ ] Fix 2.3: Health endpoint created
- [ ] Fix 2.4: Query optimization (projected fields)
- [ ] Fix 2.5: Email validation
- [ ] Fix 2.6: .env.example created
- [ ] Fix 2.7: .gitignore updated
- [ ] All tests passing (build, health, webhook)

---

## 🚀 DESPUÉS DE COMPLETAR

```bash
# 1. Verify build
npm run build

# 2. Commit changes
git add src/ zyndrix_daemon.js .gitignore .env.example
git commit -m "security: Implement critical security fixes and operational improvements

- SQL injection mitigation in supabase queries
- URL and redirect validation in daemon
- Browser memory leak fix in Puppeteer cleanup
- Puppeteer 30s timeout on all page.goto() calls
- UUID validation in Resend webhook
- Health endpoint for monitoring
- Query optimization (field projection)
- Email validation improvements
- Environment documentation (.env.example)"

# 3. Verify daemon still runs
npm run daemon

# 4. Test for 5 minutes
# Deberías ver ciclos completándose sin errores nuevos
```

---

## ⚠️ SI ALGO FALLA

**Build error:**
```bash
npm run build 2>&1 | grep -E "error|Error"
# Copia el error exacto y busca la línea que lo causa
```

**Daemon crashes:**
```bash
tail -20 daemon.log
# Busca [ERROR] o traceback
```

**Webhook returns 500:**
```bash
# Verifica que la función UUID_REGEX está definida correctamente
grep -A2 "const UUID_REGEX" src/app/api/webhooks/resend/route.ts
```

---

**Responsable:** Junior Developer  
**Validador:** Senior (después de completar checklist)  
**Tiempo Total:** ~2 horas  
**Dificultad:** Media (código directo, no refactoring)

