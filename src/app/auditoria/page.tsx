import { headers } from 'next/headers';
import { getDictionary } from '@/lib/dictionaries';
import AuditoriaClient from '@/components/pages/AuditoriaClient';

export default async function AuditoriaPage() {
  const headerList = await headers();
  const locale = headerList.get('x-zyndrix-lang') || 'es';
  const dict = await getDictionary(locale as any);

  return <AuditoriaClient dict={dict} locale={locale} />;
}
