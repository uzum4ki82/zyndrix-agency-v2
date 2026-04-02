# 🚀 GUÍA DE IMPLEMENTACIÓN - ZYNDRIX ENTERPRISE MASTER AUTOMATION

## 📋 CHECKLIST DE IMPLEMENTACIÓN

### FASE 1: DATABASE SETUP (2-3 horas)
- [ ] 1. Crear tablas faltantes en Supabase
- [ ] 2. Configurar RLS policies
- [ ] 3. Crear índices para optimización
- [ ] 4. Backup de datos actuales

### FASE 2: WORKFLOW DEPLOYMENT (1-2 horas)
- [ ] 5. Importar workflow maestro en n8n
- [ ] 6. Configurar credenciales
- [ ] 7. Testear cada nodo
- [ ] 8. Habilitar en producción

### FASE 3: INTEGRACIONES ADICIONALES (3-4 horas)
- [ ] 9. Configurar WhatsApp Business API
- [ ] 10. Setup SMS (Twilio)
- [ ] 11. Email sequences automáticas
- [ ] 12. Webhooks de respuesta

### FASE 4: MONITORING & OPTIMIZATION (1-2 horas)
- [ ] 13. Setup logging centralizado
- [ ] 14. Crear alertas en tiempo real
- [ ] 15. Dashboard de métricas
- [ ] 16. Documentación final

---

## 📊 PASO 1: CREAR TABLAS EN SUPABASE

Ejecuta estos SQL queries en tu Supabase console:

```sql
-- 1. Mejorar tabla de leads
ALTER TABLE leads ADD COLUMN IF NOT EXISTS tier VARCHAR(20);
ALTER TABLE leads ADD COLUMN IF NOT EXISTS sentiment VARCHAR(20) DEFAULT 'neutral';
ALTER TABLE leads ADD COLUMN IF NOT EXISTS pain_points TEXT[];
ALTER TABLE leads ADD COLUMN IF NOT EXISTS suggested_cta VARCHAR(50);

-- 2. Crear tabla de email sequences
CREATE TABLE IF NOT EXISTS email_sequences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  email_number INT NOT NULL,
  email_type VARCHAR(50),
  subject TEXT,
  body TEXT,
  sent_at TIMESTAMP WITH TIME ZONE,
  opened_at TIMESTAMP WITH TIME ZONE,
  clicked_at TIMESTAMP WITH TIME ZONE,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(lead_id, email_number)
);

-- 3. Crear tabla de WhatsApp messages
CREATE TABLE IF NOT EXISTS whatsapp_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  phone VARCHAR(20) NOT NULL,
  message_text TEXT NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  delivered_at TIMESTAMP WITH TIME ZONE,
  read_at TIMESTAMP WITH TIME ZONE,
  response_text TEXT,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Crear tabla de conversation logs
CREATE TABLE IF NOT EXISTS conversation_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  channel VARCHAR(50),
  message_type VARCHAR(50),
  content TEXT,
  metadata JSONB,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Mejorar tabla de tasks
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS lead_id UUID REFERENCES leads(id) ON DELETE SET NULL;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS assigned_to VARCHAR(100);
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS tags TEXT[];

-- 6. Crear tabla de AI insights
CREATE TABLE IF NOT EXISTS ai_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  analysis JSONB,
  suggestions TEXT[],
  predicted_conversion_rate DECIMAL(5,2),
  best_contact_time VARCHAR(50),
  sentiment VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Crear índices para performance
CREATE INDEX idx_leads_email ON leads(email);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_tier ON leads(tier);
CREATE INDEX idx_email_sequences_lead ON email_sequences(lead_id);
CREATE INDEX idx_whatsapp_lead ON whatsapp_messages(lead_id);
CREATE INDEX idx_conversation_lead ON conversation_logs(lead_id);
CREATE INDEX idx_tasks_lead ON tasks(lead_id);

-- 8. RLS POLICIES (opcional pero recomendado)
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_sequences ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_messages ENABLE ROW LEVEL SECURITY;
```

