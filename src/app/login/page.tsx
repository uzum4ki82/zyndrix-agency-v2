'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, User, ShieldCheck, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // In a real production app, this would call a server action or API
      // For this implementation, we simulate the validation
      // PRO TIP: The user should define these in Vercel Env Vars
      const validUser = process.env.NEXT_PUBLIC_ADMIN_USER || 'admin';
      const validPass = process.env.NEXT_PUBLIC_ADMIN_PASS || 'zyndrix2026';

      if (username === validUser && password === validPass) {
        // Set cookie via a client-side trick for this demo, 
        // or a proper API route for better security.
        document.cookie = `zyndrix_session=is_authenticated; path=/; max-age=86400; samesite=strict`;
        router.push('/dashboard');
        router.refresh();
      } else {
        setError('Credenciales inválidas. Acceso denegado.');
      }
    } catch (err) {
      setError('Error en el sistema de autenticación.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617] relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-violet-500/10 blur-[120px] rounded-full" />
        <div className="dark-grid opacity-20" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md p-8 md:p-12 glass-card border-slate-800/50 relative z-10 mx-4"
      >
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="w-16 h-16 rounded-3xl bg-cyan-500/20 flex items-center justify-center mb-6 border border-cyan-500/30">
            <ShieldCheck className="text-cyan-400 w-8 h-8" />
          </div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tighter italic">Control Center</h1>
          <p className="text-slate-500 text-sm font-bold uppercase tracking-widest mt-2">Acceso Restringido a Operadores</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Usuario</label>
            <div className="relative group">
              <User className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full h-14 bg-slate-900/50 border border-slate-800 rounded-2xl pl-14 pr-6 text-white text-sm focus:outline-none focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/10 transition-all placeholder:text-slate-700"
                placeholder="Introducir operador"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Contraseña</label>
            <div className="relative group">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-14 bg-slate-900/50 border border-slate-800 rounded-2xl pl-14 pr-6 text-white text-sm focus:outline-none focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/10 transition-all placeholder:text-slate-700"
                placeholder="••••••••••••"
              />
            </div>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-400 text-xs font-bold"
              >
                <AlertCircle size={16} />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <Button 
            disabled={isLoading}
            className="w-full h-14 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-cyan-500/20 group"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                Sincronizar Acceso
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </Button>
        </form>

        <p className="text-center text-[10px] text-slate-600 mt-10 uppercase tracking-tighter">
          &copy; 2026 ZYNDRIX.DEV AGENCY — PROTOCOLO DE SEGURIDAD ACTIVADO
        </p>
      </motion.div>
    </div>
  );
}
