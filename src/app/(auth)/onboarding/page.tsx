'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sparkles, Store, ShieldCheck } from 'lucide-react';
import { useAuthStore } from '@/modules/auth/auth.store';
import { toast } from 'sonner';
import { SaaSBackground } from '@/components/saas-background';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase';

export default function OnboardingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const [role, setRole] = useState<'user' | 'vendor' | null>(null);
  const [formData, setFormData] = useState({
    phone: '',
    universityId: '',
    businessName: '',
    serviceType: '',
    onsitePickup: false,
    storeDelivery: false
  });

  useEffect(() => {
    // Get the active session to prove they just completed Google Auth
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        toast.error("Session expired, please login again.");
        router.replace('/login');
      } else {
        setAccessToken(session.access_token);
      }
    });
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as any;
    if (type === 'checkbox') {
        setFormData({ ...formData, [name]: (e.target as HTMLInputElement).checked });
    } else {
        setFormData({ ...formData, [name]: value });
    }
    setError('');
  };

  const handleFinalize = async () => {
    if (!role) {
      setError("Please select a role");
      return;
    }
    if (role === 'vendor' && !formData.serviceType) {
      setError("Please select a service type");
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/complete-onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_token: accessToken,
          role: role,
          phone: formData.phone,
          university_id: role === 'user' ? formData.universityId : undefined,
          business_name: role === 'vendor' ? formData.businessName : undefined,
          service_type: role === 'vendor' ? formData.serviceType : undefined,
          onsite_pickup: role === 'vendor' && formData.serviceType === 'laundry' ? formData.onsitePickup : undefined,
          store_delivery: role === 'vendor' && formData.serviceType === 'laundry' ? formData.storeDelivery : undefined,
        })
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || "Failed to complete setup");
      }

      // Setup app state
      const userState = {
        id: data.profile.id,
        uniId: data.profile.uniId,
        name: data.profile.name,
        email: data.profile.email,
        role: data.profile.role,
        authProvider: 'google',
        serviceType: data.profile.serviceType,
        phone: data.profile.phone,
        kycStatus: data.profile.kycStatus
      };
      
      useAuthStore.getState().login(userState as any, data.token);

      toast.success("Welcome to UniExo!");
      const redirectPath = role === 'vendor' ? '/dashboard' : '/';
      router.replace(redirectPath);

    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (!accessToken) return <div className="min-h-screen bg-background" />;

  return (
    <div className="min-h-[100dvh] bg-background flex items-center justify-center p-4 sm:p-6 font-sans theme-landing relative overflow-hidden">
      <SaaSBackground />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-md bg-white/60 dark:bg-black/40 border border-white/60 dark:border-white/10 p-6 sm:p-10 rounded-[2.5rem] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] backdrop-blur-2xl relative z-10"
      >
        <div className="text-center mb-8">
          <h1 className="text-2xl font-black tracking-tight mb-2">Complete your profile</h1>
          <p className="text-sm text-muted-foreground">Select how you want to use UniExo</p>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <button onClick={() => setRole('user')} className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center justify-center gap-3 ${role === 'user' ? 'border-primary bg-primary/10 text-primary shadow-xl shadow-primary/10 scale-105' : 'border-white/40 dark:border-white/10 bg-white/40 dark:bg-black/20 text-muted-foreground hover:bg-white/50 shadow-inner'}`}>
              <Sparkles className="w-8 h-8" />
              <div className="font-black text-sm uppercase tracking-wider">Student</div>
            </button>
            <button onClick={() => setRole('vendor')} className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center justify-center gap-3 ${role === 'vendor' ? 'border-secondary bg-secondary/10 text-secondary shadow-xl shadow-secondary/10 scale-105' : 'border-white/40 dark:border-white/10 bg-white/40 dark:bg-black/20 text-muted-foreground hover:bg-white/50 shadow-inner'}`}>
              <Store className="w-8 h-8" />
              <div className="font-black text-sm uppercase tracking-wider">Vendor</div>
            </button>
          </div>

          <AnimatePresence>
            {role && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-4 pt-4 border-t border-border/50">
                {role === 'vendor' && (
                  <div className="space-y-2">
                    <Label className="text-[11px] font-black uppercase tracking-wider ml-1">Service Type</Label>
                    <select name="serviceType" value={formData.serviceType} onChange={handleChange} className="w-full h-14 bg-white/40 dark:bg-black/20 border border-white/40 dark:border-white/10 rounded-2xl text-foreground px-5 outline-none focus:border-secondary transition-colors text-sm font-bold shadow-inner">
                      <option value="" className="bg-background">Select Category</option>
                      <option value="vehicle" className="bg-background">Car/Bike Rental</option>
                      <option value="house" className="bg-background">PG/Room Rental</option>
                      <option value="laundry" className="bg-background">Laundry Services</option>
                    </select>
                  </div>
                )}
                
                {role === 'user' && (
                  <div className="space-y-2">
                    <Label className="text-[11px] font-black uppercase tracking-wider ml-1">University ID (Optional)</Label>
                    <Input name="universityId" placeholder="12345678" value={formData.universityId} onChange={handleChange} className="h-14 bg-white/40 dark:bg-black/20 border border-white/40 dark:border-white/10 rounded-2xl" />
                  </div>
                )}
                
                {role === 'vendor' && (
                  <div className="space-y-2">
                    <Label className="text-[11px] font-black uppercase tracking-wider ml-1">Business Name (Optional)</Label>
                    <Input name="businessName" placeholder="Doe Enterprises" value={formData.businessName} onChange={handleChange} className="h-14 bg-white/40 dark:bg-black/20 border border-white/40 dark:border-white/10 rounded-2xl" />
                  </div>
                )}

                <div className="space-y-2">
                  <Label className="text-[11px] font-black uppercase tracking-wider ml-1">Phone Number (Optional)</Label>
                  <Input name="phone" placeholder="+91 9876543210" value={formData.phone} onChange={handleChange} className="h-14 bg-white/40 dark:bg-black/20 border border-white/40 dark:border-white/10 rounded-2xl" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-xs text-center font-bold bg-red-500/10 py-3 px-4 rounded-xl border border-red-500/20">
              {error}
            </motion.div>
          )}
          
          <Button onClick={handleFinalize} disabled={loading || !role} className={`w-full h-14 font-black text-[13px] tracking-widest uppercase rounded-2xl transition-all shadow-xl relative overflow-hidden group ${role === 'user' ? 'bg-primary text-primary-foreground' : role === 'vendor' ? 'bg-secondary text-secondary-foreground' : 'bg-muted text-muted-foreground'}`}>
             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] skew-x-[-20deg]" />
             <span className="relative z-10 flex items-center justify-center gap-2">
               {loading ? "SYNCING..." : "COMPLETE SETUP"} <ShieldCheck size={16} />
             </span>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
