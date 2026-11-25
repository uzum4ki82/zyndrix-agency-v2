import { headers } from 'next/headers';
import { getDictionary } from '@/lib/dictionaries';

// Página secundaria (duplica /privacidad o es interna): fuera del índice de buscadores.
export const metadata = { robots: { index: false, follow: true } };
import SecurityClient from '@/components/pages/SecurityClient';

export default async function SecurityPage() {
  const headerList = await headers();
  const locale = headerList.get('x-zyndrix-lang') || 'es';
  const dict = await getDictionary(locale as any);

  return <SecurityClient dict={dict} locale={locale} />;
}
