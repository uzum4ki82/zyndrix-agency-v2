# 🏗️ Zyndrix: Documento de Traspaso para Programador Senior

**Última Actualización:** 18 de Abril, 2026 (Fase Final: Producción Activa)  
**Estado Actual:** Producción Operativa (Vercel Live + DB Optimizada)  
**Objetivo:** Supervisión final de los flujos de correo y optimización de acciones masivas.

---

## 🛠️ 1. Infraestructura Crítica (Supabase & DB)

La base de datos ya está completamente preparada y optimizada para la escala de producción.

- [x] **Fixes SQL Aplicados:** Se han ejecutado todos los scripts de migración (`FIX_1`, `FIX_5`, etc.). Las políticas de RLS ya permiten al daemon operar sin restricciones.
- [x] **Configuración `.env`:** El backend ya utiliza satisfactoriamente el `SUPABASE_SERVICE_ROLE_KEY` para la persistencia automática.
- [x] **Esquema Verificado:** La tabla `leads` cuenta con todos los campos necesarios (`stitch_preview_url`, `brand_palette`, `engagement_score`, etc.).

---

## 🤖 2. Motores de Inteligencia (Stitch & Visual DNA)

### 2. Capa de Inteligencia y Generación (Stitch AI)
- [x] **Integración Completada:** Se han configurado las claves de producción (`STITCH_API_KEY`).
- [x] **Endpoints Configurados:** El sistema está apuntando a `https://stitch-mcp.googleapis.com`.
- [x] **Motor Activo:** La generación de demos reales está habilitada y lista para producción.

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

## 🚀 5. Producción (Vercel) - ¡COMPLETADO!

El sistema ya está desplegado y operando en vivo.

- [x] **Despliegue Live:** [https://comercial-eta-xi.vercel.app](https://comercial-eta-xi.vercel.app)
- [x] **Entorno de Producción:** Todas las variables (Google, Supabase, Anthropic, Stitch, Resend) han sido migradas a Vercel.
- [x] **Daemon en Acción:** El script `zyndrix_daemon.js` está listo para ser orquestado vía cron-job externo apuntando al endpoint de administración.

---

## 🛠️ 6. Mantenimiento y Re-Auditoría

Si se requiere que el sistema vuelva a analizar todos los leads con las nuevas reglas de "Adaptive Visual DNA" o tras un cambio mayor en los prompts de Stitch:

- **Reset Completo:** Ejecutar `GRAND_RESET_VISUAL_DNA.sql`. Esto devolverá todos los leads al estado `NEW`, limpiará las auditorías viejas y permitirá que el Daemon procese todo de nuevo con la calidad máxima de producción.

---

## 🔍 7. Troubleshooting para el Senior

| Problema | Causa Probable | Solución |
| :--- | :--- | :--- |
| Demos no personalizadas | Falta `STITCH_API_KEY` | Verificar logs en Vercel; el sistema hace fallback a mock si no hay key. |
| El Daemon no escribe en DB | RLS bloqueando | Verificar que la key usada sea la de `service_role` y no la `anon`. |
| Emails no se trackean | Webhook no registrado | Confirmar en el panel de Resend que la URL `/api/webhooks/resend` está activa. |
| Leads duplicados | Place ID fallido | El sistema usa el Google Place ID como clave única; revisar `searchService.ts`. |

---

## 📂 Archivos Clave para Revisar
1. `src/services/stitchService.ts` -> El corazón de la generación de demos.
2. `src/lib/agent-brain.ts` -> Lógica de clasificación y análisis de leads.
3. `src/app/api/webhooks/resend/route.ts` -> Lógica de tracking de interés.
4. `zyndrix_daemon.js` -> El motor de búsqueda y procesamiento automático.

---
> **Notas Finales:** El sistema está diseñado para ser una "Agencia con un solo botón". El senior solo debe asegurar la robustez de los tipos de datos y la conexión final con las APIs premium (Stitch y Resend).
