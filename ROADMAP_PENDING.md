# 🚀 Zyndrix Commander: Roadmap de Implementación

Este documento detalla el estado actual, las tareas pendientes y los próximos pasos para la automatización total del outreach en **Sant Antoni de Vilamajor**.

## 📍 Estado de la Misión (Sant Antoni de Vilamajor)

- [x] **Geolocalización Configurada**: El dashboard carga ahora por defecto en Sant Antoni de Vilamajor.
- [x] **Motor de Tiers Activado**: Implementada la lógica de clasificación TIER 1 (Sin Web), TIER 2 (Web RRSS) y TIER 3 (Web Estándar).
- [x] **Algoritmo de Priorización**: El Piloto Automático ataca primero los leads TIER 1.
- [x] **Estabilidad Técnica**: Errores de TypeScript y variables de estado (`setShowDemo`) resueltos.

---

## 📋 Tareas Pendientes (Q2 2026)

### 1. Validación de Campo (Sant Antoni)
- [ ] **Lanzar Escaneo Global**: Ejecutar un `Deep Scan` completo en Sant Antoni de Vilamajor para verificar la precisión del motor de búsqueda.
- [x] **Auditoría de Clasificación**: Implementada lógica robusta en `agent-brain.ts` para detectar TIER 1 (sin web) y TIER 2 (solo RRSS).
- [x] **Verificación de TIER 1**: Confirmada la priorización absoluta de TIER 1 en el ciclo del autopilot (`use-autopilot.ts`).

### 2. Refinamiento de Consultas (API Engine)
- [x] **Optimización de Keywords**: Actualizado `src/app/api/engine/search/route.ts` con queries agresivas y soporte específico para urbanizaciones de Sant Antoni (Les Pungoles, Alfou).
- [x] **Ajuste de Radio**: Integrada expansión de ubicación en la query para maximizar cobertura sin depender de coordenadas GPS.

### 3. Validación de Outreach (Resend)
- [x] **Consistencia de Pitch**: `Presentation.tsx` ahora adapta su h1, descripción e insights estratégicos según el TIER del negocio.
- [x] **Prueba de Envío Real**: Realizado exitosamente con metadatos dinámicos (Impacto Estratégico, Fuga de Crecimiento) via `test-send.js`.

### 4. Pulido de UI/UX
- [x] **Badge de Tiers**: Implementados badges neon en `BusinessCard.tsx` (ROSE/MAGENTA para TIER 1).
- [x] **Logs en Vivo**: El autopilot informa explícitamente sobre detecciones de alto valor (TIER 1/2).

---

## 🛠 Puntos de Control Técnicos
- **Archivo de Tipos**: `src/types/index.ts` (Propiedad `tier` en `AuditResult`).
- **Lógica de Cerebro**: `src/lib/agent-brain.ts` (Pesos de puntuación por Tier).
- **Control de Flujo**: `src/hooks/use-autopilot.ts` (Algoritmo de ordenamiento CandidatesWithIntel).

---
> **Nota Personal**: El sistema ya es "AI-First" y prioriza el mayor valor comercial. No detener el motor hasta agotar los leads TIER 1 de la zona.
