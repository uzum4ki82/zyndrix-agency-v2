'use client';

import { motion } from 'framer-motion';

export const SectionConnector = () => (
  <div className="flex flex-col items-center justify-center h-12 -my-6 relative z-20 pointer-events-none opacity-20">
    <div className="w-[1px] h-full bg-gradient-to-b from-transparent via-white/20 to-transparent" />
  </div>
);
