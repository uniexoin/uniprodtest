'use client';
import React, { useState } from "react";
import { Truck, Plus, Gauge, MapPin } from "lucide-react";
import { useVehicleFleet, useReturnVehicle, useToggleMaintenance, useDispatchVehicle } from "@/hooks/use-fleet";
import { adaptFleetVehicles } from "@/lib/elite-adapters";
import { toast } from "sonner";

export function FleetBoardView() {
  const { data: fleetData } = useVehicleFleet();
  const vehicles = adaptFleetVehicles(fleetData?.fleet || []);

  const dispatchVehicle = useDispatchVehicle();
  const returnVehicle = useReturnVehicle();
  const toggleMaintenance = useToggleMaintenance();

  const [showForm, setShowForm] = useState(false);
  
  // New vehicle form state
  const [name, setName] = useState("");
  const [type, setType] = useState("Secure SUV (Cadillac Escalade)");
  const [status, setStatus] = useState<"Active" | "Transit" | "Maintenance" | "Idle">("Transit");
  const [driver, setDriver] = useState("");
  const [destination, setDestination] = useState("");
  const [speed, setSpeed] = useState("55 mph");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !driver || !destination) return;

    toast.success("Vehicle registration submitted. Waiting for dispatch approval.");

    // Reset Form
    setName("");
    setDriver("");
    setDestination("");
    setShowForm(false);
  };

  const statusColors = {
    Transit: "bg-blue-50 text-blue-700 border-blue-100",
    Active: "bg-green-50 text-green-700 border-green-100",
    Maintenance: "bg-rose-50 text-rose-700 border-rose-100",
    Idle: "bg-gray-50 text-gray-700 border-gray-100",
  };

  return (
    <div className="space-y-8">
      {/* Header Context */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-on-surface tracking-tight">Live Fleet Board</h2>
          <p className="text-sm text-secondary font-medium">Real-time status of high-value escort vehicles &amp; security rigs.</p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary-container text-white text-xs font-bold rounded-full shadow-lg shadow-primary/20 hover:bg-primary transition-all duration-150 cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          {showForm ? "Collapse Dispatch Center" : "Register Escort Rig"}
        </button>
      </div>

      {/* Dispatch form slider */}
      {showForm && (
        <form onSubmit={handleSubmit} className="p-6 bg-white/80 border border-gray-100 rounded-2xl space-y-4 shadow-sm">
          <h3 className="text-sm font-bold text-on-surface uppercase tracking-wider">Deploy Carriage Vehicle</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-secondary uppercase block">Rig / Cruiser Identifier</label>
              <input
                type="text"
                required
                placeholder="e.g. Armored Spec-V Runner 5"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-primary-container outline-none text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-secondary uppercase block">Coach / Rig Class</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-primary-container outline-none text-xs"
              >
                <option value="Secure SUV (Cadillac Escalade)">Secure SUV (Cadillac Escalade)</option>
                <option value="Mercedes-Benz Sprinter Custom">Mercedes-Benz Sprinter Custom</option>
                <option value="Tesla Semi-Cabin Secure">Tesla Semi-Cabin Secure</option>
                <option value="Lucid Air Sapphire">Lucid Air Sapphire</option>
                <option value="Custom King-Long V-series">Custom King-Long V-series</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-secondary uppercase block">Deploy Status</label>
              <select
                value={status}
                onChange={(e: any) => setStatus(e.target.value)}
                className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-primary-container outline-none text-xs"
              >
                <option value="Transit">Transit</option>
                <option value="Active">Active</option>
                <option value="Idle">Idle</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-secondary uppercase block">Command Officer / Driver</label>
              <input
                type="text"
                required
                placeholder="e.g. Sgt. Raymond Finch"
                value={driver}
                onChange={(e) => setDriver(e.target.value)}
                className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-primary-container outline-none text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-secondary uppercase block">Target Hub / Destination</label>
              <input
                type="text"
                required
                placeholder="e.g. Napa Valley Vineyard Retreat"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-primary-container outline-none text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-secondary uppercase block">Est Cruising Velocity</label>
              <div className="flex gap-3">
                <input
                  type="text"
                  required
                  placeholder="e.g. 60 mph"
                  value={speed}
                  onChange={(e) => setSpeed(e.target.value)}
                  className="flex-1 h-10 px-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-primary-container outline-none text-xs"
                />
                <button
                  type="submit"
                  className="px-6 h-10 bg-primary-container text-white font-bold text-xs rounded-xl shadow-md hover:bg-primary transition-all cursor-pointer"
                >
                  Deploy
                </button>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* Fleet Summary Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {["Transit", "Active", "Maintenance", "Idle"].map((st) => {
          const count = vehicles.filter((v) => v.status === st).length;
          return (
            <div key={st} className="glass-card rounded-2xl p-4 flex flex-col justify-between">
              <span className="text-[10px] font-bold text-secondary uppercase tracking-wider">{st} Cruisers</span>
              <span className="text-2xl font-bold font-mono text-on-surface mt-1">{count}</span>
            </div>
          );
        })}
      </div>

      {/* Vehicles Telemetry Board */}
      <div className="glass-panel rounded-2xl p-6">
        <h3 className="text-lg font-bold text-on-surface mb-6">Live Cargo &amp; Transit Telemetry</h3>
        
        <div className="space-y-5">
          {vehicles.map((v) => (
            <div
              key={v.id}
              className="p-5 bg-white/60 border border-gray-100 rounded-2xl hover:bg-white transition-all space-y-4"
            >
              {/* Header inside vehicle card */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div className="flex items-start space-x-3.5">
                  <div className="p-2.5 bg-primary/10 rounded-xl text-primary-container mt-1">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-on-surface flex items-center gap-2">
                      {v.name}
                      <span className="text-[10px] font-mono font-semibold bg-gray-100 px-2 py-0.5 rounded text-secondary">
                        {v.id.substring(v.id.length - 6)}
                      </span>
                    </h4>
                    <span className="text-xs text-secondary text-medium">{v.type}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start md:self-auto font-mono text-xs">
                  {/* Status Indicator pill */}
                  <span className={`px-3 py-1 border text-[11px] font-bold rounded-full ${statusColors[v.status]}`}>
                    {v.status}
                  </span>
                  
                  {/* Cruising speed gauge */}
                  {v.speed !== "0 mph" && (
                    <span className="flex items-center gap-1 bg-yellow-50 text-yellow-700 border border-yellow-100 px-2 py-1 rounded-full text-[11px] font-bold">
                      <Gauge className="w-3.5 h-3.5" /> {v.speed}
                    </span>
                  )}

                  {/* Actions based on status */}
                  {v.status === 'Idle' && (
                    <button
                      onClick={() => {
                        dispatchVehicle.mutate({ id: v.id, data: { routeId: 'route-auto-1' } });
                        toast.success("Vehicle dispatched successfully.");
                      }}
                      className="px-2 py-1 ml-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded text-[10px] uppercase font-bold tracking-wider"
                    >
                      Dispatch
                    </button>
                  )}
                  {v.status === 'Transit' && (
                    <button
                      onClick={() => {
                        returnVehicle.mutate({ id: v.id, data: {} });
                        toast.success("Vehicle recalled to HQ successfully.");
                      }}
                      className="px-2 py-1 ml-2 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded text-[10px] uppercase font-bold tracking-wider"
                    >
                      Recall
                    </button>
                  )}
                  {(v.status === 'Idle' || v.status === 'Maintenance') && (
                    <button
                      onClick={() => {
                        toggleMaintenance.mutate({ id: v.id, isEntering: v.status !== 'Maintenance' });
                        toast.success("Maintenance status toggled.");
                      }}
                      className="px-2 py-1 ml-2 bg-orange-50 text-orange-600 hover:bg-orange-100 rounded text-[10px] uppercase font-bold tracking-wider"
                    >
                      {v.status === 'Maintenance' ? 'Finish Maint.' : 'Start Maint.'}
                    </button>
                  )}
                </div>
              </div>

              {/* Progress Bar for vehicles in Transit */}
              {v.status === "Transit" || v.status === "Active" ? (
                <div className="space-y-1.5 ml-0 md:ml-[50px] p-4 bg-gray-50/60 rounded-xl border border-gray-100">
                  <div className="flex justify-between items-center text-xs">
                    <span className="flex items-center gap-1.5 text-secondary">
                      <MapPin className="w-3.5 h-3.5 text-secondary" /> Destination: <strong className="text-on-surface">{v.destination}</strong>
                    </span>
                    <span className="font-bold text-primary-container font-mono">{v.progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary-container transition-all duration-500 rounded-full"
                      style={{ width: `${v.progress}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-secondary font-semibold font-mono">
                    <span>Origin: HQ Bay</span>
                    <span>Operator: {v.driver}</span>
                  </div>
                </div>
              ) : (
                <div className="ml-0 md:ml-[50px] text-xs text-secondary italic">
                  Operator: {v.driver} • {v.status === 'Maintenance' ? 'Undergoing scheduled maintenance.' : 'Parked secure in base garage bay.'}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
