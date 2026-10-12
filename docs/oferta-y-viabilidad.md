# Oferta comercial y viabilidad — Agentes de WhatsApp (50 €/mes) y voz (75 €/mes)

Documento interno. Las cifras de terceros **no están verificadas en esta revisión**: se dejan como variables para rellenar con las tarifas reales de tus cuentas (OpenAI/Anthropic, Retell, operador, Hetzner). No hay precios inventados.

## 1. Qué hay realmente detrás de cada producto (verificado en n8n el 12/10/2026)

| Producto | Pieza existente | Estado |
|---|---|---|
| WhatsApp | Plantilla «Agente EvolutionAPI WhatsApp + Claude + Memoria Zyndrix» y `automation/whatsapp_agent_v1.json` (Evolution API → agente LLM → memoria Postgres → herramienta Calendar/Gmail → respuesta; alerta al admin si falla) | Inactiva. La única en producción es el orquestador del Ingeniero Virtual RFID (WF-01 v5) |
| Voz | «DISPONIBILIDAD CALENDAR AGENTE VOZ RETELL AI» (consulta de agenda para Retell) | Activa. «AUTOLLAMADAS RETELLAI + HUBSPOT» inactiva |
| Leads web | «Zyndrix Lead Pipeline v7» (webhook `zyndrix-lead-scoring`) | Activo |

Ningún producto está empaquetado como servicio multicliente: cada alta exige duplicar flujos, credenciales y una instancia (WhatsApp) o un agente en Retell (voz).

## 2. Modelo de costes por cliente

### WhatsApp
- **Fijos/mes**: `F_wa = (coste VPS / clientes por VPS) + horas de soporte × coste/hora`
- **Variables/mes**: `V_wa = conversaciones × mensajes por conversación × tokens por mensaje × precio por token` (+ embeddings si hay RAG)
- **Conexión**: Evolution API (WhatsApp Web, no oficial) no tiene coste por mensaje, pero **Meta puede bloquear el número**. La API oficial (Cloud API) cobra según la tarifa de Meta para España; las respuestas dentro de la ventana de 24 h iniciada por el cliente tienen un tratamiento distinto de las plantillas. Verificar la tarifa vigente antes de fijar el volumen incluido.
- **Margen**: `M_wa = 50 − F_wa − V_wa` (ajustar si el precio es sin IVA o con IVA).

### Voz
- **Variables/mes**: `V_voz = minutos × (precio/min de la plataforma de voz + LLM/min + telefonía/min)`
- **Fijos/mes**: `F_voz = número de teléfono/mes + parte proporcional del VPS + soporte`
- **Minutos máximos sin pérdidas**: `min_max = (75 − F_voz − margen objetivo) / coste_por_minuto_total`
- Como el coste por minuto suma plataforma de voz, LLM y telefonía, **75 €/mes solo es sostenible con un volumen de minutos limitado**. Fijar los minutos incluidos con esta fórmula y un precio por minuto adicional.

### Escenarios (rellenar)
| Escenario | WhatsApp: conversaciones/mes | Voz: minutos/mes | M_wa | M_voz |
|---|---|---|---|---|
| Bajo | | | | |
| Medio | | | | |
| Alto | | | | |

## 3. Decisiones pendientes del propietario (la web no las promete)
1. ¿Precios con o sin IVA?
2. ¿Coste de alta? ¿Importe?
3. Volumen incluido: conversaciones (WhatsApp) y minutos (voz), y precio del exceso.
4. Permanencia y condiciones de baja.
5. Conexión WhatsApp: Evolution API (riesgo de bloqueo) o API oficial (coste por mensaje y verificación de Meta).
6. Número de teléfono: ¿lo aporta Zyndrix o el cliente desvía el suyo? ¿Quién paga la línea?
7. Grabación y transcripción de llamadas: qué se guarda y cuánto tiempo.
8. Número de WhatsApp de contacto de Zyndrix (en el código aparecen 34637729266 y 34644145137).
9. Datos del titular para aviso legal y privacidad (`src/config/legal.ts`).
10. Contrato de encargado del tratamiento y lista de proveedores (OpenAI/Anthropic, Retell, Hetzner, Supabase…).

## 4. Recomendación
- Mantener 50 € y 75 € como precio público, con **volumen incluido por escrito** y precio de exceso.
- Para WhatsApp, valorar la API oficial para clientes de pago y dejar Evolution API para pruebas.
- Para voz, calcular `min_max` con las tarifas reales de Retell y del operador antes de la primera venta.
