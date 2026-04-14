'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, Send, User, ChevronDown, Calendar } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const ChatAgent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hola, soy el asistente estratégico de Zyndrix. ¿En qué puedo ayudarte hoy?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMsg: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // Reemplaza esta URL con tu webhook de producción de n8n
      const response = await fetch('https://tu-instancia.n8n.cloud/webhook/zyndrix-chat', {
        method: 'POST',
        body: JSON.stringify({ 
            message: input, 
            sessionId: 'client-global-session' 
        }),
        headers: { 'Content-Type': 'application/json' }
      });
      
      const data = await response.json();
      
      // Manejamos la respuesta de n8n (asumiendo que devuelve { output: "..." })
      const assistantMsg: Message = { 
        role: 'assistant', 
        content: data.output || data.message || 'Lo siento, he tenido un problema procesando tu solicitud.' 
      };
      
      setMessages(prev => [...prev, assistantMsg]);
    } catch (error) {
      console.error("Error connecting to n8n:", error);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Actualmente no puedo conectar con el sistema central. Por favor, inténtalo más tarde.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100] font-sans">
      {/* Botón Flotante */}
      <motion.button 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/10 relative overflow-hidden group"
      >
        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div key="bot" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <Bot className="w-7 h-7" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Ventana de Chat */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: 20, scale: 0.95, filter: 'blur(10px)' }}
            className="absolute bottom-24 right-0 w-[90vw] md:w-[420px] h-[600px] max-h-[80vh] flex flex-col bg-white border border-slate-200 rounded-[2rem] shadow-[0_40px_100px_rgba(15,23,42,0.15)] overflow-hidden origin-bottom-right"
          >
            {/* Header */}
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 rounded-full bg-[#0066FF] animate-pulse" />
                    <h3 className="text-sm font-black uppercase tracking-[0.3em] text-slate-900">Zyndrix Assistant</h3>
                </div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">AI Operating System Support</p>
              </div>
              <div className="flex gap-2">
                <button className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400">
                    <Calendar className="w-4 h-4" />
                </button>
                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400">
                    <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            {/* Messages Area */}
            <div 
              ref={scrollRef}
              className="flex-grow overflow-y-auto p-8 space-y-6 bg-white"
            >
              {messages.map((m, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={i} 
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                      m.role === 'user' 
                        ? 'bg-[#0066FF] text-white rounded-tr-none font-medium' 
                        : 'bg-slate-50 border border-slate-100 text-slate-700 rounded-tl-none font-medium'
                    }`}>
                      {m.content}
                    </div>
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                    <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl">
                        <div className="flex gap-1.5">
                            <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                            <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                            <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                        </div>
                    </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-6 bg-slate-50/50 border-t border-slate-100">
              <div className="relative flex items-center bg-white rounded-2xl border border-slate-200 focus-within:border-[#0066FF]/50 focus-within:ring-4 focus-within:ring-[#0066FF]/5 transition-all duration-500">
                <input 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Describe tu neceisdad..."
                  className="w-full bg-transparent border-none px-6 py-4 text-sm text-slate-900 focus:ring-0 outline-none placeholder:text-slate-300"
                />
                <button 
                  onClick={sendMessage}
                  disabled={isLoading}
                  className="mr-2 p-3 bg-[#0066FF] text-white rounded-xl hover:bg-[#0055DD] active:scale-95 transition-all disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
