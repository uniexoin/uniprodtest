'use client';
import React, { useState, useEffect } from "react";
import { Store, Truck, IndianRupee } from "lucide-react";
import { useVendorLaundryService, useUpdateVendorLaundryService } from "@/hooks/use-laundry-services";
import { toast } from "sonner";

export function LaundrySettingsView() {
  const { data: service, isLoading } = useVendorLaundryService();
  const updateService = useUpdateVendorLaundryService();
  const [onsiteCharge, setOnsiteCharge] = useState("");

  useEffect(() => {
    if (service) {
      setOnsiteCharge(service.onsitePickupCharge?.toString() || "");
    }
  }, [service]);

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-20 bg-muted rounded-xl w-full" />
        <div className="h-40 bg-muted rounded-xl w-full" />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="glass-panel p-12 text-center rounded-2xl flex flex-col items-center justify-center">
        <Store className="w-12 h-12 text-secondary mb-4 opacity-50" />
        <h3 className="text-lg font-bold text-on-surface">Service Unregistered</h3>
        <p className="text-sm text-secondary mt-1 max-w-md">Your laundry service will appear here once approved by an administrator.</p>
      </div>
    );
  }

  const handleToggle = async (field: 'onsitePickup' | 'onStoreService', value: boolean) => {
    if (field === 'onsitePickup' && !value && !service.onStoreService) {
      toast.error("You must have at least one service mode active.");
      return;
    }
    if (field === 'onStoreService' && !value && !service.onsitePickup) {
      toast.error("You must have at least one service mode active.");
      return;
    }

    try {
      await updateService.mutateAsync({ [field]: value });
      toast.success(`${field === 'onsitePickup' ? 'Onsite Pickup' : 'On-Store Service'} status updated.`);
    } catch (err: any) {
      toast.error("Failed to update service mode.");
    }
  };

  const handleSaveCharge = async () => {
    try {
      await updateService.mutateAsync({ onsitePickupCharge: Number(onsiteCharge) || 0 });
      toast.success("Pickup charge updated successfully.");
    } catch (err: any) {
      toast.error("Failed to update pickup charge.");
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Context */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-on-surface tracking-tight">Laundry Service Settings</h2>
          <p className="text-sm text-secondary font-medium">Configure operations, service modes, and dynamic pickup pricing.</p>
        </div>
      </div>

      <div className="glass-panel p-6 rounded-2xl">
        <h3 className="text-sm font-bold text-on-surface uppercase tracking-wider mb-6">Service Modes Configuration</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* On Store Toggle */}
          <div className="bg-white/60 hover:bg-white transition-all p-5 rounded-2xl border border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                <Store className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-on-surface">Store Drop-off</h4>
                <p className="text-[10px] text-secondary font-medium mt-0.5 uppercase tracking-wider">Customers bring items</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleToggle('onStoreService', !service.onStoreService)}
              disabled={updateService.isPending}
              className={`w-14 h-8 rounded-full transition-colors flex items-center shadow-inner ${
                service.onStoreService ? 'bg-primary justify-end' : 'bg-gray-200 justify-start'
              }`}
            >
              <div className="w-6 h-6 rounded-full bg-white shadow mx-1 transition-all" />
            </button>
          </div>

          {/* Onsite Pickup Toggle */}
          <div className="bg-white/60 hover:bg-white transition-all p-5 rounded-2xl border border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-on-surface">Valet Pickup</h4>
                <p className="text-[10px] text-secondary font-medium mt-0.5 uppercase tracking-wider">Collect at location</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleToggle('onsitePickup', !service.onsitePickup)}
              disabled={updateService.isPending}
              className={`w-14 h-8 rounded-full transition-colors flex items-center shadow-inner ${
                service.onsitePickup ? 'bg-primary justify-end' : 'bg-gray-200 justify-start'
              }`}
            >
              <div className="w-6 h-6 rounded-full bg-white shadow mx-1 transition-all" />
            </button>
          </div>
        </div>

        {/* Pickup Charge */}
        {service.onsitePickup && (
          <div className="mt-6 p-6 bg-gradient-to-br from-primary/5 to-transparent border border-primary/10 rounded-2xl animate-fade-in-up">
            <div className="flex flex-col md:flex-row md:items-center gap-6 justify-between">
              <div>
                <h4 className="text-sm font-bold text-on-surface flex items-center gap-2">
                  <IndianRupee className="w-4 h-4 text-primary" />
                  Base Pickup Tariff
                </h4>
                <p className="text-xs text-secondary mt-1">Surcharge automatically applied to cart totals for delivery services.</p>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="relative w-40">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary font-bold text-xs">₹</span>
                  <input
                    type="number"
                    min="0"
                    className="w-full h-10 pl-7 pr-3 bg-white border border-gray-200 rounded-xl focus:border-primary outline-none text-sm font-bold font-mono"
                    placeholder="Charge"
                    value={onsiteCharge}
                    onChange={(e) => setOnsiteCharge(e.target.value)}
                  />
                </div>
                <button
                  onClick={handleSaveCharge}
                  disabled={updateService.isPending || !onsiteCharge}
                  className="px-6 h-10 bg-primary-container text-white font-bold text-xs rounded-xl shadow-md hover:bg-primary transition-all disabled:opacity-50"
                >
                  Apply Rate
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Information Banner */}
      <div className="bg-amber-50/50 border border-amber-100 rounded-2xl p-5 flex gap-4">
        <div className="text-amber-500 mt-0.5">💡</div>
        <div>
          <h4 className="text-sm font-bold text-amber-900">Real-Time Synchronization</h4>
          <p className="text-xs text-amber-700/80 mt-1 font-medium leading-relaxed">
            Modifying your operational capacity and rates here will instantly reflect on the customer-facing frontend. No manual publishing required.
          </p>
        </div>
      </div>
    </div>
  );
}
