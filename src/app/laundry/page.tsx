'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Search, WashingMachine } from 'lucide-react';
import { useLaundryServices } from '@/hooks/use-laundry-services';
import { useAuthStore } from '@/store/auth.store';
import { AddLaundryServiceDialog } from '@/components/add-laundry-service-dialog';
import { AirbnbListingCard } from '@/components/airbnb-listing-card';

export default function LaundryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: services, isLoading } = useLaundryServices();
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'admin';

  const mappedServices = (services || []).map(service => ({
    id: service._id,
    title: service.name,
    type: 'laundry' as const,
    price: service.services?.[0]?.price || 0,
    unit: service.services?.[0]?.unit || 'pc',
    image: service.images?.[0] || '',
    category: 'Laundry',
    vendorName: service.providerName || 'Independent Provider',
    rating: 0,
    href: `/laundry/${service._id}`,
    onsitePickup: service.onsitePickup,
    onStoreService: service.onStoreService,
  }));

  const filteredServices = mappedServices.filter(v =>
    v.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background text-foreground pb-20 theme-laundry">
      {/* Header */}
      <div className="container mx-auto px-6 pt-8 pb-2">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Laundry</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Professional wash, dry clean, and ironing services
            </p>
          </div>
          {isAdmin && <AddLaundryServiceDialog />}
        </div>
      </div>

      <div className="container mx-auto px-6">
        {/* Search Bar */}
        <div className="py-4 border-b border-border mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search providers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-10 pl-10 pr-4 bg-background border border-border rounded-full text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/10 focus:border-foreground/20 transition-colors"
            />
          </div>
          <span className="text-sm text-muted-foreground mt-3 block">
            {filteredServices.length} {filteredServices.length === 1 ? 'provider' : 'providers'} available
          </span>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 py-6">
            {Array.from({ length: 6 }).map((_, i) => (
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredServices.map((service) => (
                <AirbnbListingCard
                  key={service.id}
                  id={service.id}
                  title={service.title}
                  subtitle={service.vendorName}
                  secondaryInfo={service.onsitePickup ? 'Doorstep pickup available' : 'In-store service'}
                  images={[service.image]}
                  price={service.price}
                  priceUnit={service.unit}
                  rating={4.7}
                  badge="EXPRESS"
                  badgeVariant="primary"
                  href={service.href}
                />
              ))}
            </div>

            {filteredServices.length === 0 && (
              <div className="text-center py-24">
                <WashingMachine className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-1">No services found</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  We couldn't find any laundry providers matching your search.
                </p>
                <Button
                  onClick={() => setSearchTerm('')}
                  variant="outline"
                  className="rounded-full px-6"
                >
                  Clear search
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
