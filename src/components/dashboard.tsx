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
  Tag,
  User,
  Heart,
  ShieldCheck,
  LayoutGrid
} from 'lucide-react';
import { useAuthStore } from '@/modules/auth/auth.store';
import { useHouses } from '@/hooks/use-houses';
import { useVehicles } from '@/hooks/use-vehicles';
import { useLaundryServices } from '@/hooks/use-laundry-services';
import { useMarketplaceItems } from '@/hooks/use-marketplace-items';
import { AirbnbListingCard } from '@/components/airbnb-listing-card';
import { VehicleCard } from '@/components/vehicle-card';
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
    <section className="mb-14">
      <div className="flex items-center justify-between mb-6 px-4 sm:px-8 md:px-12 lg:px-16">
        <h2 className="text-2xl font-bold text-foreground tracking-tight">{title}</h2>
        {showArrow && (
          <button onClick={onViewAll} className="p-2 -mr-2 rounded-full hover:bg-secondary/10 transition-colors">
             <ArrowRight className="w-6 h-6 text-foreground" />
          </button>
        )}
      </div>
      <div className="flex gap-6 lg:gap-8 overflow-x-auto pb-8 px-4 sm:px-8 md:px-12 lg:px-16 snap-x snap-mandatory scrollbar-hide">
        {children}
      </div>
    </section>
  );

  const getThemeClass = () => {
    switch(activeCategory) {
      case 'homes': return 'theme-house';
      case 'experiences': return 'theme-car';
      case 'services': return 'theme-laundry';
      case 'marketplace': return 'theme-food';
      default: return '';
    }
  };

  return (
    <div className={`min-h-screen bg-background text-foreground pb-24 has-bottom-nav font-sans transition-colors duration-500 ${getThemeClass()}`}>
      
      {/* ── Sticky Top Header ──────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-background/85 backdrop-blur-2xl border-b border-border/50 pb-4 pt-6 shadow-sm shadow-border/10">
        <div className="container mx-auto px-4 sm:px-8 md:px-12 lg:px-16">
          
          {/* Search Pill - Exactly like screenshot */}
          <div className="flex items-center justify-center bg-surface hover:border-primary/50 hover:shadow-lg transition-all duration-300 rounded-[1.8rem] shadow-[0_3px_15px_rgba(0,0,0,0.08)] border border-border py-3.5 px-6 mb-5 cursor-text max-w-xl mx-auto">
            <Search className="w-5 h-5 text-muted-foreground mr-3 stroke-[2.5]" />
            <span className="text-[15px] font-semibold text-foreground">Start your search</span>
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
                    isActive ? 'text-foreground font-bold' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {cat.isNew && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow-md tracking-wider z-10 animate-bounce-soft">
                      NEW
                    </span>
                  )}
                  {/* Fallback to lucide if custom icons are missing */}
                  <div className="h-7 flex items-center justify-center relative">
                      <cat.icon className={`w-6 h-6 transition-all duration-300 ${isActive ? 'stroke-[2.5] text-foreground scale-110' : 'stroke-[1.5] text-muted-foreground'}`} />
                  </div>
                  <span className="text-[12px] font-semibold tracking-wide uppercase">{cat.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeCategoryBorder"
                      className="absolute bottom-0 left-0 right-0 h-[3px] bg-foreground rounded-full"
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
                           <div className="aspect-[4/3] bg-surface border border-border/50 rounded-3xl animate-pulse" />
                           <div className="h-4 bg-surface border border-border/50 rounded w-2/3 animate-pulse" />
                           <div className="h-4 bg-surface border border-border/50 rounded w-1/3 animate-pulse" />
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
                           <div className="aspect-[4/3] bg-surface border border-border/50 rounded-3xl animate-pulse" />
                           <div className="h-4 bg-surface border border-border/50 rounded w-2/3 animate-pulse" />
                           <div className="h-4 bg-surface border border-border/50 rounded w-1/3 animate-pulse" />
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
                <div className="flex flex-col gap-6 w-full max-w-md mx-auto sm:max-w-none">
                  {/* Top Brands Filter */}
                  <div className="mb-2">
                    <h2 className="text-xl font-bold text-foreground tracking-tight mb-4 px-4 sm:px-8 md:px-12 lg:px-16">Top Brands</h2>
                    <div className="flex gap-4 overflow-x-auto pb-4 px-4 sm:px-8 md:px-12 lg:px-16 snap-x snap-mandatory scrollbar-hide">
                      {[
                        { name: 'All', icon: '/brands/all.png' },
                        { name: 'Royal Enfield', icon: '/brands/royal.png' },
                        { name: 'Honda', icon: '/brands/honda.png' },
                        { name: 'Yamaha', icon: '/brands/yamaha.png' },
                        { name: 'TATA', icon: '/brands/tata.png' }
                      ].map((brand, i) => (
                        <div key={brand.name} className="flex flex-col items-center gap-2 snap-center shrink-0 w-16">
                          <div className={`w-14 h-14 rounded-full flex items-center justify-center ${i===0 ? 'bg-surface border-2 border-border' : 'bg-background border border-border shadow-sm'}`}>
                            {i === 0 ? <LayoutGrid className="w-5 h-5 text-zinc-600" /> : <img src={`https://ui-avatars.com/api/?name=${brand.name.charAt(0)}&background=random`} alt={brand.name} className="w-8 h-8 object-contain rounded-full" />}
                          </div>
                          <span className="text-[10px] font-semibold text-center leading-tight">{brand.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Section title="Best Deals" showArrow={false}>
                    {isLoadingVehicles ? (
                      [1, 2].map(i => <div key={i} className="w-[280px] h-[300px] bg-surface border border-border/50 rounded-[1.2rem] animate-pulse shrink-0" />)
                    ) : vehicles.slice(0, 4).map((vehicle: any) => (
                      <VehicleCard
                        key={vehicle._id}
                        id={vehicle._id}
                        title={vehicle.name || vehicle.modelName || 'Vehicle'}
                        images={vehicle.images?.length ? vehicle.images : ['https://images.unsplash.com/photo-1558981403-c5f9899a28bc']}
                        pricePerDay={vehicle.pricePerDay || 1000}
                        rating={4.8}
                        seatingCapacity={vehicle.seatingCapacity || 2}
                        fuelType={vehicle.fuelType || 'Petrol'}
                        kmsOrSpeed={vehicle.topSpeed || 349}
                        isAvailable={vehicle.isAvailable}
                        href={`/vehicles/${vehicle._id}`}
                      />
                    ))}
                  </Section>

                  <Section title="Top Vehicles" showArrow={false}>
                    {isLoadingVehicles ? (
                      [1, 2].map(i => <div key={i} className="w-[280px] h-[300px] bg-surface border border-border/50 rounded-[1.2rem] animate-pulse shrink-0" />)
                    ) : vehicles.slice(0, 4).map((vehicle: any) => (
                      <VehicleCard
                        key={vehicle._id}
                        id={vehicle._id}
                        title={vehicle.name || vehicle.modelName || 'Vehicle'}
                        images={vehicle.images?.length ? vehicle.images : ['https://images.unsplash.com/photo-1558981403-c5f9899a28bc']}
                        pricePerDay={vehicle.pricePerDay || 1000}
                        rating={5.0}
                        seatingCapacity={vehicle.seatingCapacity || 2}
                        fuelType={vehicle.fuelType || 'Petrol'}
                        kmsOrSpeed={vehicle.topSpeed || 349}
                        isAvailable={vehicle.isAvailable}
                        href={`/vehicles/${vehicle._id}`}
                      />
                    ))}
                  </Section>

                  <Section title="Near Available" showArrow={false}>
                    {isLoadingVehicles ? (
                      [1, 2].map(i => <div key={i} className="w-[280px] h-[300px] bg-surface border border-border/50 rounded-[1.2rem] animate-pulse shrink-0" />)
                    ) : vehicles.slice(0, 4).map((vehicle: any) => (
                      <VehicleCard
                        key={vehicle._id}
                        id={vehicle._id}
                        title={vehicle.name || vehicle.modelName || 'Vehicle'}
                        images={vehicle.images?.length ? vehicle.images : ['https://images.unsplash.com/photo-1558981403-c5f9899a28bc']}
                        pricePerDay={vehicle.pricePerDay || 1000}
                        rating={4.5}
                        seatingCapacity={vehicle.seatingCapacity || 2}
                        fuelType={vehicle.fuelType || 'Petrol'}
                        kmsOrSpeed={vehicle.topSpeed || 349}
                        isAvailable={vehicle.isAvailable}
                        href={`/vehicles/${vehicle._id}`}
                      />
                    ))}
                  </Section>
                </div>
              )}


              {activeCategory === 'marketplace' && (
                <div className="flex flex-col gap-6">
                  {/* Hero / Header */}
                  <div className="flex flex-col gap-2 pt-2">
                    <h1 className="text-3xl font-black tracking-tight">Marketplace</h1>
                    <p className="text-sm font-medium text-muted-foreground max-w-[280px]">
                      Discover premium tech and high-end lifestyle gear.
                    </p>
                  </div>

                  {/* Search */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Search className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search products..."
                      className="w-full bg-surface border border-border text-sm rounded-2xl pl-10 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
                    />
                  </div>

                  {/* Filters */}
                  <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 snap-x-mandatory">
                    {['All Items', 'Tech', 'Audio', 'Cameras'].map((filter, i) => (
                      <button
                        key={filter}
                        className={`snap-start whitespace-nowrap px-5 py-2 rounded-full text-[11px] font-black uppercase tracking-wider transition-all ${
                          i === 0
                            ? 'bg-[#E3FF00] text-black shadow-[0_0_15px_rgba(227,255,0,0.3)] border border-[#E3FF00]'
                            : 'bg-surface border border-border text-muted-foreground hover:text-foreground hover:border-muted-foreground/30'
                        }`}
                      >
                        {filter}
                      </button>
                    ))}
                  </div>

                  {/* Featured Deal */}
                  {marketplaceItems.length > 0 && (
                    <Link href={`/marketplace/${marketplaceItems[0]._id}`} className="group tap-feedback block mt-4">
                      <div className="relative overflow-hidden rounded-[2rem] bg-[#0A0F1C] border border-white/5 p-6 flex flex-col shadow-2xl">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
                        
                        <div className="inline-flex px-3 py-1 bg-[#E3FF00] text-black text-[9px] font-black uppercase tracking-widest rounded-full self-start mb-4">
                          Featured Deal
                        </div>
                        
                        <h2 className="text-4xl font-black text-white leading-tight mb-4 z-10 w-2/3 line-clamp-3">
                          {marketplaceItems[0].title}
                        </h2>
                        
                        <p className="text-[11px] text-white/60 font-medium leading-relaxed mb-6 max-w-[200px] z-10 line-clamp-3">
                          {marketplaceItems[0].description || marketplaceItems[0].condition || 'Premium listing in excellent condition.'}
                        </p>
                        
                        <div className="flex items-end justify-between mb-6 z-10">
                          <div className="text-2xl font-black text-white tracking-tighter">${marketplaceItems[0].price}</div>
                          <div className="flex items-center gap-1.5 text-[#E3FF00]">
                            <User className="w-3.5 h-3.5" />
                            <span className="text-[10px] font-black uppercase tracking-widest">14 Interested</span>
                          </div>
                        </div>

                        <div className="w-1/2 bg-[#C3C6FF] text-black py-3 rounded-2xl text-xs font-black text-center mb-6 hover:bg-surface transition-colors z-10 shadow-[0_0_20px_rgba(195,198,255,0.4)]">
                          Secure Item
                        </div>

                        <div className="absolute -bottom-8 -right-8 w-[240px] h-[240px] z-0 group-hover:scale-105 transition-transform duration-500">
                          <img src={marketplaceItems[0].images?.[0] || "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80"} alt={marketplaceItems[0].title} className="w-full h-full object-cover object-center rounded-2xl opacity-90 mix-blend-screen drop-shadow-2xl" />
                        </div>
                      </div>
                    </Link>
                  )}

                  {/* Grid of Items */}
                  <div className="grid grid-cols-1 gap-6 mt-4">
                    {isLoadingMarketplace ? (
                      [1,2].map(i => (
                        <div key={i} className="aspect-[4/3] rounded-[2rem] bg-[#0A0F1C] border border-white/5 animate-pulse" />
                      ))
                    ) : marketplaceItems.length > 0 ? (
                      marketplaceItems.map((item: any) => (
                        <Link key={item._id} href={`/marketplace/${item._id}`} className="group flex flex-col tap-feedback">
                          <div className="relative aspect-[4/3] rounded-[2rem] overflow-hidden bg-[#0A0F1C] border border-white/5 mb-3">
                            <div className="absolute top-3 left-3 z-10 px-2.5 py-1 bg-black/50 backdrop-blur-md text-white/80 text-[8px] font-black uppercase tracking-widest rounded-full border border-white/10">
                              {item.category || 'Item'}
                            </div>
                            <div className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/10 text-white/70 hover:text-white hover:bg-black/60 transition-colors">
                              <Heart className="w-4 h-4" />
                            </div>
                            <img src={item.images?.[0] || 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80'} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                          </div>
                          <div className="flex justify-between items-start mb-1">
                            <h3 className="font-bold text-base text-foreground">{item.title}</h3>
                            <span className="font-black text-base text-[#E3FF00] drop-shadow-[0_0_8px_rgba(227,255,0,0.3)]">${item.price}</span>
                          </div>
                          <div className="flex items-center gap-3 text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-3">
                            <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> VERIFIED</span>
                            <span className="flex items-center gap-1"><User className="w-3 h-3" /> {item.condition || 'Used'}</span>
                          </div>
                          <div className="w-full py-2.5 rounded-xl border border-border text-center text-[10px] font-black uppercase tracking-widest text-foreground hover:bg-surface transition-colors">
                            View Details
                          </div>
                        </Link>
                      ))
                    ) : (
                      <div className="text-center py-10 text-muted-foreground text-sm">No items available right now.</div>
                    )}
                  </div>

                  {/* Sell Banner */}
                  <div className="mt-8 mb-4 relative overflow-hidden rounded-[2rem] bg-[#111625] border border-white/5 p-8 flex flex-col items-center text-center">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20" />
                    <h3 className="text-3xl font-black text-white leading-tight tracking-tight mb-4 relative z-10">
                      Sell your<br />tech<br />instantly
                    </h3>
                    <p className="text-xs font-medium text-white/60 mb-8 max-w-[200px] relative z-10">
                      Get a premium valuation for your used devices in under 60 seconds.
                    </p>
                    <Link href="/sell" className="w-full sm:w-auto bg-[#E3FF00] text-black px-8 py-3.5 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-[#cce600] transition-colors relative z-10 shadow-[0_0_20px_rgba(227,255,0,0.25)] tap-feedback">
                      List Item Now
                    </Link>
                  </div>

                </div>
              )}
              
              {activeCategory === 'services' && (
                <>
                  <Section title="Top Rated Services">
                    {isLoadingLaundry ? (
                      [1, 2, 3].map(i => (
                        <div key={i} className="min-w-[85vw] w-[85vw] sm:min-w-[320px] sm:w-[320px] snap-center shrink-0 space-y-3">
                           <div className="aspect-[4/3] bg-surface border border-border/50 rounded-3xl animate-pulse" />
                           <div className="h-4 bg-surface border border-border/50 rounded w-2/3 animate-pulse" />
                           <div className="h-4 bg-surface border border-border/50 rounded w-1/3 animate-pulse" />
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
                           <div className="aspect-[4/3] bg-surface border border-border/50 rounded-3xl animate-pulse" />
                           <div className="h-4 bg-surface border border-border/50 rounded w-2/3 animate-pulse" />
                           <div className="h-4 bg-surface border border-border/50 rounded w-1/3 animate-pulse" />
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
