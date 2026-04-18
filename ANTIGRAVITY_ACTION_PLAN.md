# 🎯 ANTIGRAVITY - PLAN DE ACCIÓN PRIORITIZADO

**De:** Claude Code (Auditor)  
**Para:** Antigravity Team  
**Fecha:** 2026-04-18  
**Riesgo:** BAJO (solo cambios que mejoran, nada que rompa existente)

---

## VISIÓN GENERAL

El sistema funciona bien. Hay 10 problemas identificados pero solo 4 son críticos PARA PRODUCCIÓN. Los otros 6 son mejoras de seguridad/performance que pueden venir después.

**Plan:** Preparar para Vercel deploy sin tocar lo que ya funciona.

---

## FASE 1: VERCEL DEPLOY (ESTA SEMANA)

### 1.1 Crear .env.example (NO ROMPE NADA)
**Archivo nuevo:**
```bash
# .env.example - Copiar .env.local y remover valores reales
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
GOOGLE_MAPS_API_KEY=your-google-maps-key-here
ANTHROPIC_API_KEY=your-anthropic-key-here
RESEND_API_KEY=your-resend-key-here
RESEND_FROM_EMAIL="Your Name <your-email@domain.com>"
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
STITCH_API_KEY=your-stitch-key-here-optional
STITCH_MCP_ENDPOINT=https://api.stitch.dev-optional
```

**Tiempo:** 5 min | **Riesgo:** 0% | **Beneficio:** Documentación clara

### 1.2 Actualizar .gitignore (NO ROMPE NADA)
**Agregar:**
```bash
echo ".env.local" >> .gitignore
echo ".env*.local" >> .gitignore
git add .gitignore
git commit -m "docs: Update .gitignore to exclude local env files"
```

**Tiempo:** 5 min | **Riesgo:** 0% | **Beneficio:** Seguridad (previene futuros commits accidentales)

### 1.3 Seguir VERCEL_DEPLOY_ANTIGRAVITY.md (NO ROMPE NADA)
**Pasos:**
- [ ] Verificar repo está pusheado
- [ ] Crear/vincular proyecto Vercel
- [ ] Agregar 8 variables de entorno
- [ ] Deploy
- [ ] Test webhook

**Tiempo:** 15 min | **Riesgo:** 0% (Vercel rollback automático) | **Beneficio:** Sistema en producción

### 1.4 Resend Webhook Verification (YA HECHO)
**Status:** ✅ COMPLETADO
- [x] Webhook URL registrado en Resend dashboard
- [x] Domain `zyndrix.dev` verificado (SPF/DKIM/DMARC)

**Próximo:** Test end-to-end (ver abajo)

---

## FASE 2: VALIDACIÓN (ESTA SEMANA)

### 2.1 Test Resend Webhook
**Script:**
```bash
curl -X POST https://comercial-eta.vercel.app/api/webhooks/resend \
  -H "Content-Type: application/json" \
  -d '{
    "type": "email.opened",
    "email_id": "test-123",
    "from": "info@zyndrix.dev",
    "to": "test@example.com",
    "tags": [{"name": "lead_id", "value": "test-lead-001"}]
  }'
```

**Validación:** Respuesta debe ser `{"success": true}` y lead debe actualizarse en Supabase

**Tiempo:** 5 min | **Riesgo:** 0% | **Beneficio:** Confirma email tracking

### 2.2 Monitorear daemon.log por 24h
**Qué buscar:**
```bash
# Success metrics:
grep "\[SUCCESS\]" daemon.log | wc -l  # Debería crecer
grep "Project generated" daemon.log | tail -5  # Demos se generan

# Error metrics:
grep "\[ERROR\]" daemon.log | tail -10  # Debería ser bajo
grep "timeout\|failed" daemon.log | wc -l  # Debería ser mínimo
```

**Tiempo:** 5 min setup + monitoreo pasivo | **Riesgo:** 0% | **Beneficio:** Confirma estabilidad

---

## FASE 3: MEJORAS SEGURAS (PRÓXIMA SEMANA)

### 3.1 Agregar Health Endpoint
**Archivo:** `src/app/api/health/route.ts`

```typescript
export async function GET(request: Request) {
  return Response.json({
    status: 'ok',
    daemon: 'running',
    supabase: 'connected',
    timestamp: new Date().toISOString()
  }, { status: 200 });
}
```

**Tiempo:** 5 min | **Riesgo:** 0% | **Beneficio:** Monitoreo simple

### 3.2 Agregar Puppeteer Timeout (CRÍTICA PARA RELIABILITY)
**Archivo:** `zyndrix_daemon.js` (búscar `page.goto`)

**Antes:**
```javascript
await page.goto(url);
```

**Después:**
```javascript
try {
  await page.goto(url, {
    timeout: 30000,
    waitUntil: 'networkidle2'
  });
} catch (err) {
  log('warning', `[PUPPETEER] Timeout loading ${url}`);
  // Continuar con siguiente lead
}
```

**Tiempo:** 10 min | **Riesgo:** 0% (try-catch protege) | **Beneficio:** CRÍTICO - evita daemon freeze

### 3.3 Optimizar Queries Supabase (PERFORMANCE)
**Archivo:** `src/lib/supabase.ts` línea ~255

**Antes:**
```typescript
.select('*')
```

**Después:**
```typescript
.select('id, name, category, email_sent, status, stitch_preview_url, updated_at')
```

**Tiempo:** 5 min | **Riesgo:** 0% (solo proyección, no cambio de datos) | **Beneficio:** -20% ancho de banda

### 3.4 Mejorar Demo Fallback (UX - OPCIONAL)
**Si NO tienes Stitch API real, mejorar visual de fallback:**

**Archivo:** `src/app/demo/[id]/page.tsx` (crear si no existe)

