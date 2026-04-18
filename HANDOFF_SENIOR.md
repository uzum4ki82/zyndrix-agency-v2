# 🏗️ Zyndrix: Documento de Traspaso para Programador Senior

**Última Actualización:** 18 de Abril, 2026  
**Estado Actual:** MVP Avanzado (Funcional en Local, listo para escalado)  
**Objetivo:** Dejar el sistema 100% autónomo y listo para producción.

---

## 🛠️ 1. Infraestructura Crítica (Supabase & RLS)

Se han implementado las bases para saltar las restricciones de RLS por parte del daemon, pero falta que el usuario final ejecute los permisos en el dashboard de Supabase.

- [ ] **Acción Pendiente:** Ejecutar el contenido de `FIX_1_RLS_POLICIES.sql` en el SQL Editor de Supabase.
- [ ] **Configuración `.env`:** Asegurarse de que `SUPABASE_SERVICE_ROLE_KEY` esté configurado (es el que usa el daemon para persistir los `stitch_preview_url`).
- [ ] **Verificación de Esquema:** Confirmar que la tabla `leads` tiene estas columnas (o ejecutar `STITCH_SCHEMA_FINAL.sql`):
    - `stitch_preview_url` (text)
    - `stitch_project_id` (text)
    - `brand_palette` (jsonb)
    - `engagement_score` (int)
    - `open_status` (text)

---

## 🤖 2. Motores de Inteligencia (Stitch & Visual DNA)

El "Cerebro" de Zyndrix ya es capaz de clasificar Leads en **TIER 1** (Sin Web), **TIER 2** (Solo RRSS) y **TIER 3** (Web estándar), pero la generación de demos necesita el último empujón.

- **Stitch Integration (`src/services/stitchService.ts`):**
    - [ ] El código está preparado para usar el `STITCH_MCP_ENDPOINT`. Necesitas una API Key real para que las demos sean 100% personalizadas por AI. Actualmente tiene un fallback a `/demo/[id]` que es un mock.
- **Visual DNA (`src/lib/color-extractor.ts`):**
    - [x] Hemos implementado la extracción de colores basada en el `screenshot_url` del lead.
    - [x] **[FIX #4] Lógica Lack of Connection (Sección 5.1.8):** Implementado filtro inteligente para descartar sub-entidades (p.ej. "Walmart Pharmacy" cuando se busca "Walmart") basando en discrepancias Niche vs Nombre.
    - [ ] **Mejora Senior:** Integrar Claude Vision en este paso para que el "vibe" del sector se traduzca en tipografías y estilos específicos en el prompt de Stitch.

---

## 📧 3. Outreach & Email Tracking (Resend)

El envío de emails funciona, pero estamos en modo "sandbox".

- **Resend Setup:**
    - [ ] **Dominio:** Hay que verificar el dominio `zyndrix.dev` en el panel de Resend (registros SPF/DKIM/DMARC) para evitar que los emails caigan en SPAM.
    - [ ] **Webhooks:** El endpoint `src/app/api/webhooks/resend/route.ts` está **CAPTURADO Y TERMINADO**. **NO MODIFICAR EL CÓDIGO DEL WEBHOOK**, solo registrar la URL en el panel de Resend para recibir `email.opened`, `email.clicked` y `email.complained`.
    - [ ] **Instrucción Crítica:** Seguir estrictamente `RESEND_WEBHOOK_SETUP.md` sin alterar la lógica de persistencia ya implementada.
- **Engagement Scoring:**
    - El webhook ya calcula puntos (25 por apertura, 50 por click). Solo falta que la UI lo refleje bien tras los primeros envíos reales.

---

## 🖥️ 4. Dashboard & UX de Operaciones

La interfaz está al 90%, falta conectar la "lógica de masas".

- [ ] **Acciones Masivas (Bulk):** La selección múltiple en `LeadsTable.tsx` está visualmente lista, pero los botones "Enviar Masivo" y "Generar Demos" necesitan conectarse a los endpoints de la API.
- [ ] **Unificación "Modo Magia":** Crear un flujo único donde, al pulsar un botón, el sistema haga: `Auditoría` -> `Color Extraction` -> `Stitch Generation` -> `Actualización DB`.
- [ ] **Logs en Vivo:** Mejorar `LiveOperationsFeed.tsx` para que lea de la tabla `automation_logs` en tiempo real (ahora usa estados locales efímeros).

---

## 🚀 5. Producción (Vercel)

- [ ] **Despliegue:** Configurar el proyecto en Vercel.
- [ ] **Variables de Entorno:** Mapear todas las del `.env.local` (Google Maps, Resend, Supabase, Anthropic, Stitch API).
- [ ] **Daemon Autónomo:** El script `zyndrix_daemon.js` está diseñado para ejecutarse como un proceso de fondo o vía un CRON job llamando a `/api/admin/daemon`.

---

## 📂 Archivos Clave para Revisar
1. `src/services/stitchService.ts` -> El corazón de la generación de demos.
2. `src/lib/agent-brain.ts` -> Lógica de clasificación y análisis de leads.
3. `src/app/api/webhooks/resend/route.ts` -> Lógica de tracking de interés.
4. `zyndrix_daemon.js` -> El motor de búsqueda y procesamiento automático.

---
> **Notas Finales:** El sistema está diseñado para ser una "Agencia con un solo botón". El senior solo debe asegurar la robustez de los tipos de datos y la conexión final con las APIs premium (Stitch y Resend).
