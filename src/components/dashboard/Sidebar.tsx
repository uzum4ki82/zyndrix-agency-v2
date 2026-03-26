import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  BarChart3, 
  Users, 
  Settings, 
  LogOut, 
  Brain, 
  Zap, 
  FileText, 
  Activity,
  Box,
  LayoutDashboard
} from 'lucide-react';import { cn } from '@/lib/utils';
const menuItems = [
  { icon: LayoutDashboard, label: 'Resumen', href: '/dashboard' },
  { icon: Users, label: 'Prospectos', href: '/dashboard/leads' },
  { icon: Zap, label: 'Automatizaciones', href: '/dashboard/automations' },
  { icon: Box, label: 'Herramientas IA', href: '/dashboard/ai-tools' },
  { icon: Activity, label: 'Logs del Sistema', href: '/dashboard/logs' },
  { icon: FileText, label: 'Documentación', href: '/dashboard/docs' },
  { icon: Settings, label: 'Configuración', href: '/dashboard/settings' },
];

interface SidebarProps {
  onClose?: () => void;
}

export function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname();

  const handleLogout = () => {
    // Simple redirect to home for now, as real auth isn't implemented
    window.location.href = '/';
  };

  return (
    <aside className="h-full flex flex-col">
      <div className="sidebar-logo">
        <div className="w-full flex items-center justify-center py-2">
          <img 
            src="/img/zyndrix-logo-v14.png" 
            alt="Zyndrix Logo" 
            className="w-auto h-36 object-contain brightness-110 active:scale-95 transition-all"
          />
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "sidebar-link",
              pathname === item.href ? "active" : ""
            )}
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            <span className="font-medium tracking-wide">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-white/[0.05]">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all group"
        >
          <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-semibold text-sm">Cerrar Sesión</span>
        </button>
      </div>

      <div className="p-4 mx-4 mb-4 bg-gradient-to-br from-blue-600/20 to-violet-600/20 rounded-2xl border border-white/10">
        <div className="flex items-center gap-2 mb-2">
          <Brain className="w-4 h-4 text-blue-400" />
          <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">Neuro Engine V7</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
          Monitorización neuronal activa. Procesando leads en tiempo real.
        </p>
      </div>
    </aside>
  );
}
