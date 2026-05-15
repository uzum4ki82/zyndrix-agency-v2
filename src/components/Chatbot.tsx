"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, X, User } from 'lucide-react';

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
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      type: 'bot',
      content: '¡Hola! 👋 Soy Marcos, asesor de Zyndrix. ¿En qué puedo ayudarte hoy?'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
      const response = await fetch('https://n8n.zyndrix.dev/webhook/zyndrix-lead-scoring', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: cleanText,
          source: 'chatbot_marcos',
          timestamp: new Date().toISOString()
        })
      });

      const data = await response.json();
      setIsTyping(false);

      if (data && data.output) {
        setMessages(prev => [...prev, { id: Date.now().toString() + '-bot', type: 'bot', content: data.output }]);
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

  return (
    <div className="fixed bottom-6 right-6 z-[9999] font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mb-4 w-[380px] h-[520px] backdrop-blur-xl bg-white/80 border border-slate-200/50 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-4 bg-slate-900 text-white flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden border border-white/20">
                <img src="/img/marcos.png" alt="Marcos" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-bold m-0">Marcos</h3>
                <div className="flex items-center gap-1.5 text-[10px] opacity-80">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                  Online ahora
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                    msg.type === 'user' 
                      ? 'bg-slate-900 text-white rounded-tr-none' 
                      : 'bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200/50'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-slate-100 p-3 rounded-2xl rounded-tl-none border border-slate-200/50 flex gap-1">
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggestions */}
            {showSuggestions && (
              <div className="px-4 pb-2 flex flex-wrap gap-2">
                {[
                  "Optimizar procesos ⚡",
                  "Agendar Auditoría 📅",
                  "Casos de éxito 🚀"
                ].map((s) => (
                  <button
                    key={s}
                    onClick={() => handleSuggestion(s)}
                    className="text-[11px] py-1.5 px-3 bg-white border border-slate-200 rounded-full text-slate-600 hover:border-indigo-500 hover:text-indigo-600 transition-all shadow-sm active:scale-95"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-slate-200/50 flex gap-2">
              <input 
                type="text" 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Escribe tu pregunta..."
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-all"
              />
              <button 
                onClick={() => handleSend()}
                className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center hover:bg-slate-800 active:scale-95 transition-all shadow-lg"
              >
                <Send size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-slate-900 text-white rounded-2xl shadow-2xl flex items-center justify-center hover:bg-slate-800 transition-all relative overflow-hidden"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
            >
              <X size={24} />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
            >
              <MessageSquare size={24} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
