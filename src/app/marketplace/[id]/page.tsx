'use client';

import { ArrowLeft, Heart, Share2, ShieldCheck, MapPin, Tag, Package, MessageSquare, Truck, Trash2, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useMarketplaceItem } from '@/hooks/use-marketplace-items';
import { useAuthStore } from '@/store/auth.store';
import { use } from 'react';
import { toast } from 'sonner';

export default function MarketplaceItemPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { data: item, isLoading } = useMarketplaceItem(resolvedParams.id);
  const { user } = useAuthStore();

  if (isLoading || !item) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
      </div>
    );
  }

  const isOwner = user?.id === item.sellerId?._id;

  const handleRemove = async () => {
    toast.success("Listing removed successfully");
    // Implementation for removing would go here
  };

  const handleMarkAsSold = async () => {
    toast.success("Listing marked as sold");
    // Implementation for marking as sold would go here
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-background text-foreground pb-32">
      {/* Header Image */}
      <div className="relative h-[50vh] md:h-[60vh] w-full max-w-4xl mx-auto bg-zinc-200 dark:bg-zinc-900 overflow-hidden md:rounded-b-3xl shadow-sm">
        <img src={item.images?.[0] || 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80'} alt={item.title} className="w-full h-full object-contain object-center" />
        
        {/* Top Nav */}
        <div className="absolute top-0 left-0 w-full p-4 pt-safe z-20 flex justify-between items-center">
          <Link href="/marketplace" className="w-10 h-10 rounded-full bg-white/80 dark:bg-black/60 backdrop-blur-md flex items-center justify-center border border-border shadow-sm text-foreground hover:bg-white dark:hover:bg-black transition-colors tap-feedback">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex gap-3">
            {!isOwner && (
              <button className="w-10 h-10 rounded-full bg-white/80 dark:bg-black/60 backdrop-blur-md flex items-center justify-center border border-border shadow-sm text-foreground hover:bg-white dark:hover:bg-black transition-colors tap-feedback">
                <Heart className="w-5 h-5" />
              </button>
            )}
            <button className="w-10 h-10 rounded-full bg-white/80 dark:bg-black/60 backdrop-blur-md flex items-center justify-center border border-border shadow-sm text-foreground hover:bg-white dark:hover:bg-black transition-colors tap-feedback">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 -mt-8 relative z-20">
        {/* Main Info Card */}
        <div className="bg-white dark:bg-surface border border-border shadow-xl shadow-black/5 rounded-3xl p-6 md:p-8 mb-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-foreground mb-2 leading-tight">{item.title}</h1>
              <div className="flex items-center gap-3 text-muted-foreground text-sm font-medium">
                <span className="flex items-center gap-1.5"><Tag className="w-4 h-4" /> {item.category}</span>
                <span className="w-1 h-1 rounded-full bg-border" />
                <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {item.location || 'Campus'}</span>
              </div>
            </div>
            <div className="text-4xl font-black text-primary">₹{item.price.toLocaleString('en-IN')}</div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 py-6 border-y border-border/50 my-6">
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Condition</span>
              <span className="text-sm font-bold capitalize flex items-center gap-1.5"><Package className="w-4 h-4 text-primary" /> {item.condition || 'Used'}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Status</span>
              <span className="text-sm font-bold capitalize flex items-center gap-1.5">
                {item.isSold ? <span className="text-red-500 flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> Sold</span> : <span className="text-emerald-500 flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> Available</span>}
              </span>
            </div>
          </div>

          <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3">Description</h3>
          <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">
            {item.description || 'No description provided by the seller.'}
          </p>
        </div>

        {/* Seller Info */}
        <div className="bg-white dark:bg-surface border border-border shadow-sm rounded-3xl p-6 md:p-8 mb-6">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4">Seller Details</h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-black text-xl">
                {(item.sellerId?.name?.[0] || 'U').toUpperCase()}
              </div>
              <div>
                <h4 className="font-bold text-foreground text-lg">{item.sellerId?.name || 'Independent Seller'}</h4>
                <div className="flex items-center gap-1 mt-0.5 text-sm">
                  <ShieldCheck className="w-4 h-4 text-primary" />
                  <span className="text-foreground/80 font-medium">Verified Student</span>
                </div>
              </div>
            </div>
            {!isOwner && (
              <Link href={`/marketplace/${resolvedParams.id}/chat`} className="px-6 py-3 rounded-xl bg-primary/10 text-primary font-bold hover:bg-primary/20 transition-colors hidden sm:flex items-center gap-2">
                <MessageSquare className="w-4 h-4" /> Chat
              </Link>
            )}
          </div>
        </div>

        {/* Guarantees */}
        <div className="bg-white dark:bg-surface border border-border shadow-sm rounded-3xl p-6 md:p-8 space-y-6">
          <div className="flex gap-4">
            <ShieldCheck className="w-6 h-6 text-primary shrink-0" />
            <div>
              <h4 className="font-bold text-sm text-foreground mb-1">Campus Safe Meetup</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">Exchange items safely within university premises.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 dark:bg-black/90 backdrop-blur-xl border-t border-border z-50">
        <div className="max-w-4xl mx-auto flex gap-3 pb-safe">
          {isOwner ? (
            <>
              <button onClick={handleRemove} className="flex-1 py-4 rounded-2xl bg-red-500/10 text-red-500 text-sm font-black uppercase tracking-widest hover:bg-red-500/20 transition-colors flex items-center justify-center gap-2">
                <Trash2 className="w-5 h-5" /> Remove
              </button>
              <button onClick={handleMarkAsSold} disabled={item.isSold} className="flex-1 py-4 rounded-2xl bg-emerald-500/10 text-emerald-500 text-sm font-black uppercase tracking-widest hover:bg-emerald-500/20 transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
                <CheckCircle2 className="w-5 h-5" /> {item.isSold ? 'Already Sold' : 'Mark as Sold'}
              </button>
            </>
          ) : (
            <>
              <Link href={`/marketplace/${resolvedParams.id}/chat`} className="flex-1 py-4 rounded-2xl bg-secondary/10 border border-secondary/20 text-sm font-black uppercase tracking-widest text-secondary hover:bg-secondary/20 transition-colors flex items-center justify-center gap-2">
                <MessageSquare className="w-5 h-5" /> Chat
              </Link>
              <Link href={`/marketplace/${resolvedParams.id}/checkout`} className="flex-[2] py-4 rounded-2xl bg-primary text-primary-foreground text-sm font-black uppercase tracking-widest text-center hover:bg-primary/90 transition-colors shadow-xl shadow-primary/20 flex items-center justify-center">
                Buy Now
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
