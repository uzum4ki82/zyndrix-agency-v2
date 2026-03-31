'use client';

import React from 'react';
import { 
  LayoutDashboard, 
  Calendar, 
  Layers, 
  Target, 
  Users, 
  FileText, 
  PieChart, 
  Settings, 
  Plus, 
  ChevronRight, 
  LogOut,
  Brain,
  ChevronLeft
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const menuItems = [
  { icon: LayoutDashboard, label: 'Resumen General', href: '/dashboard' },
  { icon: Calendar, label: 'Calendario', href: '/dashboard/calendar' },
  { icon: Layers, label: 'Tareas y Hitos', href: '/dashboard/tasks' },
  { icon: Target, label: 'Embudo CRM', href: '/dashboard/leads' },
  { icon: Users, label: 'Clientes / Leads', href: '/dashboard/customers' },
  { icon: FileText, label: 'Presupuestos', href: '/dashboard/quotes' },
  { icon: PieChart, label: 'Informes IA', href: '/dashboard/reports' },
  { icon: Settings, label: 'Configuración', href: '/dashboard/settings' },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="w-full h-full bg-white flex flex-col border-r border-slate-100 shadow-sm relative overflow-hidden">
      {/* Brand Logo */}
      <div className="h-16 flex items-center px-6 border-b border-slate-50">
         <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-100/50">
               <Brain size={22} fill="white" />
            </div>
            <span className="font-black text-slate-900 text-lg tracking-tight uppercase">Zyndrix <span className="text-indigo-600 italic">AI</span></span>
         </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-6 space-y-1.5 custom-scrollbar">
         <div className="px-3 mb-6">
            <button className="w-full bg-slate-900 text-white rounded-xl py-3.5 px-4 font-bold text-xs flex items-center justify-between hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 active:scale-[0.98] group">
               <div className="flex items-center gap-2.5">
                  <Plus size={18} className="group-hover:rotate-90 transition-transform" />
                  <span>Crear nuevo</span>
               </div>
               <div className="bg-white/10 px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-widest">+N</div>
            </button>
         </div>

         <div className="px-3 mb-3">
            <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-widest pl-1">Menú Operativo</h4>
         </div>

         {menuItems.map((item) => (
           <Link 
             key={item.href} 
             href={item.href}
             className={cn(
               "flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold transition-all group",
               pathname === item.href 
                 ? "bg-indigo-50 text-indigo-700 shadow-sm ring-1 ring-indigo-100/50" 
                 : "text-slate-500 hover:bg-slate-50 hover:text-indigo-600"
             )}
           >
             <div className="flex items-center gap-3">
                <item.icon size={18} className={cn(
                  "transition-colors",
                  pathname === item.href ? "text-indigo-600" : "text-slate-400 group-hover:text-indigo-500"
                )} />
                <span className="tracking-tight">{item.label}</span>
             </div>
             {pathname === item.href && (
               <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-lg shadow-indigo-500/50" />
             )}
           </Link>
         ))}
      </nav>

      {/* User Footer Account Select */}
      <div className="p-4 border-t border-slate-50 bg-slate-50/20">
         <div className="flex items-center justify-between p-2 rounded-xl hover:bg-white hover:shadow-lg hover:shadow-slate-200/50 transition-all group cursor-pointer border border-transparent hover:border-slate-100">
            <div className="flex items-center gap-3">
               <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-[10px] border border-indigo-100 shadow-sm">
                  AD
               </div>
               <div className="flex flex-col overflow-hidden max-w-[120px]">
                  <span className="text-[11px] font-black text-slate-900 group-hover:text-indigo-600 transition-colors truncate">admin@zyndrix.ai</span>
                  <span className="text-[9px] font-bold text-slate-400 uppercase group-hover:text-slate-500">Administrador</span>
               </div>
            </div>
            <LogOut size={16} className="text-slate-300 group-hover:text-rose-500 transition-colors" />
         </div>
      </div>

      {isOpen && (
        <button 
          onClick={onClose}
          className="lg:hidden absolute bottom-4 left-4 bg-slate-900 text-white p-3 rounded-xl shadow-2xl z-10"
        >
          <ChevronLeft size={20} />
        </button>
      )}
    </aside>
  );
}
