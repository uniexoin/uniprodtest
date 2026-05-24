'use client';

import { useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { Check } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';

export function Dashboard() {
  const { user } = useAuthStore();
  const [serviceType, setServiceType] = useState<'design' | 'development' | 'both'>('both');
  const [pages, setPages] = useState<number>(5);
  const [needContent, setNeedContent] = useState<boolean>(false);
  const [needSEO, setNeedSEO] = useState<boolean>(false);
  const [timeline, setTimeline] = useState<'regular' | 'fast' | 'rush'>('regular');

  const calculatePrice = () => {
    let base = 0;
    let perPage = 0;

    if (serviceType === 'design') {
      base = 399;
      perPage = 100;
    } else if (serviceType === 'development') {
      base = 199;
      perPage = 100;
    } else {
      base = 499;
      perPage = 200;
    }

    let total = Math.max(base, base + (pages - 1) * perPage);

    if (needContent) total += pages * 50;
    if (needSEO) total += pages * 50;
    
    if (timeline === 'rush') total += pages * 100;
    if (timeline === 'fast') total += pages * 25;

    return total;
  };

  const calculateAgencyCost = () => {
    const perPage = serviceType === 'both' ? 1000 : 400;
    return 8000 + (pages - 1) * perPage;
  };

  const calculateFreelancerCost = () => {
    const perPage = serviceType === 'both' ? 500 : 200;
    return 3000 + (pages - 1) * perPage;
  };

  const formatPrice = (price: number) => {
    return '$' + price.toLocaleString();
  };

  return (
    <div className="min-h-screen bg-background w-full flex flex-col items-center">
      {/* Header Spacer for Navbar if needed */}
      <div className="h-20 w-full" />
      
      <section id="calculator-section" className="w-full bg-background py-16 md:py-28 px-4 md:px-16 max-w-7xl mx-auto flex flex-col items-center">
        
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-4">Try project estimation calculator</p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-normal text-foreground">Get premium website within your budget</h2>
        </div>

        {/* Layout */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 rounded-2xl overflow-hidden shadow-2xl">
          
          {/* LEFT COLUMN */}
          <div className="bg-[#0D0D0D] p-8 lg:p-12 flex flex-col divide-y divide-[#1E1E1E]">
            
            {/* Service Type */}
            <div className="pb-8">
              <h3 className="text-xl font-medium mb-6 text-white">What kind of service do you need?</h3>
              <div className="space-y-4">
                {[
                  { id: 'design', label: 'Only Design' },
                  { id: 'development', label: 'Only Development' },
                  { id: 'both', label: 'Design + Development' }
                ].map(option => (
                  <label key={option.id} className="flex items-center gap-4 cursor-pointer group">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${serviceType === option.id ? 'border-[#FF5656]' : 'border-white/30 group-hover:border-white/50'}`}>
                      {serviceType === option.id && <div className="w-2 h-2 rounded-full bg-[#FF5656]" />}
                    </div>
                    <span className="text-white/80 group-hover:text-white transition-colors">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Number of Pages */}
            <div className="py-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-medium text-white">Number of Pages</h3>
                <span className="text-[#FF5656] text-xl font-medium">{pages} Pages</span>
              </div>
              <Slider 
                value={[pages]} 
                onValueChange={(val) => setPages(val[0])} 
                min={1} 
                max={30} 
                step={1} 
                className="my-6"
              />
              <div className="flex justify-between text-white/50 text-sm">
                <span>1</span>
                <span>30</span>
              </div>
            </div>

            {/* Add-ons */}
            <div className="py-8">
              <div className="space-y-4">
                <label className="flex items-center justify-between cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-colors ${needContent ? 'border-[#FF5656] bg-[#FF5656]' : 'border-white/30 group-hover:border-white/50'}`}>
                      {needContent && <Check className="w-3.5 h-3.5 text-white" />}
                    </div>
                    <span className="text-white/80 group-hover:text-white transition-colors">I will need help with content</span>
                  </div>
                  <span className="text-[#FF5656] text-sm font-medium">+$50/pages</span>
                </label>

                <label className="flex items-center justify-between cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-colors ${needSEO ? 'border-[#FF5656] bg-[#FF5656]' : 'border-white/30 group-hover:border-white/50'}`}>
                      {needSEO && <Check className="w-3.5 h-3.5 text-white" />}
                    </div>
                    <span className="text-white/80 group-hover:text-white transition-colors">I want to optimize my website for SEO</span>
                  </div>
                  <span className="text-[#FF5656] text-sm font-medium">+$50/pages</span>
                </label>
              </div>
            </div>

            {/* Timeline */}
            <div className="pt-8">
              <h3 className="text-xl font-medium mb-6 text-white">How fast do you need this?</h3>
              <div className="space-y-4">
                <label className="flex items-center justify-between cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${timeline === 'rush' ? 'border-[#FF5656]' : 'border-white/30 group-hover:border-white/50'}`}>
                      {timeline === 'rush' && <div className="w-2 h-2 rounded-full bg-[#FF5656]" />}
                    </div>
                    <span className="text-white/80 group-hover:text-white transition-colors">Within 7 Days</span>
                  </div>
                  <span className="text-[#FF5656] text-sm font-medium">+$100/pages</span>
                </label>

                <label className="flex items-center justify-between cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${timeline === 'fast' ? 'border-[#FF5656]' : 'border-white/30 group-hover:border-white/50'}`}>
                      {timeline === 'fast' && <div className="w-2 h-2 rounded-full bg-[#FF5656]" />}
                    </div>
                    <span className="text-white/80 group-hover:text-white transition-colors">Within 14 Days</span>
                  </div>
                  <span className="text-[#FF5656] text-sm font-medium">+$25/pages</span>
                </label>

                <label className="flex items-center justify-between cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${timeline === 'regular' ? 'border-[#FF5656]' : 'border-white/30 group-hover:border-white/50'}`}>
                      {timeline === 'regular' && <div className="w-2 h-2 rounded-full bg-[#FF5656]" />}
                    </div>
                    <span className="text-white/80 group-hover:text-white transition-colors">Regular Speed (Based on discussion)</span>
                  </div>
                </label>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN */}
          <div className="bg-[#050505] p-8 lg:p-12 border border-white/10 lg:rounded-r-2xl flex flex-col justify-center min-h-[717.98px]">
            <h3 className="text-2xl font-semibold text-white mb-2">Estimated Cost</h3>
            <p className="text-white/50 text-sm mb-8">This is an estimated price. The final price may vary based on the project's complexity.</p>

            <div className="space-y-4">
              
              <div className="bg-muted/50 rounded-2xl p-6 space-y-3 border border-white/5">
                <p className="text-white/70 text-sm font-medium">Typical Agency charges minimum</p>
                <div className="text-4xl font-bold text-white/50 line-through decoration-white/20">{formatPrice(calculateAgencyCost())}</div>
                <p className="text-xs font-medium text-white/40">+ Too much extra time & additional cost</p>
              </div>

              <div className="bg-muted/50 rounded-2xl p-6 space-y-3 border border-white/5">
                <p className="text-white/70 text-sm font-medium">Regular Freelancer charges minimum</p>
                <div className="text-4xl font-bold text-white/50 line-through decoration-white/20">{formatPrice(calculateFreelancerCost())}</div>
                <p className="text-xs font-medium text-white/40">+ Too much headache & back-and-forth</p>
              </div>

              <div className="bg-gradient-to-r from-pink-500 to-orange-500 rounded-2xl p-6 space-y-3 text-white shadow-2xl">
                <p className="text-white/90 text-sm font-medium">With Webfluin Studio</p>
                <div className="text-5xl font-bold">{formatPrice(calculatePrice())}</div>
                <p className="text-sm font-medium text-white/90">Save your money, time & headache</p>
              </div>

            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
