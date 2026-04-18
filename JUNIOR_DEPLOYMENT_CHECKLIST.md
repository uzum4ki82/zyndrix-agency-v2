# 🚀 DEPLOYMENT CHECKLIST - JUNIOR EXECUTION

**Para:** Junior Developer  
**Responsable de:** Ejecutar FIX #1-4 en producción  
**Tiempo Total:** 20 minutos  
**Fecha Target:** Hoy (2026-04-18)  
**Complejidad:** Baja (ejecutar, no codificar)

---

## PRE-DEPLOYMENT VERIFICATION

```bash
# Terminal 1: Verifica que el código está listo
cd e:\Antigravity\comercial
git status
# Debe mostrar: "working tree clean" (nada sin comitear)

git log --oneline -5
# Debe mostrar commits recientes con FIX #1-4

npm run build 2>&1 | tail -20
# Debe completar SIN errores
```

**✅ Si todo está limpio, procede. ❌ Si hay errores, reporta antes de continuar.**

---

## FASE 1: DATABASE MIGRATION (5 minutos)

### Paso 1.1: Abrir Supabase SQL Editor
1. Ve a https://supabase.com/dashboard
2. Selecciona tu proyecto (etcxlzpwxwnlrhowldel)
3. Click en **SQL Editor** (lado izquierdo)

### Paso 1.2: Copiar y ejecutar migración
1. En tu terminal, abre el archivo:
```bash
cat e:\Antigravity\comercial\FIX_4_EMAIL_TRACKING.sql
```

2. **Copia TODO el contenido** (desde el principio hasta el final)

3. En Supabase SQL Editor:
   - Click en **New Query**
   - Pega TODO el contenido
   - Click **Run** (botón azul inferior derecha)

4. **Espera a que complete** (deberías ver "Success" verde)

### Paso 1.3: Verificación de migración
En Supabase, ve a **Table Editor** → selecciona tabla `leads`:

Busca estas columnas (debe existir al menos 10 de las siguientes):
- [ ] `resend_email_id` (text)
- [ ] `email_sent_at` (timestamp)
- [ ] `email_delivered_at` (timestamp)
- [ ] `email_opened_at` (timestamp)
- [ ] `email_opened_count` (integer)
- [ ] `email_clicked_at` (timestamp)
- [ ] `email_clicked_count` (integer)
- [ ] `email_bounced_at` (timestamp)
- [ ] `bounce_reason` (text)
- [ ] `engagement_score` (numeric)

**✅ Si ves >10 nuevas columnas, Fase 1 completa.**  
**❌ Si no las ves, ejecuta la migración de nuevo (problema de paste/execute).**

---

## FASE 2: RESEND WEBHOOK (5 minutos)

### Paso 2.1: Crear webhook en Resend
1. Ve a https://resend.com/webhooks
2. Click **Create Webhook** (botón azul)

### Paso 2.2: Configurar webhook
Completa los campos:

| Campo | Valor |
|-------|-------|
| **Endpoint URL** | `https://comercial-eta.vercel.app/api/webhooks/resend` |
| **Events** | ✅ Marca TODAS: `email.sent`, `email.delivered`, `email.opened`, `email.clicked`, `email.bounced`, `email.complained` |

Click **Create Webhook**

### Paso 2.3: Copiar webhook ID (para referencia)
Después de crear, deberías ver un ID como `wh_xxxxx`. Cópialo y guarda en un editor de texto.

### Paso 2.4: Verificación manual de webhook
En terminal, ejecuta:

```bash
curl -X POST https://comercial-eta.vercel.app/api/webhooks/resend \
  -H "Content-Type: application/json" \
  -d '{"type":"email.opened","email_id":"test123","tags":[{"name":"lead_id","value":"550e8400-e29b-41d4-a716-446655440000"}]}'
```

**Esperado:** 
```json
{"success":true}
```
Status Code: **200 OK**

**✅ Si ves 200 OK, Fase 2 completa.**  
**❌ Si ves 404 o 500, significa que Vercel aún no está listo (procede a Fase 3 primero).**

---

## FASE 3: DEPLOY A VERCEL (5 minutos)

### Paso 3.1: Preparar repositorio
```bash
cd e:\Antigravity\comercial

# Verifica estado
git status
# Debe decir "working tree clean"

# Si hay cambios sin comitear:
git add -A
git commit -m "feat: FIX #1-4 production ready

- FIX #1: RLS bypass for daemon service role
- FIX #2: Real Stitch AI integration (fallback active)
- FIX #3: Visual DNA with Claude Vision color extraction
- FIX #4: Email tracking with Resend webhooks

All fixes tested and ready for deployment."
```

### Paso 3.2: Push a main/master
```bash
git push origin master
```

**Esperado:** 
```
To github.com:your-repo/comercial.git
   xxxxxxx..yyyyyyy  master -> master
```

