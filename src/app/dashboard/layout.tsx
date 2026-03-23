import React from 'react';
import type { Metadata } from 'next';
import Sidebar from '@/components/dashboard/Sidebar';
import Topbar from '@/components/dashboard/Topbar';
import '@/styles/dashboard.css';

export const metadata: Metadata = {
  title: 'Zyndrix OS | Next-Gen AI Dashboard',
  description: 'Enterprise-grade AI Agency Dashboard & Lead Management',
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="dashboard-container">
      <Sidebar />
      <main className="main-wrapper">
        <Topbar />
        <div className="content-canvas">
          {children}
        </div>
      </main>
    </div>
  );
}
