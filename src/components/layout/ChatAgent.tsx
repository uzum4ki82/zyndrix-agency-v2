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
        body: JSON.stringify({ 
          chatInput: input, 
          message: input, 
          sessionId: 'human-chat-session' 
        }),
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
    <div className="fixed top-0 right-0 h-full z-[100] pointer-events-none flex items-center">
      {/* Vertical Side Tab Trigger */}
      <div className="flex justify-end pointer-events-auto h-fit">
          <motion.button 
            initial={{ x: 100 }}
            animate={{ x: isOpen ? 100 : 0 }}
            whileHover={{ x: -10 }}
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-4 bg-white border border-slate-200 border-r-0 pl-4 py-4 pr-3 rounded-l-3xl shadow-[-20px_0_50px_rgba(0,0,0,0.1)] group transition-all"
          >
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-md relative">
                    <img 
                        src="/img/ai_avatar.png" 
                        alt="AI Assistant" 
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />
                </div>
                <div className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary/40 vertical-text py-2">
                    ASISTENTE VIRTUAL
                </div>
            </div>
          </motion.button>
      </div>

      {/* Slide-out Conversation Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 w-[400px] h-full flex flex-col bg-white shadow-[-50px_0_100px_rgba(0,0,0,0.1)] overflow-hidden pointer-events-auto border-l border-slate-100"
          >
            {/* Header: Executive Perspective */}
            <div className="px-10 py-10 bg-slate-50/50 flex items-center justify-between border-b border-slate-100">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-white shadow-lg relative">
                        <img 
                            src="/img/ai_avatar.png" 
                            alt="Zyndrix AI" 
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 rounded-full border-4 border-white" />
                    </div>
                    <div>
                        <h3 className="text-xl font-black tracking-tight text-slate-800 uppercase">Asesor Zyndrix</h3>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">Sistemas Conectados</span>
                        </div>
                    </div>
                </div>
                <button 
                    onClick={() => setIsOpen(false)} 
                    className="w-12 h-12 rounded-full flex items-center justify-center text-slate-300 hover:text-slate-500 hover:bg-slate-100 transition-all"
                >
                    <X className="w-6 h-6" />
                </button>
            </div>

            {/* Conversation Area */}
            <div 
              ref={scrollRef}
              className="flex-grow overflow-y-auto p-10 space-y-8 scrollbar-minimal"
            >
              {messages.map((m, i) => (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={i} 
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] ${m.role === 'user' ? 'bg-primary text-white shadow-xl shadow-primary/20' : 'bg-slate-50 text-slate-700'} p-6 rounded-[2rem] text-[15px] leading-relaxed ${m.role === 'user' ? 'rounded-tr-none' : 'rounded-tl-none font-medium'}`}>
                    {m.content}
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                    <div className="bg-slate-50 px-6 py-4 rounded-[1.5rem] flex gap-2 items-center">
                        <motion.div animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-2 h-2 bg-slate-300 rounded-full" />
                        <motion.div animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.1 }} className="w-2 h-2 bg-slate-300 rounded-full" />
                        <motion.div animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-2 h-2 bg-slate-300 rounded-full" />
                    </div>
                </div>
              )}
            </div>

            {/* Input Footer */}
            <div className="p-10 bg-white border-t border-slate-100">
              <div className="flex items-center bg-slate-50 rounded-[2rem] border border-slate-100 focus-within:border-primary/20 focus-within:ring-[15px] focus-within:ring-primary/5 transition-all duration-500">
                <input 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Escribe tu mensaje aquí..."
                  className="w-full bg-transparent border-none px-8 py-6 text-[15px] text-slate-800 focus:ring-0 outline-none placeholder:text-slate-300"
                />
                <button 
                  onClick={sendMessage}
                  disabled={isLoading}
                  className="mr-3 w-14 h-14 bg-primary text-white rounded-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20 disabled:opacity-30"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .vertical-text {
          writing-mode: vertical-rl;
          text-orientation: mixed;
          transform: rotate(180deg);
        }
        .scrollbar-minimal::-webkit-scrollbar {
          width: 6px;
        }
        .scrollbar-minimal::-webkit-scrollbar-track {
          background: transparent;
        }
        .scrollbar-minimal::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.03);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};
