# 🚀 VERCEL DEPLOY - INSTRUCCIONES PARA ANTIGRAVITY

**Responsable:** Antigravity Team  
**Tiempo Estimado:** 15 minutos  
**Complejidad:** Media  
**Prerequisitos:** Git push + Vercel project linkado

---

## CONTEXTO

Zyndrix está en **MVP operacional** con daemon activo procesando 360+ leads automáticamente. Necesitamos deployar la versión actual a Vercel para que:
- El webhook de Resend funcione (apunta a https://comercial-eta.vercel.app)
- El daemon pueda acceder a las APIs en producción
- El dominio `zyndrix.dev` esté verificado y activo

---

## PASO 1: PREPARAR REPOSITORIO (2 min)

### 1.1 Verificar que todo está comiteado
```bash
cd e:\Antigravity\comercial
git status
```

**Esperado:** Mostrar solo archivos que queremos ignorar (logs, etc.)

### 1.2 Si hay cambios sin comitear, comitearlos:
```bash
git add src/ zyndrix_daemon.js .env.local
git commit -m "feat: Resend webhook + improved daemon stability"
```

### 1.3 Push a rama main/master
```bash
git push origin master
# o si trabajas en rama feature:
git push origin feature-branch
```

---

## PASO 2: CONECTAR A VERCEL (1 min)

### Si ya existe proyecto Vercel:
1. Ve a https://vercel.com/dashboard
2. Selecciona proyecto `comercial-eta`
3. Ve a **Settings** → **Git**
4. Verifica que está vinculado a tu repositorio (debe decir "Connected")

### Si NO existe proyecto Vercel:
1. Ve a https://vercel.com/new
2. Click "Import Project"
3. Pega URL del repositorio
4. Selecciona framework: **Next.js**
5. Click "Import"

---

## PASO 3: CONFIGURAR VARIABLES DE ENTORNO (5 min)

### En Vercel Dashboard:

1. Ve a Settings → **Environment Variables**
2. Agrega TODAS estas variables (copiar del `.env.local` local):

| Variable | Valor | Origen |
|----------|-------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://etcxlzpwxwnlrhowldel.supabase.co` | .env.local |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` | .env.local |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` | .env.local (SECRETO) |
| `GOOGLE_MAPS_API_KEY` | `[REDACTED]` | .env.local |
| `ANTHROPIC_API_KEY` | `sk-ant-api03-OAtq9g12JERjE4Z_Q_PpznQdSu3g5uf0JG...` | .env.local (SECRETO) |
| `RESEND_API_KEY` | `[REDACTED]` | .env.local (SECRETO) |
| `RESEND_FROM_EMAIL` | `Zyndrix Capital <info@zyndrix.dev>` | .env.local |
| `NEXT_PUBLIC_APP_URL` | `https://comercial-eta.vercel.app` | .env.local |

**Importante:** Las marcadas como SECRETO deben tener checkbox "Encrypted" activado.

### Pasos en Vercel:
1. Click en el campo **"Name"**
2. Ingresa variable (ej: `NEXT_PUBLIC_SUPABASE_URL`)
3. Click en el campo **"Value"**
4. Pega el valor exacto
5. Para secretos: activa el checkbox **"Encrypted"**
6. Click **"Save"**
7. Repite para cada variable

**Validación:** Después de guardar, debe decir "Environment Variable saved"

---

## PASO 4: DEPLOYAR (5 min)

### Opción A: Deploy Automático (Recomendado)
- Automático al hacer push a `main` o `master`
- Ve a https://vercel.com/dashboard → `comercial-eta` → **Deployments**
- Debe mostrar un deploy "Building..." 
- Espera a que cambie a "Ready" (2-3 min)

### Opción B: Manual Redeploy
1. Ve a https://vercel.com/dashboard → `comercial-eta`
2. Click el botón **"..." → Redeploy**
3. Selecciona rama (main/master)
4. Click **"Redeploy"**
5. Espera a "Ready"

### Validación del Deploy:
```bash
curl https://comercial-eta.vercel.app/api/health
```

Debe retornar un status 200 OK (o el endpoint que tengas configurado)

---

## PASO 5: VERIFICAR WEBHOOK (2 min)

### Test del webhook en Vercel:

1. Ve a https://resend.com/webhooks
2. Click en tu webhook → **"Logs"**
3. Click **"Send Test"**
4. Selecciona evento: `email.opened`
5. Click **"Send"**
6. Mira el resultado:
   - ✅ **Status 200** = Webhook funciona
   - ❌ **Status 404 o 500** = Falta variable de entorno o código roto

### Si falla:
1. Verifica logs en Vercel: **Deployments** → última ejecución → **Logs**
2. Busca línea que diga `[RESEND_WEBHOOK]` 
3. Si hay error, contacta al equipo de desarrollo

---

## PASO 6: CONFIRMAR PRODUCCIÓN (1 min)

Una vez deploy exitoso:

```bash
# Verifica que el APP_URL apunta a Vercel
curl https://comercial-eta.vercel.app/api/webhooks/resend \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"type":"email.opened"}'
```

Debe retornar:
```json
{"success": true}
```

---

## CHECKLIST FINAL

- [ ] Repositorio pushedo a main/master
- [ ] Proyecto Vercel creado o vinculado
- [ ] Variables de entorno agregadas (8 variables)
- [ ] Deploy completado (status "Ready")
- [ ] Webhook test retorna 200 OK
- [ ] Logs en Vercel muestran [RESEND_WEBHOOK]

---

## TROUBLESHOOTING

### ❌ Deploy fallido (status "Error")
- Mira los logs en Vercel Deployments
- Busca `npm run build` - si falla, es error de compilación TypeScript
- Contacta equipo de desarrollo con el error exacto

### ❌ Webhook retorna 404
- Variable `NEXT_PUBLIC_SUPABASE_URL` no está configurada
- El endpoint `/api/webhooks/resend` no existe (error de build)
- Verifica que el deploy llegó a "Ready", no quedó en "Building"

### ❌ Webhook retorna 500
- Error en la lógica del webhook (base de datos, API Supabase)
- Mira logs en Vercel: **Deployments** → click en build → **Functions Logs**
- Busca `[RESEND_WEBHOOK] Error`

### ❌ Variables de entorno no se cargan
- Verifica que están en la sección correcta: **Settings → Environment Variables**
- No en **Environment Variables (Override)** o **System Environment Variables**
- Redeploy después de agregar variables

---

## POST-DEPLOY

Después de confirmar que funciona:

1. **Monitoreo:** Ver logs en https://vercel.com/dashboard/comercial-eta/logs
2. **Métricas:** Analytics en Vercel dashboard
3. **Próximo paso:** Configurar daemon como CRON job (ver documento DAEMON_CRON_SETUP.md)

---

## SOPORTE

Si algo falla:
1. Recopila el error exacto de Vercel logs
2. Captura pantalla de las variables de entorno configuradas
3. Contacta equipo de desarrollo con detalles

**Tiempo total esperado:** 15 minutos
**Riesgo:** Bajo (deploy es reversible - puedes hacer rollback a versión anterior)

