"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, X, User, ChevronDown, Sparkles } from 'lucide-react';

interface Message {
  id: string;
  type: 'bot' | 'user';
  content: string;
}

const botResponses = [
  "Zyndrix está diseñado para escalar tu facturación mediante automatización de leads. ¿Hablamos de tu sector?",
  "Nuestros agentes autónomos operan 24/7. ¿Te gustaría ver un caso de éxito?",
  "La eficiencia operativa es nuestra prioridad. ¿Quieres agendar una auditoría gratuita?"
];

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load persistence
  useEffect(() => {
    const savedMessages = localStorage.getItem('marcos_chat_history');
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
      setShowSuggestions(false);
    } else {
      setMessages([
        {
          id: 'welcome',
          type: 'bot',
          content: '¡Hola! 👋 Soy Marcos, asesor de Zyndrix. Estoy aquí para transformar tu infraestructura de ventas. ¿En qué puedo ayudarte?'
        }
      ]);
    }
  }, []);

  // Save persistence
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('marcos_chat_history', JSON.stringify(messages));
    }
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (text: string = inputValue) => {
    const cleanText = text.trim();
    if (!cleanText) return;

    // Add user message
    const userMsg: Message = { id: Date.now().toString(), type: 'user', content: cleanText };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setShowSuggestions(false);
    setIsTyping(true);

    try {
      const response = await fetch('https://n8n.zyndrix.dev/webhook/7f93bc65-c3da-4de3-99e4-800040bdbc35/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chatInput: cleanText,
          message: cleanText,
          sessionId: 'marcos-chat-session',
          source: 'chatbot_marcos',
          timestamp: new Date().toISOString()
        })
      });

      const data = await response.json();
      setIsTyping(false);

      if (data && (data.output || data.message)) {
        setMessages(prev => [...prev, { 
          id: Date.now().toString() + '-bot', 
          type: 'bot', 
          content: data.output || data.message 
        }]);
      } else {
        const fallback = botResponses[Math.floor(Math.random() * botResponses.length)];
        setMessages(prev => [...prev, { id: Date.now().toString() + '-bot', type: 'bot', content: fallback }]);
      }
    } catch (error) {
      console.error('Chat Error:', error);
      setIsTyping(false);
      const fallback = botResponses[Math.floor(Math.random() * botResponses.length)];
      setMessages(prev => [...prev, { id: Date.now().toString() + '-bot', type: 'bot', content: fallback }]);
    }
  };

  const handleSuggestion = (suggestion: string) => {
    handleSend(suggestion);
  };

  const clearChat = () => {
    localStorage.removeItem('marcos_chat_history');
    setMessages([{
      id: 'welcome',
      type: 'bot',
      content: '¡Hola! 👋 Soy Marcos. ¿En qué puedo ayudarte ahora?'
    }]);
    setShowSuggestions(true);
  };

  return (
    <div className="fixed bottom-8 right-8 z-[9999] font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.9, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: 40, scale: 0.9, filter: 'blur(10px)' }}
            transition={{ type: "spring", damping: 20, stiffness: 150 }}
            className="mb-6 w-[420px] h-[600px] bg-white border border-slate-100 rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] overflow-hidden flex flex-col"
          >
            {/* Header - Architectural Style */}
            <div className="px-6 py-8 bg-black text-white flex items-center justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl rounded-full -mr-16 -mt-16 pointer-events-none" />
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-14 h-14 rounded-xl overflow-hidden border-2 border-white/10 shadow-xl relative">
                  <img src="/img/marcos.png" alt="Marcos" className="w-full h-full object-cover" />
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-black" />
                </div>
                <div>
                  <h3 className="text-lg font-black tracking-tighter uppercase m-0 leading-tight">Marcos</h3>
                  <div className="flex items-center gap-1.5 text-[10px] opacity-60 font-bold uppercase tracking-[0.2em]">
                    Intelligence Agent
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 relative z-10">
                <button 
                  onClick={clearChat}
                  className="w-10 h-10 rounded-xl hover:bg-white/10 flex items-center justify-center transition-all text-white/40 hover:text-white"
                  title="Limpiar chat"
                >
                  <Sparkles size={16} />
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="w-10 h-10 rounded-xl hover:bg-white/10 flex items-center justify-center transition-all"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-slate-200">
              {messages.map((msg) => (
                <motion.div 
                  initial={{ opacity: 0, x: msg.type === 'user' ? 10 : -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={msg.id} 
                  className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] p-5 text-[14px] leading-relaxed ${
                    msg.type === 'user' 
                      ? 'bg-black text-white rounded-2xl rounded-tr-none shadow-lg' 
                      : 'bg-slate-50 text-slate-800 rounded-2xl rounded-tl-none border border-slate-100 font-medium'
                  }`}>
                    {msg.content}
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-slate-50 px-5 py-4 rounded-2xl rounded-tl-none border border-slate-100 flex gap-1.5">
                    <motion.span animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-1.5 h-1.5 bg-slate-400 rounded-full"></motion.span>
                    <motion.span animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.1 }} className="w-1.5 h-1.5 bg-slate-400 rounded-full"></motion.span>
                    <motion.span animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-1.5 h-1.5 bg-slate-400 rounded-full"></motion.span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggestions Chips */}
            {showSuggestions && (
              <div className="px-6 pb-4 flex flex-wrap gap-2">
                {[
                  "Optimizar mi negocio ⚡",
                  "Auditoría Gratuita 📅",
                  "Ver Casos de Éxito 🚀"
                ].map((s) => (
                  <button
                    key={s}
                    onClick={() => handleSuggestion(s)}
                    className="text-[11px] font-black uppercase tracking-wider py-2.5 px-4 bg-white border border-slate-200 rounded-lg text-slate-600 hover:border-black hover:text-black transition-all shadow-sm active:scale-95"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Input Bar */}
            <div className="p-6 border-t border-slate-100 bg-white">
              <div className="flex gap-3 bg-slate-50 p-2 rounded-2xl border border-slate-100 focus-within:border-black/10 focus-within:bg-white transition-all">
                <input 
                  type="text" 
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Escribe tu consulta estratégica..."
                  className="flex-1 bg-transparent border-none px-4 py-2 text-sm focus:outline-none placeholder:text-slate-400"
                />
                <button 
                  onClick={() => handleSend()}
                  disabled={!inputValue.trim() || isTyping}
                  className="w-11 h-11 bg-black text-white rounded-xl flex items-center justify-center hover:bg-slate-800 disabled:opacity-20 active:scale-95 transition-all shadow-lg"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-black text-white rounded-2xl shadow-[0_15px_40px_-8px_rgba(0,0,0,0.3)] flex items-center justify-center hover:bg-slate-900 transition-all relative group"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
            >
              <X size={28} />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              className="flex items-center justify-center"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
            >
              <MessageSquare size={28} className="group-hover:scale-110 transition-transform" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full border-2 border-white animate-pulse" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
