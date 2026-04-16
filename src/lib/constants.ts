import { LayoutDashboard, Users, Mail, BarChart3 } from 'lucide-react';

export const navItems = [
  { id: 'commander', label: 'Comando Central', icon: LayoutDashboard },
  { id: 'leads', label: 'Auditoría de Mercado', icon: Users, badge: 'New' },
  { id: 'outreach', label: 'Despliegues Activos', icon: Mail },
  { id: 'analytics', label: 'Inteligencia y Datos', icon: BarChart3 },
];
