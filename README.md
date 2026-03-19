# Zyndrix AI Agency - Corporate Platform

Este es el repositorio oficial de **Zyndrix**, una agencia de inteligencia artificial de alto rendimiento. El proyecto consta de una Landing Page de alta conversión y un Dashboard de control operacional desarrollado en Next.js.

## 📁 Estructura del Proyecto

-   `/` (Raíz): Landing Page estática optimizada para SEO y conversión.
-   `/dashboard`: Aplicación Next.js para la gestión de leads y monitorización de IA.
-   `/img`: Activos visuales y logos optimizados.

## 🚀 Despliegue Profesional (Recomendado: Vercel)

La forma más robusta y económica de publicar este proyecto es utilizando **Vercel**. Sigue estos pasos:

1.  **Sube el código a GitHub/GitLab:** Crea un repositorio privado o público.
2.  **Importa en Vercel:**
    -   Conecta tu cuenta de GitHub.
    -   Importa el repositorio `web-agencia-ia`.
3.  **Configura las Variables de Entorno:**
    En el panel de Vercel, añade las siguientes claves (puedes encontrarlas en `dashboard/.env.local`):
    -   `NEXT_PUBLIC_SUPABASE_URL`: Tu URL de Supabase.
    -   `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Tu clave anónima de Supabase.
4.  **¡Listo!** Vercel detectará automáticamente la configuración y desplegará ambos sitios bajo el mismo dominio (o subdominios si lo prefieres).

## 🛠️ Mantenimiento

### Supabase (Base de Datos)
-   **⚠️ IMPORTANTE:** Si usas el plan gratuito, entra al panel de Supabase al menos una vez por semana para evitar que el proyecto se pause automáticamente.
-   Si la web deja de recibir leads, verifica que el proyecto no esté en estado "Paused".

### n8n (Automatización)
-   Importa el archivo `n8n-lead-scoring.json` en tu instancia de n8n para activar el scoring automático de leads.

## 💻 Desarrollo Local

Para trabajar en el proyecto localmente:

```bash
# Instalar dependencias base
npm install

# Ejecutar Landing Page
npm run dev

# Ejecutar Dashboard (en otra terminal)
npm run dashboard:dev
```

---
© 2026 ZYNDRIX AI AGENCY. Built for scale.
