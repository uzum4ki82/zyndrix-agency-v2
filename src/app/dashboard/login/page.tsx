'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, User, ShieldCheck, Zap, ArrowRight, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import '@/styles/dashboard.css';

// Admin fallback if env is missing
const ADMIN_USER = process.env.NEXT_PUBLIC_ADMIN_USER || 'admin';
const ADMIN_PASS = process.env.NEXT_PUBLIC_ADMIN_PASS || 'zyndrix2026';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // If already logged in, skip
    if (localStorage.getItem('zyndrix_session') === 'active') {
      router.replace('/dashboard');
    }
  }, [router]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simulate tech processing
    setTimeout(() => {
      if (username === ADMIN_USER && password === ADMIN_PASS) {
        setSuccess(true);
        localStorage.setItem('zyndrix_session', 'active');
        localStorage.setItem('zyndrix_user', username);
        
        setTimeout(() => {
          router.replace('/dashboard');
        }, 1200);
      } else {
        setError('Credenciales de acceso no válidas. Acceso denegado.');
        setLoading(false);
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* BACKGROUND EFFECTS */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-600/10 blur-[150px] rounded-full" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/10 blur-[150px] rounded-full" />
      
      {/* GRID MESH */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />
      <div className="absolute inset-0 bg-grid-white/[0.02] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        {/* LOGO AREA */}
        <div className="flex flex-col items-center mb-10">
          <motion.div 
            whileHover={{ scale: 1.05, rotate: 5 }}
            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-2xl shadow-blue-500/30 mb-6 border border-white/10"
          >
            <ShieldCheck className="text-white" size={32} />
          </motion.div>
          <div className="text-center">
            <h1 className="text-3xl font-black text-white tracking-tighter uppercase flex items-center gap-3 justify-center mb-1">
              ZYNDRIX <span className="text-blue-500 font-mono italic">OS</span>
            </h1>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
              Control Center • Acceso Restringido
            </p>
          </div>
        </div>

        {/* LOGIN CARD */}
        <div className="ds-card p-0 bg-[#121215]/80 backdrop-blur-2xl border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500" />
          
          <div className="p-10">
            <form onSubmit={handleLogin} className="flex flex-col gap-6">
              {/* USERNAME */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Identificador</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                  <input 
                    type="text" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="ID de Operador"
                    required
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white text-sm outline-none focus:border-blue-500/50 focus:bg-white/[0.05] transition-all placeholder:text-slate-700"
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Clave de Seguridad</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    required
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white text-sm outline-none focus:border-blue-500/50 focus:bg-white/[0.05] transition-all placeholder:text-slate-700 font-mono"
                  />
                </div>
              </div>

              {/* ERROR STATE */}
              <AnimatePresence>
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-center gap-3 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-[11px] font-bold"
                  >
                    <AlertCircle size={14} />
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* SUBMIT */}
              <button 
                type="submit" 
                disabled={loading || success}
                className={`mt-4 w-full rounded-xl py-4 font-black transition-all flex items-center justify-center gap-3 shadow-xl ${
                  success 
                    ? 'bg-emerald-600 text-white shadow-emerald-500/20' 
                    : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/20 active:scale-95'
                }`}
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    <span>VERIFICANDO...</span>
                  </>
                ) : success ? (
                  <>
                    <Zap size={18} fill="currentColor" />
                    <span>ACCESO CONCEDIDO</span>
                  </>
                ) : (
                  <>
                    <span>AUTENTICAR SISTEMA</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="p-6 bg-white/[0.02] border-t border-white/[0.05] text-center">
             <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                <Sparkles size={12} className="text-blue-500" />
                Auth Engine V3.2 • Secure Encryption
             </p>
          </div>
        </div>

        {/* FOOTER INFO */}
        <div className="mt-8 text-center text-[10px] text-slate-700 font-bold uppercase tracking-[0.2em] leading-relaxed">
          Propiedad de Zyndrix AI Agency <br />
          Uso estrictamente confidencial • IP Logged
        </div>
      </motion.div>
    </div>
  );
}
