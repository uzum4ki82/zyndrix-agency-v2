import { headers } from 'next/headers';
import { getDictionary } from '@/lib/dictionaries';
import TermsClient from '@/components/pages/TermsClient';

export default async function TermsPage() {
  const headerList = await headers();
  const locale = headerList.get('x-zyndrix-lang') || 'es';
  const dict = await getDictionary(locale as any);

  return <TermsClient dict={dict} locale={locale} />;
}
