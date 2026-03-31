'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import AuthGuard from '@/components/dashboard/AuthGuard';
import Sidebar from '@/components/dashboard/Sidebar';
import Topbar from '@/components/dashboard/Topbar';
import '@/styles/dashboard.css';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const isLoginPage = pathname === '/dashboard/login';

  return (
    <AuthGuard>
      {isLoginPage ? (
         <div className="min-h-screen bg-slate-950">
           {children}
         </div>
      ) : (
        <div className="dashboard-container bg-[#F0F2F5]">
          <div 
            className={`mobile-overlay ${isOpen ? 'visible' : ''}`}
            onClick={() => setIsOpen(false)}
          />
          
          <div className={isOpen ? 'sidebar-shell mobile-open' : 'sidebar-shell'}>
            <Sidebar isOpen={isOpen} onClose={() => setIsOpen(false)} />
          </div>

          <main className="main-wrapper flex flex-col min-w-0 flex-1 h-screen overflow-hidden">
            <Topbar onMenuClick={() => setIsOpen(true)} />
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-10">
              <div className="max-w-[1600px] mx-auto animate-in">
                {children}
              </div>
            </div>
          </main>
        </div>
      )}
    </AuthGuard>
  );
}
