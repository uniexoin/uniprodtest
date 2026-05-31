'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Car } from 'lucide-react';
import { useVehicles } from '@/hooks/use-vehicles';
import { useAuthStore } from '@/modules/auth/auth.store';
import { AddVehicleDialog } from '@/components/add-vehicle-dialog';
import { AirbnbListingCard } from '@/components/airbnb-listing-card';
import { haptics } from '@/lib/haptics';

function VendorGroup({ vendorName, vehicles }: { vendorName: string; vehicles: any[] }) {
  return (
    <div className="py-6">
      <div className="flex items-center gap-4 mb-6">
        <h2 className="text-base font-semibold text-foreground whitespace-nowrap">{vendorName}</h2>
        <div className="h-px flex-1 bg-border" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {vehicles.map((vehicle: any) => (
          <AirbnbListingCard
            key={vehicle.id}
            id={vehicle.id}
            title={vehicle.title}
            subtitle={vehicle.rawLocation}
            secondaryInfo={`₹${vehicle.pricePerHour}/hr · ${vehicle.rawType}`}
            images={[vehicle.image]}
            price={vehicle.pricePerDay}
            priceUnit="day"
            rating={4.8}
            badge={vehicle.rawType?.toLowerCase() === 'car' ? 'PREMIUM' : 'POPULAR'}
            badgeVariant={vehicle.rawType?.toLowerCase() === 'car' ? 'accent' : 'primary'}
            href={vehicle.href}
          />
        ))}
      </div>
    </div>
  );
}

export default function VehiclesPage() {
  const [typeFilter, setTypeFilter] = useState<'all' | 'car' | 'bike'>('all');
  const { data: vehicles, isLoading } = useVehicles();
  const { user } = useAuthStore();
  const isVendor = user?.role === 'vendor';

  const mappedVehicles = (vehicles || []).map(v => ({
    id: v._id,
    title: v.name,
    type: 'vehicle' as const,
    pricePerDay: v.pricePerDay || 0,
    pricePerHour: v.pricePerHour || Math.round((v.pricePerDay || 0) / 24) || 0,
    image: v.images?.[0] || '',
    vendorName: v.vendorId?.name || 'Unknown Vendor',
    rating: 4.8,
    href: `/vehicles/${v._id}`,
    rawType: v.type,
    rawLocation: typeof v.location === 'string' ? v.location : (v as any).location?.address || '',
  }));

  const filteredVehicles = mappedVehicles.filter(v => {
    const type = v.rawType?.toLowerCase();
    if (typeFilter === 'car') return type === 'car';
    if (typeFilter === 'bike') return ['bike', 'scooter'].includes(type);
    return true;
  });

  const filterOptions = [
    { key: 'all' as const, label: 'All vehicles' },
    { key: 'car' as const, label: 'Cars' },
    { key: 'bike' as const, label: 'Bikes' },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground pb-20 has-bottom-nav md:pb-20 theme-car">
      {/* Header */}
      <div className="container mx-auto px-4 md:px-6 pt-8 pb-2">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Vehicles</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Rent verified cars and bikes with ease
            </p>
          </div>
          {isVendor && <AddVehicleDialog />}
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6">
        {/* Filter Bar */}
        <div className="flex items-center gap-2 py-4 overflow-x-auto scrollbar-hide border-b border-border mb-6">
          {filterOptions.map((opt) => (
            <button
              key={opt.key}
              onClick={() => {
                setTypeFilter(opt.key);
                haptics.selection();
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                typeFilter === opt.key
                  ? 'bg-foreground text-background'
                  : 'bg-transparent text-muted-foreground border border-border hover:border-foreground hover:text-foreground'
              }`}
            >
              {opt.label}
            </button>
          ))}

          <span className="ml-auto text-sm text-muted-foreground whitespace-nowrap hidden sm:inline">
            {filteredVehicles.length} {filteredVehicles.length === 1 ? 'vehicle' : 'vehicles'}
          </span>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 py-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="aspect-square rounded-xl bg-muted animate-pulse" />
                <div className="h-4 bg-muted animate-pulse rounded w-2/3" />
                <div className="h-3 bg-muted animate-pulse rounded w-1/2" />
                <div className="h-4 bg-muted animate-pulse rounded w-1/4" />
              </div>
            ))}
          </div>
        ) : (
          <div>
            {Object.entries(
              filteredVehicles.reduce((acc, vehicle) => {
                const vendorName = vehicle.vendorName || 'Independent Hosts';
                if (!acc[vendorName]) {
                  acc[vendorName] = { vehicles: [] };
                }
                acc[vendorName].vehicles.push(vehicle);
                return acc;
              }, {} as Record<string, { vehicles: typeof filteredVehicles }>)
            )
              .sort((a, b) => a[0].localeCompare(b[0]))
              .map(([vendorName, data]) => (
                <VendorGroup
                  key={vendorName}
                  vendorName={vendorName}
                  vehicles={data.vehicles}
                />
              ))}

            {filteredVehicles.length === 0 && (
              <div className="text-center py-24">
                <Car className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-1">No vehicles found</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  We couldn't find any vehicles matching your preference.
                </p>
                <Button
                  onClick={() => setTypeFilter('all')}
                  variant="outline"
                  className="rounded-full px-6"
                >
                  Clear filters
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
