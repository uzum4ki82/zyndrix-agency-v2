# Technical Blueprint: Autonomous Website Personalization Strategy (Stitch Integration)

**Target:** Senior Architect / Fullstack Lead
**Objective:** Transition from generic "Realistic Mocks" to automated, bespoke "Architectural Luxury" landing pages using the Stitch API.

---

## 1. The Core Vision: "Visual DNA" Infusion
Current generated pages lack the deep branding of the target leads. We need to move from "Template-first" to "Brand-first" generation.

### 1.1 Extracting the DNA
The `Visual DNA` extracted during the Audit phase (colors, typography, brand vibe) must be the primary seed for the Stitch Engine.
*   **Action:** Ensure `brand_palette` and `vibe_description` from the `leads` table are passed as high-priority tokens.

---

## 2. The "Stitch Magic" Protocol
To achieve the "Wow" factor the user expects, the Senior must implement the following programmatic logic during the `generate_site` workflow:

### 2.1 Dynamic Prompt Construction
Instead of a static prompt, the system must build a "Context Stack" for Stitch:
1.  **Identity:** "You are a world-class luxury web architect."
2.  **Context:** "The client is a [Category] named [Name] located in [City]."
3.  **Strategy:** "Targeting their pain points: [Pain Points]. Emphasize [Competitive Edge]."
4.  **Aesthetics:** "Use the extracted brand palette: [Palette]. Apply an 'Architectural Luxury' style with high-end typography and glassmorphism."

### 2.2 Section-Level Customization
Don't just generate a page; architect it.
*   **Hero:** Must feature a custom high-fidelity image generated via `generate_image` based on the lead's niche.
*   **Value Prop:** Directly address the `pain_points` identified in the `AUDIT` phase.
*   **Visual Transitions:** Use Stitch instructions to apply smooth scroll animations and premium interactions.

---

## 3. Implementation Workflow for Senior

### Step 1: Refactor `src/lib/engine/stitch.ts` 
Instead of checking for `STITCH_MOCK_MODE`, implement the full `CreateProject` -> `CreateDesignSystem` -> `GenerateScreenFromText` pipeline.

```typescript
// Architectural sequence for bespoke sites:
const project = await stitch.createProject({ title: lead.name });
const designSystem = await stitch.createDesignSystem({
  projectId: project.id,
  designSystem: {
    colorPalette: lead.brand_palette, // Dynamic injection
    typography: { fontFamily: 'Outfit, sans-serif' },
    shape: 'rounded-xl',
    designMd: "Focus on minimalist architectural luxury. Use deep saturation for brand colors."
  }
});
const landingPage = await stitch.generateScreenFromText({
  projectId: project.id,
  prompt: `Bespoke high-conversion landing page for ${lead.name}. Highlight ${lead.usp}.`
});
```

### Step 2: High-Fidelity Asset Generation
Integrate the `generate_image` tool *before* calling Stitch. Use the generated asset as the background for the Hero section.

---

## 4. The "Architectural Luxury" Prompt Blueprint
To ensure Stitch produces the "Magic," the Senior should hardcode these semantic rules into the generation engine:
*   **Negative Constraints:** "No generic UI. No default bootstrap styles. No low-contrast text."
*   **Positive Constraints:** "Use wide apertures for whitespace. Professional typography (Inter/Outfit). Dynamic gradients following the [Brand Color]. Subtle micro-animations on interactive elements."

---

## 5. Automation Loop (Daemon Integration)
The daemon shouldn't just audit; it should pre-generate.
1.  **Lead Capture** -> 2. **Deep Audit** -> 3. **Stitch Payload Prep** -> 4. **Project Creation (Async)**.
2.  The `lead.stitch_preview_url` should be populated automatically once the Stitch worker completes.

---

**Next Action for Senior:** 
1. Validar la integración de `StitchMCP` en el backend.
2. Sustituir el `fallback` de mock por el flujo de generación real inyectando el `Visual DNA`.
3. Configurar el trigger automático del proceso tras el `Audit` exitoso.

**Report by Antigravity AI**
