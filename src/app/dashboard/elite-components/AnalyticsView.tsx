'use client';
import { useState } from "react";
import { TrendingUp, Activity, Zap, Sparkles, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { useVendorBookings, useVendorAnalyticsOverview, useVendorBookingTrends } from "@/hooks/use-dashboard";
import { adaptBookingRequests } from "@/lib/elite-adapters";

interface AnalyticsViewProps {
  onTabChange: (tab: any) => void;
  onApproveBooking?: (id: string) => void;
}

export function AnalyticsView({ onTabChange, onApproveBooking }: AnalyticsViewProps) {
  const [activeHoverData, setActiveHoverData] = useState<{ day: string; value: number } | null>(null);
  const [autoSurge, setAutoSurge] = useState(true);

  // Hook integrations
  const { data: bookingsData } = useVendorBookings();
  const bookings = adaptBookingRequests(bookingsData?.bookings || []);
  const { data: overview } = useVendorAnalyticsOverview();
  const { data: trendsData } = useVendorBookingTrends(17);

  // Map backend trends to the format needed by the chart
  const revenueSeries = trendsData && trendsData.length > 0 
    ? trendsData.slice(-9).map((d: any, i: number) => ({
        day: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        value: d.bookings * (overview?.avgBookingValue || 1500)
      }))
    : [
        { day: "Jun 1", value: 12000 },
        { day: "Jun 3", value: 18000 },
        { day: "Jun 5", value: 15000 },
        { day: "Jun 7", value: 25000 },
        { day: "Jun 9", value: 29000 },
        { day: "Jun 11", value: 22000 },
        { day: "Jun 13", value: 34000 },
        { day: "Jun 15", value: 28000 },
        { day: "Jun 17", value: 38200 },
      ];

  // If there's less than 9 points, pad with zeros or mock data to avoid SVG errors
  while (revenueSeries.length < 9) {
    revenueSeries.unshift({ day: `Prev ${9 - revenueSeries.length}`, value: 0 });
  }

  const highestRev = Math.max(...revenueSeries.map((d: any) => d.value), 1);

  const pendingCount = bookings.filter((b) => b.status === "Pending").length;
  const netEarnings = overview?.netEarnings || 0;
  const momGrowth = overview?.momGrowth || 0;
  const isPositiveGrowth = momGrowth >= 0;

  return (
    <div className="space-y-8">
      {/* Upper Context Header */}
      <div>
        <h2 className="text-3xl font-bold text-on-surface tracking-tight">Analytics Overview</h2>
        <p className="text-sm text-secondary font-medium">Real-time luxury lodging & logistics insights.</p>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Revenue Card */}
        <div 
          onClick={() => onTabChange("revenue")}
          className="glass-card rounded-2xl p-6 relative overflow-hidden group cursor-pointer"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl pointer-events-none group-hover:bg-primary/10 transition-all duration-300"></div>
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-primary/10 rounded-xl text-primary-container">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className={`flex items-center text-xs font-semibold px-2.5 py-1 rounded-full border ${isPositiveGrowth ? 'text-green-600 bg-green-50 border-green-100' : 'text-rose-600 bg-rose-50 border-rose-100'}`}>
              <TrendingUp className={`w-3.5 h-3.5 mr-1 ${!isPositiveGrowth && 'rotate-180'}`} /> {isPositiveGrowth ? '+' : ''}{momGrowth.toFixed(1)}%
            </span>
          </div>
          <h3 className="text-xs font-semibold text-secondary uppercase tracking-widest mb-1">Total Portfolio Revenue</h3>
          <p className="text-4xl font-bold text-on-surface tracking-tight">₹{netEarnings.toLocaleString()}</p>
          <p className="text-xs text-secondary mt-2">Aggregated real-time earnings</p>
        </div>

        {/* Room Occupancy Card */}
        <div 
          onClick={() => onTabChange("grid")}
          className="glass-card rounded-2xl p-6 relative overflow-hidden group cursor-pointer"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-tertiary/5 rounded-full blur-2xl pointer-events-none group-hover:bg-tertiary/10 transition-all duration-300"></div>
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-[#e8f5e9] rounded-xl text-tertiary-fixed-dim">
              <Activity className="w-5 h-5 text-tertiary-fixed-dim" />
            </div>
            <span className="flex items-center text-xs font-semibold text-green-600 bg-green-50 px-2.5 py-1 rounded-full border border-green-100">
              Optimal
            </span>
          </div>
          <h3 className="text-xs font-semibold text-secondary uppercase tracking-widest mb-1">Total Bookings</h3>
          <p className="text-4xl font-bold text-on-surface tracking-tight">{overview?.totalBookings || 0}</p>
          <p className="text-xs text-secondary mt-2">{overview?.confirmedBookings || 0} confirmed / {overview?.cancelledBookings || 0} cancelled</p>
        </div>

        {/* Active Surge Card */}
        <div 
          onClick={() => onTabChange("intelligence")}
          className="glass-card rounded-2xl p-6 relative overflow-hidden group cursor-pointer"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-amber-500/15 transition-all duration-300"></div>
          <div className="flex justify-between items-start mb-4">
            <div className="p-1.5 bg-primary-container text-white rounded-lg shadow-md shadow-primary/20">
              <Zap className="w-5 h-5 text-on-primary-container" />
            </div>
            <span className={`flex items-center text-xs font-semibold px-2.5 py-1 rounded-full border ${autoSurge ? "text-amber-700 bg-amber-50 border-amber-100" : "text-secondary bg-gray-50 border-gray-100"}`}>
              {autoSurge ? "Automated" : "Manual"}
            </span>
          </div>
          <h3 className="text-xs font-semibold text-secondary uppercase tracking-widest mb-1">Active Surge Multiplier</h3>
          <p className="text-4xl font-bold text-on-surface tracking-tight">1.5x</p>
          <p className="text-xs text-primary font-medium mt-2">Triggered: High SF Financial Core Demand</p>
        </div>
      </div>

      {/* Main Charts + Side Booking Request Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Interactive Interactive SVG Chart */}
        <div className="glass-card rounded-2xl p-6 lg:col-span-2 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold text-on-surface">Revenue &amp; Sales Trends</h3>
              <p className="text-xs text-secondary">Hover points to audit daily transaction aggregates.</p>
            </div>
            <div className="text-right">
              {activeHoverData ? (
                <div>
                  <span className="text-xs text-secondary font-mono mr-2">{activeHoverData.day}:</span>
                  <span className="text-lg font-bold text-primary-container font-mono">₹{activeHoverData.value.toLocaleString()}</span>
                </div>
              ) : (
                <span className="text-xs font-mono text-secondary">Hover line for info</span>
              )}
            </div>
          </div>

          {/* Handcraft Highly Elegant SVG Wave/Line Chart */}
          <div className="relative h-64 w-full bg-slate-50/50 rounded-xl border border-dashed border-gray-100 p-2 overflow-visible">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 800 240" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#700d3e" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#700d3e" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="0" y1="60" x2="800" y2="60" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3,3" />
              <line x1="0" y1="120" x2="800" y2="120" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3,3" />
              <line x1="0" y1="180" x2="800" y2="180" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3,3" />

              {/* Path coordinates map */}
              <path
                d={`
                  M 20,${200 - (revenueSeries[0].value / highestRev) * 160}
                  C 100,${200 - (revenueSeries[1].value / highestRev) * 160}
                    200,${200 - (revenueSeries[2].value / highestRev) * 160}
                    300,${200 - (revenueSeries[3].value / highestRev) * 160}
                  S 400,${200 - (revenueSeries[4].value / highestRev) * 160}
                    500,${200 - (revenueSeries[5].value / highestRev) * 160}
                  S 600,${200 - (revenueSeries[6].value / highestRev) * 160}
                    700,${200 - (revenueSeries[7].value / highestRev) * 160}
                  S 780,${200 - (revenueSeries[8].value / highestRev) * 160}
                `}
                fill="none"
                stroke="#700d3e"
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              {/* Area fill path same control points */}
              <path
                d={`
                  M 20,220
                  L 20,${200 - (revenueSeries[0].value / highestRev) * 160}
                  C 100,${200 - (revenueSeries[1].value / highestRev) * 160}
                    200,${200 - (revenueSeries[2].value / highestRev) * 160}
                    300,${200 - (revenueSeries[3].value / highestRev) * 160}
                  S 400,${200 - (revenueSeries[4].value / highestRev) * 160}
                    500,${200 - (revenueSeries[5].value / highestRev) * 160}
                  S 600,${200 - (revenueSeries[6].value / highestRev) * 160}
                    700,${200 - (revenueSeries[7].value / highestRev) * 160}
                  S 780,${200 - (revenueSeries[8].value / highestRev) * 160}
                  L 781,220
                  Z
                `}
                fill="url(#chartGradient)"
              />

              {/* Data points for hover */}
              {revenueSeries.map((pt: any, idx: number) => {
                const stepX = 20 + (idx * 760) / (revenueSeries.length - 1);
                const stepY = 200 - (pt.value / highestRev) * 160;
                return (
                  <g
                    key={pt.day + idx}
                    onMouseEnter={() => setActiveHoverData({ day: pt.day, value: pt.value })}
                    onMouseLeave={() => setActiveHoverData(null)}
                    className="cursor-pointer group"
                  >
                    <circle
                      cx={stepX}
                      cy={stepY}
                      r="4"
                      fill="#700d3e"
                      stroke="#ffffff"
                      strokeWidth="2.5"
                      className="transition-all duration-150 group-hover:r-[7px]"
                    />
                    <circle
                      cx={stepX}
                      cy={stepY}
                      r="16"
                      fill="transparent"
                    />
                  </g>
                );
              })}
            </svg>
            <div className="absolute bottom-1 left-0 right-0 flex justify-between px-4 text-[10px] font-mono text-secondary">
              {revenueSeries.map((d: any, idx: number) => (
                <span key={idx}>{d.day}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Live Recent Bookings Triage Drawer */}
        <div className="glass-card rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-md font-bold text-on-surface">Pending Requests</h3>
              {pendingCount > 0 && (
                <span className="bg-primary/15 text-primary-container text-xs font-bold px-2 py-0.5 rounded-full">
                  {pendingCount} pending
                </span>
              )}
            </div>
            
            <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
              {pendingCount === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto mb-2 opacity-60" />
                  <p className="text-xs text-secondary font-medium">All cleared!</p>
                </div>
              ) : (
                bookings
                  .filter((b) => b.status === "Pending")
                  .map((booking) => (
                    <div
                      key={booking.id}
                      className="p-3 bg-white/60 hover:bg-white border border-gray-100 rounded-xl transition-all flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-2.5">
                        <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-xs">
                          {booking.initials}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-on-surface truncate max-w-[110px]">{booking.client}</p>
                          <p className="text-[10px] text-secondary truncate max-w-[110px]">{booking.service}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold text-primary-container">₹{booking.amount}</p>
                        <button
                          onClick={() => {
                            if(onApproveBooking) onApproveBooking(booking.id);
                            else {
                                fetch(`/api/bookings/${booking.id}/status`, {
                                    method: 'PATCH',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ status: 'confirmed' })
                                });
                            }
                          }}
                          className="text-[9px] font-bold text-green-600 hover:underline inline-block mt-0.5"
                        >
                          Approve
                        </button>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>

          <button
            onClick={() => onTabChange("bookings")}
            className="w-full mt-4 py-2.5 bg-gray-50 text-secondary border border-gray-200/50 hover:bg-gray-100/50 rounded-xl transition-all font-semibold text-xs text-center"
          >
            Audit Booking Requests
          </button>
        </div>
      </div>

      {/* Yield Surge Promotional banner */}
      <div className="glass-panel rounded-2xl p-8 relative overflow-hidden flex flex-col md:flex-row items-center md:justify-between gap-6">
        <div className="absolute right-0 top-0 w-1/3 h-full bg-gradient-to-l from-primary-container/10 to-transparent -z-10 pointer-events-none"></div>
        <div className="relative z-10 max-w-xl text-center md:text-left">
          <div className="inline-flex items-center gap-1 bg-primary/10 text-primary-container text-[11px] font-semibold px-2.5 py-0.5 rounded-full mb-3">
            <Sparkles className="w-3 h-3 text-primary-container" strokeWidth={3} /> Maximized Dynamic Multiplier
          </div>
          <h2 className="text-2xl font-bold text-on-surface mb-2">Automated Yield Optimizer</h2>
          <p className="text-sm text-secondary leading-relaxed">
            Configure automatic multiplier spikes during regional SF conventions, private terminal surges, or peak sporting tournaments to enhance yields by up to 34.5%.
          </p>
        </div>

        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center space-x-3 bg-white/80 p-3 rounded-2xl border border-gray-100 shadow-sm">
            <span className="text-xs font-semibold text-secondary">A.I. Smart Surge:</span>
            <button
              onClick={() => setAutoSurge(!autoSurge)}
              className={`w-12 h-6 rounded-full p-0.5 ${autoSurge ? "bg-primary-container" : "bg-gray-300"} transition-all duration-200 focus:outline-none`}
            >
              <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-all duration-200 transform ${autoSurge ? "translate-x-6" : ""}`} />
            </button>
          </div>
          <button
            onClick={() => onTabChange("intelligence")}
            className="px-6 py-2.5 bg-primary-container text-white font-bold text-xs rounded-full shadow-lg shadow-primary/25 hover:bg-primary transition-colors hover:scale-[1.02] active:scale-95 duration-150"
          >
            Configure Rules
          </button>
        </div>
      </div>
    </div>
  );
}
