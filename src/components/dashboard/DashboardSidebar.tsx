import React from 'react';
import { LayoutDashboard, Users, Mail, BarChart3, Settings, Menu, LogOut, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { navItems } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface NavItem {
  id: string;
  label: string;
  icon: any;
  badge?: string;
}

interface DashboardSidebarProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ activeTab, setActiveTab, isOpen, setIsOpen }) => {
  // Using centralized navItems

  return (
    <aside className={cn(
      "fixed inset-y-0 left-0 z-50 w-72 bg-[#0F172A] border-r border-slate-800 transition-transform duration-300 lg:static lg:translate-x-0",
      isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
    )}>
      <div className="flex flex-col h-full">
        {/* Institutional Branding */}
        <div className="h-24 flex items-center px-8">
          <div className="flex items-center gap-3">
             <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/20">Z</div>
             <span className="text-xl font-bold tracking-tight text-white">Zyndrix <span className="text-slate-500 font-medium">B2B</span></span>
          </div>
        </div>

        {/* Enhanced Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          <div className="px-4 mb-4">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Management</p>
          </div>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); setIsOpen(false); }}
              className={cn(
                "w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all font-medium text-[13px] group relative",
                activeTab === item.id 
                  ? "bg-slate-800/50 text-white shadow-sm" 
                  : "text-slate-400 hover:bg-slate-800/30 hover:text-white"
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon size={18} className={cn(activeTab === item.id ? "text-indigo-400" : "text-slate-500 group-hover:text-slate-300 transition-colors")} />
                <span>{item.label}</span>
              </div>
              
              {item.badge && (
                <span className="px-1.5 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 text-[10px] font-bold border border-indigo-500/20">
                  {item.badge}
                </span>
              )}

              {activeTab === item.id && (
                <motion.div layoutId="active-indicator" className="absolute left-0 w-1 h-5 bg-indigo-500 rounded-r-full" />
              )}
            </button>
          ))}

          <div className="px-4 pt-8 mb-4">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Configuración</p>
          </div>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[13px] text-slate-400 font-medium hover:bg-slate-800/30 hover:text-white transition-all">
            <Settings size={18} className="text-slate-500" />
            <span>Ajustes del SaaS</span>
          </button>
        </nav>

        {/* User Card - Institutional Profile */}
        <div className="p-4 border-t border-slate-800 mt-auto bg-slate-900/50">
          <div className="flex items-center gap-3 p-3 bg-slate-800/40 rounded-xl border border-slate-700/50">
            <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-lg shadow-indigo-500/10">OM</div>
            <div className="flex-1 overflow-hidden">
              <p className="text-xs font-semibold truncate text-white">Óscar Montes</p>
              <p className="text-[10px] text-slate-500 font-medium truncate uppercase tracking-tighter">Director de Estrategia</p>
            </div>
            <button className="text-slate-500 hover:text-white transition-colors">
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

