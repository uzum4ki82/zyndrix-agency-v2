'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Loader2, ShieldCheck, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // 1. Skip check if already on login page
    if (pathname === '/dashboard/login') {
      setAuthorized(true);
      return;
    }

    // 2. Simple local storage check
    const checkAuth = () => {
      const session = localStorage.getItem('zyndrix_session');
      if (session === 'active') {
        setAuthorized(true);
      } else {
        setAuthorized(false);
        // Delay slightly for UX or just push
        router.replace('/dashboard/login');
      }
    };

    checkAuth();
  }, [pathname, router]);

  // Handle loading state
  if (authorized === null) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6 text-center">
        <div className="relative mb-8">
           <div className="w-20 h-20 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-500 animate-pulse">
              <ShieldCheck size={40} />
           </div>
           <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full" />
        </div>
        <div className="flex flex-col gap-2">
           <h2 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-3 justify-center">
              Verificando Permisos <Loader2 size={16} className="animate-spin text-blue-500" />
           </h2>
           <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest opacity-50">Zyndrix Neural Secure Layer V3.1</p>
        </div>
      </div>
    );
  }

  // If we are on login page or authorized, render children
  if (authorized || pathname === '/dashboard/login') {
    return <>{children}</>;
  }

  // Final fallback (should not reach here as router.replace is called)
  return null;
}
