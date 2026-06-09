'use client';

import { Check, Rocket, ShieldCheck, ArrowRight, Hexagon } from 'lucide-react';
import Link from 'next/link';

export default function SecuredPage() {
  return (
    <div className="min-h-screen bg-[#0A0F1C] text-foreground flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* Background Dots Pattern */}
      <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

      <div className="relative z-10 w-full max-w-md flex flex-col items-center mt-12 mb-8">
        
        {/* Animated Checkmark */}
        <div className="relative mb-10 w-32 h-32 flex items-center justify-center animate-scale-in">
          <div className="absolute inset-0 rounded-full border-2 border-[#E3FF00]/20 animate-ping" style={{ animationDuration: '3s' }} />
          <div className="absolute inset-4 rounded-full border-2 border-[#E3FF00]/40 animate-ping" style={{ animationDuration: '3s', animationDelay: '0.5s' }} />
          <div className="relative w-20 h-20 bg-[#E3FF00] rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(227,255,0,0.4)]">
            <Check className="w-10 h-10 text-[#0A0F1C]" strokeWidth={4} />
          </div>
        </div>

        <h1 className="text-3xl font-black text-white mb-4 tracking-tight animate-slide-up" style={{ animationDelay: '0.2s' }}>
          Purchase Secured
        </h1>
        
        <p className="text-sm text-white/60 text-center font-medium leading-relaxed max-w-[280px] mb-12 animate-slide-up" style={{ animationDelay: '0.3s' }}>
          Your high-octane gear has been validated and is currently awaiting deployment from the main hangar.
        </p>

        {/* Tracking Card */}
        <div className="w-full rounded-[2rem] bg-[#111625] border border-white/5 p-6 mb-12 relative overflow-hidden shadow-2xl animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <div className="absolute -right-6 -top-6 text-white/5 rotate-12">
            <ShieldCheck className="w-40 h-40" />
          </div>
          
          <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4 relative z-10">
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Transaction ID</span>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#C3C6FF]">UX-7729-DELTA</span>
          </div>

          <div className="flex gap-4 items-center mb-6 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-[#2A3455] flex items-center justify-center shrink-0">
              <Rocket className="w-6 h-6 text-[#C3C6FF]" />
            </div>
            <div>
              <h3 className="font-bold text-white mb-1">Orbital Freight</h3>
              <p className="text-[11px] text-white/60 font-medium">Estimated arrival: Within 48 Lunar Cycles</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#0A0F1C] border border-white/5 flex items-center justify-between relative z-10">
            <div>
              <div className="text-[8px] font-black uppercase tracking-widest text-muted-foreground mb-1">Secured By</div>
              <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-white">
                <ShieldCheck className="w-3.5 h-3.5 text-[#E3FF00]" /> Uniexo Prime
              </div>
            </div>
            <div className="flex -space-x-2">
              <div className="w-6 h-6 rounded-full bg-slate-800 border-2 border-[#111625]" />
              <div className="w-6 h-6 rounded-full bg-slate-700 border-2 border-[#111625]" />
              <div className="w-6 h-6 rounded-full bg-[#2A3455] border-2 border-[#111625] flex items-center justify-center text-[8px] font-bold text-white">+3</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full space-y-4 animate-slide-up" style={{ animationDelay: '0.5s' }}>
          <button className="w-full py-4 rounded-2xl bg-[#C3C6FF] text-black text-sm font-black uppercase tracking-widest text-center hover:bg-white transition-colors shadow-[0_0_20px_rgba(195,198,255,0.3)] tap-feedback flex justify-center items-center gap-2">
            <Rocket className="w-4 h-4" /> View Order Tracking
          </button>
          <Link href="/" className="w-full py-4 rounded-2xl bg-transparent border border-white/10 text-white text-sm font-black uppercase tracking-widest text-center hover:bg-white/5 transition-colors tap-feedback flex justify-center items-center gap-2">
            Return to Discovery Hub <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        
        <div className="mt-12 flex items-center gap-2 text-[8px] font-black text-white/20 uppercase tracking-widest animate-fade-in" style={{ animationDelay: '0.8s' }}>
          <Hexagon className="w-3 h-3" /> Uniexo Protocol V4.2
        </div>

      </div>
    </div>
  );
}
