'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, User, ChevronDown } from 'lucide-react';
import Image from 'next/image';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const ChatAgent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: '¡Hola! Soy tu asistente en Zyndrix. Estoy aquí para resolver tus dudas sobre nuestra tecnología o ayudarte con tu proyecto. ¿En qué puedo apoyarte hoy?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMsg: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('https://n8n.zyndrix.dev/webhook/7f93bc65-c3da-4de3-99e4-800040bdbc35/chat', {
        method: 'POST',
        body: JSON.stringify({ message: input, sessionId: 'human-chat-session' }),
        headers: { 'Content-Type': 'application/json' }
      });
      
      const data = await response.json();
      const assistantMsg: Message = { 
        role: 'assistant', 
        content: data.output || data.message || 'Lo siento, he tenido un pequeño problema de conexión. ¿Podrías repetirme eso?' 
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Parece que estoy teniendo problemas con mi red. Dame un momento e inténtalo de nuevo.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] font-sans pointer-events-none">
      {/* Friendly Trigger: Human Face Avatar */}
      <div className="flex justify-end pointer-events-auto">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(!isOpen)}
            className="w-16 h-16 bg-white rounded-full flex items-center justify-center p-0 shadow-[0_10px_40px_rgba(0,0,0,0.15)] border-2 border-white relative group overflow-hidden"
          >
            <img 
                src="/img/ai_avatar.png" 
                alt="AI Assistant" 
                className="w-full h-full object-cover transition-transform group-hover:scale-110"
            />
            <div className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white shadow-sm" />
            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        className="absolute inset-0 bg-black/20 flex items-center justify-center"
                    >
                        <X className="w-5 h-5 text-white" />
                    </motion.div>
                )}
            </AnimatePresence>
          </motion.button>
      </div>

      {/* Modern & Minimalist Conversation Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            className="absolute bottom-20 right-0 w-[350px] h-[580px] max-h-[80vh] flex flex-col bg-white rounded-[2rem] shadow-[0_30px_90px_rgba(0,30,80,0.15)] overflow-hidden pointer-events-auto border border-slate-100"
          >
            {/* Header: Human Perspective */}
            <div className="px-8 py-6 bg-slate-50/50 flex items-center justify-between border-b border-slate-100">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm">
                        <img 
                            src="/img/ai_avatar.png" 
                            alt="Zyndrix AI" 
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div>
                        <h3 className="text-[14px] font-black tracking-tight text-slate-800">Asesor Zyndrix</h3>
                        <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">En línea ahora</span>
                        </div>
                    </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="text-slate-300 hover:text-slate-500 transition-colors">
                    <ChevronDown className="w-5 h-5" />
                </button>
            </div>

            {/* Clean Conversation Space */}
            <div 
              ref={scrollRef}
              className="flex-grow overflow-y-auto p-8 space-y-6 scrollbar-minimal"
            >
              {messages.map((m, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={i} 
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] ${m.role === 'user' ? 'bg-[#0066FF] text-white shadow-[0_10px_20px_rgba(0,102,255,0.1)]' : 'bg-slate-50 text-slate-700'} p-4 rounded-2xl text-[14px] leading-relaxed ${m.role === 'user' ? 'rounded-tr-none' : 'rounded-tl-none font-medium'}`}>
                    {m.content}
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                    <div className="bg-slate-50 px-5 py-3 rounded-2xl flex gap-1.5 items-center">
                        <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-1.5 h-1.5 bg-slate-300 rounded-full" />
                        <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.1 }} className="w-1.5 h-1.5 bg-slate-300 rounded-full" />
                        <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-1.5 h-1.5 bg-slate-300 rounded-full" />
                    </div>
                </div>
              )}
            </div>

            {/* Elegant Input Field */}
            <div className="p-6 bg-white border-t border-slate-100">
              <div className="flex items-center bg-slate-50 rounded-2xl border border-slate-100 focus-within:border-blue-500/20 focus-within:ring-4 focus-within:ring-blue-500/5 transition-all duration-300">
                <input 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Escribe un mensaje..."
                  className="w-full bg-transparent border-none px-6 py-4 text-[14px] text-slate-800 focus:ring-0 outline-none"
                />
                <button 
                  onClick={sendMessage}
                  disabled={isLoading}
                  className="mr-2 p-3 bg-[#0066FF] text-white rounded-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-30"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .scrollbar-minimal::-webkit-scrollbar {
          width: 4px;
        }
        .scrollbar-minimal::-webkit-scrollbar-track {
          background: transparent;
        }
        .scrollbar-minimal::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.05);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};
