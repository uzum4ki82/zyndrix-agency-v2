'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Phone, MessageSquare, Play, Sparkles, X, Mic, Volume2, VolumeX, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

export const DemoPlayground = () => {
  const [activeTab, setActiveTab] = useState<'chat' | 'voice'>('chat');
  const [isCalling, setIsCalling] = useState(false);
  const [chatStep, setChatStep] = useState(0);
  const [callStep, setCallStep] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  const speechTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const transcriptContainerRef = useRef<HTMLDivElement | null>(null);

  // Simulación de chat
  useEffect(() => {
    if (activeTab === 'chat') {
      const timer = setInterval(() => {
        setChatStep(prev => (prev < 3 ? prev + 1 : 0));
      }, 4000);
      return () => clearInterval(timer);
    }
  }, [activeTab]);

  const audioContextRef = useRef<any>(null);

  const getAudioContext = () => {
    if (typeof window === 'undefined') return null;
    if (!audioContextRef.current) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        audioContextRef.current = new AudioContextClass();
      }
    }
    return audioContextRef.current;
  };

  // Web Audio API chimes
  const playChime = (type: 'connect' | 'disconnect') => {
    if (typeof window === 'undefined' || isMuted) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      if (type === 'connect') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
        
        osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.15); // G5
        gain.gain.setValueAtTime(0.08, ctx.currentTime + 0.15);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
        
        osc.start();
        osc.stop(ctx.currentTime + 0.4);
      } else {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(659.25, ctx.currentTime); // E5
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
        
        osc.frequency.setValueAtTime(329.63, ctx.currentTime + 0.15); // E4
        gain.gain.setValueAtTime(0.08, ctx.currentTime + 0.15);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
        
        osc.start();
        osc.stop(ctx.currentTime + 0.5);
      }
    } catch (e) {
      console.warn('AudioContext chime error:', e);
    }
  };

  const handleCallToggle = () => {
    if (isCalling) {
      setIsCalling(false);
    } else {
      // Initialize/resume AudioContext under user gesture
      try {
        const ctx = getAudioContext();
        if (ctx && ctx.state === 'suspended') {
          ctx.resume();
        }
      } catch (e) {
        console.warn('Click gesture AudioContext unlock error:', e);
      }
      
      // Speak silent utterance to unlock SpeechSynthesis under user gesture
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        try {
          window.speechSynthesis.cancel();
          const silent = new SpeechSynthesisUtterance('');
          silent.volume = 0;
          window.speechSynthesis.speak(silent);
        } catch (e) {
          console.warn('Click gesture SpeechSynthesis unlock error:', e);
        }
      }
      setIsCalling(true);
      setCallStep(0);
    }
  };

  const getVoiceLineText = (step: number) => {
    switch (step) {
      case 1: return 'Hola, bienvenido al entorno de desarrollo de ZYNDRIX. ¿Deseas probar la integración de voz?';
      case 2: return 'Hola, sí. Quería comprobar la latencia y la calidad de la síntesis.';
      case 3: return 'Excelente. Nuestra latencia es inferior a ciento cincuenta milisegundos. ¿Qué opinas de la fluidez actual?';
      case 4: return 'Se escucha increíblemente natural y rápido.';
      case 5: return 'Perfecto. Podemos conectar esta base a cualquier API o base de datos. ¿Te gustaría ver la documentación técnica?';
      case 6: return 'Sí, me interesa mucho. Muchas gracias.';
      case 7: return 'Genial, tienes el acceso en el panel lateral. ¡Disfruta probando el sandbox!';
      default: return '';
    }
  };

  const isStepAgent = (step: number) => {
    return step === 1 || step === 3 || step === 5 || step === 7;
  };

  const speakText = (text: string, isAgent: boolean, onEndCallback: () => void) => {
    if (speechTimeoutRef.current) {
      clearTimeout(speechTimeoutRef.current);
      speechTimeoutRef.current = null;
    }

    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      speechTimeoutRef.current = setTimeout(onEndCallback, 3000);
      return;
    }

    window.speechSynthesis.cancel();

    if (isMuted) {
      const duration = Math.max(2000, text.length * 45);
      speechTimeoutRef.current = setTimeout(onEndCallback, duration);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';

    const voices = window.speechSynthesis.getVoices();
    const langVoices = voices.filter(v => v.lang.toLowerCase().includes('es'));

    if (isAgent) {
      utterance.pitch = 1.12;
      utterance.rate = 1.02;
      const agentVoice = langVoices.find(v => 
        v.name.toLowerCase().includes('female') || 
        v.name.toLowerCase().includes('google') ||
        v.name.toLowerCase().includes('helena') || 
        v.name.toLowerCase().includes('zira') ||
        v.name.toLowerCase().includes('samantha')
      ) || langVoices[0];
      if (agentVoice) utterance.voice = agentVoice;
    } else {
      utterance.pitch = 0.92;
      utterance.rate = 0.98;
      const userVoice = langVoices.find(v => 
        v.name.toLowerCase().includes('male') || 
        v.name.toLowerCase().includes('david') || 
        v.name.toLowerCase().includes('sabina') ||
        (!v.name.toLowerCase().includes('zira') && !v.name.toLowerCase().includes('samantha') && !v.name.toLowerCase().includes('helena'))
      ) || langVoices[1] || langVoices[0];
      if (userVoice) utterance.voice = userVoice;
    }

    utterance.onend = () => {
      onEndCallback();
    };

    utterance.onerror = (e) => {
      console.warn('SpeechSynthesis error:', e);
      speechTimeoutRef.current = setTimeout(onEndCallback, 1000);
    };

    window.speechSynthesis.speak(utterance);
  };

  // Voice call simulator driving logic
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    if (isCalling && activeTab === 'voice') {
      if (callStep === 0) {
        playChime('connect');
        timeoutId = setTimeout(() => {
          setCallStep(1);
        }, 1500);
      } else if (callStep > 0 && callStep <= 7) {
        const textToSpeak = getVoiceLineText(callStep);
        const isAgent = isStepAgent(callStep);
        
        const handleSpeechEnd = () => {
          const delay = isAgent ? 800 : 700;
          timeoutId = setTimeout(() => {
            if (callStep < 7) {
              setCallStep(prev => prev + 1);
            } else {
              playChime('disconnect');
              timeoutId = setTimeout(() => {
                setIsCalling(false);
              }, 1500);
            }
          }, delay);
        };

        speakText(textToSpeak, isAgent, handleSpeechEnd);
      }
    } else {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (speechTimeoutRef.current) {
        clearTimeout(speechTimeoutRef.current);
        speechTimeoutRef.current = null;
      }
      setCallStep(0);
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [isCalling, callStep, activeTab]);

  // Clean up speech on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (speechTimeoutRef.current) {
        clearTimeout(speechTimeoutRef.current);
      }
    };
  }, []);

  // Scroll transcript box on step change
  useEffect(() => {
    if (transcriptContainerRef.current) {
      transcriptContainerRef.current.scrollTop = transcriptContainerRef.current.scrollHeight;
    }
  }, [callStep]);

  const toggleMute = () => {
    setIsMuted(prev => {
      const nextMuted = !prev;
      if (nextMuted && typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      return nextMuted;
    });
  };

  return (
    <section className="py-32 bg-slate-50 relative overflow-hidden" id="demo">
      {/* Decorative Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-[160px] pointer-events-none opacity-50" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl mx-auto mb-20 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-mono uppercase tracking-widest mb-6 shadow-sm">
            <Sparkles size={12} /> Live Simulation Environment
          </div>
          <h2 className="text-5xl md:text-7xl font-bold mb-8 tracking-tighter text-slate-900">Prueba la <span className="text-primary italic font-light">Potencia</span></h2>
          <p className="text-slate-500 text-xl font-medium">Experimenta la latencia ultra-baja y la inteligencia de nuestros sistemas en tiempo real.</p>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Dashboard Control */}
          <div className="flex justify-center gap-4 mb-12">
            <button 
              onClick={() => { setActiveTab('chat'); setIsCalling(false); }}
              className={`px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2 border ${activeTab === 'chat' ? 'bg-primary text-white border-primary shadow-[0_20px_40px_rgba(0,82,255,0.2)]' : 'bg-white text-slate-400 border-slate-200 hover:bg-slate-50'}`}
            >
              <MessageSquare size={18} /> Agente de Chat
            </button>
            <button 
              onClick={() => { setActiveTab('voice'); setIsCalling(false); }}
              className={`px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2 border ${activeTab === 'voice' ? 'bg-primary text-white border-primary shadow-[0_20px_40px_rgba(0,82,255,0.2)]' : 'bg-white text-slate-400 border-slate-200 hover:bg-slate-50'}`}
            >
              <Phone size={18} /> Agente de Voz
            </button>
          </div>

          <div className="grid md:grid-cols-5 gap-8 items-start">
            {/* Main Interactive Area */}
            <div className="md:col-span-3 bento-card p-1 bg-slate-200 shadow-xl rounded-[24px]">
              <div className="bg-white rounded-[20px] p-10 min-h-[500px] flex flex-col justify-center relative overflow-hidden">
                <AnimatePresence mode="wait">
                  {activeTab === 'chat' ? (
                    <motion.div 
                      key="chat-demo"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="space-y-6"
                    >
                      <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200 shadow-sm">
                          <span className="text-[10px] font-bold text-slate-600">U</span>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-2xl rounded-tl-none text-sm text-slate-700 max-w-[80%] border border-slate-100 shadow-sm">
                          "¿Cómo puede vuestra IA reducir el tiempo de respuesta de mi soporte técnico?"
                        </div>
                      </div>
                      
                      <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: chatStep >= 1 ? 1 : 0, x: chatStep >= 1 ? 0 : 20 }}
                        className="flex gap-4 justify-end"
                      >
                        <div className="bg-primary/5 p-4 rounded-2xl rounded-tr-none text-sm text-primary font-semibold max-w-[80%] border border-primary/10 shadow-sm">
                          "Nuestra infraestructura utiliza un motor de razonamiento que procesa el contexto en {'<'}150ms. Podemos automatizar el 85% de las consultas repetitivas con integración total en tu CRM."
                        </div>
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0 shadow-[0_8px_16px_rgba(0,82,255,0.3)]">
                          <Zap size={14} className="text-white" />
                        </div>
                      </motion.div>

                      {chatStep >= 2 && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="pt-6 border-t border-slate-100"
                        >
                          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-[0.2em] mb-4 font-bold">Internal Reasoning Process:</div>
                          <div className="flex gap-2">
                            <div className="px-2 py-1 rounded bg-emerald-50 border border-emerald-100 text-emerald-600 text-[9px] font-mono font-bold">CONTEXT_MATCH: 98%</div>
                            <div className="px-2 py-1 rounded bg-primary/5 border border-primary/10 text-primary text-[9px] font-mono font-bold">CRM_LOOKUP_ACTIVE</div>
                            <div className="px-2 py-1 rounded bg-slate-50 border border-slate-100 text-slate-400 text-[9px] font-mono">LATENCY: 142ms</div>
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="voice-demo"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="text-center flex flex-col items-center w-full"
                    >
                      <div className="relative w-48 h-48 mx-auto mb-10">
                        {/* Animated Voice Waves Image */}
                        <div className={`absolute inset-0 rounded-full overflow-hidden border border-slate-100 transition-all duration-700 ${isCalling ? 'scale-110 shadow-[0_20px_40px_rgba(0,82,255,0.2)]' : 'scale-100 bg-slate-50'}`}>
                          <Image src="/img/voice-waves.png" alt="Voice Waves" fill className="object-cover opacity-50 grayscale" />
                        </div>
                        {isCalling && (
                          <>
                            <div className="absolute inset-0 rounded-full border-2 border-primary animate-ping opacity-20" />
                            <div className="absolute inset-0 rounded-full border border-primary/40 animate-pulse scale-125 opacity-10" />
                          </>
                        )}
                        <div className="absolute inset-0 flex items-center justify-center">
                          {isCalling ? <Volume2 size={40} className="text-primary" /> : <Mic size={40} className="text-slate-200" />}
                        </div>
                      </div>

                      <h3 className="text-2xl font-bold mb-4 text-slate-900">{isCalling ? "Llamada en Progreso..." : "Asistente de Voz Enterprise"}</h3>
                      <p className="text-slate-500 text-sm mb-10 max-w-sm mx-auto font-medium">
                        Inicia una sesión de prueba para escuchar la clonación de voz y la fluidez conversacional.
                      </p>

                      {/* Live Call Script Box */}
                      {isCalling && (
                        <motion.div 
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="w-full max-w-xl p-6 rounded-2xl bg-slate-50 border border-slate-200 text-left font-mono text-xs space-y-4 shadow-inner mb-8"
                        >
                          <div className="flex items-center justify-between border-b border-slate-200 pb-2 text-[10px] text-slate-400">
                            <span>SESSION_ACTIVE // LIVE</span>
                            <span className="text-primary flex items-center gap-1.5 font-bold">
                              LATENCY: &lt;150ms
                              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
                            </span>
                          </div>
                          
                          <div ref={transcriptContainerRef} className="space-y-3 max-h-[140px] overflow-y-auto scroll-smooth">
                            {callStep >= 0 && (
                              <div className="text-slate-400">// Estableciendo canal seguro...</div>
                            )}
                            {callStep >= 1 && (
                              <div className="text-primary font-semibold">
                                Agente: "Hola, bienvenido al entorno de desarrollo de ZYNDRIX. ¿Deseas probar la integración de voz?"
                              </div>
                            )}
                            {callStep >= 2 && (
                              <div className="text-slate-600">
                                Tú: "Hola, sí. Quería comprobar la latencia y la calidad de la síntesis."
                              </div>
                            )}
                            {callStep >= 3 && (
                              <div className="text-primary font-semibold">
                                Agente: "Excelente. Nuestra latencia es inferior a ciento cincuenta milisegundos. ¿Qué opinas de la fluidez actual?"
                              </div>
                            )}
                            {callStep >= 4 && (
                              <div className="text-slate-600">
                                Tú: "Se escucha increíblemente natural y rápido."
                              </div>
                            )}
                            {callStep >= 5 && (
                              <div className="text-primary font-semibold">
                                Agente: "Perfecto. Podemos conectar esta base a cualquier API o base de datos. ¿Te gustaría ver la documentación técnica?"
                              </div>
                            )}
                            {callStep >= 6 && (
                              <div className="text-slate-600">
                                Tú: "Sí, me interesa mucho. Muchas gracias."
                              </div>
                            )}
                            {callStep >= 7 && (
                              <div className="text-primary font-semibold">
                                Agente: "Genial, tienes el acceso en el panel lateral. ¡Disfruta probando el sandbox!"
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}

                      {/* Trigger Actions */}
                      <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
                        <button 
                          onClick={handleCallToggle}
                          className={`w-full max-w-xs py-5 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all duration-500 border cursor-pointer ${isCalling ? 'bg-red-50 text-red-500 border-red-100 hover:bg-red-100' : 'bg-primary text-white border-primary shadow-[0_20px_40px_rgba(0,82,255,0.3)] hover:scale-105'}`}
                        >
                          {isCalling ? (
                            <> <X size={20} /> Finalizar Llamada </>
                          ) : (
                            <> <Play size={20} fill="currentColor" /> Iniciar Llamada de Prueba </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={toggleMute}
                          title={isMuted ? "Activar sonido" : "Silenciar"}
                          className={`p-5 rounded-2xl border transition-all duration-300 flex items-center justify-center cursor-pointer ${
                            isMuted 
                              ? 'bg-slate-100 text-slate-400 border-slate-200 hover:bg-slate-200' 
                              : 'bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 shadow-[0_0_15px_rgba(0,82,255,0.1)]'
                          }`}
                        >
                          {isMuted ? (
                            <VolumeX size={20} className="transition-transform hover:scale-110" />
                          ) : (
                            <Volume2 size={20} className="transition-transform hover:scale-110" />
                          )}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Sidebar Stats/Info */}
            <div className="md:col-span-2 space-y-6">
              <div className="bento-card p-8 bg-white border border-slate-100 shadow-lg rounded-[24px]">
                <h4 className="text-lg font-bold mb-6 flex items-center gap-2 text-slate-900">
                  <BarChart3 className="text-primary" size={20} /> Métricas en Tiempo Real
                </h4>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between text-[10px] font-mono text-slate-400 uppercase mb-2 font-bold">
                      <span>Inference Speed</span>
                      <span className="text-primary font-black">12ms</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-primary w-[94%] shadow-[0_0_10px_rgba(0,82,255,0.3)]" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[10px] font-mono text-slate-400 uppercase mb-2 font-bold">
                      <span>Sentiment Accuracy</span>
                      <span className="text-secondary font-black">98.4%</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-secondary w-[98%] shadow-[0_0_10px_rgba(255,51,102,0.3)]" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[10px] font-mono text-slate-400 uppercase mb-2 font-bold">
                      <span>Cost Reduction</span>
                      <span className="text-emerald-500 font-black">~64%</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 w-[64%] shadow-[0_0_10px_rgba(16,185,129,0.3)]" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bento-card p-8 bg-primary/5 border border-primary/10 relative group overflow-hidden rounded-[24px]">
                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
                <h4 className="text-lg font-bold mb-4 text-slate-900">¿Quieres probarlo con tus propios datos?</h4>
                <p className="text-slate-500 text-xs leading-relaxed mb-6 font-medium">
                  Configuramos una instancia de prueba personalizada integrada con tu stack tecnológico en menos de 48h.
                </p>
                <button className="text-primary font-black text-[10px] uppercase tracking-widest flex items-center gap-2 group-hover:gap-4 transition-all">
                  Consultar Disponibilidad <Play size={12} fill="currentColor" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Mock components to avoid missing imports if they were intended
const BarChart3 = ({ className, size }: { className?: string, size?: number }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>
);

