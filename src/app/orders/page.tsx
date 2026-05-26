'use client';

import { ProtectedRoute } from '@/components/protected-route';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Package, ShoppingBag, Loader2 } from 'lucide-react';
import { useUserBookings, useUserLaundryOrders } from '@/hooks/use-dashboard';

export default function OrdersPage() {
  const { data: bookingsData, isLoading: loadingBookings } = useUserBookings(1, 100);
  const { data: laundryData, isLoading: loadingLaundry } = useUserLaundryOrders(1, 100);

  const bookings = bookingsData?.bookings || [];
  const laundryOrders = laundryData?.orders || [];

  const combinedOrders = [
    ...bookings.map((b: any) => ({
      id: b.id || b._id,
      date: new Date(b.created_at || b.createdAt || b.startDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }),
      status: b.status || 'pending',
      type: b.serviceType || 'rental',
      items: b.serviceId?.name || b.serviceId?.title || (b.serviceType === 'vehicle' ? 'Vehicle Rental' : 'PG/Room Booking'),
      total: Number(b.totalAmount || b.total_amount || 0),
      rawDate: new Date(b.created_at || b.createdAt || b.startDate)
    })),
    ...laundryOrders.map((o: any) => ({
      id: o.id || o._id,
      date: new Date(o.created_at || o.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }),
      status: o.status || 'pending',
      type: 'laundry',
      items: o.laundryService?.name || 'Laundry Service',
      total: Number(o.totalAmount || o.total_amount || 0),
      rawDate: new Date(o.created_at || o.createdAt)
    }))
  ].sort((a, b) => b.rawDate.getTime() - a.rawDate.getTime());

  const isLoading = loadingBookings || loadingLaundry;

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">My Orders</h1>
            <p className="text-muted-foreground">View your marketplace purchases, vehicle/room bookings, and laundry service history.</p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <span className="ml-2 text-muted-foreground">Loading orders...</span>
          </div>
        ) : (
          <div className="space-y-4">
            {combinedOrders.map((order) => (
              <Card key={order.id} className="border-border/50 hover:border-primary/50 transition-colors">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-4 justify-between md:items-center">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-full flex-shrink-0 ${
                        order.type === 'laundry' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
                      }`}>
                        {order.type === 'laundry' ? <Package className="w-6 h-6" /> : <ShoppingBag className="w-6 h-6" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-lg">{order.id.slice(-8).toUpperCase()}</span>
                          <Badge variant="outline" className={
                            order.status.toLowerCase() === 'delivered' || 
                            order.status.toLowerCase() === 'completed' || 
                            order.status.toLowerCase() === 'confirmed'
                              ? 'border-primary/30 text-primary' 
                              : 'border-amber-500/30 text-amber-500'
                          }>
                            {order.status}
                          </Badge>
                        </div>
                        <p className="text-foreground font-medium mb-1">{order.items}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4" /> {order.date}
                        </div>
                      </div>
                    </div>
                    <div className="text-left md:text-right mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-none">
                      <p className="text-sm text-muted-foreground mb-1">Total Amount</p>
                      <p className="text-2xl font-bold">₹{order.total.toFixed(2)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {combinedOrders.length === 0 && (
              <div className="text-center py-20 border rounded-2xl border-dashed">
                <ShoppingBag className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium">No orders yet</h3>
                <p className="text-muted-foreground">When you buy items, rent vehicles, rent rooms, or book laundry services, they will appear here.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
