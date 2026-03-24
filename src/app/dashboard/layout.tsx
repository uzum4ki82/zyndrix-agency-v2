'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import Topbar from '@/components/dashboard/Topbar';
import '@/styles/dashboard.css';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="dashboard-container">
      <div 
        className={`mobile-overlay ${isOpen ? 'visible' : ''}`}
        onClick={() => setIsOpen(false)}
      />
      
      <div className={`sidebar-shell ${isOpen ? 'mobile-open' : ''}`}>
        <Sidebar onClose={() => setIsOpen(false)} />
      </div>

      <main className="main-wrapper">
        <Topbar onMenuClick={() => setIsOpen(true)} />
        <div className="content-canvas">
          {children}
        </div>
      </main>
    </div>
  );
}
