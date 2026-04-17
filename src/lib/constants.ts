import { LayoutDashboard, Users, Mail, BarChart3, Globe } from 'lucide-react';

export const navItems = [
  { id: 'commander', label: 'Comando Central', icon: LayoutDashboard },
  { id: 'leads', label: 'Auditoría de Mercado', icon: Users, badge: 'New' },
  { id: 'sites', label: 'Activos Digitales', icon: Globe },
  { id: 'outreach', label: 'Despliegues Activos', icon: Mail },
  { id: 'analytics', label: 'Inteligencia y Datos', icon: BarChart3 },
];
