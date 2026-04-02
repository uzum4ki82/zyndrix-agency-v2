# 🔧 CORRECCIONES ESPECÍFICAS A WORKFLOWS ACTUALES

## ❌ PROBLEMA 1: Nodos Postgres vs Supabase

### ¿Qué está mal?
```json
// ❌ INCORRECTO
{
  "type": "n8n-nodes-base.postgres",
  "parameters": {
    "query": "UPDATE leads SET lead_score = $1, reasoning = $2 WHERE id = $4"
  }
}
```

### ✅ CORRECTO
```json
{
  "type": "n8n-nodes-base.httpRequest",
  "parameters": {
    "method": "PATCH",
    "url": "https://vrvfftftnlspajplqjye.supabase.co/rest/v1/leads?id=eq.{{ $json.id }}",
    "headers": {
      "apikey": "sb_publishable_04ivizRHZPLg2eH6YkQUtw_MJG7DXfE",
      "Authorization": "Bearer sb_publishable_04ivizRHZPLg2eH6YkQUtw_MJG7DXfE"
    },
    "bodyParameters": {
      "lead_score": "={{ $json.score }}",
      "reasoning": "={{ $json.reasoning }}"
    }
  }
}
```

**Por qué:** Supabase REST API es más confiable, escalable y fácil de debuggear.

---

## ❌ PROBLEMA 2: Referencias a Nodos Inestables

### ¿Qué está mal?
```javascript
// ❌ INCORRECTO - Esto a veces funciona, a veces no
"source": "={{ $node[\"Webhook (Home)\"] ? 'HOME' : 'BLUEPRINT' }}"
```

### ✅ CORRECTO
```javascript
// ✅ CORRECTO - Explícito y siempre funciona
"source": "={{ $json.body?.source || $json.source || 'contact_form' }}"
```

**Por qué:** Las referencias directas a nodos son frágiles. Mejor pasar el valor en el body del webhook.

---

## ❌ PROBLEMA 3: Error en Nodo Create CRM Task

### ¿Qué está mal?
En `ZYNDRIX_MASTER_FUNNEL_V10.json` línea 117:
```javascript
"description": "={{ JSON.parse($node[\"AI Analyzer\"].json.message.content).reasoning }}"
// Error: "AI Analyzer" no existe, debería ser "AI Lead Analyzer"
```

### ✅ CORRECCIÓN
```javascript
"description": "={{ JSON.parse($node[\"AI Lead Analyzer\"].json.message.content).reasoning }}"
```

---

## ❌ PROBLEMA 4: Falta de Validación de Email

### ¿Qué está mal?
```javascript
// ❌ Envía email sin validar
"toEmail": "={{ $json.record.email }}"
```

### ✅ CORRECTO
```javascript
// ✅ Valida antes de enviar
"toEmail": "={{ $json.record.email.match(/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/) ? $json.record.email : '' }}"
```

O mejor aún, agregar un nodo de validación:

```json
{
  "name": "Validate Email",
  "type": "n8n-nodes-base.if",
  "parameters": {
    "conditions": {
      "conditions": [
        {
          "condition": "regex",
          "value1": "={{ $json.email }}",
          "value2": "/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/"
        }
      ]
    }
  }
}
```

---

## ❌ PROBLEMA 5: Sin Error Handling

### ¿Qué está mal?
Si cualquier nodo falla, todo el flujo se detiene sin notificación.

### ✅ CORRECTO - Agregar Try/Catch

```json
{
  "name": "Email Send with Error Handling",
  "type": "n8n-nodes-base.gmail",
  "onError": "continueRegardless"
}
```

Y crear rama de error:
```json
{
  "name": "Error Logger",
  "type": "n8n-nodes-base.httpRequest",
  "parameters": {
    "url": "https://vrvfftftnlspajplqjye.supabase.co/rest/v1/error_logs",
    "method": "POST",
    "body": {
      "error": "={{ $error.message }}",
      "lead_id": "={{ $json.lead_id }}",
      "timestamp": "={{ $now.toISO() }}"
    }
  }
}
```

---

## ❌ PROBLEMA 6: JSON Response Parse Frágil

### ¿Qué está mal?
```javascript
// ❌ Si OpenAI devuelve error, JSON.parse falla
JSON.parse($node["ai_analysis"].json.message.content).score
```

