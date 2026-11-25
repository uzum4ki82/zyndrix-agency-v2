import { headers } from 'next/headers';
import { getDictionary } from '@/lib/dictionaries';
import AuditoriaClient from '@/components/pages/AuditoriaClient';

export async function generateMetadata() {
  const headerList = await headers();
  const locale = (headerList.get('x-zyndrix-lang') as string) || 'es';
  const dict = await getDictionary(locale);
  const m = dict.metadata.auditoria;

  return {
    title: m.title,
    description: m.description,
    keywords: dict.metadata.keywords.split(', '),
  };
}

export default async function AuditoriaPage() {
  const headerList = await headers();
  const locale = (headerList.get('x-zyndrix-lang') as string) || 'es';
  const dict = await getDictionary(locale);

  return <AuditoriaClient dict={dict} locale={locale} />;
}
