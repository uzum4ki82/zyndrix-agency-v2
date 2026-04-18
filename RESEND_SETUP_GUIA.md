# RESEND SETUP - GUÍA PASO A PASO

## INFO ACTUAL (En tu .env.local)

```
RESEND_API_KEY=re_bfdcjfVN_3PD2ydT4HQLDX66ZMZRbedxi
RESEND_FROM_EMAIL="Zyndrix Capital <info@zyndrix.dev>"
NEXT_PUBLIC_APP_URL=https://comercial-eta.vercel.app
```

**Webhook URL:** `https://comercial-eta.vercel.app/api/webhooks/resend`

---

## PARTE 1: REGISTRAR WEBHOOK EN RESEND (5 min)

### Paso 1: Ir a Resend Dashboard
1. Abre: https://resend.com/webhooks
2. Login con tu cuenta (la que tiene la API key)

### Paso 2: Crear nuevo Webhook
1. Click en **"Create Webhook"** (botón azul arriba)
2. En el campo **"URL"**, pega:
   ```
   https://comercial-eta.vercel.app/api/webhooks/resend
   ```

### Paso 3: Seleccionar Eventos
Marca TODOS estos checkboxes:
- ✓ email.sent
- ✓ email.delivered
- ✓ email.opened
- ✓ email.clicked
- ✓ email.bounced
- ✓ email.complained

### Paso 4: Guardar
1. Click **"Create"**
2. Resend te mostrará un screen con:
   - Webhook ID
   - Webhook Signing Secret (si aplica)
   - Status: "Active"

**OPCIONAL:** Si ves "Webhook Signing Secret", cópialo y agrégalo a `.env.local`:
```
RESEND_WEBHOOK_SECRET=<tu-secret>
```

### ✅ LISTO: El webhook está registrado

---

## PARTE 2: VERIFICAR DOMINIO `zyndrix.dev` (20 min)

### Opción A: Verificación DNS (Recomendado - Funciona)

#### Paso 1: Ir a Dominios en Resend
1. Abre: https://resend.com/domains
2. Click **"Add a Domain"**
3. Ingresa: `zyndrix.dev`
4. Click **"Next"**

#### Paso 2: Copiar Registros DNS
Resend te mostrará 3 registros. Cópialos exactamente:

**SPF Record:**
```
Type: TXT
Name: zyndrix.dev
Value: v=spf1 include:resend.com ~all
TTL: 3600
```

**DKIM Record (Resend dará este):**
```
Type: CNAME
Name: default._domainkey.zyndrix.dev
Value: [RESEND TE DARÁ ESTE VALOR]
TTL: 3600
```

**DMARC Record (Recomendado):**
```
Type: TXT
Name: _dmarc.zyndrix.dev
Value: v=DMARC1; p=quarantine; rua=mailto:info@zyndrix.dev
TTL: 3600
```

#### Paso 3: Agregar Registros en tu Registrador
¿Dónde compraste `zyndrix.dev`? (GoDaddy, Namecheap, Google Domains, etc.)

**EJEMPLO: Si es GoDaddy:**
1. Abre https://www.godaddy.com/domains
2. Click en `zyndrix.dev` → "Manage"
3. Ir a **"DNS"**
4. Agregar cada registro como TXT o CNAME según corresponda
5. Guardar

**Registrador diferente?** La interfaz varía, pero siempre es:
- Ir a DNS/Records
- Agregar nuevo registro
- Copiar Name, Type, Value exactamente

#### Paso 4: Verificar en Resend
1. Vuelve a https://resend.com/domains
2. Click en `zyndrix.dev` → **"Verify DNS"**
3. Resend verificará los registros (toma 5-30 min)
4. Cuando aparezca ✅ "Domain Verified", estás listo

---

## PARTE 3: TEST END-TO-END (5 min)

### Opción A: Test vía cURL

Abre una terminal y ejecuta:

```bash
curl -X POST https://comercial-eta.vercel.app/api/webhooks/resend \
  -H "Content-Type: application/json" \
  -d '{
    "type": "email.opened",
    "created_at": "2026-04-18T12:00:00Z",
    "email_id": "test-email-123",
    "from": "info@zyndrix.dev",
    "to": "test@example.com",
    "tags": [
      {"name": "lead_id", "value": "test-lead-001"}
    ]
  }'
```

**Respuesta esperada:**
```json
{"success": true}
```

### Opción B: Test vía Resend Dashboard

1. Ir a https://resend.com/webhooks
2. Click en tu webhook → **"Logs"**
3. Click **"Send Test"**
4. Selecciona evento: `email.opened`
5. Click **"Send"**
6. Mira los logs - debe aparecer "Sent" con status 200

### Validar en Base de Datos

Después del test:
1. Abre Supabase: https://app.supabase.com/
2. Proyecto: `etcxlzpwxwnlrhowldel`
3. Ir a tabla `leads`
4. Busca el lead con ID `test-lead-001`
5. Verifica que tenga:
   - `email_opened: true`
   - `email_opened_at: 2026-04-18T12:00:00Z`
   - `engagement_score: 35` (25 base + 10 por abierto)

---

## CHECKLIST FINAL

- [ ] Webhook registrado en Resend dashboard
- [ ] Webhook URL: `https://comercial-eta.vercel.app/api/webhooks/resend`
- [ ] Eventos seleccionados: sent, delivered, opened, clicked, bounced, complained
- [ ] Dominio `zyndrix.dev` agregado en Resend Domains
- [ ] Registros DNS creados en tu registrador (SPF, DKIM, DMARC)
- [ ] Dominio verificado en Resend (status ✅)
- [ ] Test webhook enviado y validado
- [ ] Lead actualizado en Supabase con email_opened: true

---

## TROUBLESHOOTING

### ❌ "Domain verification failed"
- Verifica que los registros estén exactamente igual a lo que Resend pide
- Espera 10-15 min más (propagación DNS)
- Si falta el DKIM, Resend lo regenerará

### ❌ "Webhook returns 404"
- Verifica que la URL sea: `https://comercial-eta.vercel.app/api/webhooks/resend`
- Asegúrate que Vercel esté deployado (todavía no lo está, es local)
- Por ahora puedes hacer test local: `http://localhost:3000/api/webhooks/resend`

### ❌ "Email still goes to spam"
- Espera a que DKIM se propague completamente (24-48h a veces)
- Asegúrate que DMARC está agregado
- Resend recomienda SPF + DKIM + DMARC juntos

### ❌ "Webhook secret validation fails"
- Si agregaste RESEND_WEBHOOK_SECRET en .env, necesitas validarlo en el código:
  ```typescript
  const signature = request.headers.get('x-resend-signature');
  // Validar con tu secret...
  ```
- Por ahora puedes ignorar el secret

---

## NEXT: DESPUÉS DE RESEND

Una vez dominio verificado:
1. Deploy a Vercel con variables de entorno
2. Configurar daemon como CRON job
3. Monitoreo en vivo de engagement

**Tiempo total esperado:** 45 min (incluida propagación DNS)

