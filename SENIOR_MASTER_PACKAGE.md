# 💎 Master Handoff: Zyndrix Commercial Engine v3.1 (Producción)

Este documento centraliza toda la información estratégica y técnica necesaria para la supervisión y escalado de la plataforma Zyndrix.

---

## 🚀 1. Ecosistema de Producción

| Componente | Estado | URL / Acceso |
| :--- | :--- | :--- |
| **Frontend/API** | ✅ **Live** | [https://comercial-eta-xi.vercel.app](https://comercial-eta-xi.vercel.app) |
| **Repositorio** | ✅ **Git** | [zyndrix-agency-v2](https://github.com/uzum4ki82/zyndrix-agency-v2) |
| **Base de Datos** | ✅ **Active** | Supabase Project: `etcxlzpwxwnlrhowldel` |
| **Engine (Stitch)** | ✅ **Online** | Endpoint: `stitch-mcp.googleapis.com` |

---

## 🛠️ 2. Arquitectura del "Cerebro" (Agent-Brain)

### **2. Auditoría Inteligente (Brain v3.1)**
- **Filtros de Calidad:** Se ha implementado una lista negra de grandes cadenas y servicios públicos en `src/services/searchService.ts` y `src/lib/agent-brain.ts` para evitar prospectar entidades irrelevantes (ej. Mercadona, Deixalleria).
- **Lógica de Descarte:** El `HunterAgent` marca automáticamente como `DISCARDED` cualquier lead que sea una gran marca o que presente una "Falta de Conexión" (ej. Farmacia en una búsqueda de Restaurantes).
- **Deduplicación:** Sistema de prevención de duplicados basado en `googlePlaceId` en la capa de persistencia para evitar leads repetidos en el Dashboard.
- **Visual DNA Extraction:** El sistema extrae colores de marca a partir de screenshots y los inyecta en los prompts de Stitch para demos 100% personalizadas.
3.  **Strategist:** Calcula el "Engagement Score" e identifica los puntos de dolor.
4.  **Designer (Stitch AI):** Genera una landing page única inyectando los colores y el prompt estratégico.

---

## 🔐 3. Configuración de Entorno (Secrets)

Todas las variables están en Vercel, pero para desarrollo local usa el `.env.local` (excluido de Git):

*   `STITCH_API_KEY`: Clave premium para generación real (ya inyectada en Vercel).
*   `SUPABASE_SERVICE_ROLE_KEY`: **CRÍTICO**. Es la llave que usa el Daemon para bypass de RLS. No usar la `anon_key` para servicios autónomos.
*   `RESEND_API_KEY`: Para el sistema de outreach. Actualmente en modo sandbox.

---

## 🚀 4. Roadmap de Tareas Pendientes (Senior Priorities)

### 📧 Outreach & Tracking
- [ ] **Verificar Dominio:** Acceder a Resend y validar `zyndrix.dev` (SPF/DKIM). Sin esto, el outreach caerá en SPAM.
- [ ] **Webhook Registry:** Confirmar que la URL de producción está registrada en Resend (`/api/webhooks/resend`) para el tracking de aperturas y clicks.

### 🖥️ Dashboard & Features
- [ ] **Bulk Operations:** Los botones de "Selección Múltiple" en el dashboard están listos en la UI, pero el backend necesita el loop de orquestación para procesar leads en masa.
- [ ] **Live Logs:** Conectar el componente `LiveOperationsFeed.tsx` a la tabla `daemon_logs` de Supabase para monitoreo en tiempo real.

---

## 📂 Mapa de Archivos Críticos

1.  `src/lib/agent-brain.ts` -> Lógica central de calificación.
2.  `src/services/stitchService.ts` -> Orquestador de la generación de demos.
3.  `src/app/api/webhooks/resend/route.ts` -> Motor de persistencia de métricas de interés.
4.  `zyndrix_daemon.js` -> El motor "invisible" que mantiene el sistema alimentado.

---

> **Nota de Seguridad:** He censurado todas las claves de los archivos markdown del repositorio principal para cumplir con las políticas de seguridad de GitHub. Las claves reales residen únicamente en los entornos seguros de Vercel y Supabase.

**Zyndrix está listo para la escala masiva.**
