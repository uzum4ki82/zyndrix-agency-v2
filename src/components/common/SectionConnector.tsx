'use client';

import { motion } from 'framer-motion';

export const SectionConnector = () => (
  <div className="flex flex-col items-center justify-center py-4 relative z-20 pointer-events-none">
    <div className="w-[1px] h-12 bg-gradient-to-b from-primary/40 via-primary/20 to-transparent" />
    <div className="w-1.5 h-1.5 rounded-full bg-primary/40 border border-primary/60 animate-pulse" />
    <div className="font-mono text-[7px] text-primary/30 uppercase tracking-[0.4em] mt-2">
      DATA_PIPE_CONN
    </div>
  </div>
);
