const fs = require('fs');

const content = `'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Heart, Check, X, Users, Fuel, Gauge, Weight, Settings, Star } from 'lucide-react';
import { useVehicle } from '@/hooks/use-vehicle';

export default function VehicleDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { data: vehicle, isLoading } = useVehicle(id);

  const [activeImage, setActiveImage] = useState(0);

  if (isLoading || !vehicle) return <div className="min-h-screen bg-slate-50 flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-white pb-24 font-sans">
      {/* Top Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="p-2 hover:bg-slate-100 rounded-full">
            <ArrowLeft className="w-6 h-6 text-slate-800" />
          </button>
          <span className="text-lg font-bold">Vehicle Details</span>
        </div>
        <button className="p-2 hover:bg-slate-100 rounded-full">
          <Heart className="w-6 h-6 text-slate-800" />
        </button>
      </div>

      <div className="pt-16">
        {/* Image Carousel */}
        <div className="relative w-full aspect-[4/3] bg-zinc-100 overflow-hidden">
          <img src={vehicle.images?.[activeImage] || 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc'} className="w-full h-full object-cover" alt={vehicle.name} />
          
          <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1.5 rounded-full text-[11px] font-bold flex items-center gap-1.5 backdrop-blur-md">
            <Star className="w-3.5 h-3.5 fill-white" /> Premium
          </div>
          
          <div className="absolute top-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md">
            {activeImage + 1}/{vehicle.images?.length || 1}
          </div>
        </div>

        {/* Content Container */}
        <div className="px-5 py-6">
          {/* Host Info */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-500">
              <User className="w-4 h-4" />
            </div>
            <span className="text-sm font-semibold text-slate-600">
              Hosted by <span className="text-orange-500">{typeof vehicle.vendorId === 'object' ? vehicle.vendorId?.name : 'Vendor'}</span>
            </span>
          </div>

          {/* Title & Price */}
          <div className="flex items-start justify-between mb-4">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">{vehicle.name || vehicle.modelName}</h1>
            <div className="bg-[#ff9900]/10 border border-[#ff9900]/30 text-[#ff9900] px-4 py-1.5 rounded-xl font-black text-lg">
              ₹{vehicle.pricePerDay || 1600}/day
            </div>
          </div>

          {/* Status Tags */}
          <div className="flex gap-3 mb-2">
            <div className="flex items-center gap-1.5 bg-green-50 border border-green-200 text-green-600 px-3 py-1.5 rounded-full">
              <div className="bg-green-500 rounded-full p-0.5"><Check className="w-3 h-3 text-white stroke-[3]" /></div>
              <span className="text-[12px] font-bold">Available</span>
            </div>
            <div className="flex items-center gap-1.5 bg-red-50 border border-red-200 text-red-600 px-3 py-1.5 rounded-full">
              <div className="bg-red-500 rounded-full p-0.5"><X className="w-3 h-3 text-white stroke-[3]" /></div>
              <span className="text-[12px] font-bold">Non-Deliverable</span>
            </div>
          </div>
          
          <p className="text-xs text-slate-500 mb-8 ml-1">Prices are different according to duration of booking</p>

          {/* Specs Grid */}
          <div className="grid grid-cols-3 gap-3 mb-8">
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-2">
              <Settings className="w-6 h-6 text-[#ff9900]" />
              <div>
                <div className="text-[13px] font-bold text-slate-800">295 cc</div>
                <div className="text-[11px] text-slate-500 font-medium">Engine</div>
              </div>
            </div>
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-2">
              <Gauge className="w-6 h-6 text-[#ff9900]" />
              <div>
                <div className="text-[13px] font-bold text-slate-800">27 HP</div>
                <div className="text-[11px] text-slate-500 font-medium">HP</div>
              </div>
            </div>
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-2">
              <Settings className="w-6 h-6 text-[#ff9900]" />
              <div>
                <div className="text-[13px] font-bold text-slate-800">27 Nm</div>
                <div className="text-[11px] text-slate-500 font-medium">Torque</div>
              </div>
            </div>
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-2">
              <Fuel className="w-6 h-6 text-[#ff9900]" />
              <div>
                <div className="text-[13px] font-bold text-slate-800">31 kmpl</div>
                <div className="text-[11px] text-slate-500 font-medium">Mileage</div>
              </div>
            </div>
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-2">
              <Gauge className="w-6 h-6 text-[#ff9900]" />
              <div>
                <div className="text-[13px] font-bold text-slate-800">130 km/h</div>
                <div className="text-[11px] text-slate-500 font-medium">Top Speed</div>
              </div>
            </div>
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-2">
              <Weight className="w-6 h-6 text-[#ff9900]" />
              <div>
                <div className="text-[13px] font-bold text-slate-800">182 kg</div>
                <div className="text-[11px] text-slate-500 font-medium">Weight</div>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Features</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center"><Check className="w-4 h-4 text-green-600 stroke-[3]" /></div>
                <span className="text-slate-700 font-medium text-sm">Digital Console</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center"><Check className="w-4 h-4 text-green-600 stroke-[3]" /></div>
                <span className="text-slate-700 font-medium text-sm">Abs</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center"><Check className="w-4 h-4 text-green-600 stroke-[3]" /></div>
                <span className="text-slate-700 font-medium text-sm">Alloy Wheels</span>
              </div>
            </div>
            <button className="mt-4 text-[#ff9900] font-bold text-sm w-full text-center">Show all features</button>
          </div>

        </div>
      </div>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 p-4 z-50">
        <button 
          onClick={() => router.push(\`/checkout?type=vehicle&id=\${id}\`)}
          className="w-full bg-[#ff9900] text-white font-black text-lg py-4 rounded-2xl shadow-lg shadow-[#ff9900]/30 active:scale-[0.98] transition-transform"
        >
          Book Now
        </button>
      </div>
    </div>
  );
}
`;

fs.writeFileSync('src/app/vehicles/[id]/page.tsx', content);