---

## 🔧 PASO 2: CONFIGURAR N8N WORKFLOW

### Importar Workflow Maestro

1. **Login a n8n.zyndrix.dev**
2. **Crear nuevo workflow**
3. **Copiar el contenido de `ZYNDRIX_ENTERPRISE_MASTER_WORKFLOW.json`**
4. **Importar como nuevo workflow**

### Configurar Credenciales

En cada nodo que requiera credenciales:

#### OpenAI
```
- API Key: Tu clave de OpenAI
- Model: gpt-4o
- Keep enabled
```

#### Supabase
```
- URL: https://vrvfftftnlspajplqjye.supabase.co
- API Key: sb_publishable_04ivizRHZPLg2eH6YkQUtw_MJG7DXfE
```

#### Gmail
```
- OAuth2: Conectar tu cuenta Gmail
- From email: hola@zyndrix.dev
```

#### Telegram
```
- Bot Token: YOUR_TELEGRAM_BOT_TOKEN
- Chat ID: TU_TELEGRAM_CHAT_ID
```

---

## ✅ PASO 3: TESTEAR WORKFLOW

### Test 1: Webhook Home
```bash
curl -X POST https://n8n.zyndrix.dev/webhook/zyndrix-lead-home \
  -H "Content-Type: application/json" \
  -d '{
    "body": {
      "record": {
        "id": "test-123",
        "name": "Test User",
        "email": "test@example.com",
        "company_name": "Test Company",
        "message": "Interesado en servicios",
        "service": "Blueprint"
      }
    }
  }'
```

### Test 2: Verificar Supabase
```sql
SELECT * FROM leads WHERE email = 'test@example.com';
SELECT * FROM email_sequences WHERE lead_id = 'test-123';
SELECT * FROM tasks WHERE lead_id = 'test-123';
```

### Test 3: Verificar Telegram
- Revisar que llegue el mensaje de alerta en Telegram

### Test 4: Verificar Email
- Revisar inbox de test@example.com

---

## 💬 PASO 4: INTEGRAR WHATSAPP

### Requisitos
- WhatsApp Business Account
- Número de teléfono verificado
- API Key de Meta

### Setup
```javascript
// Agregar a n8n como nuevo nodo
{
  "name": "WhatsApp Send",
  "type": "n8n-nodes-base.httpRequest",
  "parameters": {
    "url": "https://graph.instagram.com/v18.0/YOUR_PHONE_ID/messages",
    "method": "POST",
    "headers": {
      "Authorization": "Bearer YOUR_WHATSAPP_TOKEN"
    },
    "bodyParameters": {
      "messaging_product": "whatsapp",
      "recipient_type": "individual",
      "to": "{{ $('normalize_data').first().json.phone_number }}",
      "type": "text",
      "text": {
        "preview_url": false,
        "body": "{{ JSON.parse($node['ai_analysis'].json.message.content).whatsapp_message }}"
      }
    }
  }
}
```

---

## 📧 PASO 5: EMAIL SEQUENCES AUTOMÁTICAS

Crear nodo de "Scheduled Email Sequence" en n8n:

```
Email 1 (Día 0): Welcome + Audit propuesta
Email 2 (Día 3): Case study relevante
Email 3 (Día 7): Testimonios de clientes
Email 4 (Día 14): Special offer limitado
Email 5 (Día 21): "Hemos notado que aún no decidiste"
```

### Trigger automático
```javascript
// Crear workflow separado que se ejecute cada 24h
if (days_since_lead_received >= email_sequence_day) {
  send_email_sequence_next();
  log_to_table();
}
```

---

## 🎯 PASO 6: DASHBOARD REAL-TIME

Crear endpoint en Next.js:

```typescript
// app/api/webhook/dashboard-sync/route.ts
export async function POST(request: Request) {
  const data = await request.json();
  
  // Actualizar lead status en Supabase
  const { data: lead } = await supabase
    .from('leads')
    .update({
      updated_at: new Date().toISOString(),
      dashboard_sync: data.event
    })
    .eq('id', data.lead_id);
  
  // Trigger Supabase realtime (automático)
  
  return Response.json({ success: true });
}
```