### ✅ CORRECTO
```javascript
// ✅ Valida primero
try {
  const parsed = JSON.parse($node["ai_analysis"].json.message.content);
  return parsed.score || 5; // default value
} catch(e) {
  return 5; // default score
}
```

O mejor, agregar validación en n8n:

```json
{
  "name": "Validate AI Response",
  "type": "n8n-nodes-base.code",
  "parameters": {
    "language": "javaScript",
    "code": "
      try {
        const response = JSON.parse(items[0].json.message.content);
        if (!response.score || !response.tier) {
          throw new Error('Invalid AI response format');
        }
        return [{ json: response }];
      } catch(e) {
        return [{ json: { score: 5, tier: 'MEDIUM', reasoning: 'Default due to error' } }];
      }
    "
  }
}
```

---

## ❌ PROBLEMA 7: Sin Logging de Secuencias

### ¿Qué está mal?
No hay forma de saber qué emails se enviaron, cuáles se abrieron, etc.

### ✅ CORRECTO - Agregar nodo de logging

```json
{
  "name": "Log Email Sent",
  "type": "n8n-nodes-base.httpRequest",
  "parameters": {
    "url": "https://vrvfftftnlspajplqjye.supabase.co/rest/v1/email_sequences",
    "method": "POST",
    "headers": { /* auth headers */ },
    "bodyParameters": {
      "lead_id": "={{ $json.lead_id }}",
      "email_number": "1",
      "subject": "={{ $json.subject }}",
      "sent_at": "={{ $now.toISO() }}",
      "status": "sent"
    }
  }
}
```

---

## ❌ PROBLEMA 8: Credenciales Hardcodeadas

### ¿Qué está mal?
```javascript
// ❌ NUNCA hagas esto
"apikey": "sb_publishable_04ivizRHZPLg2eH6YkQUtw_MJG7DXfE"
```

### ✅ CORRECTO
```javascript
// ✅ Usar environment variables
"apikey": "={{ $env.SUPABASE_KEY }}"
```

En n8n Settings:
```
Environment Variable: SUPABASE_KEY
Value: sb_publishable_04ivizRHZPLg2eH6YkQUtw_MJG7DXfE
```

---

## ✨ MEJORAS ADICIONALES IMPLEMENTADAS

### 1. **Input Validation**
```json
{
  "name": "Validate Input",
  "type": "n8n-nodes-base.if",
  "parameters": {
    "conditions": {
      "rules": [
        { "field": "email", "operation": "contains", "value": "@" },
        { "field": "name", "operation": "isNotEmpty" },
        { "field": "company_name", "operation": "isNotEmpty" }
      ]
    }
  }
}
```

### 2. **Fallback Values**
```javascript
"lead_name": "={{ $json.body?.record?.name || $json.body?.name || 'Prospect' }}"
```

### 3. **Timestamp Logging**
```javascript
"timestamp": "={{ $now.toISO() }}"
```

### 4. **Metadata Enrichment**
```json
{
  "channel": "email",
  "source_webhook": "{{ $node.nodeName }}",
  "ip_address": "={{ $json.ip }}",
  "user_agent": "={{ $json.headers['User-Agent'] }}"
}
```

### 5. **Retry Logic**
```json
{
  "retry": {
    "maxAttempts": 3,
    "delay": 10000
  }
}
```

---

## 📋 CHECKLIST DE MIGRACIÓN

- [ ] Backup actual de leads en Supabase
- [ ] Crear todas las tablas nuevas
- [ ] Eliminar nodos postgres antiguos
- [ ] Reemplazar con HTTP requests a Supabase REST API
- [ ] Agregar validación en cada entrada
- [ ] Implementar error handling
- [ ] Testear cada nodo individualmente
- [ ] Testear flujo completo
- [ ] Monitorear primeras 24h
- [ ] Archivar workflows antiguos

---

## 🚀 QUICK WINS (Implementar HOY)

1. **Cambiar todos los `postgres` → HTTP Supabase** (15 min)
2. **Agregar validación de email** (10 min)
3. **Crear nodo de error logging** (20 min)
4. **Usar env variables para keys** (15 min)
5. **Agregar timestamps en todos los logs** (10 min)

**Total: ~70 minutos para estabilizar completamente el sistema**

