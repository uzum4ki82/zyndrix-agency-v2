import { motion } from 'framer-motion';
import { NavBar } from '@/components/common/NavBar';
import { Footer } from '@/components/sections/Contacto';
import { SectionHeader } from '@/components/common/SectionHeader';
import { Shield, Eye, Lock, Database } from 'lucide-react';
import { headers } from 'next/headers';
import { getDictionary } from '@/lib/dictionaries';
import PrivacyClient from '@/components/pages/PrivacyClient';

export default async function PrivacyPage() {
  const headerList = await headers();
  const locale = headerList.get('x-zyndrix-lang') || 'es';
  const dict = await getDictionary(locale as any);

  return <PrivacyClient dict={dict} locale={locale} />;
}
