"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Zap, MessageSquare, AlertTriangle } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Business } from "@/types";

export const SonarPulse = () => (
  <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10">
    <motion.div 
      initial={{ scale: 0.5, opacity: 0.5 }}
      animate={{ scale: 3, opacity: 0 }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeOut" }}
      className="absolute w-20 h-20 border border-primary/40 bg-primary/2"
    />
    <motion.div 
      initial={{ scale: 0.8, opacity: 0.3 }}
      animate={{ scale: 2.5, opacity: 0 }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeOut", delay: 1 }}
      className="absolute w-20 h-20 border border-secondary/30 bg-secondary/2"
    />
  </div>
);

export const SmallTrendGraph = ({ color = "rose" }: { color?: "rose" | "emerald" }) => (
  <svg width="40" height="20" viewBox="0 0 40 20" className={cn("opacity-60", color === 'rose' ? "text-accent" : "text-primary")}>
    <motion.path 
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 1, ease: "easeInOut" }}
      d="M0 15 L8 12 L16 18 L24 4 L32 10 L40 2" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

export function ChatBubble({ role, text, delay }: { role: 'user' | 'ai', text: string, delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: role === 'user' ? -20 : 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className={cn(
        "max-w-[85%] p-4 border rounded-sm font-mono text-[11px] leading-relaxed",
        role === 'user' 
          ? "bg-slate-900/50 border-slate-800 text-slate-400 self-start" 
          : "bg-primary/5 border-primary/30 text-primary self-end shadow-[inset_0_0_10px_rgba(0,255,156,0.05)] neon-text-green"
      )}
    >
      <div className="flex items-center gap-2 mb-2 opacity-50 uppercase tracking-[0.2em] text-[8px]">
        {role === 'user' ? '[AUTHORIZED_USER]' : '[AI_STRATEGIST]'}
      </div>
      {text}
    </motion.div>
  );
}

export function ProblemItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-4 text-slate-300 text-[10px] bg-accent/5 p-4 border border-accent/20 group hover:border-accent/50 transition-all font-mono">
      <div className="w-2 h-2 bg-accent animate-pulse shadow-[0_0_5px_rgba(255,0,255,0.8)]" />
      <span className="tracking-tight uppercase">{text}</span>
    </div>
  );
}

export function SequenceStep({ day, title, desc, progress, active, variant = 'primary' }: { day: string, title: string, desc: string, progress: string, active?: boolean, variant?: 'primary' | 'secondary' }) {
  return (
    <div className={cn("relative pl-8 pb-8 border-l border-card-border/30 last:pb-0 transition-opacity duration-700", !active && "opacity-30")}>
       {/* Pin */}
       <div className={cn(
         "absolute left-[-5px] top-0 w-2.5 h-2.5 border border-background z-10",
         active ? "bg-primary shadow-[0_0_10px_rgba(0,255,156,1)]" : "bg-slate-800"
       )} />
       
       <div className="flex items-start justify-between gap-4 font-mono">
          <div>
            <div className="flex items-center gap-2 mb-1">
               <span className={cn(
                 "text-[9px] font-bold uppercase tracking-[0.3em]",
                 active ? "text-primary" : "text-slate-500"
               )}>{day}</span>
               {active && (
                 <motion.span 
                   animate={{ opacity: [0, 1, 0] }}
                   transition={{ duration: 1, repeat: Infinity }}
                   className="w-1.5 h-1.5 bg-primary shadow-[0_0_5px_rgba(0,255,156,0.5)]" 
                 />
               )}
            </div>
            <h5 className="text-[12px] font-black text-white uppercase tracking-[0.1em] mb-1">{title}</h5>
            <p className="text-[10px] text-slate-400 leading-relaxed max-w-[240px] uppercase opacity-70">{desc}</p>
          </div>
          <div className="text-right">
             <div className="text-[14px] font-black text-primary mb-1 italic">{progress}</div>
             <div className="w-20 h-1 bg-white/5 overflow-hidden border border-white/5">
                <motion.div 
                   initial={{ width: 0 }}
                   animate={{ width: progress }}
                   className={cn("h-full", active ? "bg-primary" : "bg-slate-800")} 
                />
             </div>
          </div>
       </div>
    </div>
  );
}

export function ActivityItem({ name, action, time, highlight }: { name: string, action: string, time: string, highlight?: boolean }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        "p-4 border transition-all duration-500 font-mono",
        highlight 
        ? "bg-secondary/5 border-secondary/40 shadow-[0_0_20px_rgba(0,229,255,0.05)] border-l-4" 
        : "bg-black/20 border-white/5 opacity-40 hover:opacity-100"
    )}>
       <div className="flex items-center justify-between gap-4">
         <div className="flex items-center gap-4">
           <div className={cn(
              "w-8 h-8 flex items-center justify-center relative bg-background border",
              highlight ? "border-secondary text-secondary" : "border-slate-800 text-slate-600"
           )}>
             {highlight ? <Zap size={14} className="neon-text-cyan" /> : <MessageSquare size={14} />}
           </div>
           <div>
             <div className="text-[11px] font-black text-white tracking-widest uppercase">{name}</div>
             <div className="text-[8px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-0.5 opacity-60">{action}</div>
           </div>
         </div>
         <div className="text-[7px] text-slate-600 font-mono">
           [{time}]
         </div>
       </div>
    </motion.div>
  );
}

