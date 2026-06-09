'use client';
import React, { useState } from "react";
import { MapPin, BedDouble, Search, PlusCircle } from "lucide-react";
import { useVendorHouses } from "@/hooks/use-dashboard";
import { adaptHouseProperties } from "@/lib/elite-adapters";
import { toast } from "sonner";

export function ManageHousesView() {
  const { data: housesData } = useVendorHouses();
  const properties = adaptHouseProperties(housesData?.houses || []);

  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");

  // Form structure
  const [name, setName] = useState("");
  const [type, setType] = useState("Corporate Villa");
  const [location, setLocation] = useState("");
  const [rooms, setRooms] = useState("");
  const [occupiedRooms, setOccupiedRooms] = useState("");
  const [monthlyIncome, setMonthlyIncome] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !location || !rooms || !occupiedRooms || !monthlyIncome) return;

    toast.success("Estate registered successfully.");

    // Reset Form
    setName("");
    setLocation("");
    setRooms("");
    setOccupiedRooms("");
    setMonthlyIncome("");
    setShowForm(false);
  };

  const filtered = properties.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Upper Context Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-on-surface tracking-tight">Manage Houses</h2>
          <p className="text-sm text-secondary font-medium">Configure corporate housing estates, luxury lodges &amp; suites database.</p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary-container text-white text-xs font-bold rounded-full shadow-lg shadow-primary/20 hover:bg-primary transition-all duration-150 cursor-pointer self-start md:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          {showForm ? "Collapse Housing Desk" : "Register Elite Estate"}
        </button>
      </div>

      {/* Dynamic Slide Drawer Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="p-6 bg-white/80 border border-gray-100 rounded-2xl space-y-4 shadow-sm">
          <h3 className="text-sm font-bold text-on-surface uppercase tracking-wider">Acquire Housing Asset</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-secondary uppercase block">Estate Name / Suite Ref</label>
              <input
                type="text"
                required
                placeholder="e.g. Pacific Heights Manor Deluxe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-primary-container outline-none text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-secondary uppercase block">Category / Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-primary-container outline-none text-xs"
              >
                <option value="Corporate Villa">Corporate Villa</option>
                <option value="High-end Luxury Manor">High-end Luxury Manor</option>
                <option value="Premium Loft Complex">Premium Loft Complex</option>
                <option value="Luxe Vineyard Bungalows">Luxe Vineyard Bungalows</option>
                <option value="Ocean-View Manor">Ocean-View Manor</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-secondary uppercase block">Registered Address / Location</label>
              <input
                type="text"
                required
                placeholder="e.g. Marin County, CA"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-primary-container outline-none text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-secondary uppercase block">Total Bed Capacity</label>
              <input
                type="number"
                required
                placeholder="e.g. 8"
                value={rooms}
                onChange={(e) => setRooms(e.target.value)}
                className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-primary-container outline-none text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-secondary uppercase block">Currently Occupied Units</label>
              <input
                type="number"
                required
                placeholder="e.g. 5"
                value={occupiedRooms}
                onChange={(e) => setOccupiedRooms(e.target.value)}
                className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-primary-container outline-none text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-secondary uppercase block">Monthly Estimated Yield (₹)</label>
              <div className="flex gap-4">
                <input
                  type="number"
                  required
                  placeholder="e.g. 15000"
                  value={monthlyIncome}
                  onChange={(e) => setMonthlyIncome(e.target.value)}
                  className="flex-1 h-10 px-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-primary-container outline-none text-xs"
                />
                <button
                  type="submit"
                  className="px-6 h-10 bg-primary-container text-white font-bold text-xs rounded-xl shadow-md hover:bg-primary transition-all cursor-pointer"
                >
                  Acquire
                </button>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* Global search filters info */}
      <div className="flex items-center space-x-3 bg-white/60 p-3 rounded-2xl border border-gray-100 shadow-sm max-w-md">
        <Search className="w-4 h-4 text-secondary ml-1" />
        <input
          type="text"
          placeholder="Filter estates by title, location or type..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full outline-none text-xs text-on-surface bg-transparent"
        />
      </div>

      {/* Properties cards list */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((p) => {
          const occupancyRate = p.rooms > 0 ? Math.round((p.occupiedRooms / p.rooms) * 100) : 0;
          return (
            <div
              key={p.id}
              className="glass-card rounded-2xl p-5 flex flex-col justify-between space-y-4"
            >
              <div>
                {/* Header details */}
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-bold text-primary-container bg-primary/10 px-2 py-0.5 rounded">
                    {p.type}
                  </span>
                  <span
                    className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full ${
                      p.status === "Full"
                        ? "bg-rose-50 text-rose-700 font-bold"
                        : p.status === "Maintenance"
                        ? "bg-yellow-50 text-yellow-700"
                        : "bg-green-50 text-green-700 font-bold"
                    }`}
                  >
                    {p.status}
                  </span>
                </div>

                <h4 className="text-base font-bold text-on-surface line-clamp-1">{p.name}</h4>
                <p className="text-xs text-secondary flex items-center gap-1 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-secondary" /> {p.location}
                </p>
              </div>

              {/* Progress and Room calculations */}
              <div className="space-y-1 bg-gray-50/50 p-3.5 rounded-xl border border-gray-100">
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span className="flex items-center gap-1 text-secondary">
                    <BedDouble className="w-3.5 h-3.5" /> Bookings Yield:
                  </span>
                  <span className="text-on-surface font-semibold">
                    {p.occupiedRooms} / {p.rooms} beds ({occupancyRate}%)
                  </span>
                </div>
                <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary-container rounded-full"
                    style={{ width: `${occupancyRate}%` }}
                  />
                </div>
              </div>

              {/* Action and pricing yield footer inside card */}
              <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                <div>
                  <span className="text-[10px] font-semibold text-secondary uppercase tracking-wider block">Estimated Yield</span>
                  <span className="text-sm font-extrabold text-primary-container font-mono">
                    ₹{p.monthlyIncome.toLocaleString(undefined, { maximumFractionDigits: 0 })}<span className="text-[10px] text-secondary font-semibold">/mo</span>
                  </span>
                </div>
                
                <span className="text-xs font-mono font-bold text-secondary">ID: {p.id.substring(p.id.length - 6)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
