'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  Zap, 
  Brain, 
  ScrollText, 
  Settings, 
  ChevronRight,
  Database,
  BookOpen
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { id: 'overview', name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { id: 'leads', name: 'Leads (CRM)', icon: Users, href: '/dashboard/leads' },
  { id: 'automations', name: 'Automatizaciones', icon: Zap, href: '/dashboard/automations' },
  { id: 'ai-tools', name: 'AI Core Tools', icon: Brain, href: '/dashboard/ai-tools' },
  { id: 'logs', name: 'Historial / Logs', icon: ScrollText, href: '/dashboard/logs' },
  { id: 'docs', name: 'SDK & API Docs', icon: BookOpen, href: '/dashboard/docs' },
  { id: 'database', name: 'Base de Datos', icon: Database, href: '/dashboard/database' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar-shell">
      <div className="sidebar-logo">
        <div 
          className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-500/20"
        >
          Z
        </div>
        <span className="font-bold tracking-tight text-lg pl-1 whitespace-nowrap">
          Zyndrix <span className="text-blue-500 font-medium">OS</span>
        </span>
      </div>

      <nav className="nav-group">
        <div className="text-[10px] font-bold text-slate-500 tracking-widest uppercase px-4 mb-2">
          General
        </div>
        {navItems.slice(0, 3).map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.id} 
              href={item.href}
              className={cn("nav-link", isActive && "active")}
            >
              <item.icon className="w-4 h-4" />
              <span>{item.name}</span>
              {isActive && <ChevronRight className="w-3 h-3 ml-auto opacity-40" />}
            </Link>
          );
        })}

        <div className="text-[10px] font-bold text-slate-500 tracking-widest uppercase px-4 mt-8 mb-2">
          Inteligencia
        </div>
        {navItems.slice(3).map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.id} 
              href={item.href}
              className={cn("nav-link", isActive && "active")}
            >
              <item.icon className="w-4 h-4" />
              <span>{item.name}</span>
              {isActive && <ChevronRight className="w-3 h-3 ml-auto opacity-40" />}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto p-4 border-t border-white/[0.04]">
        <Link href="/dashboard/settings" className={cn("nav-link", pathname === '/dashboard/settings' && "active")}>
          <Settings className="w-4 h-4" />
          <span>Configuración</span>
        </Link>
      </div>
    </aside>
  );
}
