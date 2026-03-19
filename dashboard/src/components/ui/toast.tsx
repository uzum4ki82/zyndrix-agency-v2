'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

type Toast = {
  id: string;
  type: ToastType;
  message: string;
};

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  return { toasts, showToast };
}

// Singleton-ish for global access
let toastHandlers: ((m: string, t?: ToastType) => void)[] = [];

export const toast = {
  show: (message: string, type: ToastType = 'success') => {
    toastHandlers.forEach(handler => handler(message, type));
  },
  success: (message: string) => toast.show(message, 'success'),
  error: (message: string) => toast.show(message, 'error'),
  info: (message: string) => toast.show(message, 'info'),
};

export function ToastContainer() {
  const { toasts, showToast } = useToast();

  useEffect(() => {
    toastHandlers.push(showToast);
    return () => {
      toastHandlers = toastHandlers.filter(h => h !== showToast);
    };
  }, [showToast]);

  return (
    <div className="fixed bottom-8 right-8 z-[300] flex flex-col gap-3">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: 20, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.9 }}
            className={`flex items-center gap-4 p-4 pr-6 rounded-2xl border backdrop-blur-xl shadow-2xl ${
              t.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
              t.type === 'error' ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' :
              'bg-cyan-500/10 border-cyan-500/20 text-cyan-400'
            }`}
          >
            {t.type === 'success' && <CheckCircle2 size={20} />}
            {t.type === 'error' && <AlertCircle size={20} />}
            {t.type === 'info' && <Info size={20} />}
            <p className="text-sm font-bold uppercase tracking-tight">{t.message}</p>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