export function CompetitorItem({ name, threat, status }: { name: string, threat: string, status: string }) {
  return (
    <div className="p-4 border border-card-border/30 bg-black/40 hover:border-accent/40 transition-all group overflow-hidden relative font-mono">
      <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
         <AlertTriangle size={60} className="text-accent" />
      </div>
      
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-accent/5 flex items-center justify-center text-accent border border-accent/20">
            <AlertTriangle size={16} />
          </div>
          <div>
            <div className="text-[12px] font-black text-white tracking-widest uppercase mb-0.5">{name}</div>
            <div className="text-[8px] text-accent font-bold uppercase tracking-[0.3em] italic">{threat}</div>
          </div>
        </div>
        
        <div className={cn(
          "text-[9px] px-3 py-1 font-black uppercase tracking-[0.2em] border shadow-sm",
          status.toLowerCase().includes('high') 
          ? "bg-accent/10 text-accent border-accent/30 neon-text-magenta" 
          : "bg-slate-900 text-slate-500 border-slate-800"
        )}>
          {status}
        </div>
      </div>
    </div>
  );
}

export function NavItem({ children, active, onClick, label }: { children: React.ReactNode, active: boolean, onClick: () => void, label: string }) {
  return (
    <button onClick={onClick} className={cn(
      "flex flex-col items-center justify-center transition-all duration-300 gap-1.5 relative group outline-none",
      active ? "text-primary" : "text-slate-500 hover:text-primary/70"
    )}>
      <div className={cn(
        "w-11 h-11 flex items-center justify-center transition-all duration-300 relative border",
        active ? "bg-primary/10 border-primary shadow-[0_0_15px_rgba(0,255,156,0.2)]" : "bg-transparent border-transparent group-active:scale-95"
      )}>
        {children}
        {active && (
          <div className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-primary animate-pulse" />
        )}
      </div>
      
      <span className={cn(
        "text-[8px] font-black uppercase tracking-[0.2em] transition-all duration-300",
        active ? "opacity-100" : "opacity-40"
      )}>
        {label}
      </span>

      {active && (
        <motion.div 
          layoutId="nav-underline"
          className="absolute -bottom-1 w-4 h-0.5 bg-primary"
          transition={{ type: "spring", bounce: 0, duration: 0.4 }}
        />
      )}
    </button>
  );
}