---

## 📊 PASO 7: MONITORING & ALERTAS

### Crear dashboard con estas métricas:
- Leads por hora
- Tasa de conversión
- Score promedio
- Emails abiertos
- Respuestas WhatsApp
- Tasks completadas

### Configurar alertas críticas:
```javascript
if (leads_received_hourly > 100) {
  alert_slack("Alto volumen de leads detectado");
}

if (email_failure_rate > 5%) {
  alert_slack("Tasa de error en emails > 5%");
}

if (api_response_time > 3000) {
  alert_slack("Latencia de API detectada");
}
```

---

## 🔐 PASO 8: CONFIGURACIÓN DE SEGURIDAD

### Variables de Entorno
```env
N8N_WEBHOOK_URL=https://n8n.zyndrix.dev/webhook
SUPABASE_URL=https://vrvfftftnlspajplqjye.supabase.co
SUPABASE_KEY=sb_publishable_04ivizRHZPLg2eH6YkQUtw_MJG7DXfE
OPENAI_API_KEY=sk-...
WHATSAPP_TOKEN=EAAB...
TELEGRAM_BOT_TOKEN=...
GMAIL_CLIENT_SECRET=...
```

### Headers de Seguridad
- Validar webhook signatures
- Rate limiting por IP
- CORS configurado correctamente
- TLS 1.3

---

## 📝 PASO 9: DOCUMENTACIÓN

### Crear documentación para el equipo:
1. Guía de troubleshooting común
2. Procesos de escalada
3. Métricas clave a monitorear
4. Procedimiento de respuesta a clientes

---

## 🎓 WORKFLOW ARCHITECTURE VISUAL

```
INPUT SOURCES (3 Webhooks)
    ↓
[NORMALIZE DATA]
    ↓
[PERSIST TO SUPABASE]
    ↓
[AI ANALYSIS - GPT-4o]
    ↓
    ├→ [UPDATE SCORE]
    ├→ [SEND EMAIL]
    ├→ [TELEGRAM ALERT]
    │
    └→ [LOG SEQUENCE]
        ├→ [CREATE TASK]
        └→ [DASHBOARD SYNC]

ASYNCRONOUS (por separado):
    • [EMAIL SEQUENCES] cada 3/7/14/21 días
    • [WHATSAPP RESPONSES] cuando recibe mensajes
    • [FOLLOWUP TASKS] reminders diarios
```

---

## ⚠️ TROUBLESHOOTING COMÚN

### Problema: Workflow no dispara
**Solución:**
- Verificar URL del webhook
- Comprobar n8n está ejecutándose
- Revisar logs en n8n

### Problema: Email no se envía
**Solución:**
- Verificar credenciales de Gmail
- Comprobar email format válido
- Revisar logs de n8n

### Problema: Supabase no actualiza
**Solución:**
- Verificar API key
- Comprobar estructura de datos
- Revisar permisos RLS

### Problema: AI devuelve respuesta inválida
**Solución:**
- Revisar prompt del system
- Aumentar `max_tokens`
- Validar JSON response

---

## 📈 PRÓXIMOS PASOS (FASE 2)

Después de implementación exitosa:

1. **Multi-idioma:** Traducir prompts de IA
2. **A/B Testing:** Diferentes hooks y CTAs
3. **Predicción:** ML model para conversion rate
4. **Integración CRM:** HubSpot / Pipedrive
5. **Análisis avanzado:** Behavioral segmentation
6. **Automation:** Lead scoring dinámico
7. **Integración SMS:** Twilio
8. **Análisis de sentimiento:** Real-time

---

## 🆘 SOPORTE

Errores y preguntas:
- Documentación n8n: https://docs.n8n.io
- Documentación Supabase: https://supabase.com/docs
- Slack: #automation-support

