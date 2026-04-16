import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { BusinessCard } from '@/components/BusinessCard'; // Reusaremos componentes si es necesario, pero crearemos una vista especial
import Image from 'next/image';
import { ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

async function getLeadData(id: string) {
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error || !data) return null;
  return data;
}

export default async function DemoPage({ params }: { params: { id: string } }) {
  const lead = await getLeadData(params.id);

  if (!lead) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white pb-20">
      {/* Cinematic Pulse Header */}
      <nav className="fixed top-0 w-full z-50 px-8 py-6 flex justify-between items-center mix-blend-difference invert border-b border-black/5 backdrop-blur-sm">
        <div className="font-black text-xl tracking-tighter">ZYNDRIX <span className="font-light">STRATEGIC</span></div>
        <div className="flex gap-8 text-[10px] font-bold uppercase tracking-widest invisible md:visible">
          <span>{lead.category || 'Sector Premium'}</span>
          <span>Core Ops</span>
          <span>IA v4.2</span>
        </div>
        <a 
          href={`https://wa.me/34684411135?text=Hola Óscar, he visto el Prototipo Estratégico para ${encodeURIComponent(lead.name)} y quiero activarlo.`}
          className="bg-black text-white px-6 py-2.5 rounded-none text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-transform"
        >
          Solicitar Activación
        </a>
      </nav>

      {/* Audit Hero */}
      <section className="pt-40 pb-20 px-8 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-20 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-none bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest mb-6">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-none animate-pulse" />
              Auditoría Ejecutiva para {lead.name}
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-8">
              Tu ventaja <br/> estratégica.
            </h1>
            <p className="text-xl text-slate-500 max-w-md leading-relaxed mb-12 font-medium">
              Hemos detectado una <strong>brecha de conversión crítica</strong> en vuestra operativa en {lead.address || 'vuestra zona'}. Zyndrix no es una web; es el protocolo que la cierra.
            </p>
            
            <div className="flex flex-col gap-4">
               {/* Fuga de Crecimiento */}
               <div className="p-6 rounded-[2rem] bg-rose-50 border border-rose-100 relative overflow-hidden group">
                  <div className="absolute right-0 top-0 p-4 opacity-10 font-black text-8xl text-rose-500 select-none">!</div>
                  <div className="relative z-10">
                    <h4 className="text-rose-500 text-[10px] font-black uppercase tracking-widest mb-2">Fuga de Crecimiento Detectada</h4>
                    <p className="text-lg font-black text-rose-950 leading-tight">
                       {lead.growth_leak_label || 'Capacidad de conversión infrautilizada'}
                    </p>
                    <div className="mt-4 text-[10px] font-bold text-rose-400 uppercase tracking-widest">
                       Pérdida estimada: <span className="text-rose-600 underline">{lead.estimated_loss || 'Consultar con estratega'}</span>
                    </div>
                  </div>
               </div>

               {/* Puntuación de Velocidad */}
               <div className="p-6 rounded-[2rem] bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <div>
                    <h4 className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Score de Velocidad Actual</h4>
                    <p className="text-2xl font-black text-black">{lead.speed_score || '34'}/100</p>
                  </div>
                  <div className="h-12 w-24 bg-slate-200 rounded-none overflow-hidden relative">
                    <div 
                      className="absolute inset-y-0 left-0 bg-rose-500 transition-all duration-1000" 
                      style={{ width: `${lead.speed_score || 34}%` }} 
                    />
                  </div>
               </div>
            </div>
          </div>

          <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl shadow-black/10 border border-black/5 group">
            <div className="absolute inset-x-0 top-0 p-10 z-20 bg-gradient-to-b from-black/60 to-transparent text-white">
               <div className="text-[10px] font-black uppercase tracking-widest mb-2 opacity-70">Concepto de Rediseño</div>
               <div className="text-3xl font-black leading-tight italic">Reborn for High Frequency Ops.</div>
            </div>
            <Image 
              src={lead.screenshot_url || lead.og_image_url || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200'} 
              alt="Prototype Preview"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-1000 grayscale hover:grayscale-0"
            />
            <div className="absolute bottom-0 inset-x-0 p-10 z-20 bg-gradient-to-t from-black/80 to-transparent text-white">
               <div className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-50">Stack Propuesto</div>
               <div className="font-mono text-[9px] tracking-wider text-emerald-400">{lead.tech_stack || 'NEXT.JS 15 + AI DISPATCH ENGINE + CDN EDGE'}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Strategic Comparison */}
      <section className="py-32 px-8 max-w-7xl mx-auto">
         <div className="text-center mb-20">
            <h2 className="text-5xl font-black tracking-tighter uppercase italic">Protocolo vs Realidad</h2>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-4">Benchmark técnico de alta fidelidad</p>
         </div>

         <div className="grid md:grid-cols-2 gap-8">
            {/* Estado Actual */}
            <div className="glass p-10 rounded-[3.5rem] border-rose-100/50 bg-rose-50/10">
               <div className="flex justify-between items-start mb-8">
                  <div>
                     <div className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-1">Estado Actual</div>
                     <div className="text-2xl font-black tracking-tighter">Infraestructura Base</div>
                  </div>
                  <div className="px-3 py-1 rounded-none bg-rose-500/10 text-rose-500 text-[8px] font-black uppercase tracking-widest border border-rose-500/20">
                     Vulnerable
                  </div>
               </div>
               <div className="space-y-6">
                  <div className="flex justify-between items-center py-4 border-b border-rose-100">
                     <span className="text-xs font-bold text-slate-500 uppercase">Tiempo de Carga</span>
                     <span className="text-xs font-black text-rose-600">3.8s (Avg)</span>
                  </div>
                  <div className="flex justify-between items-center py-4 border-b border-rose-100">
                     <span className="text-xs font-bold text-slate-500 uppercase">Mobile UX</span>
                     <span className="text-xs font-black text-rose-600">Bajo Rendimiento</span>
                  </div>
                  <div className="flex justify-between items-center py-4 border-b border-rose-100">
                     <span className="text-xs font-bold text-slate-500 uppercase">Fuga de Leads</span>
                     <span className="text-xs font-black text-rose-600">~{lead.ltv_estimate ? '15%' : 'Crítica'}</span>
                  </div>
               </div>
            </div>

            {/* Estado Zyndrix */}
            <div className="bg-black text-white p-10 rounded-[3.5rem] shadow-2xl shadow-black/20 relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] -mr-32 -mt-32" />
               <div className="relative z-10">
                  <div className="flex justify-between items-start mb-8">
                     <div>
                        <div className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Zyndrix Protocol</div>
                        <div className="text-2xl font-black tracking-tighter">High Frequency Ops</div>
                     </div>
                     <div className="px-3 py-1 rounded-none bg-primary/20 text-primary text-[8px] font-black uppercase tracking-widest border border-primary/40 animate-pulse">
                        Active Agent
                     </div>
                  </div>
                  <div className="space-y-6">
                     <div className="flex justify-between items-center py-4 border-b border-white/10">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Despliegue Edge</span>
                        <span className="text-xs font-black text-primary">{"< 0.5s"}</span>
                     </div>
                     <div className="flex justify-between items-center py-4 border-b border-white/10">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">AI Integration</span>
                        <span className="text-xs font-black text-primary">Autopilot Active</span>
                     </div>
                     <div className="flex justify-between items-center py-4 border-b border-white/10">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Boost esperado</span>
                        <span className="text-xs font-black text-primary">+{lead.conversion_boost || '30'}%</span>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* Tactical Strategy Section */}
      <section className="bg-black text-white py-32 px-8 overflow-hidden rounded-[4rem] mx-4">
        <div className="max-w-7xl mx-auto">
           <div className="grid md:grid-cols-2 gap-20 items-center">
              <div>
                <h2 className="text-5xl font-black tracking-tighter mb-10 leading-none">El plan de <br/> dominancia local.</h2>
                <div className="space-y-8">
                   <div className="flex gap-6">
                      <div className="w-12 h-12 rounded-none bg-white/10 border border-white/20 flex items-center justify-center font-bold text-xl">01</div>
                      <div>
                        <h4 className="font-black text-sm uppercase tracking-widest mb-2 italic text-primary">Diagnóstico</h4>
                        <p className="text-slate-400 text-sm leading-relaxed">{lead.conversion_gap || 'Identificación de puntos ciegos en la captación de tráfico actual.'}</p>
                      </div>
                   </div>
                   <div className="flex gap-6">
                      <div className="w-12 h-12 rounded-none bg-white/10 border border-white/20 flex items-center justify-center font-bold text-xl">02</div>
                      <div>
                        <h4 className="font-black text-sm uppercase tracking-widest mb-2 italic text-primary">Inyección de IA</h4>
                        <p className="text-slate-400 text-sm leading-relaxed">{lead.strategy || 'Despliegue de un motor de reservas/captación con inteligencia conversacional.'}</p>
                      </div>
                   </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                 <div className="aspect-square glass-dark p-8 rounded-[2.5rem] border-white/10 flex flex-col justify-between">
                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Conversión</div>
                    <div className="text-5xl font-black">+40%</div>
                 </div>
                 <div className="aspect-square bg-white text-black p-8 rounded-[2.5rem] flex flex-col justify-between">
                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Latencia</div>
                    <div className="text-5xl font-black">-90%</div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* Tech Stack & Reliability Audit */}
      <section className="py-32 px-8 max-w-7xl mx-auto">
         <div className="flex flex-col md:flex-row gap-20 items-center">
            <div className="flex-1 space-y-8">
               <div className="w-16 h-1 bg-black mb-10" />
               <h2 className="text-4xl font-black tracking-tighter uppercase leading-[0.9]">Auditoría de Resiliencia y Stack Técnico</h2>
               <p className="text-slate-500 text-lg font-medium leading-relaxed">
                  Analizamos los cimientos digitales de <span className="text-black font-bold">{lead.name}</span>. No se trata solo de estética, sino de la capacidad técnica para escalar sin fricciones.
               </p>
               
               <div className="space-y-4 pt-6">
                  {['Arquitectura Edge-First', 'Seguridad Blindada', 'Latencia de Nueva Generación'].map(item => (
                     <div key={item} className="flex items-center gap-4">
                        <div className="w-5 h-5 rounded-none bg-black/5 flex items-center justify-center">
                           <ShieldCheck size={12} className="text-black" />
                        </div>
                        <span className="text-xs font-black uppercase tracking-widest text-slate-700">{item}</span>
                     </div>
                  ))}
               </div>
            </div>

            <div className="flex-1 w-full">
               <div className="glass p-12 rounded-[4rem] border-slate-200 relative overflow-hidden bg-slate-50/50">
                  <div className="grid grid-cols-2 gap-8 relative z-10">
                     {[
                        { label: 'Core System', value: lead.tech_stack || 'Standard Architecture', status: 'Optimizable' },
                        { label: 'Security Protocols', value: 'Edge Protection', status: 'Moderate' },
                        { label: 'CDN Global Relay', value: 'Cloudflare/Vercel Ready', status: 'Active' },
                        { label: 'AI Readiness Index', value: 'Alpha Stage', status: 'High Opportunity' }
                     ].map((item, i) => (
                        <div key={i} className="p-6 rounded-3xl bg-white border border-slate-100 shadow-sm">
                           <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-2">{item.label}</div>
                           <div className="text-xs font-black mb-1">{item.value}</div>
                           <div className={cn(
                              "text-[8px] font-bold uppercase",
                              item.status === 'Optimizable' || item.status === 'Moderate' ? 'text-blue-500' : 'text-emerald-500'
                           )}>{item.status}</div>
                        </div>
                     ))}
                  </div>
                  {/* Visual Decoration */}
                  <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-slate-200 rounded-full blur-3xl opacity-30" />
               </div>
            </div>
         </div>
      </section>

      {/* WhatsApp Activation CTA */}
      <footer className="py-40 text-center px-8">
         <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-7xl font-black tracking-tighter mb-12">¿Listo para activar <br/> {lead.name} v2.0?</h2>
            <p className="text-slate-500 mb-16 text-xl">Un estratega senior está asignado para tu implementación.</p>
            <a 
              href={`https://wa.me/34684411135?text=Hola Óscar, he visto la auditoría de ${encodeURIComponent(lead.name)} y quiero lanzarlo.`}
              className="inline-flex items-center gap-4 bg-black text-white px-12 py-7 rounded-none text-xl font-black uppercase tracking-wider hover:bg-slate-900 transition-colors shadow-2xl shadow-black/20"
            >
              Hablar con Óscar por WhatsApp
              <div className="w-2 h-2 bg-emerald-500 rounded-none animate-ping" />
            </a>
            <div className="mt-16 flex justify-center items-center gap-10 opacity-30 grayscale underline transition-all hover:grayscale-0">
               <span className="text-[10px] font-black uppercase tracking-widest">Protocolo de seguridad SSL/AES</span>
               <span className="text-[10px] font-black uppercase tracking-widest">Sla 99.9% Garantizado</span>
            </div>
         </div>
      </footer>
    </div>
  );
}
