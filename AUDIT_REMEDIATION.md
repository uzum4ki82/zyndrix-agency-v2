# Zyndrix Engine: Auditoría de Rendimiento y Plan de Remodelación

## 🔍 Estado de la Auditoría (17 Abr 2026)

Tras monitorizar los ciclos autónomos del `zyndrix_daemon.js`, se han identificado tres cuellos de botella críticos que impiden el outreach de alto impacto:

### 1. Fallo de Persistencia (Bloqueo por RLS)
- **Síntoma**: El daemon registra éxito (`[SUCCESS] Project generated...`) pero la base de datos Supabase no refleja el `stitch_preview_url`.
- **Causa**: Las políticas de Seguridad de Nivel de Fila (RLS) en la tabla `leads` solo permiten `UPDATE` a usuarios `authenticated`. El daemon opera con el rol `anon`, lo que provoca que las actualizaciones fallen silenciosamente.
- **Impacto**: Los leads nunca pasan al estado `GENERATED`, por lo que el Phase 4 (Outreach) nunca encuentra candidatos.

### 2. Integración de Stitch (Mock/Placeholder)
- **Síntoma**: Las URLs generadas apuntan a `/demo/[id]`, pero el motor interno solo simula la generación.
- **Impacto**: Las páginas enviadas a los clientes no tienen el valor añadido de un prototipo real basado en su negocio.

### 3. Falta de "ADN Visual"
- **Síntoma**: No se están extrayendo colores corporativos de las capturas de pantalla.
- **Impacto**: El branding de la demo es genérico, reduciendo la percepción de "servicio personalizado" que promete Zyndrix.

---

## 🛠️ Plan de Remodelación Inmediata

### Fase A: Estabilidad de Datos
1. **Actualizar RLS**: Modificar políticas para permitir que el rol `anon` pueda actualizar leads específicos (o usar el helper `syncLead` de forma más agresiva).
2. **Fix de Columnas**: Asegurar que `stitch_preview_url` y `stitch_project_id` están presentes en todas las vistas de la DB.

### Fase B: Motor Stitch Real
1. **Implementar Generador**: Conectar el API `engine/stitch` con el motor de prompts reales que analice los `pain_points` extraídos en la auditoría técnica.
2. **Demos Dinámicas**: El `/demo/[id]` debe cargar dinámicamente los datos del lead y mostrar componentes de Stitch reales.

### Fase C: Extracción de Branding (Audit 2.0)
1. **Color Picker**: Añadir lógica al Phase 2 para analizar los píxeles dominantes del screenshot y guardar una `brand_palette` (HEX) en el registro del lead. 
2. **Imagen Corporativa**: Identificar logotipos mediante visión artificial durante la navegación con Puppeteer.

---

## 🚀 Próximos Pasos (En ejecución)
1. Aplicar parche de RLS.
2. Refactorizar el daemon para incluir el paso de "Extracción de DNA".
3. Activar el Outreach de prueba para `omontesquesada@gmail.com`.
