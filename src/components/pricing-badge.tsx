import React from 'react';
import { Tag } from 'lucide-react';

export function PricingBadge() {
  return (
    <div className="fixed top-24 right-4 sm:right-8 z-[9999] pointer-events-none">
      <div className="flex items-center gap-2 bg-[#5B5B5B]/90 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border border-white/10">
        <div className="bg-[#A03348] p-1.5 rounded-md flex items-center justify-center transform rotate-45">
          <Tag className="w-3.5 h-3.5 text-white/90 transform -rotate-45" />
        </div>
        <span className="text-white/90 font-bold text-sm ml-1 tracking-wide">Prices include all fees</span>
      </div>
    </div>
  );
}
