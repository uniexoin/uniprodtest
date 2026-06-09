'use client';
import React, { useState } from "react";
import { Check, X, Calendar, PlusCircle } from "lucide-react";
import { useVendorBookings } from "@/hooks/use-dashboard";
import { adaptBookingRequests } from "@/lib/elite-adapters";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export function BookingRequestsView() {
  const { data: bookingsData } = useVendorBookings();
  const bookings = adaptBookingRequests(bookingsData?.bookings || []);
  const queryClient = useQueryClient();

  const [filter, setFilter] = useState<"All" | "Pending" | "Approved" | "Declined">("All");
  const [showForm, setShowForm] = useState(false);

  // Form states
  const [client, setClient] = useState("");
  const [service, setService] = useState("Premium Package A (Private Escort + Estate)");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("Today");
  const [time, setTime] = useState("12:00 PM");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!client || !amount) return;

    toast.info("Vendor accounts cannot manually generate bookings. Clients must book via the public gateway.");
    
    // Reset Form
    setClient("");
    setAmount("");
    setShowForm(false);
  };

  const updateBookingStatus = async (id: string, status: 'confirmed' | 'cancelled') => {
    try {
        await fetch(`/api/bookings/${id}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status })
        });
        queryClient.invalidateQueries({ queryKey: ['vendorBookings'] });
        toast.success(`Booking ${status === 'confirmed' ? 'approved' : 'declined'} successfully.`);
    } catch (e) {
        toast.error("Failed to update booking status.");
    }
  };

  const filtered = bookings.filter((b) => (filter === "All" ? true : b.status === filter));

  const statusStyles = {
    Approved: "bg-green-50 text-green-700 border-green-200",
    Pending: "bg-blue-50 text-blue-700 border-blue-200",
    Declined: "bg-rose-50 text-rose-700 border-rose-200",
  };

  return (
    <div className="space-y-8">
      {/* Context Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-on-surface tracking-tight">Booking Requests</h2>
          <p className="text-sm text-secondary font-medium">Verify exclusive private escort services &amp; corporate rentals.</p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary-container text-white text-xs font-bold rounded-full shadow-lg shadow-primary/20 hover:bg-primary transition-all duration-150 cursor-pointer self-start md:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          {showForm ? "Collapse Workspace Desk" : "Submit Custodial Booking"}
        </button>
      </div>

      {/* Manual Request Formulation Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="p-6 bg-white/80 border border-gray-100 rounded-2xl space-y-4 shadow-sm animate-fade-in-up">
          <h3 className="text-sm font-bold text-on-surface uppercase tracking-wider">Book Client Reservation</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-secondary uppercase block">Client Full Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Johnathan Doe"
                value={client}
                onChange={(e) => setClient(e.target.value)}
                className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-primary-container outline-none text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-secondary uppercase block">Lodging / Porter Package</label>
              <select
                value={service}
                onChange={(e) => setService(e.target.value)}
                className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-primary-container outline-none text-xs"
              >
                <option value="Premium Package A (Private Escort + Estate)">Premium Package A (Private Escort + Estate)</option>
                <option value="Standard Consultation & Logistics Assessment">Standard/Business Class Courier Suite</option>
                <option value="Enterprise Setup & High-Security Onboarding">Enterprise High-Security Onboarding</option>
                <option value="Full Vineyard Residency Concierge Packet">Vineyard Residency Package</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-secondary uppercase block">Scheduled Date</label>
              <input
                type="text"
                required
                placeholder="e.g. Today or 2026-06-12"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-primary-container outline-none text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-secondary uppercase block">Scheduled Hour</label>
              <input
                type="text"
                required
                placeholder="e.g. 2:45 PM"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-primary-container outline-none text-xs"
              />
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="text-[10px] font-bold text-secondary uppercase block">Quoted Transfer Fee (₹)</label>
              <div className="flex gap-4">
                <input
                  type="number"
                  required
                  placeholder="250.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="flex-1 h-10 px-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-primary-container outline-none text-xs"
                />
                <button
                  type="submit"
                  className="px-6 h-10 bg-primary-container text-white font-bold text-xs rounded-xl shadow-md hover:bg-primary transition-all cursor-pointer"
                >
                  Post Manifest
                </button>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* Tabs Filter Bar */}
      <div className="flex space-x-2 bg-white/70 p-1.5 rounded-2xl border border-gray-100 shadow-sm w-fit">
        {(["All", "Pending", "Approved", "Declined"] as const).map((st) => (
          <button
            key={st}
            onClick={() => setFilter(st)}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
              filter === st
                ? "bg-primary-container text-on-primary-container shadow-md"
                : "text-secondary hover:text-primary-container"
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Requests Core View Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((b) => (
          <div
            key={b.id}
            className="glass-card rounded-2xl p-5 flex flex-col justify-between space-y-4 border border-white/5 opacity-100 relative group animate-fade-in-up"
          >
            {/* Header profile inside book cards */}
            <div className="flex justify-between items-start">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-primary-container/10 border border-primary/10 text-primary-container flex items-center justify-center font-extrabold text-xs">
                  {b.initials}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-on-surface line-clamp-1">{b.client}</h4>
                  <p className="text-[10px] text-secondary font-mono">#{b.id.substring(b.id.length - 6)}</p>
                </div>
              </div>

              <span className={`px-2.5 py-0.5 border text-[10px] font-bold rounded-full ${statusStyles[b.status]}`}>
                {b.status}
              </span>
            </div>

            {/* Service info details */}
            <div className="space-y-1 bg-gray-50/50 p-3 rounded-xl border border-gray-100">
              <p className="text-xs text-on-surface font-semibold line-clamp-2">{b.service}</p>
              <div className="flex items-center gap-1.5 text-[10px] text-secondary mt-1 font-mono">
                <Calendar className="w-3.5 h-3.5 text-secondary" />
                <span>{b.date} • {b.time}</span>
              </div>
            </div>

            {/* Bottom action bar */}
            <div className="flex justify-between items-center pt-2 border-t border-gray-100">
              <div>
                <span className="text-[9px] font-semibold text-secondary uppercase block">Service Price</span>
                <span className="text-sm font-extrabold text-primary-container font-mono">
                  ₹{b.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>

              {/* Triage action triggers if status is pending */}
              {b.status === "Pending" ? (
                <div className="flex space-x-1.5">
                  <button
                    onClick={() => updateBookingStatus(b.id, 'cancelled')}
                    className="p-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 rounded-lg transition-transform active:scale-95 duration-100"
                    title="Decline"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => updateBookingStatus(b.id, 'confirmed')}
                    className="px-3.5 py-1.5 bg-primary-container text-white rounded-lg text-xs font-bold shadow hover:bg-primary transition-transform active:scale-95 duration-100 flex items-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5" /> Approve
                  </button>
                </div>
              ) : (
                <span className="text-[10px] font-semibold text-secondary italic">
                  Processed
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
