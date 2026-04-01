import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "DESCARGAR | El Blueprint de Automatización de IA 2026",
  description: "Accede al documento maestro de sistemas autónomos. La arquitectura definitiva para escalar tu empresa sin aumentar la carga operativa e incrementando el ROI de captación.",
  openGraph: {
    title: "DESCARGA: El Blueprint de la Autonomía Operativa de Zyndrix",
    description: "Recurso oficial de Zyndrix para directivos que exigen eficiencia absoluta.",
    images: ["/img/blueprint-cover.png"],
  },
};

export default function BlueprintLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
