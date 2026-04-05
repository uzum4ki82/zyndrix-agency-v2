import { headers } from 'next/headers';
import { getDictionary } from '@/lib/dictionaries';
import BlueprintClient from '@/components/pages/BlueprintClient';

export default async function BlueprintPage() {
  const headerList = await headers();
  const locale = headerList.get('x-zyndrix-lang') || 'es';
  const dict = await getDictionary(locale as any);

  return <BlueprintClient dict={dict} locale={locale} />;
}
