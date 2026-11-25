import { headers } from 'next/headers';
import { getDictionary } from '@/lib/dictionaries';

// Página secundaria (duplica /privacidad o es interna): fuera del índice de buscadores.
export const metadata = { robots: { index: false, follow: true } };
import TermsClient from '@/components/pages/TermsClient';

export default async function TermsPage() {
  const headerList = await headers();
  const locale = headerList.get('x-zyndrix-lang') || 'es';
  const dict = await getDictionary(locale as any);

  return <TermsClient dict={dict} locale={locale} />;
}
