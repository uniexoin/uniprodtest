'use client';

import { ArrowLeft, Bell, MapPin, Wallet, Bitcoin, CreditCard, ShieldCheck, Box } from 'lucide-react';
import Link from 'next/link';
import { useMarketplaceItem } from '@/hooks/use-marketplace-items';

export default function CheckoutPage({ params }: { params: { id: string } }) {
  const { data: item, isLoading } = useMarketplaceItem(params.id);

  if (isLoading || !item) {
    return (
      <div className="min-h-screen bg-[#0A0F1C] text-white flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-[#E3FF00]/30 border-t-[#E3FF00] animate-spin" />
      </div>
    );
  }

  const tax = item.price * 0.08;
  const total = item.price + tax;

  return (
    <div className="min-h-screen bg-[#0A0F1C] text-foreground pb-12">
      {/* Top Nav */}
      <div className="p-4 pt-safe flex justify-between items-center bg-[#0A0F1C] sticky top-0 z-50 border-b border-white/5">
        <Link href={`/marketplace/${params.id}`} className="p-2 text-white/80 hover:text-white transition-colors tap-feedback">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <span className="font-black text-white text-lg tracking-tight">Uniexo</span>
        <button className="p-2 text-white/80 hover:text-white transition-colors tap-feedback">
          <Bell className="w-5 h-5" />
        </button>
      </div>

      <div className="px-6 py-8 max-w-md mx-auto">
        <h1 className="text-2xl font-black text-white mb-6">
          <span className="text-[#E3FF00]">01</span> Checkout Detail
        </h1>

        {/* Product Card */}
        <div className="rounded-[2rem] bg-[#111625] border border-white/5 overflow-hidden mb-8 shadow-2xl flex flex-col items-center">
          <div className="w-full aspect-[4/3] relative">
            <img src={item.images?.[0] || 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80'} alt={item.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#111625] to-transparent" />
          </div>
          
          <div className="px-6 pb-8 -mt-10 relative z-10 flex flex-col items-center text-center">
            <div className="inline-flex px-3 py-1 bg-[#1A2500] border border-[#E3FF00]/20 text-[#E3FF00] rounded-full text-[9px] font-black uppercase tracking-widest mb-4">
              Premium Edition
            </div>
            <h2 className="text-2xl font-black text-white mb-2">{item.title}</h2>
            <p className="text-[11px] text-white/60 mb-4 font-medium leading-relaxed max-w-[240px] line-clamp-2">
              {item.description || 'Premium listed item.'}
            </p>
            <div className="flex items-center gap-3">
              <span className="text-2xl font-black text-white">${item.price}</span>
            </div>
          </div>
        </div>

        {/* Shipping Address */}
        <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4">Shipping Address</h3>
        <div className="p-5 rounded-[1.5rem] border-2 border-[#C3C6FF] bg-[#C3C6FF]/5 flex items-start gap-4 mb-8 relative">
          <MapPin className="w-5 h-5 text-[#C3C6FF] shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-sm text-white mb-1">Home — Elite Courier</h4>
            <p className="text-[11px] text-white/60 leading-relaxed max-w-[200px]">
              4521 Cyber Avenue, Neo-Tokyo<br />
              District 5<br />
              Tokyo, 150-0043, Japan
            </p>
          </div>
          <div className="absolute top-5 right-5 w-5 h-5 rounded-full border-2 border-[#E3FF00] flex items-center justify-center">
            <div className="w-2.5 h-2.5 bg-[#E3FF00] rounded-full" />
          </div>
        </div>

        {/* Payment Method */}
        <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4">Payment Method</h3>
        <div className="space-y-3 mb-8">
          <div className="p-5 rounded-[1.5rem] bg-[#111625] border border-white/5 flex flex-col items-center justify-center gap-2 text-white/60 hover:text-white hover:border-white/20 transition-colors tap-feedback cursor-pointer">
            <Wallet className="w-6 h-6" />
            <span className="text-[10px] font-black uppercase tracking-widest">Uniexo Pay</span>
          </div>
          <div className="p-5 rounded-[1.5rem] bg-[#111625] border border-[#E3FF00]/20 flex flex-col items-center justify-center gap-2 text-[#E3FF00] transition-colors tap-feedback cursor-pointer shadow-[0_0_15px_rgba(227,255,0,0.05)]">
            <Bitcoin className="w-6 h-6" />
            <span className="text-[10px] font-black uppercase tracking-widest">Crypto</span>
          </div>
          <div className="p-5 rounded-[1.5rem] bg-[#111625] border border-white/5 flex flex-col items-center justify-center gap-2 text-white/60 hover:text-white hover:border-white/20 transition-colors tap-feedback cursor-pointer">
            <CreditCard className="w-6 h-6" />
            <span className="text-[10px] font-black uppercase tracking-widest">Card</span>
          </div>
          
          <div className="mt-4 p-4 rounded-[1.5rem] bg-white/5 border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="px-2 py-1 bg-[#1A2530] rounded-md text-[10px] font-black text-white uppercase tracking-wider">VISA</div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-white">Ending in 8842</span>
                <span className="text-[10px] text-white/50 font-medium">Expires 12/28</span>
              </div>
            </div>
            <button className="text-[10px] font-black text-[#C3C6FF] hover:text-white transition-colors uppercase tracking-widest">
              Change
            </button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="p-6 rounded-[2rem] bg-[#111625] border border-white/5 mb-8">
          <h3 className="text-lg font-black text-white mb-6">Order Summary</h3>
          <div className="space-y-4 mb-6">
            <div className="flex justify-between text-sm">
              <span className="text-white/70">Subtotal</span>
              <span className="font-bold text-white">${item.price}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/70">Shipping (Elite)</span>
              <span className="font-black text-[#E3FF00]">FREE</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/70">Estimated Tax</span>
              <span className="font-bold text-white">${tax.toFixed(2)}</span>
            </div>
          </div>
          <div className="pt-6 border-t border-white/10 flex justify-between items-center mb-6">
            <span className="text-xl font-black text-white">Total</span>
            <span className="text-2xl font-black text-[#C3C6FF]">${total.toFixed(2)}</span>
          </div>
          
          <div className="flex items-center justify-between p-4 rounded-[1rem] bg-black/40 border border-white/5 mb-6">
            <span className="text-xs text-white/40 font-medium">Promo Code</span>
            <span className="text-[10px] font-black text-[#E3FF00] uppercase tracking-widest cursor-pointer">Apply</span>
          </div>

          <Link href={`/marketplace/secured`} className="w-full block py-4 rounded-2xl bg-[#C3C6FF] text-black text-sm font-black uppercase tracking-widest text-center hover:bg-white transition-colors shadow-[0_0_20px_rgba(195,198,255,0.3)] tap-feedback mb-6 flex items-center justify-center gap-2">
            Confirm Purchase 🚀
          </Link>
          
          <p className="text-[9px] text-white/40 text-center font-medium leading-relaxed px-4">
            By clicking "Confirm Purchase", you agree to Uniexo's<br />
            <span className="underline cursor-pointer">Terms of Service</span> and <span className="underline cursor-pointer">Refund Policy</span>.
          </p>
        </div>

        {/* Badges */}
        <div className="flex gap-4">
          <div className="flex-1 p-4 rounded-[1rem] border border-white/5 flex items-center gap-3">
            <ShieldCheck className="w-4 h-4 text-[#E3FF00]" />
            <span className="text-[8px] font-black uppercase tracking-widest text-white/70">Encrypted<br />Transaction</span>
          </div>
          <div className="flex-1 p-4 rounded-[1rem] border border-white/5 flex items-center gap-3">
            <Box className="w-4 h-4 text-[#C3C6FF]" />
            <span className="text-[8px] font-black uppercase tracking-widest text-white/70">Insured<br />Delivery</span>
          </div>
        </div>

      </div>
    </div>
  );
}
