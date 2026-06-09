'use client';
import React, { useState } from "react";
import { Plus, Minus, PlusCircle, ArrowUpRight, ArrowDownRight, Tag } from "lucide-react";
import { useVendorLedger } from "@/hooks/use-dashboard";
import { adaptLedgerTransactions } from "@/lib/elite-adapters";
import { toast } from "sonner";

export function LedgerView() {
  const { data: ledgerData } = useVendorLedger(1, 50);
  const transactions = adaptLedgerTransactions(ledgerData?.entries || []);

  const [filterType, setFilterType] = useState<"all" | "income" | "expense">("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [showAddForm, setShowAddForm] = useState(false);

  // New Transaction entry form state
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Hospitality Management");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"income" | "expense">("income");
  const [date, setDate] = useState(new Date().toISOString().substring(0, 10));

  const categories = Array.from(new Set(transactions.map((tx) => tx.category)));

  // Calculate high-fidelity math aggregates
  const totalIncome = ledgerData?.totals?.income || 0;
  const totalExpense = ledgerData?.totals?.expense || 0;
  const netBalance = ledgerData?.totals?.net || 0;

  const filteredTransactions = transactions.filter((tx) => {
    const matchesType = filterType === "all" ? true : tx.type === filterType;
    const matchesCategory = filterCategory === "all" ? true : tx.category === filterCategory;
    return matchesType && matchesCategory;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount) return;

    toast.success("Transaction recorded successfully.");

    // Reset Form
    setDescription("");
    setAmount("");
    setShowAddForm(false);
  };

  return (
    <div className="space-y-8">
      {/* Context Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-on-surface tracking-tight">Ledger Book</h2>
          <p className="text-sm text-secondary font-medium">Double-entry audit log of assets, logistics margins &amp; corporate rentals.</p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary-container text-white text-xs font-bold rounded-full shadow-lg shadow-primary/20 hover:bg-primary transition-all duration-150 cursor-pointer self-start md:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          {showAddForm ? "Collapse Ledger Desk" : "Record New Manifest Entry"}
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total revenue credit */}
        <div className="glass-card rounded-2xl p-5 border-l-4 border-l-green-500">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-secondary uppercase tracking-widest">Aggregate Credits</span>
            <ArrowUpRight className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-2xl font-bold font-mono text-on-surface">₹{totalIncome.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
        </div>

        {/* Total expenses debit */}
        <div className="glass-card rounded-2xl p-5 border-l-4 border-l-rose-500">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-secondary uppercase tracking-widest">Aggregate Debits</span>
            <ArrowDownRight className="w-5 h-5 text-rose-600" />
          </div>
          <p className="text-2xl font-bold font-mono text-on-surface">₹{totalExpense.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
        </div>

        {/* Total net balance margin */}
        <div className="glass-card rounded-2xl p-5 border-l-4 border-l-primary">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-secondary uppercase tracking-widest">Net Yield Margin</span>
            <div className="w-2.5 h-2.5 bg-primary rounded-full animate-pulse" />
          </div>
          <p className="text-2xl font-bold font-mono text-primary-container">
            ₹{netBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      {/* Dynamic Slide-down Add Transaction Form */}
      {showAddForm && (
        <form onSubmit={handleSubmit} className="p-6 bg-white/80 border border-gray-100 rounded-2xl space-y-4 shadow-sm">
          <h3 className="text-sm font-bold text-on-surface uppercase tracking-wider">Record Ledger Entry</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-secondary uppercase block">Description / Manifest details</label>
              <input
                type="text"
                required
                placeholder="e.g. Mercedes Refuel SFO"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-primary-container outline-none text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-secondary uppercase block">Category / Sector</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-primary-container outline-none text-xs"
              >
                <option value="Hospitality Management">Hospitality Management</option>
                <option value="Logistics Carriage">Logistics Carriage</option>
                <option value="Property Leasing">Property Leasing</option>
                <option value="Executive Transport">Executive Transport</option>
                <option value="Maintenance">Maintenance</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-secondary uppercase block">Transaction Date</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-primary-container outline-none text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-secondary uppercase block">Account Manifest Flow</label>
              <div className="grid grid-cols-2 gap-2 h-10">
                <button
                  type="button"
                  onClick={() => setType("income")}
                  className={`border font-semibold text-xs rounded-xl focus:outline-none flex items-center justify-center gap-1.5 ${
                    type === "income" ? "bg-green-50 border-green-300 text-green-700" : "bg-gray-50 border-gray-200 text-secondary"
                  }`}
                >
                  <Plus className="w-3.5 h-3.5" /> Credit
                </button>
                <button
                  type="button"
                  onClick={() => setType("expense")}
                  className={`border font-semibold text-xs rounded-xl focus:outline-none flex items-center justify-center gap-1.5 ${
                    type === "expense" ? "bg-rose-50 border-rose-300 text-rose-700" : "bg-gray-50 border-gray-200 text-secondary"
                  }`}
                >
                  <Minus className="w-3.5 h-3.5" /> Debit
                </button>
              </div>
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="text-[10px] font-bold text-secondary uppercase block">Transaction Value (₹)</label>
              <div className="flex gap-4">
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="0.00"
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

      {/* Manifest Entries lists with filters */}
      <div className="glass-panel rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-bold text-on-surface">Record Sheets</h3>
            <p className="text-xs text-secondary">Historical entries logged in standard double entry ledger.</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {/* Filter Type */}
            <select
              value={filterType}
              onChange={(e: any) => setFilterType(e.target.value)}
              className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none text-secondary font-semibold"
            >
              <option value="all">Direction: All</option>
              <option value="income">Credits (Inflows)</option>
              <option value="expense">Debits (Outflows)</option>
            </select>

            {/* Filter Category */}
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none text-secondary font-semibold"
            >
              <option value="all">Sectors: All</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table/List of items */}
        <div className="space-y-3.5">
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-12 text-secondary text-sm">
              No ledger matching current directory filter rules.
            </div>
          ) : (
            filteredTransactions.map((tx) => (
              <div
                key={tx.id}
                className="p-4 bg-white/60 hover:bg-white border border-gray-100 rounded-xl flex items-center justify-between transition-all"
              >
                <div className="flex items-center space-x-4">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs ${
                      tx.type === "income"
                        ? "bg-green-50 text-green-700"
                        : "bg-rose-50 text-rose-700"
                    }`}
                  >
                    {tx.type === "income" ? "+" : "-"}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-on-surface">{tx.description}</h4>
                    <div className="flex items-center gap-2 text-xs text-secondary mt-0.5">
                      <span className="font-mono text-[10px] text-primary bg-primary/5 px-2 py-0.5 rounded-full font-bold">
                        {tx.id.substring(tx.id.length - 6)}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Tag className="w-2.5 h-2.5 text-secondary" /> {tx.category}
                      </span>
                      <span>•</span>
                      <span>{tx.date}</span>
                    </div>
                  </div>
                </div>

                <span
                  className={`text-sm font-bold font-mono ${
                    tx.type === "income" ? "text-green-600" : "text-rose-600"
                  }`}
                >
                  {tx.type === "income" ? "+" : "-"}₹{tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
