'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Heart, Check, X, Users, User, Fuel, Gauge, Weight, Settings, Star } from 'lucide-react';
import { useVehicle } from '@/hooks/use-vehicle';

export default function VehicleDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { data: vehicle, isLoading } = useVehicle(id);

  const [activeImage, setActiveImage] = useState(0);

  if (isLoading || !vehicle) return <div className="min-h-screen bg-surface flex items-center justify-center">Loading...</div>;

  return (
    <div className="theme-car min-h-screen bg-background text-foreground pb-24 font-sans transition-colors duration-500">
      {/* Top Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-background px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="p-2 hover:bg-surface border-border rounded-full">
            <ArrowLeft className="w-6 h-6 text-foreground" />
          </button>
          <span className="text-lg font-bold">Vehicle Details</span>
        </div>
        <button className="p-2 hover:bg-surface border-border rounded-full">
          <Heart className="w-6 h-6 text-foreground" />
        </button>
      </div>

      <div className="pt-16">
        {/* Image Carousel */}
        <div className="relative w-full aspect-[4/3] bg-surface overflow-hidden">
          <img src={vehicle.images?.[activeImage] || 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc'} className="w-full h-full object-cover" alt={vehicle.name} />
          
          <div className="absolute top-4 left-4 bg-background/70 text-foreground px-3 py-1.5 rounded-full text-[11px] font-bold flex items-center gap-1.5 backdrop-blur-md">
            <Star className="w-3.5 h-3.5 fill-white" /> Premium
          </div>
          
          <div className="absolute top-4 right-4 bg-background/60 text-foreground px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md">
            {activeImage + 1}/{vehicle.images?.length || 1}
          </div>
        </div>

        {/* Content Container */}
        <div className="px-5 py-6">
          {/* Host Info */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-surface border-border rounded-full flex items-center justify-center text-muted-foreground">
              <User className="w-4 h-4" />
            </div>
            <span className="text-sm font-semibold text-foreground/90">
              Hosted by <span className="text-accent">{typeof vehicle.vendorId === 'object' ? vehicle.vendorId?.name : 'Vendor'}</span>
            </span>
          </div>

          {/* Title & Price */}
          <div className="flex items-start justify-between mb-4">
            <h1 className="text-3xl font-black text-foreground tracking-tight">{vehicle.name || vehicle.modelName}</h1>
            <div className="bg-accent/10 border border-[#ff9900]/30 text-accent px-4 py-1.5 rounded-xl font-black text-lg">
              ₹{vehicle.pricePerDay || 1600}/day
            </div>
          </div>

          {/* Status Tags */}
          <div className="flex gap-3 mb-2">
            <div className="flex items-center gap-1.5 bg-green-50 border border-green-200 text-green-600 px-3 py-1.5 rounded-full">
              <div className="bg-green-500 rounded-full p-0.5"><Check className="w-3 h-3 text-accent-foreground stroke-[3]" /></div>
              <span className="text-[12px] font-bold">Available</span>
            </div>
            <div className="flex items-center gap-1.5 bg-red-50 border border-red-200 text-red-600 px-3 py-1.5 rounded-full">
              <div className="bg-red-500 rounded-full p-0.5"><X className="w-3 h-3 text-accent-foreground stroke-[3]" /></div>
              <span className="text-[12px] font-bold">Non-Deliverable</span>
            </div>
          </div>
          
          <p className="text-xs text-muted-foreground mb-8 ml-1">Prices are different according to duration of booking</p>

          {/* Specs Grid */}
          <div className="grid grid-cols-3 gap-3 mb-8">
            <div className="bg-surface border border-border rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-2">
              <Settings className="w-6 h-6 text-accent" />
              <div>
                <div className="text-[13px] font-bold text-foreground">295 cc</div>
                <div className="text-[11px] text-muted-foreground font-medium">Engine</div>
              </div>
            </div>
            <div className="bg-surface border border-border rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-2">
              <Gauge className="w-6 h-6 text-accent" />
              <div>
                <div className="text-[13px] font-bold text-foreground">27 HP</div>
                <div className="text-[11px] text-muted-foreground font-medium">HP</div>
              </div>
            </div>
            <div className="bg-surface border border-border rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-2">
              <Settings className="w-6 h-6 text-accent" />
              <div>
                <div className="text-[13px] font-bold text-foreground">27 Nm</div>
                <div className="text-[11px] text-muted-foreground font-medium">Torque</div>
              </div>
            </div>
            <div className="bg-surface border border-border rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-2">
              <Fuel className="w-6 h-6 text-accent" />
              <div>
                <div className="text-[13px] font-bold text-foreground">31 kmpl</div>
                <div className="text-[11px] text-muted-foreground font-medium">Mileage</div>
              </div>
            </div>
            <div className="bg-surface border border-border rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-2">
              <Gauge className="w-6 h-6 text-accent" />
              <div>
                <div className="text-[13px] font-bold text-foreground">130 km/h</div>
                <div className="text-[11px] text-muted-foreground font-medium">Top Speed</div>
              </div>
            </div>
            <div className="bg-surface border border-border rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-2">
              <Weight className="w-6 h-6 text-accent" />
              <div>
                <div className="text-[13px] font-bold text-foreground">182 kg</div>
                <div className="text-[11px] text-muted-foreground font-medium">Weight</div>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Features</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center"><Check className="w-4 h-4 text-green-600 stroke-[3]" /></div>
                <span className="text-muted-foreground font-medium text-sm">Digital Console</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center"><Check className="w-4 h-4 text-green-600 stroke-[3]" /></div>
                <span className="text-muted-foreground font-medium text-sm">Abs</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center"><Check className="w-4 h-4 text-green-600 stroke-[3]" /></div>
                <span className="text-muted-foreground font-medium text-sm">Alloy Wheels</span>
              </div>
            </div>
            <button className="mt-4 text-accent font-bold text-sm w-full text-center">Show all features</button>
          </div>

        </div>
      </div>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4 z-50">
        <button 
          onClick={() => router.push(`/checkout?type=vehicle&id=${id}`)}
          className="w-full bg-accent text-accent-foreground font-black text-lg py-4 rounded-2xl shadow-lg shadow-[#ff9900]/30 active:scale-[0.98] transition-transform"
        >
          Book Now
        </button>
      </div>
    </div>
  );
}
