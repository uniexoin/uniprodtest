'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Script from 'next/script';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { 
  Shield, Car, Home, MapPin, Clock, CreditCard, CheckCircle, 
  ArrowLeft, Loader2, LocateFixed, Sparkles, ChevronRight, Info 
} from 'lucide-react';
import { useAuthStore } from '@/modules/auth/auth.store';
import { useCreateBooking } from '@/hooks/use-booking';
import { useCreatePaymentOrder, useVerifyPayment } from '@/hooks/use-payment';

declare global { interface Window { Razorpay: any; } }

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();

  const serviceType = searchParams.get('type') || 'vehicle';
  const serviceId = searchParams.get('id') || '';
  const serviceName = searchParams.get('name') || 'Service';

  const createBooking = useCreateBooking();
  const createOrder = useCreatePaymentOrder();
  const verifyPayment = useVerifyPayment();

  const [serviceData, setServiceData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [startDate, setStartDate] = useState(searchParams.get('startDate') || '');
  const [endDate, setEndDate] = useState(searchParams.get('endDate') || '');
  const [bookingType, setBookingType] = useState<'daily' | 'hourly'>((searchParams.get('bookingType') as any) || 'daily');
  const [bookingLocation, setBookingLocation] = useState(searchParams.get('location') || '');
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [roomTab, setRoomTab] = useState(searchParams.get('roomTab') || 'single');
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=/checkout?type=${serviceType}&id=${serviceId}`);
    }
  }, [isAuthenticated]);

  // Set default dates if not provided in query parameters
  useEffect(() => {
    if (!startDate) {
      const today = new Date();
      const offset = today.getTimezoneOffset();
      const localToday = new Date(today.getTime() - (offset * 60 * 1000));
      if (bookingType === 'hourly') {
        setStartDate(localToday.toISOString().slice(0, 16));
      } else {
        setStartDate(localToday.toISOString().slice(0, 10));
      }
    }
    if (!endDate) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + (serviceType === 'house' ? 30 : 1));
      const offset = tomorrow.getTimezoneOffset();
      const localTomorrow = new Date(tomorrow.getTime() - (offset * 60 * 1000));
      if (bookingType === 'hourly') {
        setEndDate(localTomorrow.toISOString().slice(0, 16));
      } else {
        setEndDate(localTomorrow.toISOString().slice(0, 10));
      }
    }
  }, [serviceType, bookingType, startDate, endDate]);

  // Fetch service data
  useEffect(() => {
    if (!serviceId) return;
    const endpoint = serviceType === 'house' ? `/api/houses/${serviceId}` : `/api/vehicles/${serviceId}`;
    fetch(endpoint)
      .then(r => r.json())
      .then(json => { setServiceData(json.data || null); setLoading(false); })
      .catch(() => { setLoading(false); });
  }, [serviceId, serviceType]);

  // Calculate units
  const [units, setUnits] = useState(1);
  useEffect(() => {
    if (!startDate || !endDate) return;
    const s = new Date(startDate), e = new Date(endDate);
    const diff = Math.abs(e.getTime() - s.getTime());
    if (bookingType === 'hourly') setUnits(Math.max(1, Math.ceil(diff / 3600000)));
    else setUnits(Math.max(1, Math.ceil(diff / 86400000)));
  }, [startDate, endDate, bookingType]);

  // Price calculation
  let unitPrice = 0, basePrice = 0, securityDep = 0, monthlyRent = 0, totalMonths = 0, total = 0, label = '';
  if (serviceData) {
    if (serviceType === 'house') {
      const h = serviceData;
      const propType = h.property_type || h.propertyType;
      if (propType === 'pg') {
        monthlyRent = roomTab === 'double'
          ? (h.double_sharing_price || h.doubleSharingPrice || 0)
          : (h.single_sharing_price || h.singleSharingPrice || h.price_per_month || h.pricePerMonth || 0);
        totalMonths = Math.max(1, Math.ceil(units / 30));
        securityDep = h.security_deposit || h.securityDeposit || 0;
        basePrice = monthlyRent;
        total = monthlyRent + securityDep;
        label = `₹${monthlyRent}/mo × 1 month (upfront) + ₹${securityDep} deposit`;
      } else {
        unitPrice = h.price_per_day || h.pricePerDay || 0;
        basePrice = unitPrice * units;
        total = basePrice;
        label = `₹${unitPrice} × ${units} days`;
      }
    } else {
      unitPrice = bookingType === 'hourly'
        ? (serviceData.price_per_hour || serviceData.pricePerHour || Math.round((serviceData.price_per_day || serviceData.pricePerDay || 0) / 24))
        : (serviceData.price_per_day || serviceData.pricePerDay || 0);
      basePrice = unitPrice * units;
      total = basePrice;
      label = `₹${unitPrice} × ${units} ${bookingType === 'hourly' ? 'hours' : 'days'}`;
    }
  }

  const handleFetchLocation = () => {
    if (!navigator.geolocation) { toast.error('Geolocation not supported.'); return; }
    setIsFetchingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const r = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`);
          const d = await r.json();
          const a = d.address;
          setBookingLocation([a.city || a.town || a.village, a.state].filter(Boolean).join(', '));
          toast.success('Location updated!');
        } catch { toast.error('Could not get address.'); }
        setIsFetchingLocation(false);
      },
      () => { setIsFetchingLocation(false); toast.error('Location access denied.'); },
      { timeout: 10000 }
    );
  };

  const handlePay = async () => {
    if (!startDate || !endDate) { toast.error('Select start and end dates.'); return; }
    if (new Date(startDate) >= new Date(endDate)) { toast.error('End must be after start.'); return; }

    const vendorId = typeof serviceData?.vendor_id === 'string' ? serviceData.vendor_id
      : serviceData?.vendor?.id || serviceData?.vendorId;
    if (user?.id === vendorId) { toast.error('Cannot book your own listing.'); return; }

    setIsProcessing(true);
    try {
      const s = new Date(startDate), e = new Date(endDate);
      s.setHours(12,0,0,0); e.setHours(12,0,0,0);

      const bookingRes = await createBooking.mutateAsync({
        userId: user!.id,
        serviceType: serviceType as any,
        serviceId,
        startDate: s.toISOString(),
        endDate: e.toISOString(),
        bookingType,
        notes: bookingLocation ? `Location: ${bookingLocation}` : undefined,
        securityDeposit: securityDep,
        monthlyRent,
        totalMonths,
      } as any);

      const bookingId = bookingRes.data.id || bookingRes.data._id;
      const amt = bookingRes.data.total_amount || bookingRes.data.totalAmount || total;

      const orderRes = await createOrder.mutateAsync({
        userId: user!.id, serviceType: serviceType as any, referenceId: bookingId, amount: amt,
      });

      const opts = {
        key: orderRes.data.key,
        amount: orderRes.data.amount,
        currency: orderRes.data.currency,
        name: 'UniExo',
        description: `Booking: ${serviceName}`,
        order_id: orderRes.data.razorpayOrderId,
        handler: async (resp: any) => {
          try {
            await verifyPayment.mutateAsync({
              razorpay_order_id: resp.razorpay_order_id,
              razorpay_payment_id: resp.razorpay_payment_id,
              razorpay_signature: resp.razorpay_signature,
            });
            setPaymentSuccess(true);
            toast.success('Payment successful! Booking confirmed.');
          } catch { toast.error('Payment verification failed.'); }
          setIsProcessing(false);
        },
        prefill: { name: user?.name, email: user?.email },
        theme: { color: '#8B004A' },
        modal: { ondismiss: () => { setIsProcessing(false); toast.error('Payment cancelled.'); } },
      };
      const rzp = new window.Razorpay(opts);
      rzp.on('payment.failed', () => { setIsProcessing(false); toast.error('Payment failed.'); });
      rzp.open();
    } catch (err: any) {
      toast.error(err.message || 'Booking failed.');
      setIsProcessing(false);
    }
  };

  if (paymentSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-slate-900 via-zinc-950 to-[#5B2C6F] p-4 text-white">
        <Card className="p-10 text-center max-w-md mx-auto shadow-2xl border border-white/10 rounded-3xl bg-zinc-900/60 backdrop-blur-2xl text-white">
          <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <CheckCircle className="w-10 h-10 text-emerald-400" />
          </div>
          <h2 className="text-3xl font-black mb-3 uppercase tracking-tighter bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">Booking Confirmed!</h2>
          <p className="text-zinc-400 text-sm mb-8 leading-relaxed">Your payment was fully secured and verified. The vendor has been updated in real-time.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={() => router.push('/dashboard')} className="bg-white hover:bg-zinc-100 text-zinc-950 rounded-2xl h-12 font-bold px-8 shadow-lg active:scale-95 transition-all">Go to Dashboard</Button>
            <Button variant="outline" onClick={() => router.push(serviceType === 'house' ? '/houses' : '/vehicles')} className="border-white/10 text-white hover:bg-white/5 rounded-2xl h-12 font-bold px-8 active:scale-95 transition-all">Browse More</Button>
          </div>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-[#8B004A]" />
          <span className="text-sm font-bold text-zinc-500 uppercase tracking-widest animate-pulse">Assembling Secure Checkout...</span>
        </div>
      </div>
    );
  }

  if (!serviceData) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <Card className="p-8 text-center max-w-sm bg-zinc-900 border border-white/5 rounded-3xl text-white shadow-2xl">
          <h2 className="text-xl font-bold mb-2">Listing Not Found</h2>
          <p className="text-zinc-500 text-sm mb-6 leading-relaxed">The requested service could not be loaded or has been archived by the vendor.</p>
          <Button onClick={() => router.back()} className="bg-[#8B004A] hover:bg-[#8B004A]/90 text-white rounded-xl w-full h-11 font-bold">Go Back</Button>
        </Card>
      </div>
    );
  }

  const img = serviceData.images?.[0];
  const propType = serviceData.property_type || serviceData.propertyType;

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-zinc-950 to-slate-900 text-white font-sans selection:bg-[#8B004A]/30 pb-28 lg:pb-12">
        
        {/* Animated Background Mesh Glow */}
        <div className="absolute top-0 inset-x-0 h-[40vh] bg-gradient-to-b from-[#8B004A]/10 to-transparent pointer-events-none blur-3xl" />

        <div className="max-w-5xl mx-auto px-4 py-8 relative z-10">
          {/* Header */}
          <button onClick={() => router.back()} className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-white mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to listing
          </button>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tighter uppercase leading-none mb-2">Secure Checkout</h1>
              <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[#8B004A] rounded-full animate-ping" />
                Razorpay Secure Channel Active
              </p>
            </div>
            
            {/* Step Indicator */}
            <div className="hidden sm:flex items-center gap-3 bg-zinc-900/60 backdrop-blur-md px-4 py-2.5 rounded-full border border-white/5 text-xs text-zinc-500 font-bold uppercase tracking-wider">
              <span className="text-white">1. Verify Details</span>
              <ChevronRight className="w-3.5 h-3.5" />
              <span>2. Secure Payment</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
            {/* LEFT — Info Form */}
            <div className="lg:col-span-3 space-y-6">
              
              {/* Product Preview Card */}
              <Card className="p-0 overflow-hidden border border-white/5 shadow-2xl rounded-3xl bg-zinc-900/40 backdrop-blur-xl text-white">
                <div className="flex gap-4 p-5 items-center">
                  <div className="w-24 h-20 sm:w-28 sm:h-20 rounded-2xl overflow-hidden bg-zinc-950 border border-white/5 flex-shrink-0 relative">
                    {img ? <img src={img} alt="" className="w-full h-full object-cover" /> : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-700 bg-zinc-950">
                        {serviceType === 'house' ? <Home className="w-8 h-8 opacity-20" /> : <Car className="w-8 h-8 opacity-20" />}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-[#8B004A]/20 border border-[#8B004A]/30 text-rose-400">
                        {serviceType === 'house' ? (propType === 'pg' ? 'PG Sharing' : 'Room Rent') : 'Vehicle'}
                      </span>
                    </div>
                    <h3 className="font-extrabold text-lg sm:text-xl truncate text-white leading-tight">{serviceData.title || serviceData.name || serviceName}</h3>
                    <div className="flex items-center gap-1 text-xs text-zinc-500 font-semibold mt-1">
                      <MapPin className="w-3.5 h-3.5 text-zinc-600" />
                      <span>{serviceData.city || serviceData.location || serviceData.address || 'Location TBD'}</span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Booking Details Input Cards */}
              <Card className="p-6 sm:p-8 border border-white/5 shadow-2xl rounded-3xl bg-zinc-900/40 backdrop-blur-xl text-white space-y-6">
                <h2 className="text-base font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2.5 border-b border-white/5 pb-4">
                  <Clock className="w-4 h-4 text-rose-400" />
                  Booking Details
                </h2>

                {serviceType === 'vehicle' && (
                  <div className="space-y-2">
                    <Label className="text-zinc-400 text-[10px] font-black uppercase tracking-widest ml-1">Duration Type</Label>
                    <select 
                      className="flex h-12 w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-2 text-sm font-bold text-white outline-none focus:ring-2 focus:ring-[#8B004A]/50 transition-all cursor-pointer" 
                      value={bookingType} 
                      onChange={e => setBookingType(e.target.value as any)}
                    >
                      <option value="daily" className="text-zinc-900 bg-white">Per Day</option>
                      <option value="hourly" className="text-zinc-900 bg-white">Per Hour</option>
                    </select>
                  </div>
                )}

                {serviceType === 'house' && propType === 'pg' && (
                  <div className="space-y-2">
                    <Label className="text-zinc-400 text-[10px] font-black uppercase tracking-widest ml-1">Sharing Type</Label>
                    <select 
                      className="flex h-12 w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-2 text-sm font-bold text-white outline-none focus:ring-2 focus:ring-[#8B004A]/50 transition-all cursor-pointer" 
                      value={roomTab} 
                      onChange={e => setRoomTab(e.target.value)}
                    >
                      <option value="single" className="text-zinc-900 bg-white">Single Sharing</option>
                      <option value="double" className="text-zinc-900 bg-white">Double Sharing</option>
                    </select>
                  </div>
                )}

                <div className="space-y-2">
                  <Label className="text-zinc-400 text-[10px] font-black uppercase tracking-widest ml-1">
                    {serviceType === 'house' ? 'Move-in & Move-out Dates' : 'Rental Duration Period'}
                  </Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="relative">
                      <Input 
                        type={bookingType === 'hourly' ? 'datetime-local' : 'date'} 
                        value={startDate} 
                        onChange={e => setStartDate(e.target.value)} 
                        min={new Date().toISOString().slice(0, bookingType === 'hourly' ? 16 : 10)} 
                        className="h-12 bg-zinc-950 border-white/10 rounded-2xl text-sm font-bold px-4 focus-visible:ring-[#8B004A]/50 text-white" 
                      />
                    </div>
                    <div className="relative">
                      <Input 
                        type={bookingType === 'hourly' ? 'datetime-local' : 'date'} 
                        value={endDate} 
                        onChange={e => setEndDate(e.target.value)} 
                        min={startDate || new Date().toISOString().slice(0, bookingType === 'hourly' ? 16 : 10)} 
                        className="h-12 bg-zinc-950 border-white/10 rounded-2xl text-sm font-bold px-4 focus-visible:ring-[#8B004A]/50 text-white" 
                      />
                    </div>
                  </div>
                </div>

                {serviceType === 'vehicle' && (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center mb-1">
                      <Label className="text-zinc-400 text-[10px] font-black uppercase tracking-widest ml-1">Delivery Location</Label>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-6 text-[10px] uppercase font-black px-2.5 rounded-lg border border-[#8B004A]/20 hover:bg-[#8B004A]/10 text-rose-400 active:scale-95 transition-all" 
                        onClick={handleFetchLocation} 
                        disabled={isFetchingLocation}
                      >
                        {isFetchingLocation ? <Loader2 className="w-3 h-3 mr-1 animate-spin text-rose-400" /> : <LocateFixed className="w-3 h-3 mr-1" />} 
                        Auto-fill
                      </Button>
                    </div>
                    <Input 
                      placeholder="Enter specific delivery address..." 
                      value={bookingLocation} 
                      onChange={e => setBookingLocation(e.target.value)} 
                      className="h-12 bg-zinc-950 border-white/10 rounded-2xl text-sm font-bold px-4 focus-visible:ring-[#8B004A]/50 text-white" 
                    />
                  </div>
                )}
              </Card>
            </div>

            {/* RIGHT — Payment Card Summary */}
            <div className="lg:col-span-2">
              <Card className="p-6 sm:p-8 border border-white/5 shadow-2xl rounded-3xl sticky top-24 bg-zinc-900/60 backdrop-blur-2xl text-white">
                <h2 className="text-base font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2.5 border-b border-white/5 pb-4 mb-6">
                  <CreditCard className="w-4 h-4 text-rose-400" />
                  Payment Summary
                </h2>

                <div className="space-y-4 text-sm mb-8 font-semibold">
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-500 uppercase text-xs tracking-wider">{label || 'Calculation details'}</span>
                    <span className="font-bold text-white text-base">₹{basePrice.toLocaleString()}</span>
                  </div>
                  {securityDep > 0 && (
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-zinc-500 uppercase text-xs tracking-wider flex items-center gap-1.5">
                        Security Deposit
                        <Info className="w-3.5 h-3.5 text-zinc-600 cursor-help" />
                      </span>
                      <span className="font-bold text-white text-base">₹{securityDep.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="border-t border-white/5 pt-4 flex justify-between items-baseline">
                    <span className="text-zinc-400 uppercase text-xs font-black tracking-widest">Total Due Now</span>
                    <span className="text-2xl font-black text-rose-400 tracking-tighter">₹{total.toLocaleString()}</span>
                  </div>
                </div>

                {/* Secure Badge Message */}
                <div className="mb-6 p-4 rounded-2xl bg-zinc-950 border border-white/5 flex gap-3 text-left">
                  <Shield className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <div className="text-xs space-y-1">
                    <p className="font-bold text-zinc-300">100% Fully Encrypted</p>
                    <p className="text-zinc-500 leading-tight">All transactions are direct-mapped and verified instantly via Razorpay's PCI-DSS gateway.</p>
                  </div>
                </div>

                <Button 
                  size="lg" 
                  className="w-full text-sm font-black uppercase tracking-widest rounded-2xl h-14 bg-gradient-to-r from-[#8B004A] to-[#5B2C6F] hover:shadow-lg hover:shadow-[#8B004A]/25 transition-all text-white border-0 shadow-lg active:scale-98 relative group overflow-hidden" 
                  onClick={handlePay} 
                  disabled={isProcessing || !startDate || !endDate}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] skew-x-[-20deg]" />
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {isProcessing ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Verifying...</> : `Confirm & Pay ₹${total.toLocaleString()}`}
                  </span>
                </Button>

                {user?.role === 'vendor' && (
                  <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-[10px] font-black uppercase tracking-widest text-amber-500 text-center leading-relaxed">
                    Vendors are restricted from making bookings. Please access via User account.
                  </div>
                )}
              </Card>
            </div>
          </div>
        </div>

        {/* Mobile Sticky Floating Bar */}
        <div className="lg:hidden fixed bottom-0 inset-x-0 bg-zinc-950/80 backdrop-blur-xl border-t border-white/5 p-4 flex items-center justify-between z-40 shadow-[0_-8px_30px_rgba(0,0,0,0.5)]">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-black text-zinc-500 tracking-wider">Total Amount</span>
            <span className="text-xl font-black text-white">₹{total.toLocaleString()}</span>
          </div>
          <Button 
            size="lg" 
            className="h-12 px-6 rounded-xl font-bold bg-[#8B004A] hover:bg-[#8B004A]/90 text-white flex items-center gap-2 active:scale-98 transition-all shadow-lg shadow-[#8B004A]/25 text-xs uppercase tracking-wider"
            onClick={handlePay} 
            disabled={isProcessing || !startDate || !endDate}
          >
            {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Pay Securely'}
          </Button>
        </div>
      </div>
    </>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>}>
      <CheckoutContent />
    </Suspense>
  );
}
