import { headers } from 'next/headers';
import { getDictionary } from '@/lib/dictionaries';
import BlueprintClient from '@/components/pages/BlueprintClient';

export async function generateMetadata() {
  const headerList = await headers();
  const locale = (headerList.get('x-zyndrix-lang') as string) || 'es';
  const dict = await getDictionary(locale);
  const m = dict.metadata.blueprint;

  return {
    title: m.title,
    description: m.description,
    keywords: dict.metadata.keywords.split(', '),
  };
}

export default async function BlueprintPage() {
  const headerList = await headers();
  const locale = (headerList.get('x-zyndrix-lang') as string) || 'es';
  const dict = await getDictionary(locale);

  return <BlueprintClient dict={dict} locale={locale} />;
}