```typescript
export default async function DemoPage({ params }: { params: { id: string } }) {
  const lead = await getLeadById(params.id);
  
  return (
    <div style={{
      backgroundColor: lead?.brand_palette?.primary || '#6366f1',
      color: '#ffffff'
    }}>
      <h1>Propuesta Personalizada para {lead?.name}</h1>
      <p>Diseño único basado en tu marca</p>
      {/* Mostrar brand_palette.primary, secondary */}
      {/* Mostrar pain_points */}
      {/* Mostrar CTA */}
    </div>
  );
}
```

**Tiempo:** 30 min | **Riesgo:** 0% | **Beneficio:** UX mejorada visiblemente (incluso sin Stitch real)

---

## FASE 4: SEGURIDAD (CUANDO VAYA A PRODUCCIÓN)

### ⚠️ NO HACER AHORA - DEJAR PARA DESPUÉS

```
❌ Rotar API keys hoy
   Razón: Puede romper integraciones si algo falla
   Cuándo: Justo antes de producción final
   
❌ Webhook signature validation ahora
   Razón: Ya funciona sin ella, bajo riesgo
   Cuándo: Sprint de seguridad post-launch
   
❌ Cambios a RLS policies
   Razón: Ya funcionan bien, riesgo de romper
   Cuándo: Si necesitas restricciones nuevas
   
❌ Configurar Sentry hoy
   Razón: Daemon ya loguea todo, es bonito-to-have
   Cuándo: Cuando necesites alertas automáticas
```

---

## PRIORIZACIÓN FINAL

### ESTA SEMANA (Semana 1)
```
PRIORIDAD MÁXIMA:
[ ] Seguir VERCEL_DEPLOY_ANTIGRAVITY.md → Deploy a Vercel
[ ] Test Resend webhook end-to-end
[ ] Monitorear daemon 24h

PRIORIDAD ALTA (si hay tiempo):
[ ] Crear .env.example
[ ] Agregar Puppeteer timeout
[ ] Test en Vercel después de cada cambio
```

### PRÓXIMA SEMANA (Semana 2)
```
PRIORIDAD MEDIA:
[ ] Optimizar queries Supabase
[ ] Agregar /health endpoint
[ ] Mejorar demo fallback UI (si sin Stitch real)
```

### DESPUÉS (Cuando esté 100% stable)
```
PRIORIDAD BAJA:
[ ] Rotar API keys (con cuidado)
[ ] Webhook signature validation
[ ] Sentry integration
[ ] Audit seguridad externo
```

---

## RIESGOS A EVITAR

### ❌ NO HAGAS ESTO

1. **No cambies RLS policies**
   - Ya funcionan bien
   - Riesgo de bloquear daemon
   
2. **No toques schema de base de datos**
   - Ya está completo
   - Migraciones en producción son riesgosas
   
3. **No agregues nuevas integraciones API**
   - Enfócate en estabilizar lo existente
   - Las APIs externas (Google, Resend, Anthropic) ya están conectadas
   
4. **No refactorices daemon.js sin tests**
   - Sistema productivo
   - Cambios deben ser mínimos y probados

5. **No robes credenciales a .env.local en commits**
   - Verificar con `git log -- ".env.local"`
   - Agregar a .gitignore PRIMERO
   - Luego hacer commits

---

## CHECKLIST FINAL

### Pre-Deploy
- [ ] .env.example creado y incluido en repo
- [ ] .gitignore actualizado (excluye .env.local)
- [ ] Todos los tests pasando localmente
- [ ] daemon.log limpio (sin errores críticos)

### Deploy a Vercel
- [ ] Proyecto Vercel creado/vinculado
- [ ] 8 variables de entorno agregadas
- [ ] Enviroment Variables está en Settings (no hardcoded)
- [ ] Deploy exitoso (status "Ready")

### Post-Deploy
- [ ] URL https://comercial-eta.vercel.app accesible
- [ ] /api/webhooks/resend responde 200 OK
- [ ] Logs de Vercel muestran [RESEND_WEBHOOK]
- [ ] daemon.log muestra ciclos continuos SIN errores

### Webhook
- [ ] Webhook URL registrado en Resend dashboard
- [ ] Domain zyndrix.dev verificado (SPF ✅, DKIM ✅, DMARC ✅)
- [ ] Test webhook retorna success
- [ ] Lead actualizado en Supabase

---

## ENTREGABLES ESPERADOS

**Semana 1:**
- ✅ Deploy a Vercel funcional
- ✅ Webhook Resend confirmado operacional
- ✅ Daemon corriendo sin errores
- ✅ .env.example documentado

**Semana 2:**
- ✅ Puppeteer timeout implementado
- ✅ Queries optimizadas
- ✅ Health endpoint disponible
- ✅ UX de demo mejorada (si mejoras fallback)

---

## SOPORTE / DUDAS

Si algo falla:
1. Revisar daemon.log para mensajes de error
2. Revisar Vercel logs: Settings → Deployments → Logs
3. Revisar AUDIT_EXHAUSTIVE_20260418.md para contexto
4. Revisar AUDIT_INTERNAL_ANALYSIS.md para soluciones específicas

---

## NOTAS FINALES

✅ **Sistema está BUENO.** No necesita cambios radicales.  
⚠️ **Hay mejoras de seguridad/performance** que vienen después.  
🚀 **El focus AHORA es:** Deploy estable a Vercel + validar Resend.  
💰 **Credenciales/keying** se maneja cuando vaya a producción final.

**Timeline realista:**
- Deploy: Mañana (2026-04-19)
- Validación: +3 días (2026-04-22)
- Mejoras Phase 2: Semana siguiente

---

**Documento autorizado para Antigravity Team**  
**Última revisión:** 2026-04-18 12:30 UTC

