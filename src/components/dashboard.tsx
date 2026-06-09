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
import { useLaundryServices } from '@/hooks/use-laundry-services';
import { useMarketplaceItems } from '@/hooks/use-marketplace-items';
import { AirbnbListingCard } from '@/components/airbnb-listing-card';
import Link from 'next/link';

export function Dashboard({ initialCategory = 'homes' }: { initialCategory?: 'homes' | 'experiences' | 'services' | 'marketplace' }) {
  const { user } = useAuthStore();
  const { data: houses = [], isLoading: isLoadingHouses } = useHouses();
  const { data: vehicles = [], isLoading: isLoadingVehicles } = useVehicles();
  const { data: laundryServices = [], isLoading: isLoadingLaundry } = useLaundryServices();
  const { data: marketplaceItems = [], isLoading: isLoadingMarketplace } = useMarketplaceItems();
  
  const [activeCategory, setActiveCategory] = useState<'homes' | 'experiences' | 'services' | 'marketplace'>(initialCategory);

  // Match the screenshot exact category structure
  const categories = [
    { id: 'homes', label: 'Homes', icon: Home, isNew: false, image: '/homes-icon.png' },
    { id: 'experiences', label: 'Experiences', icon: Car, isNew: true, image: '/exp-icon.png' },
    { id: 'services', label: 'Services', icon: WashingMachine, isNew: true, image: '/serv-icon.png' },
    { id: 'marketplace', label: 'Marketplace', icon: ShoppingBag, isNew: true, image: '/market-icon.png' },
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
    <div className="min-h-screen bg-slate-50/50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 pb-24 has-bottom-nav font-sans">
      
      {/* ── Sticky Top Header ──────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-zinc-950/70 backdrop-blur-xl border-b border-slate-100 dark:border-white/5 pb-2 pt-4 shadow-sm shadow-slate-100/10 dark:shadow-none">
        <div className="container mx-auto px-4 sm:px-6 md:px-8">
          
          {/* Search Pill - Exactly like screenshot */}
          <div className="flex items-center justify-center bg-white dark:bg-zinc-900/60 hover:border-slate-300 dark:hover:border-zinc-700 hover:shadow-lg transition-all duration-300 rounded-[1.8rem] shadow-[0_3px_15px_rgba(0,0,0,0.08)] border border-slate-100 dark:border-zinc-800 py-3.5 px-6 mb-5 cursor-text max-w-xl mx-auto">
            <Search className="w-5 h-5 text-slate-800 dark:text-zinc-300 mr-3 stroke-[2.5]" />
            <span className="text-[15px] font-semibold text-slate-950 dark:text-zinc-200">Start your search</span>
          </div>

          {/* Categories - Exactly like screenshot */}
          <div className="flex items-center justify-center gap-8 overflow-x-auto scrollbar-hide px-2">
            {categories.map(cat => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`relative flex flex-col items-center gap-1.5 pb-3 pt-2 min-w-fit transition-all duration-300 ${
                    isActive ? 'text-slate-900 dark:text-zinc-100 font-bold' : 'text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-zinc-200'
                  }`}
                >
                  {cat.isNew && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow-md tracking-wider z-10 animate-bounce-soft">
                      NEW
                    </span>
                  )}
                  {/* Fallback to lucide if custom icons are missing */}
                  <div className="h-7 flex items-center justify-center relative">
                      <cat.icon className={`w-6 h-6 transition-all duration-300 ${isActive ? 'stroke-[2.5] text-slate-900 dark:text-zinc-100 scale-110' : 'stroke-[1.5] text-slate-400 dark:text-zinc-500'}`} />
                  </div>
                  <span className="text-[12px] font-semibold tracking-wide uppercase">{cat.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeCategoryBorder"
                      className="absolute bottom-0 left-0 right-0 h-[3px] bg-slate-900 dark:bg-zinc-100 rounded-full"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
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
                  <Section title="Popular homes">
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
                            secondaryInfo={room.city}
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

                  <Section title="Available this weekend">
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
                            secondaryInfo={room.city}
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
                            secondaryInfo={vehicle.location}
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
                  
                  {/* Cross-selling in Experiences */}
                  <Section title="Marketplace Essentials" showArrow={true}>
                    {isLoadingMarketplace ? (
                      [1, 2].map(i => (
                        <div key={i} className="min-w-[85vw] w-[85vw] sm:min-w-[320px] sm:w-[320px] snap-center shrink-0 space-y-3">
                           <div className="aspect-[4/3] bg-slate-100 rounded-3xl animate-pulse" />
                           <div className="h-4 bg-slate-100 rounded w-2/3 animate-pulse" />
                        </div>
                      ))
                    ) : (
                      marketplaceItems.slice(0, 4).map((item: any) => (
                        <div key={item._id} className="min-w-[85vw] w-[85vw] sm:min-w-[320px] sm:w-[320px] snap-center shrink-0">
                          <AirbnbListingCard
                            id={item._id}
                            title={item.title}
                            subtitle={item.condition}
                            secondaryInfo={item.location}
                            images={item.images?.length ? item.images : ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e']}
                            price={item.price || 0}
                            priceUnit="item"
                            rating={0}
                            href={`/marketplace/${item._id}`}
                          />
                        </div>
                      ))
                    )}
                  </Section>
                </>
              )}
              
              {activeCategory === 'services' && (
                <>
                  <Section title="Top Rated Services">
                    {isLoadingLaundry ? (
                      [1, 2, 3].map(i => (
                        <div key={i} className="min-w-[85vw] w-[85vw] sm:min-w-[320px] sm:w-[320px] snap-center shrink-0 space-y-3">
                           <div className="aspect-[4/3] bg-slate-100 rounded-3xl animate-pulse" />
                           <div className="h-4 bg-slate-100 rounded w-2/3 animate-pulse" />
                           <div className="h-4 bg-slate-100 rounded w-1/3 animate-pulse" />
                        </div>
                      ))
                    ) : (
                      laundryServices.map((service: any) => (
                        <div key={service._id} className="min-w-[85vw] w-[85vw] sm:min-w-[320px] sm:w-[320px] snap-center shrink-0">
                          <AirbnbListingCard
                            id={service._id}
                            title={service.name}
                            subtitle="Laundry Service"
                            secondaryInfo={service.providerName}
                            images={service.images?.length ? service.images : ['https://images.unsplash.com/photo-1545173168-9f1947eebb7f']}
                            price={service.services?.[0]?.price || 0}
                            priceUnit={service.services?.[0]?.unit || 'kg'}
                            rating={4.9}
                            href={`/services/${service._id}`}
                          />
                        </div>
                      ))
                    )}
                  </Section>
                </>
              )}

              {activeCategory === 'marketplace' && (
                <>
                  <Section title="Campus Marketplace">
                    {isLoadingMarketplace ? (
                      [1, 2, 3].map(i => (
                        <div key={i} className="min-w-[85vw] w-[85vw] sm:min-w-[320px] sm:w-[320px] snap-center shrink-0 space-y-3">
                           <div className="aspect-[4/3] bg-slate-100 rounded-3xl animate-pulse" />
                           <div className="h-4 bg-slate-100 rounded w-2/3 animate-pulse" />
                           <div className="h-4 bg-slate-100 rounded w-1/3 animate-pulse" />
                        </div>
                      ))
                    ) : (
                      marketplaceItems.map((item: any) => (
                        <div key={item._id} className="min-w-[85vw] w-[85vw] sm:min-w-[320px] sm:w-[320px] snap-center shrink-0">
                          <AirbnbListingCard
                            id={item._id}
                            title={item.title}
                            subtitle={item.condition}
                            secondaryInfo={item.location}
                            images={item.images?.length ? item.images : ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e']}
                            price={item.price || 0}
                            priceUnit="item"
                            rating={0}
                            href={`/marketplace/${item._id}`}
                          />
                        </div>
                      ))
                    )}
                  </Section>
                </>
              )}
            </motion.div>
          </AnimatePresence>

        </div>
      </main>

    </div>
  );
}
