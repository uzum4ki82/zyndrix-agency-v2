import { headers } from 'next/headers';
import { getDictionary } from '@/lib/dictionaries';

// Página secundaria (duplica /privacidad o es interna): fuera del índice de buscadores.
export const metadata = { robots: { index: false, follow: true } };
import PrivacyClient from '@/components/pages/PrivacyClient';

export default async function PrivacyPage() {
  const headerList = await headers();
  const locale = headerList.get('x-zyndrix-lang') || 'es';
  const dict = await getDictionary(locale as any);

  return <PrivacyClient dict={dict} locale={locale} />;
}
