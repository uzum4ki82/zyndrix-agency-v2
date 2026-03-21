import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps {
  children: ReactNode;
  variant?: 'cyan' | 'emerald' | 'violet' | 'amber' | 'slate' | 'rose';
  className?: string;
}

export function Badge({ children, variant = 'slate', className }: BadgeProps) {
  const variants = {
    cyan: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    violet: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    slate: 'bg-slate-800 text-slate-400 border-slate-700',
    rose: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  };

  return (
    <span className={cn(
      "text-[10px] font-black px-2.5 py-0.5 rounded-full border uppercase tracking-wider",
      variants[variant],
      className
    )}>
      {children}
    </span>
  );
}
