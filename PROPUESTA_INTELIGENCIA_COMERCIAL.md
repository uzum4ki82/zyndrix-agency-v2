# 🎯 Propuesta de Operaciones Tácticas: Zyndrix Core

Este documento detalla la arquitectura y estrategia para las dos fases críticas de expansión del motor comercial de Zyndrix: **Geotargeting Masivo** y **Optimización de Rastreo de Puntos de Fricción**.

---

## 📍 1. Geotargeting Masivo: Escalado de Adquisición
*Objetivo: Dominio territorial total mediante el escaneo sistemático de zonas comerciales de alto valor.*

### 🚀 Estrategia de Escaneo en Rejilla (Grid-Mapping)
En lugar de un escaneo radial simple, implementaremos un **algoritmo de trayectoria en espiral o rejilla** sobre coordenadas GPS:
- **Radio de Acción**: 2km a 5km por nodo.
- **Densidad de Prospectos**: Target de 50 a 100 leads únicos por ejecución.
- **Filtro de Calidad**: Priorización por "Rating" (Google Places > 4.2) y "Tier" (A, B, C) basado en la categoría del negocio.

### 🛠️ Implementación Técnica
- **Google Places API (New)**: Uso de `searchNearby` con campos extendidos para obtener fotos de fachada real (imprescindible para el Hero de Stitch).
- **Control de Duplicados**: Verificación de `place_id` contra la base de datos de Supabase antes de la inserción para evitar redundancia en el outreach.
- **Batch Processing**: Inserción masiva en Supabase para optimizar las llamadas al sistema nervioso central.

---

## 🔍 2. Optimización de Rastreo: Inteligencia de Puntos de Fricción
*Objetivo: Transformar datos técnicos en disparadores psicológicos de alta conversión.*

### 🛠️ Auditoría Técnica Dinámica (Deep Audit)
El sistema recolectará y parseará los siguientes datos para usarlos como **"Pain Points"** en el email de outreach:
- **CMS Detector**: Identificación de versiones obsoletas o limitadas (WordPress, Wix, Shopify).
- **Velocidad de Carga (Lighthouse)**: Detección de tiempos superiores a 3s para contrastar con los 0.4s de Zyndrix.
- **SEO On-Page**: Verificación de meta-etiquetas faltantes o duplicadas.
- **Mobile Fidelity**: Check de respuesta táctica en dispositivos móviles.

### 🧠 Lógica de Copywriting Predictivo
El motor de correo dinámico utilizará estos hallazgos para personalizar la narrativa:
| Hallazgo Técnico | Disparador Psicológico (Copy) |
| :--- | :--- |
| **WordPress Obsoleto** | "Su infraestructura actual presenta vulnerabilidades que comprometen la integridad de sus datos." |
| **Load Time > 4s** | "Está perdiendo un 27% de clientes potenciales antes de que su página termine de cargar." |
| **Wix/Shopify Generic** | "Su imagen de marca se diluye en una plantilla genérica que no proyecta la autoridad de su negocio." |

---

## 🗓️ Hoja de Ejecución (Next Steps)

1. **Sprint 1**: Implementación del script `bulk_scanner.js` para Geotargeting Masivo.
2. **Sprint 2**: Integración del parser de `tech_stack` en el motor de generación de correos.
3. **Validación**: Test de envío del primer "Dossier de Deficiencia Estructural".

---

> [!IMPORTANT]
> **Nota de Diseño**: Toda la inteligencia recolectada debe reflejarse visualmente en la `Demo Page` mediante el `HeatMapOverlay` y gráficos de comparación de rendimiento.
