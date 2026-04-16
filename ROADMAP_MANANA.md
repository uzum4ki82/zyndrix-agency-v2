# 🎯 Roadmap de Finalización: Zyndrix Sales Engine
**Fecha Objetivo:** Mañana (16 de Abril, 2026)

Este documento resume las tareas críticas para pasar el motor de ventas Zyndrix de modo desarrollo a producción total.

---

## 1. Identidad Digital & Branding (Activos Reales)
- [ ] **Subir Assets**: Colocar `logo-dark.png` y `avatar-oscar.png` en la carpeta `public/img/`.
- [ ] **Actualizar Enlaces**: Reemplazar los placeholders de `placehold.co` en `src/app/api/send/route.ts` por las rutas de imagen definitivas.
- [ ] **Verificar Meta-tags**: Asegurar que al compartir la URL `zyndrix.dev` el preview sea impactante.

## 2. Configuración de Outreach Profesional
- [ ] **Verificación DNS**: Completar la verificación del dominio `zyndrix.dev` en el panel de Resend.
- [ ] **Cambio de Remitente**: Actualizar la variable `RESEND_FROM_EMAIL` en `.env.local` con el email oficial (ej: `oscar@zyndrix.dev`).
- [ ] **Activación de Tracking**: Habilitar el seguimiento de apertura (open tracking) y clicks en Resend para medir el interés de los leads.

## 3. Optimización del Motor (Pipeline de Magia)
- [ ] **Pipeline Automático**: Unificar el flujo en el dashboard para que el botón "Ejecutar Magia" dispare la generación en Stitch y el envío de email sin pasos manuales intermedios.
- [ ] **Robustez de Datos**: Asegurar que si un lead no tiene email capturado, el sistema ofrezca un campo rápido para introducirlo antes del envío.

## 4. Funcionalidades Avanzadas
- [ ] **Envío Masivo (Bulk)**: Implementar la selección múltiple en la tabla de leads para lanzar campañas por zonas completas.
- [ ] **Log de Actividad**: Mostrar en la interfaz cuándo fue la última vez que se contactó a un lead específico para evitar duplicidades.

## 5. Lanzamiento a Producción
- [ ] **Despliegue en Vercel**: Subir el repositorio y configurar los secretos (API Keys) en el dashboard de Vercel.
- [ ] **Auditoría Final**: Realizar una búsqueda real, generar un prototipo y recibir el email en condiciones de producción.

---

**Nota:** La prioridad máxima es la verificación del dominio `zyndrix.dev` en Resend para poder usar tu marca oficial.

---
*Generado por Antigravity para Óscar (Zyndrix).*
