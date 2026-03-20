'use client';

import Link from 'next/link';
import Image from 'next/image';
import { 
  LayoutDashboard, 
  Users, 
  Send, 
  BarChart3, 
  Settings, 
  Zap, 
  MessageSquare,
  ShieldCheck,
  Command as CommandIcon,
  Globe,
  Wind,
  ExternalLink,
  X
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* OVERLAY FOR MOBILE */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] lg:hidden"
          />
        )}
      </AnimatePresence>

      <aside className={`
        fixed inset-y-0 left-0 z-[101] w-72 border-r border-slate-800/40 bg-[#020617]/80 backdrop-blur-3xl 
        transition-transform duration-300 transform 
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        lg:translate-x-0 lg:sticky lg:top-0 lg:h-screen flex flex-col p-6 overflow-y-auto
      `}>
        <div className="flex items-center justify-between mb-12 px-2">
          <div className="flex items-center gap-3">
            <Image 
              src="/web/img/zyndrix-logo-surgical.png" 
              alt="Zyndrix Logo" 
              width={40}
              height={40}
              className="object-contain"
            />
            <span className="font-bold text-2xl tracking-tighter text-white uppercase italic">
              Zyndrix
            </span>
          </div>
          <button onClick={onClose} className="lg:hidden text-slate-400 hover:text-white p-2">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 space-y-8">
        <nav className="space-y-1">
          <p className="px-3 mb-3 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] opacity-80">Navegación</p>
          <SidebarItem icon={LayoutDashboard} label="Vista General" href="/" active={pathname === '/'} />
          <SidebarItem icon={Users} label="Prospectos" href="/prospects" active={pathname === '/prospects'} />
          <SidebarItem icon={Send} label="Outreach" href="/outreach" active={pathname === '/outreach'} />
          <SidebarItem icon={BarChart3} label="Analíticas" href="/analytics" active={pathname === '/analytics'} />
        </nav>

        <nav className="space-y-1">
          <p className="px-3 mb-3 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] opacity-80">Automatización</p>
          <SidebarItem icon={Zap} label="Workflows" href="/workflows" active={pathname === '/workflows'} />
          <SidebarItem icon={MessageSquare} label="Respuestas" href="/responses" active={pathname === '/responses'} />
          <SidebarItem icon={ShieldCheck} label="IA Scoring" href="/scoring" active={pathname === '/scoring'} />
        </nav>

        <nav className="space-y-1">
          <p className="px-3 mb-3 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] opacity-80">Accesos Externos</p>
          <ExternalSidebarItem icon={Globe} label="Sitio Web" href="/web/index.html" />
          <ExternalSidebarItem icon={Wind} label="Plataforma n8n" href="https://omontesquesada.app.n8n.cloud/" />
        </nav>
      </div>

      <div className="mt-auto space-y-4 pt-10">
        <button 
          className="w-full flex items-center justify-between px-4 py-3 rounded-2xl bg-slate-900/50 border border-slate-800/80 text-xs font-bold text-slate-400 group hover:border-cyan-500/50 hover:text-white transition-all"
          onClick={() => {
            const event = new KeyboardEvent('keydown', {
              key: 'k',
              metaKey: true,
              bubbles: true
            });
            document.dispatchEvent(event);
          }}
        >
          <div className="flex items-center gap-2">
            <CommandIcon size={14} className="group-hover:text-cyan-400" />
            <span>Comandos</span>
          </div>
          <div className="flex gap-1">
            <span className="px-1.5 py-0.5 bg-slate-800 rounded text-[9px] border border-slate-700">⌘</span>
            <span className="px-1.5 py-0.5 bg-slate-800 rounded text-[9px] border border-slate-700">K</span>
          </div>
        </button>
        
        <div className="p-5 rounded-3xl bg-slate-900/50 border border-slate-800/80 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              <span className="text-[9px] font-black text-white uppercase tracking-widest">IA Core Status</span>
            </div>
            <span className="text-[9px] font-black text-emerald-400 capitalize">Optimal</span>
          </div>

          <div className="space-y-3">
            <div className="space-y-1.5">
              <div className="flex justify-between text-[8px] font-black uppercase tracking-tighter opacity-60">
                <span className="text-slate-400">Sync Pipeline</span>
                <span className="text-white">98.2%</span>
              </div>
              <div className="h-1 bg-slate-950 rounded-full overflow-hidden">
                <div className="h-full bg-cyan-500/80 w-[98.2%] shadow-[0_0_10px_rgba(6,182,212,0.3)]" />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-[8px] font-black uppercase tracking-tighter opacity-60">
                <span className="text-slate-400">Response Latency</span>
                <span className="text-white">12ms</span>
              </div>
              <div className="h-1 bg-slate-950 rounded-full overflow-hidden">
                <div className="h-full bg-violet-500/80 w-[15%] shadow-[0_0_10px_rgba(139,92,246,0.3)]" />
              </div>
            </div>
          </div>

          <p className="text-[9px] text-slate-500 leading-tight font-medium uppercase tracking-tighter italic text-center">
            Escaneando <strong className="text-white tracking-widest">+1,200</strong> empresas/hr
          </p>
        </div>
        <SidebarItem icon={Settings} label="Configuración" href="/settings" active={pathname === '/settings'} />
      </div>
    </aside>
    </>
  );
}

function SidebarItem({ icon: Icon, label, href, active }: { icon: any, label: string, href: string, active?: boolean }) {
  return (
    <Link 
      href={href} 
      className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl text-[13px] font-bold transition-all group uppercase tracking-tight ${
        active 
          ? 'bg-cyan-500/10 text-white border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.1)]' 
          : 'text-slate-400 hover:text-white hover:bg-slate-800/40 border border-transparent'
      }`}
    >
      <Icon size={18} className={`${active ? 'text-cyan-400' : 'group-hover:text-cyan-400'} transition-colors opacity-70 group-hover:opacity-100`} />
      {label}
    </Link>
  );
}

function ExternalSidebarItem({ icon: Icon, label, href }: { icon: any, label: string, href: string }) {
  return (
    <a 
      href={href} 
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-between px-4 py-3.5 rounded-2xl text-[13px] font-bold text-slate-400 hover:text-white hover:bg-slate-800/40 border border-transparent transition-all group uppercase tracking-tight"
    >
      <div className="flex items-center gap-3">
        <Icon size={18} className="group-hover:text-cyan-400 transition-colors opacity-70 group-hover:opacity-100" />
        {label}
      </div>
      <ExternalLink size={12} className="opacity-0 group-hover:opacity-40 transition-opacity" />
    </a>
  );
}
