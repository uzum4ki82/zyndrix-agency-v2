# Auditoría y Remodelación: Arquitectura de Personalización Zyndrix

## 1. Contexto de la Auditoría
Se ha detectado que la generación actual de activos digitales ('Stitch projects') carece de diferenciación visual competitiva. Para un servicio de "Arquitectura de Lujo", el uso de plantillas genéricas invalida la propuesta de autoridad. Se requiere una transición hacia un modelo de **Personalización Algorítmica Contextual**.

## 2. Pilares de la Nueva Arquitectura
Para que cada activo digital impacte al cliente, implementaremos los siguientes vectores de personalización:

### A. Inteligencia Cromática e Identitaria
- **Extracción de ADN Visual**: El sistema ya no usará un 'Índigo' por defecto. Derivaremos la paleta de colores de:
  - El sector industrial (P. ej: Naranja Industrial para Talleres, Oro Metálico para Consultoras de Lujo).
  - Análisis heurístico de la captura de pantalla del negocio (si existe).
- **Tipografía Selectiva**: Uso de fuentes con personalidad específica (Syne para impacto, Space Grotesk para tech, Outfit para precisión).

### B. Grounding Geográfico y Contextual
- **Narrativa de Territorio**: El contenido ya no dirá "Tu negocio", dirá "Dominando el sector de [Nicho] en [Ciudad]".
- **Uso de Fotografía Real**: Integración prioritaria de la fachada real del negocio extraída de Google Places para crear un efecto de "espejo" inmediato.

### C. Ingeniería de Prompts 'Supreme'
- **Dolores Específicos**: El prompt de generación integrará el `PAIN_POINT` detectado en la auditoría técnica (P. ej: "Solución a la caída de 4s en LCP").
- **Estructura de Bloques Única**: La disposición de los componentes en Stitch variará según el TIER del lead.

## 3. Plan de Acción Técnico
| Fase | Acción | Estado |
| :--- | :--- | :--- |
| **I. Intelligence** | Actualización de `STITCH_PROMPTS` con mapeo de campos dinámicos. | ✅ Completado |
| **II. Integration** | Conexión real con el MCP de Stitch para crear proyectos únicos por lead. | ✅ Completado |
| **III. Automation** | Inyección de la paleta de colores personalizada en el `DesignSystem`. | ✅ Completado |
| **IV. Validation** | Auditoría visual de los primeros 5 despliegues en el Live Feed. | 🛠️ En Proceso |

## 5. Resultados de la Remodelación Inicial
Se han generado con éxito los primeros activos "Arquitectura de Lujo" hyper-personalizados:

1.  **Clínica Dental Catalunya S.Cp**
    - **Asset ID**: `10581402629731639142`
    - **Visual DNA**: Cyan Onyx Architectural (#00f2ff).
    - **Impacto**: Transición de WordPress genérico a una interfaz de diagnóstico quirúrgico.

2.  **Talleres IGM Motors**
    - **Asset ID**: `5434145728995153286`
    - **Visual DNA**: Kinetic Precision (Naranja Industrial #ff5f1f).
    - **Impacto**: Estética de "Pit-Stop Luxury" para elevar la autoridad del taller mecánico.

## 6. Siguientes Pasos
El daemon de Zyndrix ahora opera con un umbral de score reducido (30+) para asegurar que el 80% del mercado reciba una propuesta visual personalizada antes del primer contacto.

## 4. Próximos Pasos Inmediatos
Voy a proceder a reconstruir el endpoint `/api/engine/stitch` para que realice llamadas reales al motor de generación, eliminando el mock actual y asegurando que cada `previewUrl` sea una instancia única y personalizada.
