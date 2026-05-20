"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, MessageSquare, Mic, Volume2, VolumeX, X, Play, Sparkles, BarChart3, ArrowRight, Check } from 'lucide-react';

interface EnterpriseDemosProps {
  dict: any;
  locale: string;
}

export const EnterpriseDemos = ({ dict, locale }: EnterpriseDemosProps) => {
  const [activeTab, setActiveTab] = useState<'voice' | 'chat'>('voice');
  const [isCalling, setIsCalling] = useState(false);
  const [callStep, setCallStep] = useState(0);
  const [chatStep, setChatStep] = useState(0);
  const [chatPromptIndex, setChatPromptIndex] = useState(-1);
  const [isMuted, setIsMuted] = useState(false);

  const speechTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const transcriptContainerRef = useRef<HTMLDivElement | null>(null);

  const handleScrollTo = (targetId: string) => {
    const element = document.getElementById(targetId);
    if (element) {
      const offset = 90; // height of sticky navbar
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      
      window.history.pushState(null, '', `#${targetId}`);
    }
  };

  const t = {
    badge: locale === 'es' ? 'SIMULADOR_CORE // INTERACTIVE PLAYGROUND' : 'SIMULADOR_CORE // INTERACTIVE PLAYGROUND',
    titlePrefix: locale === 'es' ? 'Prueba la ' : 'Experience the ',
    titleHighlighted: locale === 'es' ? 'Potencia en Directo' : 'Power Live',
    subtitle: locale === 'es' ? 'Experimenta la latencia real y la precisión de inferencia de nuestros agentes autónomos en este sandbox en tiempo real.' : 'Experience real latency and inference accuracy of our autonomous agents in this real-time sandbox.',
    
    tabVoice: locale === 'es' ? 'Agente de Voz AI' : 'AI Voice Agent',
    tabChat: locale === 'es' ? 'Workspace de Chat' : 'Chat Workspace',
    
    voiceTitleActive: locale === 'es' ? 'Agente de Voz en Directo' : 'Live Voice Agent Session',
    voiceTitleIdle: locale === 'es' ? 'Simulador de Voz Omnicanal' : 'Omnichannel Voice Simulator',
    voiceDescActive: locale === 'es' ? 'Escucha el procesado secuencial del diálogo en base a inferencias continuas.' : 'Listen to the sequential dialogue processing powered by continuous inference.',
    voiceDescIdle: locale === 'es' ? 'Establece una llamada simulada segura para analizar la velocidad de habla y fluidez.' : 'Establish a simulated secure call to analyze speech speed and conversational flow.',
    
    btnEndCall: locale === 'es' ? 'Finalizar Sesión' : 'End Session',
    btnStartCall: locale === 'es' ? 'Iniciar Llamada de Prueba' : 'Start Demo Call',
    
    chatPromptTitle: locale === 'es' ? 'Selector de Prompt Corporativo' : 'Enterprise Prompt Template Selector',
    chatPromptSubtitle: locale === 'es' ? 'Haz clic en una plantilla para enviar una consulta al Agente Corporativo.' : 'Click any template to dispatch a query to the Corporate Agent.',
    chatIdleText: locale === 'es' ? '// Esperando interacción del selector de prompt superior...' : '// Awaiting interaction from prompt template selector above...',
    chatThinkingText: locale === 'es' ? 'Pensando en base a base vectorial...' : 'Querying vector database...',
    
    metricsTitle: locale === 'es' ? 'Métricas de Inferencia' : 'Inference Metrics',
    metricSpeed: locale === 'es' ? 'VELOCIDAD DE INFERENCIA' : 'INFERENCE SPEED',
    metricAccuracy: locale === 'es' ? 'PRECISIÓN DE CONTEXTO' : 'CONTEXT ACCURACY',
    metricCost: locale === 'es' ? 'REDUCCIÓN DE COSTE' : 'COST REDUCTION',
    
    bullet1: locale === 'es' ? 'RESPUESTA AUDIO EN TIEMPO REAL' : 'REAL-TIME AUDIO RESPONSE',
    bullet2: locale === 'es' ? 'CLONACIÓN DE VOZ DE ALTO PARECIDO' : 'HIGH-FIDELITY VOICE CLONING',
    bullet3: locale === 'es' ? 'MÁXIMA RETENCIÓN DE CONTEXTO' : 'MAXIMUM CONTEXT RETENTION',
    
    ctaTitle: locale === 'es' ? '¿Quieres un sandbox corporativo propio?' : 'Want your own corporate sandbox?',
    ctaDesc: locale === 'es' ? 'Montamos una prueba piloto integrada con tu base de datos empresarial y sistemas core en 48 horas sin coste.' : 'We build a custom pilot integrated with your enterprise database and core systems in 48 hours, free of charge.',
    ctaBtn: locale === 'es' ? 'Probar con mis Datos' : 'Test with my Data'
  };

  const chatPrompts = [
    {
      title: locale === 'es' ? "Agendar Demo SAP" : "Schedule SAP Integration",
      user: locale === 'es' ? "¿Tienen integración con SAP para extraer facturas de forma autónoma?" : "Do you integrate with SAP to extract invoices autonomously?",
      bot: locale === 'es' ? "Sí, disponemos de conectores RFC y OData nativos. Nuestro agente extrae la factura en <150ms, valida los campos mediante IA y actualiza el estado de pago de forma transparente." : "Yes, we provide native RFC and OData connectors. Our agent retrieves the invoice in <150ms, validates fields using AI, and updates payment status seamlessly.",
      steps: ["TRANSCRIPTION: OK", "ERP_LOOKUP: SAP_RFC_STABLE", "LATENCY: 142ms"]
    },
    {
      title: locale === 'es' ? "Calcular ROI" : "Calculate ROI",
      user: locale === 'es' ? "Tengo un call center de 20 personas. ¿Cuánto me costaría automatizar el 60%?" : "I have a 20-agent call center. What does it cost to automate 60% of the volume?",
      bot: locale === 'es' ? "Para un volumen promedio de 20,000 llamadas al mes, la automatización del 60% reduce el coste operativo de $12.5k a menos de $2.8k mensuales, con un ROI positivo desde el mes 1." : "For an average volume of 20,000 calls per month, automating 60% reduces operational costs from $12.5k to under $2.8k monthly, achieving positive ROI from month 1.",
      steps: ["ANALYTICS: LOADED", "PROJECTION: ACTIVE", "LATENCY: 118ms"]
    },
    {
      title: locale === 'es' ? "Clonación de Voz" : "Voice Cloning",
      user: locale === 'es' ? "¿Puedo clonar la voz de mi agente estrella para que atienda las llamadas?" : "Can I clone the voice of my top-performing agent to handle calls?",
      bot: locale === 'es' ? "Absolutamente. Necesitamos una muestra de audio limpia de solo 5 minutos. Nuestra red generativa clona la prosodia, tono y estilo de habla con un parecido del 99.2%." : "Absolutely. We only need a clean 5-minute audio sample. Our generative neural network clones the prosody, tone, and speaking style with 99.2% accuracy.",
      steps: ["TTS_REGISTRY: OK", "SPEECH_CLONE: ACTIVE", "LATENCY: 180ms"]
    }
  ];

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
    if (locale === 'es') {
      switch (step) {
        case 1: return 'Hola, gracias por llamar a soporte premium ZYNDRIX. ¿En qué puedo ayudarte hoy?';
        case 2: return 'Hola, quería consultar la viabilidad de implementar agentes de voz.';
        case 3: return 'Excelente. Nuestras llamadas tienen una latencia inferior a 800ms. ¿Para qué volumen de llamadas diarias lo necesitas?';
        case 4: return 'Aproximadamente unas 1000 llamadas al día.';
        case 5: return 'Perfecto, con ese volumen el ahorro estimado es del 68%. ¿Te gustaría agendar una auditoría técnica mañana a las 10:00?';
        case 6: return 'Sí, me viene muy bien a esa hora. Muchas gracias.';
        case 7: return 'Genial, queda registrado. Te llegará una confirmación por correo. ¡Que tengas un excelente día!';
        default: return '';
      }
    } else {
      switch (step) {
        case 1: return 'Hello, thank you for calling ZYNDRIX premium support. How can I help you today?';
        case 2: return 'Hello, I wanted to inquire about the feasibility of implementing voice agents.';
        case 3: return 'Excellent. Our calls feature under 800ms latency. What daily call volume are you planning for?';
        case 4: return 'Approximately 1,000 calls per day.';
        case 5: return 'Perfect, with that volume the estimated savings is 68%. Would you like to schedule a technical feasibility audit tomorrow at 10:00?';
        case 6: return 'Yes, that time works perfectly. Thank you.';
        case 7: return 'Great, it is scheduled. You will receive a confirmation email. Have a great day!';
        default: return '';
      }
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
    utterance.lang = locale === 'es' ? 'es-ES' : 'en-US';

    const voices = window.speechSynthesis.getVoices();
    const targetLang = locale === 'es' ? 'es' : 'en';
    const langVoices = voices.filter(v => v.lang.toLowerCase().includes(targetLang));

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
    
    if (isCalling) {
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
  }, [isCalling, callStep]);

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

  // Tab routing listener
  useEffect(() => {
    const handleSelectTabEvent = (e: Event) => {
      const customEvent = e as CustomEvent<'voice' | 'chat'>;
      if (customEvent.detail === 'voice' || customEvent.detail === 'chat') {
        setActiveTab(customEvent.detail);
        setIsCalling(false);
      }
    };
    window.addEventListener('select-demo-tab', handleSelectTabEvent);

    const handleHash = () => {
      if (window.location.hash === '#demos-voice') {
        setActiveTab('voice');
        setIsCalling(false);
      } else if (window.location.hash === '#demos-chat') {
        setActiveTab('chat');
        setIsCalling(false);
      }
    };
    window.addEventListener('hashchange', handleHash);
    handleHash();

    return () => {
      window.removeEventListener('select-demo-tab', handleSelectTabEvent);
      window.removeEventListener('hashchange', handleHash);
    };
  }, []);

  // Chat conversation prompt selector helper
  const handleChatPromptClick = (index: number) => {
    setChatPromptIndex(index);
    setChatStep(1);
    const timer = setTimeout(() => {
      setChatStep(2);
    }, 1500);
    return () => clearTimeout(timer);
  };

  return (
    <section id="demos" className="py-32 bg-black relative overflow-hidden">
      {/* Laser Border bottom */}
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-secondary/50 to-transparent"></div>
      
      {/* Mesh Background */}
      <div className="absolute inset-0 bg-grid-mesh opacity-[0.02] pointer-events-none" />

      {/* Futuristic radial lights */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-secondary/5 rounded-full blur-[160px] pointer-events-none opacity-30" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/10 border border-secondary/30 text-secondary text-[10px] font-mono tracking-widest uppercase mb-6 animate-float">
            <Sparkles size={12} className="animate-pulse" /> {t.badge}
          </div>
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white leading-none tracking-tight">
            {locale === 'es' ? (
              <>
                Prueba la <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-primary italic font-light">{t.titleHighlighted}</span>
              </>
            ) : (
              <>
                {t.titlePrefix}<span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-primary italic font-light">{t.titleHighlighted}</span>
              </>
            )}
          </h2>
          <p className="text-xl text-slate-400 font-light">
            {t.subtitle}
          </p>
        </div>

        {/* Playroom Tabs Control */}
        <div className="flex justify-center gap-4 mb-16">
          <button
            onClick={() => { setActiveTab('voice'); setIsCalling(false); }}
            className={`px-8 py-4 rounded-2xl font-bold transition-all flex items-center gap-3 border ${
              activeTab === 'voice' 
                ? 'bg-primary text-white border-primary/50 shadow-[0_15px_30px_rgba(0,82,255,0.3)]' 
                : 'bg-[#0B0F17] text-slate-400 border-white/10 hover:border-white/20 hover:text-white'
            }`}
          >
            <Phone size={18} />
            {t.tabVoice}
          </button>
          <button
            onClick={() => { setActiveTab('chat'); setIsCalling(false); setChatPromptIndex(-1); setChatStep(0); }}
            className={`px-8 py-4 rounded-2xl font-bold transition-all flex items-center gap-3 border ${
              activeTab === 'chat' 
                ? 'bg-primary text-white border-primary/50 shadow-[0_15px_30px_rgba(0,82,255,0.3)]' 
                : 'bg-[#0B0F17] text-slate-400 border-white/10 hover:border-white/20 hover:text-white'
            }`}
          >
            <MessageSquare size={18} />
            {t.tabChat}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          
          {/* LEFT PANEL: Interactive Screen */}
          <div className="lg:col-span-8">
            <div className="p-[1px] bg-gradient-to-b from-white/10 via-transparent to-white/5 rounded-[36px]">
              <div className="bg-[#07090E] rounded-[35px] p-8 md:p-12 min-h-[520px] flex flex-col justify-center relative overflow-hidden border border-white/5">
                <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
                
                <AnimatePresence mode="wait">
                  
                  {/* TAB 1: VOICE AGENT SIMULATOR */}
                  {activeTab === 'voice' ? (
                    <motion.div
                      key="voice-tab"
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      className="text-center space-y-8 flex flex-col items-center"
                    >
                      <div className="relative w-44 h-44 flex items-center justify-center">
                        
                        {/* Audio Ring Glowing pulses */}
                        {isCalling && (
                          <>
                            <div className="absolute inset-0 rounded-full border-4 border-secondary animate-ping opacity-25" />
                            <div className="absolute -inset-4 rounded-full border border-secondary/40 animate-pulse scale-110 opacity-10" />
                            <div className="absolute -inset-8 rounded-full border border-primary/20 animate-pulse scale-125 opacity-5" />
                          </>
                        )}
                        
                        {/* Core Phone Sphere */}
                        <div className={`w-36 h-36 rounded-full border transition-all duration-700 flex items-center justify-center ${
                          isCalling 
                            ? 'bg-secondary/10 border-secondary shadow-[0_0_35px_rgba(0,229,255,0.25)] scale-105' 
                            : 'bg-white/5 border-white/10 hover:border-white/20'
                        }`}>
                          {isCalling ? (
                            <Volume2 size={42} className="text-secondary animate-bounce-slow" />
                          ) : (
                            <Mic size={42} className="text-slate-400 group-hover:text-white" />
                          )}
                        </div>
                      </div>

                      {/* Caller State Information */}
                      <div className="space-y-3 max-w-lg">
                        <h3 className="text-2xl font-bold text-white">
                          {isCalling ? t.voiceTitleActive : t.voiceTitleIdle}
                        </h3>
                        <p className="text-sm text-slate-400 leading-relaxed max-w-sm mx-auto font-light">
                          {isCalling ? t.voiceDescActive : t.voiceDescIdle}
                        </p>
                      </div>

                      {/* Live Call Script Box */}
                      {isCalling && (
                        <motion.div 
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="w-full max-w-xl p-6 rounded-2xl bg-black/60 border border-white/10 text-left font-mono text-xs space-y-4 shadow-inner"
                        >
                          <div className="flex items-center justify-between border-b border-white/5 pb-2 text-[10px] text-slate-500">
                            <span>SIP_SESSION_ACTIVE</span>
                            <span className="text-secondary flex items-center gap-1.5">
                              LATENCY: &lt;740ms
                              <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-ping" />
                            </span>
                          </div>
                          
                          <div ref={transcriptContainerRef} className="space-y-3 max-h-[140px] overflow-y-auto scroll-smooth">
                            {callStep >= 0 && (
                              <div className="text-slate-500">// {locale === 'es' ? "Estableciendo conexión segura..." : "Establishing secure link..."}</div>
                            )}
                            {callStep >= 1 && (
                              <div className="text-secondary font-semibold">
                                {locale === 'es' 
                                  ? 'Agente: "Hola, gracias por llamar a soporte premium ZYNDRIX. ¿En qué puedo ayudarte hoy?"' 
                                  : 'Agent: "Hello, thank you for calling ZYNDRIX premium support. How can I help you today?"'}
                              </div>
                            )}
                            {callStep >= 2 && (
                              <div className="text-slate-300">
                                {locale === 'es' 
                                  ? 'Tú: "Hola, quería consultar la viabilidad de implementar agentes de voz."' 
                                  : 'You: "Hello, I wanted to inquire about the feasibility of implementing voice agents."'}
                              </div>
                            )}
                            {callStep >= 3 && (
                              <div className="text-secondary font-semibold">
                                {locale === 'es' 
                                  ? 'Agente: "Excelente. Nuestras llamadas tienen una latencia inferior a 800ms. ¿Para qué volumen de llamadas diarias lo necesitas?"' 
                                  : 'Agent: "Excellent. Our calls feature under 800ms latency. What daily call volume are you planning for?"'}
                              </div>
                            )}
                            {callStep >= 4 && (
                              <div className="text-slate-300">
                                {locale === 'es' 
                                  ? 'Tú: "Aproximadamente unas 1000 llamadas al día."' 
                                  : 'You: "Approximately 1,000 calls per day."'}
                              </div>
                            )}
                            {callStep >= 5 && (
                              <div className="text-secondary font-semibold">
                                {locale === 'es' 
                                  ? 'Agente: "Perfecto, con ese volumen el ahorro estimado es del 68%. ¿Te gustaría agendar una auditoría técnica mañana a las 10:00?"' 
                                  : 'Agent: "Perfect, with that volume the estimated savings is 68%. Would you like to schedule a technical feasibility audit tomorrow at 10:00?"'}
                              </div>
                            )}
                            {callStep >= 6 && (
                              <div className="text-slate-300">
                                {locale === 'es' 
                                  ? 'Tú: "Sí, me viene muy bien a esa hora. Muchas gracias."' 
                                  : 'You: "Yes, that time works perfectly. Thank you."'}
                              </div>
                            )}
                            {callStep >= 7 && (
                              <div className="text-secondary font-semibold">
                                {locale === 'es' 
                                  ? 'Agente: "Genial, queda registrado. Te llegará una confirmación por correo. ¡Que tengas un excelente día!"' 
                                  : 'Agent: "Great, it is scheduled. You will receive a confirmation email. Have a great day!"'}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}

                      {/* Trigger Actions */}
                      <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
                        <button
                          onClick={handleCallToggle}
                          className={`px-12 py-5 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all duration-500 border w-full max-w-xs cursor-pointer ${
                            isCalling 
                              ? 'bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500/20' 
                              : 'bg-primary text-white border-primary/50 shadow-[0_20px_40px_rgba(0,82,255,0.25)] hover:scale-105 hover:shadow-[0_20px_40px_rgba(0,82,255,0.4)]'
                          }`}
                        >
                          {isCalling ? (
                            <>
                              <X size={20} />
                              {t.btnEndCall}
                            </>
                          ) : (
                            <>
                              <Play size={18} fill="currentColor" />
                              {t.btnStartCall}
                            </>
                          )}
                        </button>
                        
                        <button
                          type="button"
                          onClick={toggleMute}
                          title={isMuted ? (locale === 'es' ? "Activar sonido" : "Unmute sound") : (locale === 'es' ? "Silenciar" : "Mute sound")}
                          className={`p-5 rounded-2xl border transition-all duration-300 flex items-center justify-center cursor-pointer ${
                            isMuted 
                              ? 'bg-slate-900/40 text-slate-500 border-white/5 hover:text-slate-300 hover:border-white/10' 
                              : 'bg-[#00E5FF]/10 text-[#00E5FF] border-[#00E5FF]/30 hover:bg-[#00E5FF]/20 shadow-[0_0_15px_rgba(0,229,255,0.1)]'
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
                  ) : (
                    
                    /* TAB 2: CHAT WORKSPACE SIMULATOR */
                    <motion.div
                      key="chat-tab"
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      className="space-y-6"
                    >
                      <div className="text-center mb-6">
                        <h3 className="text-xl font-bold text-white mb-2">{t.chatPromptTitle}</h3>
                        <p className="text-xs text-slate-400 font-light">{t.chatPromptSubtitle}</p>
                      </div>

                      {/* Prewritten prompt buttons grid */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
                        {chatPrompts.map((p, index) => (
                          <button
                            key={index}
                            onClick={() => handleChatPromptClick(index)}
                            className={`p-4 rounded-xl text-left border text-xs transition-all cursor-pointer ${
                              chatPromptIndex === index 
                                ? 'bg-primary/20 border-primary text-white shadow-lg' 
                                : 'bg-black/40 border-white/10 text-slate-300 hover:bg-[#0B0F17] hover:border-white/20'
                            }`}
                          >
                            <div className="font-bold mb-1 text-slate-200">{p.title}</div>
                            <div className="text-[10px] text-slate-400 truncate">{p.user}</div>
                          </button>
                        ))}
                      </div>

                      {/* Chat dialog simulation frame */}
                      <div className="min-h-[220px] p-6 rounded-2xl bg-black/60 border border-white/5 space-y-4">
                        {chatPromptIndex === -1 ? (
                          <div className="h-[180px] flex items-center justify-center text-slate-500 font-mono text-xs italic">
                            {t.chatIdleText}
                          </div>
                        ) : (
                          <div className="space-y-4 text-xs font-mono">
                            
                            {/* User bubble */}
                            <div className="flex gap-3">
                              <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center shrink-0 text-[10px] text-white">U</div>
                              <div className="bg-[#0B0F17] p-3.5 rounded-xl rounded-tl-none border border-white/5 text-slate-300 max-w-[85%]">
                                {chatPrompts[chatPromptIndex].user}
                              </div>
                            </div>

                            {/* Bot reasoning / Response logic */}
                            {chatStep >= 1 && (
                              <motion.div 
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex gap-3 justify-end"
                              >
                                <div className="bg-primary/10 p-3.5 rounded-xl rounded-tr-none border border-primary/20 text-slate-100 max-w-[85%]">
                                  {chatStep === 1 ? (
                                    <span className="flex items-center gap-2 text-slate-400">
                                      <span className="w-2 h-2 bg-primary rounded-full animate-ping" />
                                      {t.chatThinkingText}
                                    </span>
                                  ) : (
                                    chatPrompts[chatPromptIndex].bot
                                  )}
                                </div>
                                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center shrink-0 text-[10px] text-white">AI</div>
                              </motion.div>
                            )}

                            {/* Tech steps */}
                            {chatStep >= 2 && (
                              <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="pt-4 border-t border-white/5 flex flex-wrap gap-2 text-[9px] text-slate-400 uppercase tracking-widest font-bold"
                              >
                                <span>REASONING:</span>
                                {chatPrompts[chatPromptIndex].steps.map((st, sidx) => (
                                  <span key={sidx} className="px-2 py-0.5 rounded bg-[#0B0F17] border border-white/10 text-secondary">{st}</span>
                                ))}
                              </motion.div>
                            )}

                          </div>
                        )}
                      </div>

                    </motion.div>
                  )}

                </AnimatePresence>

              </div>
            </div>
          </div>

          {/* RIGHT PANEL: Live analytics dashboard mockup */}
          <div className="lg:col-span-4 flex flex-col justify-between gap-6">
            
            {/* Real-time latency chart widget */}
            <div className="card-surface bg-[#0B0F17] border border-white/10 p-8 rounded-[28px] shadow-2xl flex-1 flex flex-col justify-between">
              <div>
                <h4 className="text-lg font-bold mb-6 flex items-center gap-2 text-white">
                  <BarChart3 className="text-secondary" size={20} />
                  {t.metricsTitle}
                </h4>
                
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-2">
                      <span>{t.metricSpeed}</span>
                      <span className="text-secondary font-bold">12ms // EXTREME</span>
                    </div>
                    <div className="h-2 bg-black/40 border border-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-secondary to-primary w-[95%] shadow-[0_0_15px_#00E5FF]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-2">
                      <span>{t.metricAccuracy}</span>
                      <span className="text-accent font-bold">99.1% // SECURE</span>
                    </div>
                    <div className="h-2 bg-black/40 border border-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-accent w-[99%] shadow-[0_0_15px_#10B981]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-2">
                      <span>{t.metricCost}</span>
                      <span className="text-white font-bold">~64% // OPTIMIZED</span>
                    </div>
                    <div className="h-2 bg-black/40 border border-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-white w-[64%] shadow-[0_0_15px_rgba(255,255,255,0.3)]" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Verified check badge list */}
              <div className="pt-8 border-t border-white/5 space-y-3 font-mono text-[10px] text-slate-400">
                <div className="flex items-center gap-2">
                  <Check size={12} className="text-accent" />
                  {t.bullet1}
                </div>
                <div className="flex items-center gap-2">
                  <Check size={12} className="text-accent" />
                  {t.bullet2}
                </div>
                <div className="flex items-center gap-2">
                  <Check size={12} className="text-accent" />
                  {t.bullet3}
                </div>
              </div>

            </div>

            {/* Sandbox CTA Card */}
            <div className="card-surface bg-[#0B0F17] border border-white/10 p-8 rounded-[28px] relative overflow-hidden group">
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
              <h4 className="text-lg font-bold text-white mb-2">{t.ctaTitle}</h4>
              <p className="text-slate-400 text-xs leading-relaxed mb-6 font-light">
                {t.ctaDesc}
              </p>
              <button 
                onClick={() => handleScrollTo('contacto')}
                className="text-secondary font-bold text-[10px] tracking-widest uppercase flex items-center gap-2 group-hover:gap-4 transition-all cursor-pointer"
              >
                {t.ctaBtn} <ArrowRight size={12} />
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
