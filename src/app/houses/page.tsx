'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Home, Search } from 'lucide-react';
import { useHouses } from '@/hooks/use-houses';
import { useAuthStore } from '@/store/auth.store';
import { AddHouseDialog } from '@/components/add-house-dialog';
import { AirbnbListingCard } from '@/components/airbnb-listing-card';

function VendorGroup({ vendorName, rooms }: { vendorName: string; rooms: any[] }) {
  return (
    <div className="py-6">
      <div className="flex items-center gap-4 mb-6">
        <h2 className="text-base font-semibold text-foreground whitespace-nowrap">{vendorName}</h2>
        <div className="h-px flex-1 bg-border" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {rooms.map((room: any) => (
          <AirbnbListingCard
            key={room.id}
            id={room.id}
            title={room.title}
            subtitle={room.rawLocation}
            secondaryInfo={`Managed by ${room.vendorName}`}
            images={[room.image]}
            price={room.propertyType === 'pg' ? room.pricePerMonth : room.pricePerDay}
            priceUnit={room.propertyType === 'pg' ? 'month' : 'day'}
            rating={4.9}
            badge={room.isAvailable === false ? 'BOOKED' : 'VERIFIED'}
            badgeVariant={room.isAvailable === false ? 'default' : 'success'}
            href={room.href}
          />
        ))}
      </div>
    </div>
  );
}

export default function HousesPage() {
  const [typeFilter, setTypeFilter] = useState<'all' | 'pg' | 'room'>('all');
  const { data: rooms, isLoading } = useHouses();
  const { user } = useAuthStore();
  const isVendor = user?.role === 'vendor';

  const mappedRooms = (rooms || []).map((r: any) => ({
    id: r._id,
    title: r.title,
    type: 'house' as const,
    propertyType: r.propertyType,
    pricePerMonth: r.pricePerMonth || 0,
    pricePerDay: r.pricePerDay || 0,
    image: r.images?.[0] || '',
    vendorName: r.vendor?.name || 'Unknown Vendor',
    rating: 0,
    href: `/houses/${r._id}`,
    rawLocation: r.city || r.address || '',
    isAvailable: r.isAvailable,
  }));

  const filteredRooms = mappedRooms.filter((v: any) => {
    const type = v.propertyType?.toLowerCase();
    if (typeFilter === 'pg') return type === 'pg';
    if (typeFilter === 'room') return type === 'room';
    return true;
  });

  const filterOptions = [
    { key: 'all' as const, label: 'All stays' },
    { key: 'pg' as const, label: 'PGs' },
    { key: 'room' as const, label: 'Rooms' },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground pb-20 theme-house">
      {/* Header */}
      <div className="container mx-auto px-6 pt-8 pb-2">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Stays</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Explore verified PGs and rooms near campus
            </p>
          </div>
          {isVendor && <AddHouseDialog />}
        </div>
      </div>

      <div className="container mx-auto px-6">
        {/* Filter Bar */}
        <div className="flex items-center gap-2 py-4 overflow-x-auto scrollbar-hide border-b border-border mb-6">
          {filterOptions.map((opt) => (
            <button
              key={opt.key}
              onClick={() => setTypeFilter(opt.key)}
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
            {filteredRooms.length} {filteredRooms.length === 1 ? 'result' : 'results'}
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
              filteredRooms.reduce((acc: any, room: any) => {
                const vendorName = room.vendorName || 'Independent Hosts';
                if (!acc[vendorName]) {
                  acc[vendorName] = { rooms: [] };
                }
                acc[vendorName].rooms.push(room);
                return acc;
              }, {} as Record<string, { rooms: typeof filteredRooms }>)
            )
              .sort((a, b) => a[0].localeCompare(b[0]))
              .map(([vendorName, data]: [string, any]) => (
                <VendorGroup
                  key={vendorName}
                  vendorName={vendorName}
                  rooms={data.rooms}
                />
              ))}

            {filteredRooms.length === 0 && (
              <div className="text-center py-24">
                <Home className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-1">No stays found</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  We couldn't find any stays matching your criteria.
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
