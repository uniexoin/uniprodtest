'use client';
import { useState } from "react";
import { TrendingUp, PackageCheck, Receipt } from "lucide-react";
import { useVendorSalesBreakdown, useVendorLedger, useVendorAnalyticsOverview } from "@/hooks/use-dashboard";
import { adaptLedgerTransactions } from "@/lib/elite-adapters";

type Period = "Daily" | "Weekly" | "Monthly";

export function RevenueView() {
  const [period, setPeriod] = useState<Period>("Monthly");

  const { data: salesData } = useVendorSalesBreakdown('year');
  const { data: ledgerData } = useVendorLedger(1, 10);
  const { data: overview } = useVendorAnalyticsOverview();

  const transactions = adaptLedgerTransactions(ledgerData?.entries || []);

  const totalBookings = overview?.totalBookings || 0;
  const netEarnings = overview?.netEarnings || 0;
  const avg = overview?.avgBookingValue || 0;
  const change = overview?.momGrowth || 0;

  // Use real data to derive period estimates
  const multiplier = period === "Daily" ? 1/30 : period === "Weekly" ? 7/30 : 1;

  const currentData = {
    total: `₹${(netEarnings * multiplier).toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
    change: `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`,
    units: Math.round(totalBookings * multiplier).toLocaleString(),
    avg: `₹${avg.toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
    chart: salesData?.monthlySeries ? salesData.monthlySeries.slice(-10).map((m: any) => (m.vehicle + m.house + m.laundry) / 1000) : [35, 24, 40, 32, 45, 30, 48, 35, 52, 46],
  };

  // Ensure chart has exactly 10 points for the SVG math
  while(currentData.chart.length < 10) {
      currentData.chart.unshift(20);
  }

  return (
    <div className="space-y-8">
      {/* Upper context Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-on-surface tracking-tight">Revenue &amp; Sales</h2>
          <p className="text-sm text-secondary font-medium">Drill down into luxury reservation receipts and logistics billings.</p>
        </div>

        {/* Period Switcher tabs */}
        <div className="flex bg-white/60 p-1 rounded-full border border-gray-100 backdrop-blur shadow-sm w-fit">
          {(["Daily", "Weekly", "Monthly"] as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
                period === p
                  ? "bg-primary-container text-on-primary-container shadow-md"
                  : "text-secondary hover:text-primary-container"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Hero Chart container */}
      <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
        <div className="flex justify-between items-start mb-6">
          <div>
            <span className="text-xs font-bold text-secondary uppercase tracking-wider mb-1 block">Aggregate Receipts</span>
            <div className="text-4xl font-extrabold text-on-surface font-mono tracking-tight">{currentData.total}</div>
          </div>
          <div className={`flex items-center space-x-1.5 px-3 py-1 rounded-full border ${change >= 0 ? 'bg-green-50 text-green-700 border-green-100' : 'bg-rose-50 text-rose-700 border-rose-100'}`}>
            <TrendingUp className={`w-3.5 h-3.5 ${change < 0 && 'rotate-180'}`} />
            <span className="text-xs font-bold">{currentData.change}</span>
          </div>
        </div>

        {/* Dynamic Stylized SVG Wave representing multiperiod charts */}
        <div className="h-36 w-full mt-4 relative">
          <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 40">
            <defs>
              <linearGradient id="revenueWaveGrad" x1="0%" x2="0%" y1="0%" y2="100%">
                <stop offset="0%" stopColor="#700d3e" stopOpacity="0.28" />
                <stop offset="100%" stopColor="#700d3e" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Simulated wave path based on current period */}
            <path
              d={`
                M 0 40
                L 0 ${40 - currentData.chart[0]}
                Q 10 ${40 - currentData.chart[1]} 20 ${40 - currentData.chart[2]}
                T 40 ${40 - currentData.chart[4]}
                T 60 ${40 - currentData.chart[6]}
                T 80 ${40 - currentData.chart[8]}
                L 100 ${40 - currentData.chart[9]}
                L 100 40
                Z
              `}
              fill="url(#revenueWaveGrad)"
            />
            <path
              d={`
                M 0 ${40 - currentData.chart[0]}
                Q 10 ${40 - currentData.chart[1]} 20 ${40 - currentData.chart[2]}
                T 40 ${40 - currentData.chart[4]}
                T 60 ${40 - currentData.chart[6]}
                T 80 ${40 - currentData.chart[8]}
                L 100 ${40 - currentData.chart[9]}
              `}
              fill="none"
              stroke="#700d3e"
              strokeWidth="2"
            />
          </svg>
        </div>
      </div>

      {/* Grid containing units sales detail cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card rounded-2xl p-5 flex flex-col items-start hover:scale-[1.01] transition-transform">
          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center mb-4 text-primary-container">
            <PackageCheck className="w-5 h-5" />
          </div>
          <span className="text-xs font-semibold text-secondary uppercase tracking-wider mb-1">Logistics / Rental Units Sold</span>
          <span className="text-3xl font-bold text-on-surface font-mono">{currentData.units}</span>
        </div>

        <div className="glass-card rounded-2xl p-5 flex flex-col items-start hover:scale-[1.01] transition-transform">
          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center mb-4 text-primary-container">
            <Receipt className="w-5 h-5" />
          </div>
          <span className="text-xs font-semibold text-secondary uppercase tracking-wider mb-1">Average Carriage Value</span>
          <span className="text-3xl font-bold text-on-surface font-mono">{currentData.avg}</span>
        </div>
      </div>

      {/* Core Recent Ledger Receipts */}
      <div className="glass-panel rounded-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-bold text-on-surface">Recent Receipt Ledger</h3>
            <p className="text-xs text-secondary">Verified incoming credit deposits.</p>
          </div>
          <span className="text-xs font-mono text-secondary">Awaiting direct bank sync</span>
        </div>

        <div className="space-y-4">
          {transactions
            .filter((tx) => tx.type === "income")
            .slice(0, 4)
            .map((tx) => (
              <div
                key={tx.id}
                className="glass-card rounded-xl p-4 flex items-center justify-between hover:bg-white/80 transition-all cursor-pointer"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-primary-container/10 text-primary-container flex items-center justify-center font-bold text-xs font-mono">
                    {tx.id.substring(tx.id.length - 4)}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-on-surface">{tx.description}</h4>
                    <div className="flex items-center space-x-2 text-xs text-secondary mt-0.5">
                      <span className="bg-gray-100 px-2 py-0.5 rounded-full text-[10px] font-semibold">{tx.category}</span>
                      <span>•</span>
                      <span>{tx.date}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-base font-bold text-primary-container font-mono">+₹{tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  <p className="text-[10px] text-green-600 font-semibold mt-0.5 uppercase tracking-wider">Deposited</p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
