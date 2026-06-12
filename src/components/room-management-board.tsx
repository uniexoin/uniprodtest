'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Home, Calendar, AlertCircle, CheckCircle2, IndianRupee, Clock } from 'lucide-react';
import { useVendorRoomOccupancy } from '@/hooks/use-dashboard';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

function RoomCheckInModal({ room }: { room: any }) {
    const [open, setOpen] = useState(false);
    const queryClient = useQueryClient();
    
    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [customerEmail, setCustomerEmail] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [bookingType, setBookingType] = useState('monthly');
    const [totalAmount, setTotalAmount] = useState('');

    const mutation = useMutation({
        mutationFn: async (payload: any) => {
            const res = await fetch('/api/vendors/analytics/room-occupancy/action', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'check_in', id: room._id, payload })
            });
            const json = await res.json();
            if (!json.success) throw new Error(json.error);
            return json;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['vendorRoomOccupancy'] });
            setOpen(false);
        }
    });

    const handleCheckIn = (e: React.FormEvent) => {
        e.preventDefault();
        mutation.mutate({
            customerName, customerPhone, customerEmail, startDate, endDate, bookingType, 
            totalAmount: Number(totalAmount) || room.pricePerMonth || room.pricePerDay || 0
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-500/20 h-11">
                    Check In Tenant
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] glass-premium border border-white/20 dark:border-white/10 shadow-2xl backdrop-blur-2xl">
                <DialogHeader>
                    <DialogTitle>Check In: {room.title}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCheckIn} className="space-y-4 pt-4">
                    <div className="space-y-2">
                        <Label>Customer Name</Label>
                        <Input required value={customerName} onChange={e => setCustomerName(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label>Customer Phone</Label>
                        <Input required value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label>Customer Email (for alerts)</Label>
                        <Input type="email" value={customerEmail} onChange={e => setCustomerEmail(e.target.value)} placeholder="tenant@example.com" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Check-In Date</Label>
                            <Input type="date" required value={startDate} onChange={e => setStartDate(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>End Date (Optional)</Label>
                            <Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Billing Cycle</Label>
                        <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={bookingType} onChange={e => setBookingType(e.target.value)}>
                            <option value="monthly">Monthly</option>
                            <option value="daily">Daily</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <Label>Total Initial Payment (₹)</Label>
                        <Input type="number" required value={totalAmount} onChange={e => setTotalAmount(e.target.value)} placeholder={String(room.pricePerMonth || room.pricePerDay || '')} />
                    </div>
                    <Button type="submit" className="w-full" disabled={mutation.isPending}>
                        {mutation.isPending ? 'Processing...' : 'Confirm Check-In'}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export function RoomManagementBoard() {
  const { data } = useVendorRoomOccupancy();
  const rooms = data?.rooms || [];
  const todayRevenue = data?.todayRevenue || 0;
  const queryClient = useQueryClient();

  const checkoutMutation = useMutation({
      mutationFn: async (id: string) => {
          const res = await fetch('/api/vendors/analytics/room-occupancy/action', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ action: 'check_out', id })
          });
          const json = await res.json();
          if (!json.success) throw new Error(json.error);
          return json;
      },
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ['vendorRoomOccupancy'] })
  });

  const markPaidMutation = useMutation({
      mutationFn: async (bookingId: string) => {
          const res = await fetch('/api/vendors/analytics/room-occupancy/action', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ action: 'mark_paid', bookingId })
          });
          const json = await res.json();
          if (!json.success) throw new Error(json.error);
          return json;
      },
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ['vendorRoomOccupancy'] })
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 bg-white/40 dark:bg-zinc-900/40 p-6 rounded-[2rem] border border-white/60 dark:border-zinc-800 shadow-inner">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight flex items-center gap-3">
            <Home className="w-8 h-8 text-[#8B004A]" /> Live Room Management
          </h2>
          <div className="flex items-center gap-2 mt-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span className="text-sm font-medium text-muted-foreground">Live Sync Active</span>
          </div>
        </div>
        
        {/* Daily Revenue Bar */}
        <div className="flex flex-col bg-white dark:bg-zinc-900 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-zinc-800 text-center sm:text-right">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Today's Room Revenue</span>
            <span className="text-3xl font-black text-[#8B004A] dark:text-rose-400 leading-none mt-1">₹{todayRevenue.toLocaleString()}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {rooms?.map((r: any) => (
          <motion.div
            key={r._id}
            whileHover={{ y: -8, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
            className={`overflow-hidden rounded-3xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md flex flex-col border border-slate-200/50 dark:border-zinc-800 shadow-sm transition-all duration-300 ${
              r.currentStatus === 'available' ? 'shadow-green-500/5 hover:border-green-500/40 hover:shadow-[0_0_20px_rgba(34,197,94,0.15)]' : 
              r.currentBooking?.rentStatus === 'overdue' ? 'shadow-red-500/10 hover:border-red-600/40 hover:shadow-[0_0_20px_rgba(239,68,68,0.2)]' : 
              r.currentBooking?.rentStatus === 'due_soon' ? 'shadow-blue-500/10 hover:border-blue-500/40 hover:shadow-[0_0_20px_rgba(59,130,246,0.15)]' : 
              'shadow-emerald-500/10 hover:border-emerald-500/40 hover:shadow-[0_0_20px_rgba(16,185,129,0.15)]'
            }`}
          >
            {/* Room Image */}
            <div className="relative h-48 w-full bg-slate-100 dark:bg-zinc-800 overflow-hidden group">
               <img src={r.images?.[0] || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80'} alt={r.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
               <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
               
               <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                  <div className="text-white">
                    <h3 className="font-black text-lg leading-tight tracking-tight shadow-sm">{r.title}</h3>
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mt-1">{r.propertyType}</p>
                  </div>
                  <Badge className={`border-0 shadow-lg px-3 py-1 text-[10px] font-black uppercase tracking-wider rounded-full ${
                    r.currentStatus === 'available' ? 'bg-green-500 text-white hover:bg-green-600 shadow-green-500/20' : 'bg-rose-500 text-white hover:bg-rose-600 shadow-rose-500/20'
                  }`}>
                    {r.currentStatus}
                  </Badge>
               </div>
            </div>

            <CardContent className="p-5 flex-1 flex flex-col">
                {r.currentStatus === 'occupied' && r.currentBooking ? (
                  <div className="bg-slate-50/50 dark:bg-zinc-950/40 p-4 rounded-2xl mb-4 text-sm space-y-3 flex-1 border border-slate-150 dark:border-white/5">
                    <div className="flex justify-between items-center border-b border-slate-100 dark:border-white/5 pb-2">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5"><AlertCircle className="w-3.5 h-3.5"/> Tenant</span>
                      <div className="text-right">
                        <span className="font-black text-foreground block">{r.currentBooking.customer?.name || r.currentBooking.notes ? JSON.parse(r.currentBooking.notes).offlineCustomer?.name : 'Customer'}</span>
                        <span className="text-[10px] text-muted-foreground font-bold">{r.currentBooking.customer?.phone || r.currentBooking.notes ? JSON.parse(r.currentBooking.notes).offlineCustomer?.phone : ''}</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center border-b border-slate-100 dark:border-white/5 pb-2">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5"/> Checked In</span>
                      <span className="font-bold text-xs text-foreground">{new Date(r.currentBooking.startDate).toLocaleDateString()}</span>
                    </div>

                    <div className="flex justify-between items-center border-b border-slate-100 dark:border-white/5 pb-2">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Revenue</span>
                      <span className="font-black text-green-600 dark:text-green-400">₹{r.currentBooking.totalAmount} / {r.currentBooking.bookingType}</span>
                    </div>

                    {/* Rent Status Indicators */}
                    <div className={`flex justify-between items-center p-2.5 rounded-xl mt-2 font-black text-[10px] uppercase tracking-widest ${
                        r.currentBooking.rentStatus === 'overdue' ? 'bg-red-500/10 text-red-600 dark:text-red-400 animate-pulse border border-red-500/20' :
                        r.currentBooking.rentStatus === 'due_soon' ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 animate-pulse border border-blue-500/20' :
                        'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                    }`}>
                       <span className="flex items-center gap-1">
                          {r.currentBooking.rentStatus === 'overdue' ? <AlertCircle className="w-3.5 h-3.5"/> : 
                           r.currentBooking.rentStatus === 'due_soon' ? <Clock className="w-3.5 h-3.5"/> : <CheckCircle2 className="w-3.5 h-3.5"/>}
                          {r.currentBooking.rentStatus === 'overdue' ? 'RENT OVERDUE' :
                           r.currentBooking.rentStatus === 'due_soon' ? 'RENT DUE SOON' : 'RENT PAID'}
                       </span>
                       <span className="text-[9px] font-bold">
                          {r.currentBooking.rentStatus === 'overdue' ? `Since ${r.currentBooking.overdueDays} Days` :
                           r.currentBooking.rentStatus === 'due_soon' ? `In ${r.currentBooking.daysUntilDue} Days` : 'Up to date'}
                       </span>
                    </div>
                  </div>
                ) : (
                  <div className="mb-4 flex-1 flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-200 dark:border-zinc-800 rounded-2xl bg-slate-50/50 dark:bg-zinc-900/10">
                     <p className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-1.5">Room Available</p>
                     <p className="text-2xl font-black text-foreground text-center">
                       ₹{(r.pricePerMonth || r.pricePerDay).toLocaleString()}
                       <span className="block text-xs text-muted-foreground font-bold uppercase tracking-wider mt-1">/ {r.pricePerMonth ? 'month' : 'day'}</span>
                     </p>
                  </div>
                )}

                <div className="flex gap-2 mt-auto pt-2">
                  {r.currentStatus === 'available' ? (
                     <RoomCheckInModal room={r} />
                  ) : (
                    <>
                        {r.currentBooking?.rentStatus !== 'paid' && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="flex-1 bg-green-50 text-green-700 border-green-200 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900 dark:hover:bg-green-900/40 font-black uppercase tracking-wider h-11 rounded-xl shadow-sm"
                              onClick={() => markPaidMutation.mutate(r.currentBooking._id)}
                              disabled={markPaidMutation.isPending}
                            >
                              <IndianRupee className="w-4 h-4 mr-1"/> Paid
                            </Button>
                        )}
                        <Button 
                          size="sm" 
                          variant="destructive"
                          className="flex-1 font-black uppercase tracking-wider h-11 rounded-xl shadow-md shadow-rose-500/10"
                          onClick={() => checkoutMutation.mutate(r._id)}
                          disabled={checkoutMutation.isPending}
                        >
                          Check Out
                        </Button>
                    </>
                  )}
                </div>
            </CardContent>
          </motion.div>
        ))}
        {rooms?.length === 0 && (
            <div className="col-span-full py-20 text-center flex flex-col items-center">
                <div className="w-20 h-20 bg-slate-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4">
                   <Home className="w-10 h-10 text-slate-400" />
                </div>
                <h3 className="text-xl font-bold">No Rooms found</h3>
                <p className="text-muted-foreground mt-2">Add properties to your portfolio to manage them here.</p>
            </div>
        )}
      </div>
    </div>
  );
}
