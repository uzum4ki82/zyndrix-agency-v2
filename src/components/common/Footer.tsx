'use client';

import Link from 'next/link';

export const Footer = ({ dict, locale }: { dict: any, locale: string }) => (
    <footer className="py-12 md:py-16 px-10 border-t border-primary/5 overflow-hidden bg-white relative">
        <div className="arch-grid opacity-10" />
        
        <div className="max-w-7xl mx-auto flex flex-col gap-10 md:gap-12 relative z-10">
            <div className="flex flex-col lg:flex-row justify-between items-center lg:items-start gap-10">
                <div className="flex flex-col gap-6 items-center lg:items-start max-w-sm">
                    <Link href="/" className="flex items-center gap-4 group">
                          <div className="border border-primary/10 p-2 bg-slate-50 group-hover:border-primary transition-all">
                            <span className="text-xl font-heading font-black tracking-tighter text-primary uppercase">Z</span>
                          </div>
                          <span className="text-xl font-heading font-black tracking-[0.2em] uppercase text-primary">ZYNDRIX</span>
                    </Link>
                    <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-secondary/60 text-center lg:text-left leading-relaxed">
                        {dict.desc}
                    </p>
                    
                    <div className="flex gap-4 pt-4 border-t border-primary/5 w-full justify-center lg:justify-start">
                        {[
                          { l: "HQ", v: "BARCELONA" },
                          { l: "FOUNDED", v: "2024" }
                        ].map((item, idx) => (
                           <div key={idx} className="flex flex-col">
                              <span className="text-[7px] font-black text-secondary/30 uppercase tracking-widest">{item.l}</span>
                              <span className="text-[9px] font-bold text-primary uppercase">{item.v}</span>
                           </div>
                        ))}
                    </div>
                </div>

                <div className="flex-1 flex flex-wrap justify-center lg:justify-end gap-10 md:gap-16">
                     {dict.sections ? Object.values(dict.sections).map((col: any, i: number) => (
                        <div key={i} className="flex flex-col gap-4 text-center lg:text-left min-w-[120px]">
                            <div className="text-[9px] font-black uppercase tracking-[0.4em] text-primary/30 border-b border-primary/5 pb-2 mb-2">{col.title}</div>
                            <div className="flex flex-col gap-2">
                               {col.links.map((link: any, j: number) => (
                                  <Link key={j} href={link.href} className="text-[9px] font-bold uppercase tracking-[0.1em] text-secondary/60 hover:text-primary transition-all">{link.label}</Link>
                               ))}
                            </div>
                        </div>
                     )) : null}
                </div>
            </div>

            <div className="pt-8 border-t border-primary/5 flex flex-col md:flex-row justify-between items-center gap-6 opacity-40">
                <div className="flex items-center gap-8">
                   <div className="text-[7px] font-black uppercase tracking-[0.5em] text-primary">UNIT_ID: Z-HQ-BCN</div>
                   <div className="text-[7px] font-black uppercase tracking-[0.5em] text-primary">BUILD: 2.0.42_PROD</div>
                </div>
                
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3">
                       <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                       <span className="text-[7px] font-black uppercase tracking-[0.5em] text-primary">NET_AUTH_VERIFIED</span>
                    </div>
                    <div className="w-12 h-px bg-primary/20" />
                    <span className="text-[7px] font-black uppercase tracking-[0.2em] text-primary/40">© 2026 ZYNDRIX</span>
                </div>
            </div>
        </div>
    </footer>



);
