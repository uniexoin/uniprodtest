'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Home, 
  Car, 
  ShoppingBag, 
  WashingMachine, 
  ArrowRight,
  SlidersHorizontal,
  MapPin,
  TrendingUp,
  Map,
  Tag
} from 'lucide-react';
import { useAuthStore } from '@/modules/auth/auth.store';
import { useHouses } from '@/hooks/use-houses';
import { useVehicles } from '@/hooks/use-vehicles';
import { AirbnbListingCard } from '@/components/airbnb-listing-card';
import Link from 'next/link';

export function Dashboard({ initialCategory = 'homes' }: { initialCategory?: 'homes' | 'experiences' | 'services' }) {
  const { user } = useAuthStore();
  const { data: houses = [], isLoading: isLoadingHouses } = useHouses();
  const { data: vehicles = [], isLoading: isLoadingVehicles } = useVehicles();
  const [activeCategory, setActiveCategory] = useState<'homes' | 'experiences' | 'services'>(initialCategory);

  // Match the screenshot exact category structure
  const categories = [
    { id: 'homes', label: 'Homes', icon: Home, isNew: false, image: '/homes-icon.png' },
    { id: 'experiences', label: 'Experiences', icon: Car, isNew: true, image: '/exp-icon.png' },
    { id: 'services', label: 'Services', icon: WashingMachine, isNew: true, image: '/serv-icon.png' },
  ] as const;

  const popularHomes = houses.filter((h: any) => h.propertyType === 'room' || h.propertyType === 'house').slice(0, 6);
  const pgHomes = houses.filter((h: any) => h.propertyType === 'pg').slice(0, 6);

  const Section = ({ title, children, onViewAll, showArrow = true }: { title: string, children: React.ReactNode, onViewAll?: () => void, showArrow?: boolean }) => (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-4 px-4 sm:px-6 md:px-8">
        <h2 className="text-xl font-semibold text-slate-900 tracking-tight">{title}</h2>
        {showArrow && (
          <button onClick={onViewAll} className="p-1 -mr-1 rounded-full hover:bg-slate-100 transition-colors">
             <ArrowRight className="w-5 h-5 text-slate-900" />
          </button>
        )}
      </div>
      <div className="flex gap-4 overflow-x-auto pb-6 px-4 sm:px-6 md:px-8 snap-x snap-mandatory scrollbar-hide">
        {children}
      </div>
    </section>
  );

  return (
    <div className="min-h-screen bg-white text-slate-900 pb-24 has-bottom-nav font-sans">
      
      {/* ── Sticky Top Header ──────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-white shadow-sm pb-2 pt-4 shadow-slate-100/50">
        <div className="container mx-auto px-4 sm:px-6 md:px-8">
          
          {/* Search Pill - Exactly like screenshot */}
          <div className="flex items-center justify-center bg-white rounded-[1.8rem] shadow-[0_3px_15px_rgba(0,0,0,0.08)] border border-slate-100 py-3.5 px-6 mb-5 cursor-text max-w-xl mx-auto">
            <Search className="w-5 h-5 text-slate-800 mr-3 stroke-[2.5]" />
            <span className="text-[15px] font-semibold text-slate-900">Start your search</span>
          </div>

          {/* Categories - Exactly like screenshot */}
          <div className="flex items-center justify-center gap-8 overflow-x-auto scrollbar-hide px-2">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`relative flex flex-col items-center gap-1.5 pb-2 min-w-fit transition-all ${
                  activeCategory === cat.id ? 'text-slate-900 border-b-[2.5px] border-slate-900' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {cat.isNew && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm tracking-wider z-10">
                    NEW
                  </span>
                )}
                {/* Fallback to lucide if custom icons are missing */}
                <div className="h-7 flex items-center justify-center relative">
                    <cat.icon className={`w-6 h-6 ${activeCategory === cat.id ? 'stroke-[2.5] text-slate-900' : 'stroke-[1.5] text-slate-400'}`} />
                </div>
                <span className="text-[12px] font-medium whitespace-nowrap">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* ── Main Scrollable Content ─────────────────────────────────── */}
      <main className="pt-6">
        <div className="container mx-auto max-w-7xl">
          
          {/* Feed Content based on active tab */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {activeCategory === 'homes' && (
                <>
                  <Section title="Popular homes in Noida">
                    {isLoadingHouses ? (
                      [1, 2, 3].map(i => (
                        <div key={i} className="min-w-[85vw] w-[85vw] sm:min-w-[320px] sm:w-[320px] snap-center shrink-0 space-y-3">
                           <div className="aspect-[4/3] bg-slate-100 rounded-3xl animate-pulse" />
                           <div className="h-4 bg-slate-100 rounded w-2/3 animate-pulse" />
                           <div className="h-4 bg-slate-100 rounded w-1/3 animate-pulse" />
                        </div>
                      ))
                    ) : (
                      popularHomes.map((room: any) => (
                        <div key={room._id} className="min-w-[85vw] w-[85vw] sm:min-w-[320px] sm:w-[320px] snap-center shrink-0">
                          <AirbnbListingCard
                            id={room._id}
                            title={room.title}
                            subtitle={`${room.pricePerMonth ? '1 month' : '1 night'}`}
                            images={room.images?.length ? room.images : ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267']}
                            price={room.pricePerMonth || room.pricePerDay || 0}
                            priceUnit={room.pricePerMonth ? 'month' : 'night'}
                            rating={4.88}
                            badge={room.isAvailable ? undefined : 'Booked'}
                            href={`/houses/${room._id}`}
                          />
                        </div>
                      ))
                    )}
                  </Section>

                  <Section title="Available in Gurgaon District this weekend">
                    {isLoadingHouses ? (
                      [1, 2, 3].map(i => (
                        <div key={i} className="min-w-[85vw] w-[85vw] sm:min-w-[320px] sm:w-[320px] snap-center shrink-0 space-y-3">
                           <div className="aspect-[4/3] bg-slate-100 rounded-3xl animate-pulse" />
                           <div className="h-4 bg-slate-100 rounded w-2/3 animate-pulse" />
                           <div className="h-4 bg-slate-100 rounded w-1/3 animate-pulse" />
                        </div>
                      ))
                    ) : (
                      pgHomes.map((room: any) => (
                        <div key={room._id} className="min-w-[85vw] w-[85vw] sm:min-w-[320px] sm:w-[320px] snap-center shrink-0">
                          <AirbnbListingCard
                            id={room._id}
                            title={room.title}
                            subtitle={`${room.pricePerMonth ? '1 month' : '1 night'}`}
                            images={room.images?.length ? room.images : ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267']}
                            price={room.pricePerMonth || room.pricePerDay || 0}
                            priceUnit={room.pricePerMonth ? 'month' : 'night'}
                            rating={4.87}
                            badge={room.propertyType === 'pg' ? 'Guest favourite' : undefined}
                            href={`/houses/${room._id}`}
                          />
                        </div>
                      ))
                    )}
                  </Section>
                </>
              )}

              {activeCategory === 'experiences' && (
                <>
                  <Section title="Featured experiences">
                    {isLoadingVehicles ? (
                      [1, 2, 3].map(i => (
                        <div key={i} className="min-w-[85vw] w-[85vw] sm:min-w-[320px] sm:w-[320px] snap-center shrink-0 space-y-3">
                           <div className="aspect-[3/4] bg-slate-100 rounded-3xl animate-pulse" />
                           <div className="h-4 bg-slate-100 rounded w-2/3 animate-pulse" />
                        </div>
                      ))
                    ) : (
                      vehicles.slice(0, 6).map((vehicle: any) => (
                        <div key={vehicle._id} className="min-w-[85vw] w-[85vw] sm:min-w-[320px] sm:w-[320px] snap-center shrink-0">
                          <AirbnbListingCard
                            id={vehicle._id}
                            title={`${vehicle.brand} ${vehicle.model}`}
                            subtitle="1 trip"
                            images={vehicle.images?.length ? vehicle.images : ['https://images.unsplash.com/photo-1555215695-3004980ad54e']}
                            price={vehicle.pricePerDay || 0}
                            priceUnit="trip"
                            rating={4.7}
                            badge={vehicle.isAvailable ? undefined : 'Booked'}
                            href={`/vehicles/${vehicle._id}`}
                          />
                        </div>
                      ))
                    )}
                  </Section>
                </>
              )}
              
              {activeCategory === 'services' && (
                <div className="px-6 py-12 text-center text-slate-500">
                  <WashingMachine className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  <p>Services coming soon.</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

        </div>
      </main>

      {/* Floating Price Tooltip (like in screenshot) */}
      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-40">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white px-5 py-3 rounded-full shadow-[0_4px_24px_rgba(0,0,0,0.12)] border border-slate-100 flex items-center gap-3 whitespace-nowrap"
        >
          <div className="w-6 h-6 rounded bg-[#ff385c] flex items-center justify-center -rotate-45 shadow-sm">
             <Tag className="w-3.5 h-3.5 text-white stroke-[2.5]" />
          </div>
          <span className="font-bold text-slate-900 text-[14px]">Prices include all fees</span>
        </motion.div>
      </div>

    </div>
  );
}
