import { headers } from 'next/headers';
import { getDictionary } from '@/lib/dictionaries';
import SecurityClient from '@/components/pages/SecurityClient';

export default async function SecurityPage() {
  const headerList = await headers();
  const locale = headerList.get('x-zyndrix-lang') || 'es';
  const dict = await getDictionary(locale as any);

  return <SecurityClient dict={dict} locale={locale} />;
}