### Paso 3.3: Monitorear deploy en Vercel
1. Ve a https://vercel.com/dashboard/comercial-eta
2. Click en **Deployments** (pestaña superior)
3. Deberías ver un deploy nuevo "Building..."
4. **Espera a que cambie a "Ready"** (normalmente 2-3 minutos)

**Indicadores de status:**
- 🟡 **Building** = En proceso (espera)
- 🟢 **Ready** = Completado exitosamente (sigue)
- 🔴 **Error** = Fallo de compilación (revisar logs)

### Paso 3.4: Ver logs si algo falla
Si status es **Error**:
1. Click en el deployment
2. Scroll down a **Build Logs**
3. Busca línea roja con error (normalmente TypeScript o module not found)
4. Reporta el error exacto

---

## FASE 4: VERIFICACIÓN FINAL (5 minutos)

### Test 4.1: Health Endpoint
```bash
curl https://comercial-eta.vercel.app/api/health
```

**Esperado:**
```json
{
  "status": "ok",
  "timestamp": "2026-04-18T...",
  "environment": "production",
  "uptime": 123
}
```

✅ Si ves `"status": "ok"` → Sigue  
❌ Si ves error o 404 → Deploy no completó, espera 1 min y reintenta

### Test 4.2: Webhook (Resend)
```bash
curl -X POST https://comercial-eta.vercel.app/api/webhooks/resend \
  -H "Content-Type: application/json" \
  -d '{"type":"email.opened","email_id":"test","tags":[{"name":"lead_id","value":"550e8400-e29b-41d4-a716-446655440000"}]}'
```

**Esperado:**
```json
{"success":true}
```
Status: **200 OK**

✅ Si ves 200 OK → Webhook funciona  
❌ Si ves 500 → Error en código (contacta equipo)

### Test 4.3: Daemon sigue activo
```bash
tail -20 daemon.log
# Debe mostrar ciclos recientes sin [ERROR]
```

✅ Si ves `[SUCCESS]` o `[INFO]` → Daemon activo  
❌ Si ves `[ERROR]` → Revisar qué pasó

---

## CHECKLIST FINAL

**Completar en orden:**

- [ ] **Fase 1:** Database migration ejecutada, 10+ columnas nuevas visibles
- [ ] **Fase 2:** Resend webhook creado, curl test retorna 200 OK
- [ ] **Fase 3:** Git push completado, Vercel status = "Ready"
- [ ] **Fase 4.1:** Health endpoint retorna 200 OK con status "ok"
- [ ] **Fase 4.2:** Webhook curl test retorna 200 OK (después que Vercel está Ready)
- [ ] **Fase 4.3:** Daemon.log muestra ciclos sin errores críticos

**Si todos los checks tienen ✅:**
```bash
echo "✅ DEPLOYMENT EXITOSO - Sistema en producción"
```

---

## MONITOREO POST-DEPLOYMENT

### Logs en tiempo real
```bash
# Terminal 1: Ver daemon en vivo
tail -f daemon.log | grep -E "SUCCESS|ERROR|TIMEOUT"

# Terminal 2: Monitor Vercel (abrir en navegador)
# https://vercel.com/dashboard/comercial-eta/logs
```

### Métricas a vigilar (primeras 24 horas)

| Métrica | Objetivo | Cómo verificar |
|---------|----------|----------------|
| Daemon uptime | >95% (>1,368 ciclos) | Contar `[SUCCESS]` en daemon.log |
| Email delivery | >98% | Resend dashboard → Logs |
| Webhook events | Real-time (<1s) | Resend webhooks → test events |
| API errors | <5 por 24h | daemon.log grep `[ERROR]` |

---

## SI ALGO FALLA

### ❌ Database migration error
```bash
# Revisa el error exacto en Supabase SQL Editor
# Posibles causas:
# 1. Ya existe una columna (es idempotent, debería funcionar)
# 2. Sintaxis SQL (copia exacto del archivo)
# 3. Permissions en Supabase (contacta equipo)

# Solución: Re-ejecuta la migración (es safe, tiene IF NOT EXISTS)
```

### ❌ Webhook test returns 404
Vercel aún no está Ready. Espera 1-2 minutos y reintenta.

### ❌ Webhook test returns 500
Error en la lógica del webhook. Contacta equipo de desarrollo con el error exacto.

### ❌ Daemon se detiene
1. Ver últimas líneas: `tail -50 daemon.log`
2. Buscar `[ERROR]` o `[TIMEOUT]`
3. Contactar equipo con el error

---

## ÉXITO

Una vez completado:

✅ Sistema en producción  
✅ Email tracking activo  
✅ Webhook recibiendo eventos  
✅ Dashboard visible con nueva columna "Engagement"  
✅ Daemon procesando leads sin interrupciones  

**Próximo paso:** Monitorear 24h y reportar estabilidad a equipo senior.

---

**Tiempo total esperado:** 20 minutos  
**Riesgo:** Bajo (todo es reversible en Vercel con rollback)  
**Responsable:** Junior Developer  
**Validador:** Senior (revisar logs después)

