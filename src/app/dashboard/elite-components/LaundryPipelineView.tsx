'use client';
import React, { useState } from "react";
import { useVendorLaundryOrders, useUpdateVendorOrderStatus } from "@/hooks/use-laundry-services";
import { PackageSearch, ArrowRight, CheckCircle2, Truck } from "lucide-react";

export function LaundryPipelineView() {
  const { data: laundry, isLoading } = useVendorLaundryOrders(1, 100);
  const updateStatus = useUpdateVendorOrderStatus();
  const [activeStage, setActiveStage] = useState('placed');

  const stages = [
    { id: 'placed', label: 'New', fullLabel: 'New Orders', icon: 'bg-blue-100 text-blue-700 border-blue-200' },
    { id: 'processing', label: 'Washing', fullLabel: 'Active Wash', icon: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
    { id: 'in_progress', label: 'Ironing', fullLabel: 'Iron/Fold', icon: 'bg-purple-100 text-purple-700 border-purple-200' },
    { id: 'out_for_delivery', label: 'Transit', fullLabel: 'Dispatching', icon: 'bg-orange-100 text-orange-700 border-orange-200' },
    { id: 'delivered', label: 'Done', fullLabel: 'Completed', icon: 'bg-green-100 text-green-700 border-green-200' }
  ];

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-20 bg-muted rounded-xl w-full" />
        <div className="h-[400px] bg-muted rounded-xl w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Context */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-on-surface tracking-tight">Laundry Logistics Pipeline</h2>
          <p className="text-sm text-secondary font-medium">Kanban board for managing high-volume garment care streams.</p>
        </div>

        {laundry && (
          <div className="flex items-center gap-3 px-5 py-2.5 bg-white border border-gray-100 rounded-full shadow-sm self-start md:self-auto">
            <span className="text-[10px] font-bold text-secondary uppercase tracking-wider">Gross Pipeline Revenue</span>
            <span className="text-sm font-bold text-primary font-mono">₹{(laundry.totalRevenue || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          </div>
        )}
      </div>

      {/* Mobile Stage Selector Tab Strip */}
      <div className="flex md:hidden gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {stages.map(stage => {
          const count = laundry?.orders?.filter((o: any) => o.status === stage.id).length || 0;
          const isActive = activeStage === stage.id;
          return (
            <button
              key={stage.id}
              onClick={() => setActiveStage(stage.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border ${
                isActive
                  ? 'bg-primary-container text-white border-primary-container shadow-md'
                  : 'bg-white text-secondary border-gray-100 hover:bg-gray-50'
              }`}
            >
              <span>{stage.label}</span>
              <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono ${
                isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-secondary'
              }`}>{count}</span>
            </button>
          );
        })}
      </div>

      {/* Desktop Kanban Board */}
      <div className="hidden md:grid grid-cols-5 gap-4">
        {stages.map(stage => {
          const stageOrders = laundry?.orders?.filter((o: any) => o.status === stage.id) || [];
          return (
            <div key={stage.id} className="flex flex-col gap-3 h-full">
              {/* Column Header */}
              <div className={`p-4 rounded-2xl border flex items-center justify-between ${stage.icon}`}>
                <span className="text-xs font-bold uppercase tracking-widest">{stage.fullLabel}</span>
                <span className="bg-white/80 px-2 py-1 rounded-lg text-[10px] font-black font-mono shadow-sm">{stageOrders.length}</span>
              </div>

              {/* Column Body */}
              <div className="glass-panel p-3 rounded-2xl flex-1 flex flex-col gap-3 min-h-[500px]">
                {stageOrders.map((order: any) => (
                  <div key={order._id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:border-primary/30 transition-all hover:shadow-md space-y-3 group">
                    <div className="flex justify-between items-start">
                      <div className="font-bold text-sm text-on-surface line-clamp-1">{order.userId?.name || 'Guest User'}</div>
                      <div className="text-[10px] font-mono text-secondary px-2 py-0.5 bg-gray-50 rounded">
                        {order.items.length} items
                      </div>
                    </div>
                    
                    <div className="text-[10px] text-secondary font-medium tracking-wide uppercase border-b border-gray-50 pb-2">
                      Mode: <span className="text-on-surface font-bold">{order.pickupType === 'onsite' ? 'Valet Pickup' : 'Store Drop-off'}</span>
                    </div>

                    <div className="flex justify-between items-end pt-1">
                      <div>
                        <div className="text-[10px] text-secondary mb-0.5">Value</div>
                        <span className="text-sm font-bold text-primary font-mono">₹{order.totalAmount}</span>
                      </div>
                      
                      {/* Quick Actions */}
                      <div>
                        {stage.id === 'placed' && (
                          <button onClick={() => updateStatus.mutate({ id: order._id, status: 'processing' })} className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors flex items-center justify-center" title="Start Wash">
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        )}
                        {stage.id === 'processing' && (
                          <button onClick={() => updateStatus.mutate({ id: order._id, status: 'in_progress' })} className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-colors flex items-center justify-center" title="Send to Ironing">
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        )}
                        {stage.id === 'in_progress' && (
                          <button onClick={() => updateStatus.mutate({ id: order._id, status: 'out_for_delivery' })} className="w-8 h-8 rounded-full bg-orange-50 text-orange-600 hover:bg-orange-600 hover:text-white transition-colors flex items-center justify-center" title="Dispatch order">
                            <Truck className="w-4 h-4" />
                          </button>
                        )}
                        {stage.id === 'out_for_delivery' && (
                          <button onClick={() => updateStatus.mutate({ id: order._id, status: 'delivered' })} className="w-8 h-8 rounded-full bg-green-50 text-green-600 hover:bg-green-600 hover:text-white transition-colors flex items-center justify-center" title="Mark Delivered">
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                {stageOrders.length === 0 && (
                  <div className="flex-1 flex flex-col items-center justify-center text-center opacity-40">
                    <PackageSearch className="w-8 h-8 text-secondary mb-2" />
                    <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">No active units</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Mobile Kanban Board (Active Stage Only) */}
      <div className="block md:hidden">
        {stages.filter(s => s.id === activeStage).map(stage => {
          const stageOrders = laundry?.orders?.filter((o: any) => o.status === stage.id) || [];
          return (
            <div key={stage.id} className="flex flex-col gap-3">
              <div className="glass-panel p-3 rounded-2xl flex flex-col gap-3 min-h-[400px]">
                {stageOrders.map((order: any) => (
                  <div key={order._id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-3">
                    <div className="flex justify-between items-start">
                      <div className="font-bold text-sm text-on-surface">{order.userId?.name || 'Guest User'}</div>
                      <div className="text-[10px] font-mono text-secondary px-2 py-0.5 bg-gray-50 rounded">
                        {order.items.length} items
                      </div>
                    </div>
                    
                    <div className="text-[10px] text-secondary font-medium tracking-wide uppercase">
                      Mode: <span className="text-on-surface font-bold">{order.pickupType === 'onsite' ? 'Valet Pickup' : 'Store Drop-off'}</span>
                    </div>

                    <div className="flex justify-between items-center border-t border-gray-50 pt-3">
                      <span className="text-sm font-bold text-primary font-mono">₹{order.totalAmount}</span>
                      
                      <div className="w-1/2">
                        {stage.id === 'placed' && <button onClick={() => updateStatus.mutate({ id: order._id, status: 'processing' })} className="w-full py-2 bg-blue-50 text-blue-700 text-xs font-bold rounded-lg uppercase tracking-wider">Start Wash</button>}
                        {stage.id === 'processing' && <button onClick={() => updateStatus.mutate({ id: order._id, status: 'in_progress' })} className="w-full py-2 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-lg uppercase tracking-wider">To Ironing</button>}
                        {stage.id === 'in_progress' && <button onClick={() => updateStatus.mutate({ id: order._id, status: 'out_for_delivery' })} className="w-full py-2 bg-orange-50 text-orange-700 text-xs font-bold rounded-lg uppercase tracking-wider">Dispatch</button>}
                        {stage.id === 'out_for_delivery' && <button onClick={() => updateStatus.mutate({ id: order._id, status: 'delivered' })} className="w-full py-2 bg-green-600 text-white shadow-md text-xs font-bold rounded-lg uppercase tracking-wider">Mark Done</button>}
                      </div>
                    </div>
                  </div>
                ))}
                
                {stageOrders.length === 0 && (
                  <div className="flex-1 flex flex-col items-center justify-center py-12 text-center opacity-50">
                    <PackageSearch className="w-10 h-10 text-secondary mb-3" />
                    <span className="text-xs font-bold text-secondary uppercase tracking-widest">No orders in this stage</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
