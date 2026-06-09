'use client';

import { ArrowLeft, Heart, Share2, ShieldCheck, Battery, Bluetooth, Weight, Palette, MessageSquare, Truck, Package } from 'lucide-react';
import Link from 'next/link';
import { useMarketplaceItem } from '@/hooks/use-marketplace-items';
import { use } from 'react';

export default function MarketplaceItemPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { data: item, isLoading } = useMarketplaceItem(resolvedParams.id);

  if (isLoading || !item) {
    return (
      <div className="min-h-screen bg-[#0A0F1C] text-white flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-[#E3FF00]/30 border-t-[#E3FF00] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0F1C] text-foreground pb-24">
      {/* Header Image */}
      <div className="relative h-[60vh] w-full">
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F1C] via-[#0A0F1C]/20 to-black/40 z-10" />
        <img src={item.images?.[0] || 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80'} alt={item.title} className="w-full h-full object-cover object-center" />
        
        {/* Top Nav */}
        <div className="absolute top-0 left-0 w-full p-4 pt-safe z-20 flex justify-between items-center">
          <Link href="/" className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center border border-white/10 text-white hover:bg-black/40 transition-colors tap-feedback">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex gap-3">
            <button className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center border border-white/10 text-white hover:bg-black/40 transition-colors tap-feedback">
              <Heart className="w-5 h-5" />
            </button>
            <button className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center border border-white/10 text-white hover:bg-black/40 transition-colors tap-feedback">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="px-6 -mt-10 relative z-20">
        {/* Title Block */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#1A2500] border border-[#E3FF00]/20 text-[#E3FF00] rounded-full text-[10px] font-black uppercase tracking-widest mb-4 shadow-[0_0_15px_rgba(227,255,0,0.1)]">
            <ShieldCheck className="w-3.5 h-3.5" />
            Verified
          </div>
          <h1 className="text-4xl font-black text-white mb-2 tracking-tight">{item.title}</h1>
          <div className="text-2xl font-black text-[#C3C6FF]">${item.price}</div>
        </div>

        {/* Product Overview */}
        <div className="mb-8 p-6 rounded-[2rem] bg-[#111625] border border-white/5">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4">Product Overview</h3>
          <p className="text-sm font-medium text-white/80 leading-relaxed">
            {item.description || 'No description provided.'}
          </p>
        </div>

        {/* Specs Grid */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="p-5 rounded-[2rem] bg-[#111625] border border-white/5 flex flex-col items-center justify-center text-center">
            <Package className="w-5 h-5 text-[#E3FF00] mb-3" />
            <div className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1">Condition</div>
            <div className="text-sm font-bold text-white capitalize">{item.condition || 'Used'}</div>
          </div>
          <div className="p-5 rounded-[2rem] bg-[#111625] border border-white/5 flex flex-col items-center justify-center text-center">
            <Palette className="w-5 h-5 text-[#E3FF00] mb-3" />
            <div className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1">Category</div>
            <div className="text-sm font-bold text-white capitalize">{item.category || 'General'}</div>
          </div>
        </div>

        {/* Seller Info */}
        <div className="mb-8 p-6 rounded-[2rem] bg-[#111625] border border-white/5">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4">Seller Information</h3>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-[#C3C6FF]/10 border border-[#C3C6FF]/20 flex items-center justify-center">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#C3C6FF] to-purple-500 flex items-center justify-center">
                <span className="text-black font-black text-xs">{(item.sellerId?.name?.[0] || 'U').toUpperCase()}</span>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-white line-clamp-1">{item.sellerId?.name || 'Independent Seller'}</h4>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="text-[#E3FF00]">★</span>
                <span className="text-xs font-bold text-white">4.9</span>
                <span className="text-xs text-muted-foreground ml-1">(1.2k Reviews)</span>
              </div>
            </div>
          </div>
          <button className="w-full py-3.5 rounded-xl border border-white/10 text-xs font-black text-white hover:bg-white/5 transition-colors flex items-center justify-center gap-2">
            <MessageSquare className="w-4 h-4" /> Message Seller
          </button>
        </div>

        {/* Guarantees */}
        <div className="mb-4 p-6 rounded-[2rem] bg-[#111625] border border-white/5 space-y-6">
          <div className="flex gap-4">
            <ShieldCheck className="w-6 h-6 text-[#C3C6FF] shrink-0" />
            <div>
              <h4 className="font-bold text-sm text-white mb-1">Uniexo Protection</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">Secure escrow and 30-day money-back guarantee.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <Truck className="w-6 h-6 text-[#C3C6FF] shrink-0" />
            <div>
              <h4 className="font-bold text-sm text-white mb-1">Insured Shipping</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">Express delivery via encrypted orbital freight.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#0A0F1C]/80 backdrop-blur-xl border-t border-white/10 z-50 flex gap-3 pb-safe">
        <button className="flex-1 py-4 rounded-2xl bg-white/5 border border-white/10 text-xs font-black uppercase tracking-widest text-white hover:bg-white/10 transition-colors">
          Add to Cart
        </button>
        <Link href={`/marketplace/${resolvedParams.id}/checkout`} className="flex-1 py-4 rounded-2xl bg-[#C3C6FF] text-black text-xs font-black uppercase tracking-widest text-center hover:bg-white transition-colors shadow-[0_0_20px_rgba(195,198,255,0.3)] flex items-center justify-center">
          Secure Item
        </Link>
      </div>
    </div>
  );
}
