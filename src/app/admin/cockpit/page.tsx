'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, 
  Terminal, 
  Settings, 
  Play, 
  Pause, 
  Activity, 
  Search, 
  PieChart, 
  Server,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ExternalLink
} from 'lucide-react';

export default function CockpitPage() {
  const [logs, setLogs] = useState<string[]>([]);
  const [status, setStatus] = useState('OPERATIONAL (AUTONOMOUS)');
  const [activeStep, setActiveStep] = useState(0);

  const fetchLogs = async () => {
    try {
      const res = await fetch('/api/admin/daemon');
      const data = await res.json();
      if (data.logs) setLogs(data.logs);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 5000); // Polling every 5s
    return () => clearInterval(interval);
  }, []);

  const steps = [
    { name: "Discovery", icon: Search, desc: "Scanning 50+ Spanish territories" },
    { name: "Audit", icon: Zap, desc: "Extracting real technical pain points" },
    { name: "Generation", icon: Play, desc: "Building custom Stitch designs" },
    { name: "Outreach", icon: ExternalLink, desc: "Hi-Fidelity Email Dispatch" }
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white p-8 font-sans">
      {/* Header */}
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-3xl font-light tracking-tighter mb-2 flex items-center gap-3">
            <Server className="text-blue-500 w-8 h-8" />
            Zyndrix Autonomous <span className="font-bold text-blue-500">Cockpit</span>
          </h1>
          <p className="text-gray-500 text-sm">System Status: <span className="text-green-500 font-mono animate-pulse uppercase">{status}</span></p>
        </div>
        
        <div className="flex gap-4">
          <button className="px-6 py-2 bg-red-500/10 text-red-500 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-all flex items-center gap-2 text-sm">
            <Pause className="w-4 h-4" /> EMERGENCY STOP
          </button>
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all flex items-center gap-2 text-sm shadow-lg shadow-blue-500/20">
            <Settings className="w-4 h-4" /> CONFIGURE DAEMON
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Left Column: Visual Lifecycle */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <div className="bg-[#111112] border border-white/5 rounded-2xl p-6">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <Activity className="w-4 h-4" /> Autonomous Lifecycle
            </h2>
            
            <div className="space-y-8 relative">
              <div className="absolute left-[19px] top-4 bottom-4 w-[1px] bg-gradient-to-b from-blue-500/50 via-gray-800 to-transparent" />
              
              {steps.map((step, i) => (
                <div key={i} className="flex gap-6 relative">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${i === 1 ? 'bg-blue-600 border-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.3)]' : 'bg-black border-white/10 text-gray-500'} z-10`}>
                    <step.icon className={`w-5 h-5 ${i === 1 ? 'text-white' : ''}`} />
                  </div>
                  <div>
                    <h3 className={`text-lg transition-all ${i === 1 ? 'text-white font-bold' : 'text-gray-500 font-normal'}`}>{step.name}</h3>
                    <p className={`text-xs ${i === 1 ? 'text-blue-400' : 'text-gray-600'}`}>{step.desc}</p>
                    {i === 1 && (
                      <motion.div 
                        initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 2, repeat: Infinity }}
                        className="h-[2px] bg-blue-500 mt-2" 
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/20 rounded-2xl p-6 shadow-2xl">
            <h2 className="text-sm font-bold text-blue-400 uppercase tracking-widest mb-4">Real-time Metrics</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-black/40 rounded-xl border border-white/5">
                <p className="text-gray-500 text-[10px] uppercase font-bold tracking-tighter">Daily Scans</p>
                <p className="text-2xl font-bold">272</p>
              </div>
              <div className="p-4 bg-black/40 rounded-xl border border-white/5">
                <p className="text-gray-500 text-[10px] uppercase font-bold tracking-tighter">Conversion Gap</p>
                <p className="text-2xl font-bold text-green-500">+12%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Log Terminal */}
        <div className="col-span-12 lg:col-span-8 flex flex-col h-[600px]">
          <div className="bg-[#111112] border border-white/10 rounded-2xl flex-1 flex flex-col overflow-hidden shadow-2xl">
            <div className="p-4 bg-black/40 border-b border-white/5 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Terminal className="text-gray-500 w-4 h-4" />
                <span className="text-xs font-mono text-gray-400">COMMAND_CENTER v2.4.0 -- PRODUCTION MODE</span>
              </div>
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/20" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/40" />
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 font-mono text-[13px] space-y-2 custom-scrollbar bg-black">
              {logs.length === 0 ? (
                <div className="text-gray-600 italic">Waiting for daemon heartbeat...</div>
              ) : (
                logs.map((log, i) => {
                  const isSuccess = log.includes('[SUCCESS]');
                  const isError = log.includes('[ERROR]');
                  const isWarning = log.includes('[WARNING]');
                  
                  return (
                    <div key={i} className="flex gap-4 group">
                      <span className="text-gray-700 select-none">{logs.length - i}</span>
                      <span className={`
                        ${isSuccess ? 'text-green-400' : ''}
                        ${isError ? 'text-red-400' : ''}
                        ${isWarning ? 'text-yellow-400 text-sm italic' : ''}
                        ${!isSuccess && !isError && !isWarning ? 'text-gray-400' : ''}
                      `}>
                        {log}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #000;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #222;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #333;
        }
      `}</style>
    </div>
  );
}