export function EmailPreview({ business }: { business: Business }) {
  const auditId = useMemo(() => {
    const str = business.name || "";
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash % 9000) + 1000;
  }, [business.name]);
  
  if (!business) return null;

  const findings = business.intel?.findings || [business.conversionGap] || ["CRITICAL_OPTIMIZATION_REQUIRED"];
  const boost = business.intel?.conversionBoost || business.conversionBoost || 45;
  const impactLabel = business.intel?.growthLeakLabel || "SIGNIFICATIVE_COMMERCIAL_IMPACT";

  return (
    <div className="bg-[#050505] rounded-sm overflow-hidden shadow-[0_30px_60px_-12px_rgba(0,0,0,0.8)] border border-primary/20 text-slate-300 font-mono mx-auto max-w-full lg:max-w-2xl transform transition-all selection:bg-primary selection:text-black relative group">
      
      {/* Decorative Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      <div className="bg-[#0A0A0A] p-4 border-b border-primary/20 flex items-center gap-4 relative z-10">
         <div className="flex gap-1.5 shrink-0 px-2">
            <div className="w-2 h-2 rounded-none bg-accent animate-pulse" />
            <div className="w-2 h-2 rounded-none bg-secondary" />
            <div className="w-2 h-2 rounded-none bg-primary" />
         </div>
         <div className="bg-black px-4 py-2 border border-primary/10 text-[9px] font-bold text-primary flex-1 truncate uppercase tracking-[0.2em] flex items-center gap-3">
            <span className="opacity-30">ENCRYPTED_TO:</span> <span className="neon-text-green">{business.email || 'REDACTED@DATA.ENGINE'}</span>
         </div>
      </div>
      
      <div className="p-8 sm:p-12 relative z-10">
        {/* ZYNDRIX AGENCY BRANDING */}
        <div className="flex items-center justify-between mb-12 pb-6 border-b border-white/5">
            <div className="flex items-center gap-3">
              <Image src="https://zyndrix.dev/img/zyndrix-live.png" width={28} height={28} alt="Zyndrix" className="h-7 w-auto object-contain grayscale invert" />
              <div>
                <div className="text-sm font-black tracking-widest text-white leading-none">ZYNDRIX<span className="text-secondary">_SYSTEMS</span></div>
                <div className="text-[7px] font-bold text-slate-500 uppercase tracking-[0.3em] mt-1">Tactical Audit Protocol v4.0</div>
              </div>
            </div>
            <div className="text-[7px] text-slate-600 font-mono text-right">
              TIMESTAMP: {new Date().toISOString().split('T')[0]}<br/>
              LOCATION: {business.neighborhood?.toUpperCase() || 'UNKNOWN_SECTOR'}
            </div>
        </div>

        <div className="space-y-8">
          <div className="space-y-2">
            <div className="text-[8px] text-primary font-bold uppercase tracking-[0.4em]">Objective_Identification</div>
            <h1 className="text-2xl font-black text-white tracking-tight leading-tight uppercase">
              Operational Audit: <br/> 
              <span className="text-primary neon-text-green">{business.name}</span>
            </h1>
          </div>
          
          <p className="text-slate-400 text-[13px] leading-relaxed border-l border-primary/20 pl-4 py-1 italic">
            Analysis initiated for <strong>{business.name}</strong>. Intelligence indicates multiple leak vectors in current digital infrastructure. Deployment of high-fidelity optimization required to prevent further market degradation.
          </p>

          {/* THE BEAST BRAIN METRICS BOX */}
          <div className="bg-black/80 border border-primary/30 rounded-sm p-8 my-10 relative overflow-hidden group/box">
             <div className="absolute top-0 right-0 p-6 opacity-5 rotate-12 group-hover/box:opacity-10 transition-opacity">
                <Zap size={100} className="text-primary shadow-[0_0_20px_white]" />
             </div>
             
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 relative z-10">
                <div>
                   <div className="text-[8px] font-black text-secondary uppercase tracking-[0.4em] mb-3">Projected_Equity_Gain</div>
                   <div className="text-3xl font-black text-white tracking-tighter uppercase">{impactLabel}</div>
                   <div className="text-[8px] font-bold text-slate-600 mt-2 uppercase tracking-widest">Growth forecast verified.</div>
                </div>
                <div>
                   <div className="text-[8px] font-black text-primary uppercase tracking-[0.4em] mb-3">Conversion_Acceleration</div>
                   <div className="text-4xl font-black text-primary neon-text-green">+{boost}.00%</div>
                   <div className="text-[8px] font-bold text-slate-600 mt-2 uppercase tracking-widest">Inbound traffic yield optimize.</div>
                </div>
             </div>

             <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                <div>
                   <div className="text-[7px] font-black text-slate-500 uppercase tracking-[0.4em]">Sector_Benchmark</div>
                   <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{business.category}</div>
                </div>
                <div className="px-3 py-1 bg-primary/5 border border-primary/20 rounded-sm text-[8px] font-black text-primary uppercase italic tracking-tighter">
                   AUDIT_HASH: #ZX-{auditId}-ALPHA
                </div>
             </div>
          </div>

          <div className="border-l-2 border-accent/40 pl-6 my-10 space-y-4">
             <div className="text-[8px] font-black text-accent uppercase tracking-[0.4em] mb-2">Primary_Vulnerability_Detected</div>
             <p className="text-white font-bold leading-relaxed text-lg uppercase tracking-tight">
               &quot;{findings[0]}&quot;
             </p>
          </div>

          <p className="text-slate-400 text-[13px] leading-relaxed mb-10 uppercase tracking-wide opacity-80">
            A specialized prototype has been synthesized to demonstrate full-capacity operations for your enterprise. Access the secure interface below:
          </p>

          <div className="flex flex-col sm:flex-row gap-6 items-center pt-8 border-t border-white/5">
             <button className="w-full sm:w-auto px-10 py-5 bg-primary text-black font-black text-[10px] uppercase tracking-[0.3em] hover:bg-white transition-all shadow-[0_0_20px_rgba(0,255,156,0.3)]">
                Initialize Secure Protocol
             </button>
             <div className="text-[8px] font-bold text-slate-600 uppercase tracking-[0.3em]">
                Link_Expiry: 48:00:00_HRS
             </div>
          </div>
        </div>

        <footer className="mt-20 pt-10 border-t border-white/5 flex justify-between items-end bg-transparent opacity-40">
          <div>
            <div className="text-[10px] font-black text-white tracking-widest uppercase mb-1">ZYNDRIX<span className="text-secondary">_SYSTEMS</span></div>
            <div className="text-[7px] font-bold text-slate-500 uppercase tracking-widest">Applied_Industrial_Intelligence</div>
          </div>
          <div className="text-[7px] font-black text-slate-600 uppercase tracking-[0.2em] font-mono">
            CLASSIFIED_DOCUMENT // FOR_INTERNAL_USE_ONLY
          </div>
        </footer>
      </div>
    </div>
  );
}
