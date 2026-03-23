'use client';

import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface StatCardProps {
  label: string;
  value: string | number;
  trend?: string;
  trendType?: 'up' | 'down';
  icon: LucideIcon;
  subValue?: string;
  delay?: string;
  color?: 'blue' | 'purple' | 'emerald' | 'rose' | 'amber';
}

const colorMap = {
  blue: 'text-blue-500 bg-blue-500/10 border-blue-500/20 shadow-blue-500/20',
  purple: 'text-purple-500 bg-purple-500/10 border-purple-500/20 shadow-purple-500/20',
  emerald: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20 shadow-emerald-500/20',
  rose: 'text-rose-500 bg-rose-500/10 border-rose-500/20 shadow-rose-500/20',
  amber: 'text-amber-500 bg-amber-500/10 border-amber-500/20 shadow-amber-500/20',
};

export default function StatCard({ 
  label, 
  value = 0, 
  trend, 
  trendType = 'up', 
  icon: Icon, 
  subValue,
  delay = '0s',
  color = 'blue'
}: StatCardProps) {
  return (
    <div 
      className="ds-card group"
      style={{ animationDelay: delay }}
    >
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{label}</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight group-hover:text-blue-400 transition-colors uppercase font-mono">
                {value}
            </span>
            {trend && (
              <div className={cn(
                "flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full",
                trendType === 'up' ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
              )}>
                {trendType === 'up' ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                {trend}
              </div>
            )}
          </div>
          {subValue && (
            <span className="text-[11px] font-medium text-slate-400 mt-1">{subValue}</span>
          )}
        </div>
        
        <div className={cn(
          "p-2.5 rounded-xl border flex items-center justify-center transition-all group-hover:scale-110",
          colorMap[color]
        )}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-2">
         <div className="h-1.5 w-full bg-white/[0.03] rounded-full overflow-hidden">
            <div 
              className={cn("h-full rounded-full transition-all duration-1000", colorMap[color].split(' ')[1].replace('/10', ''))}
              style={{ width: `${Math.floor(Math.random() * 40) + 40}%` }}
            />
         </div>
         <div className="flex justify-between items-center text-[9px] font-bold text-slate-500 uppercase tracking-tighter">
            <span>Historical baseline</span>
            <span className="text-white opacity-40">Ready</span>
         </div>
      </div>
    </div>
  );
}
