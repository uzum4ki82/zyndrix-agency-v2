# RESEND WEBHOOK SETUP - PASO A PASO

## Estado Actual
- ✅ Webhook endpoint implementado: `/api/webhooks/resend`
- ✅ Manejo de eventos: email.sent, email.delivered, email.opened, email.clicked, email.bounced, email.complained
- ✅ Actualización de leads en tiempo real con engagement_score
- ✅ Filtrado de eventos de test
- 🔴 Webhook URL no registrada en Resend dashboard
- 🔴 Dominio zyndrix.dev no verificado

## 1. REGISTRAR WEBHOOK EN RESEND DASHBOARD

**URL del Webhook:**
```
https://comercial-eta.vercel.app/api/webhooks/resend
```

**Pasos:**
1. Ir a https://resend.com/webhooks
2. Click en "Create webhook"
3. Pegar URL: `https://comercial-eta.vercel.app/api/webhooks/resend`
4. Seleccionar eventos a escuchar:
   - ✓ email.sent
   - ✓ email.delivered
   - ✓ email.opened
   - ✓ email.clicked
   - ✓ email.bounced
   - ✓ email.complained
5. Click "Create"
6. Copiar el Webhook Signing Secret (si aplica)
7. Guardar el secret en `.env.local`: `RESEND_WEBHOOK_SECRET=<secret>`

## 2. VERIFICAR DOMINIO EN RESEND

**Dominio:** `zyndrix.dev`

### Opción A: DNS (Recomendado)

**Pasos:**
1. Ir a https://resend.com/domains
2. Click "Add a Domain"
3. Ingresar: `zyndrix.dev`
4. Resend mostrará registros DNS a crear:

#### SPF Record (Required)
```
Type: TXT
Name: zyndrix.dev
Value: v=spf1 include:resend.com ~all
TTL: 3600
```

#### DKIM Record (Required)
```
Type: CNAME
Name: default._domainkey.zyndrix.dev
Value: <valor-generado-por-resend>
TTL: 3600
```

#### DMARC Record (Recommended)
```
Type: TXT
Name: _dmarc.zyndrix.dev
Value: v=DMARC1; p=quarantine; rua=mailto:info@zyndrix.dev
TTL: 3600
```

5. Agregar registros en tu registrador de dominio (GoDaddy, Namecheap, etc.)
6. Volver a Resend → Click "Verify DNS"
7. Esperar propagación (5-30 minutos)

### Opción B: Email Verification (Backup)
Si DNS falla, Resend enviará email a:
- admin@zyndrix.dev
- postmaster@zyndrix.dev
- webmaster@zyndrix.dev

Necesitas acceso al inbox de esos correos para verificar.

## 3. TEST END-TO-END

**Script de test:**
```bash
curl -X POST https://comercial-eta.vercel.app/api/webhooks/resend \
  -H "Content-Type: application/json" \
  -d '{
    "type": "email.opened",
    "created_at": "2026-04-18T12:00:00Z",
    "email_id": "test-123",
    "from": "info@zyndrix.dev",
    "to": "test@example.com",
    "tags": [
      {"name": "lead_id", "value": "<test-lead-id>"}
    ]
  }'
```

**Validar:**
1. Response debe ser 200 OK
2. Logs en Vercel deben mostrar: `[RESEND_WEBHOOK] Received email.opened for lead <id>`
3. En Supabase, la row del lead debe tener `email_opened: true` y timestamp actualizado

## 4. TIMELINE

| Paso | Tiempo Estimado | Dependencias |
|------|-----------------|--------------|
| 1. Registrar webhook en Resend | 2 min | API key Resend (ya tienes) |
| 2. Crear registros DNS | 5 min | Acceso a registrador de dominio |
| 3. Propagar DNS | 5-30 min | Registros creados |
| 4. Verificar en Resend | 1 min | Propagación DNS |
| 5. Test end-to-end | 5 min | Dominio verificado |

**Total: 20-45 minutos**

## 5. PRODUCCIÓN - POST SETUP

Una vez verificado:
- ✅ Outreach automático enviará emails reales
- ✅ Engagement tracking capturará opens/clicks en tiempo real
- ✅ Daemon actualizará engagement_score automáticamente
- ✅ Dashboard mostrará live metrics

## NOTAS IMPORTANTES

1. **RESEND_FROM_EMAIL** está configurado en `.env.local`:
   ```
   RESEND_FROM_EMAIL="Zyndrix Capital <info@zyndrix.dev>"
   ```
   El dominio `zyndrix.dev` debe estar verificado para que funcione.

2. **Rate limits Resend:**
   - Free tier: 100 emails/día
   - Pro: ilimitado
   Verifica tu plan si necesitas más volumen.

3. **Webhook retry policy:**
   Resend reintenta webhooks failed hasta 72 horas. Los logs están en:
   https://resend.com/webhooks → selecciona el webhook → "Logs"

4. **Signing secret (si aplica):**
   Si usas signing secret, necesitas validarlo en la función webhook:
   ```typescript
   import crypto from 'crypto';
   const signature = request.headers.get('x-resend-signature');
   // Validar signature...
   ```

