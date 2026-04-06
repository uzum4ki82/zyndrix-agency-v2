import { Metadata } from 'next';
import { headers } from 'next/headers';
import { getDictionary } from '@/lib/dictionaries';
import AuditoriaClient from '@/components/pages/AuditoriaClient';

export const metadata: Metadata = {
  title: "AUDITORÍA GRATIS | Zyndrix IA - Detecta Ineficiencias Ahora",
  description: "Solicita tu auditoría de sistemas IA. Analizamos tu stack tecnológico gratis y diseñamos tu plan de automatización personalizado en 48h.",
  alternates: {
    canonical: 'https://zyndrix.dev/auditoria',
  },
};

export default async function AuditoriaPage() {
  const headerList = await headers();
  const locale = headerList.get('x-zyndrix-lang') || 'es';
  const dict = await getDictionary(locale as any);

  return <AuditoriaClient dict={dict} locale={locale} />;
}
