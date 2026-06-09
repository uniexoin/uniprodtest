'use client';
import React, { useState } from "react";
import { ToggleLeft, ToggleRight, Sparkles, Plus } from "lucide-react";
import { SurgeRule } from "@/lib/elite-adapters";

const initialMockRules: SurgeRule[] = [
  { id: "SRO-120", zone: "SFO Financial District", baseRate: 120, multiplier: 1.5, demand: "High", active: true },
  { id: "SRO-121", zone: "Silicon Valley Tech Parks", baseRate: 150, multiplier: 1.8, demand: "Extreme", active: true },
  { id: "SRO-122", zone: "OAK Airport Terminals", baseRate: 90, multiplier: 1.0, demand: "Low", active: false },
  { id: "SRO-123", zone: "Napa Valley Vineyards", baseRate: 400, multiplier: 1.2, demand: "Medium", active: true },
];

export function IntelligenceSurgeView() {
  const [rules, setRules] = useState<SurgeRule[]>(initialMockRules);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editMultiplier, setEditMultiplier] = useState("");

  // New Rule form states
  const [zone, setZone] = useState("");
  const [baseRate, setBaseRate] = useState("");
  const [multiplier, setMultiplier] = useState("");
  const [demand, setDemand] = useState<SurgeRule["demand"]>("Medium");

  const handleCreateRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!zone || !baseRate || !multiplier) return;

    const newRule: SurgeRule = {
      id: `SRO-${Math.floor(Math.random() * 1000)}`,
      zone,
      baseRate: parseFloat(baseRate),
      multiplier: parseFloat(multiplier),
      demand,
      active: true,
    };

    setRules([newRule, ...rules]);

    // Reset Form
    setZone("");
    setBaseRate("");
    setMultiplier("");
    setShowAddForm(false);
  };

  const onToggleRule = (id: string) => {
    setRules(rules.map((r) => (r.id === id ? { ...r, active: !r.active } : r)));
  };

  const onUpdateMultiplier = (id: string, newMultiplier: number) => {
    setRules(rules.map((r) => (r.id === id ? { ...r, multiplier: newMultiplier } : r)));
  };

  const handleSaveMultiplier = (id: string) => {
    const parsed = parseFloat(editMultiplier);
    if (!isNaN(parsed) && parsed >= 1.0) {
      onUpdateMultiplier(id, parsed);
    }
    setEditingId(null);
  };

  const demandColors = {
    Low: "bg-gray-100 text-gray-700",
    Medium: "bg-blue-100 text-blue-700",
    High: "bg-amber-100 text-amber-700",
    Extreme: "bg-rose-100 text-rose-700 font-bold animate-pulse",
  };

  return (
    <div className="space-y-8">
      {/* Header Context */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-on-surface tracking-tight">Intelligence &amp; Surge</h2>
          <p className="text-sm text-secondary font-medium">A.I. Smart Pricing dispatch controller. Adjust sector multiplier indices of luxury routes.</p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary-container text-white text-xs font-bold rounded-full shadow-lg shadow-primary/20 hover:bg-primary transition-all duration-150 cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          {showAddForm ? "Collapse Config Panel" : "Establish New Pricing Zone"}
        </button>
      </div>

      {/* Slide form container */}
      {showAddForm && (
        <form onSubmit={handleCreateRule} className="p-6 bg-white/80 border border-gray-100 rounded-2xl space-y-4 shadow-sm">
          <h3 className="text-sm font-bold text-on-surface uppercase tracking-wider">Configure Dynamic Zone</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-secondary uppercase block">Zone / Hub Territory</label>
              <input
                type="text"
                required
                placeholder="e.g. SFO Private Aerodrome"
                value={zone}
                onChange={(e) => setZone(e.target.value)}
                className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-primary-container outline-none text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-secondary uppercase block">Base Transfer Rate ($)</label>
              <input
                type="number"
                required
                placeholder="350"
                value={baseRate}
                onChange={(e) => setBaseRate(e.target.value)}
                className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-primary-container outline-none text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-secondary uppercase block">Starting Multiplier</label>
              <input
                type="number"
                step="0.1"
                required
                placeholder="1.5"
                value={multiplier}
                onChange={(e) => setMultiplier(e.target.value)}
                className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-primary-container outline-none text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-secondary uppercase block">Estimated Area Demand</label>
              <div className="flex gap-3">
                <select
                  value={demand}
                  onChange={(e: any) => setDemand(e.target.value)}
                  className="flex-1 h-10 px-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-primary-container outline-none text-xs"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Extreme">Extreme</option>
                </select>
                <button
                  type="submit"
                  className="px-6 h-10 bg-primary-container text-white font-bold text-xs rounded-xl shadow-md hover:bg-primary transition-all cursor-pointer"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* Rules Board layout */}
      <div className="glass-panel rounded-2xl p-6">
        <h3 className="text-lg font-bold text-on-surface mb-6">Zone Mult-Index Matrix</h3>
        
        <div className="space-y-4">
          {rules.map((rule) => (
            <div
              key={rule.id}
              className={`p-4 rounded-xl border transition-all flex flex-col md:flex-row md:items-center md:justify-between gap-4 ${
                rule.active ? "bg-white/75 border-gray-200/60" : "bg-gray-100/50 border-gray-200 opacity-70"
              }`}
            >
              <div className="flex items-center space-x-4">
                <div
                  onClick={() => onToggleRule(rule.id)}
                  className="cursor-pointer text-secondary hover:text-primary-container"
                  title={rule.active ? "Deactivate Zone" : "Activate Zone"}
                >
                  {rule.active ? (
                    <ToggleRight className="w-8 h-8 text-primary-container" />
                  ) : (
                    <ToggleLeft className="w-8 h-8 text-gray-450" />
                  )}
                </div>

                <div>
                  <h4 className="text-sm font-bold text-on-surface">{rule.zone}</h4>
                  <div className="flex items-center space-x-2.5 text-xs text-secondary mt-0.5">
                    <span>Base Escort Rate: <strong className="text-on-surface font-mono">₹{rule.baseRate}</strong></span>
                    <span>•</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${demandColors[rule.demand]}`}>
                      {rule.demand} Demand
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 self-end md:self-auto">
                <div className="text-right">
                  <span className="text-[9px] font-semibold text-secondary uppercase block">Active Index</span>
                  
                  {editingId === rule.id ? (
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        type="number"
                        step="0.1"
                        className="w-16 h-8 px-2 bg-white border border-gray-300 rounded font-mono text-xs focus:outline-none"
                        value={editMultiplier}
                        onChange={(e) => setEditMultiplier(e.target.value)}
                      />
                      <button
                        onClick={() => handleSaveMultiplier(rule.id)}
                        className="px-2.5 h-8 bg-green-600 text-white text-xs font-bold rounded"
                      >
                        Set
                      </button>
                    </div>
                  ) : (
                    <span
                      onClick={() => {
                        setEditingId(rule.id);
                        setEditMultiplier(rule.multiplier.toString());
                      }}
                      className="text-lg font-extrabold text-primary-container font-mono cursor-pointer hover:underline border-b border-dashed border-primary"
                      title="Click to edit multiplier"
                    >
                      {rule.multiplier}x
                    </span>
                  )}
                </div>

                {rule.active && rule.demand === "Extreme" && (
                  <div className="flex items-center gap-1.5 text-xs text-primary bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-lg font-bold">
                    <Sparkles className="w-3.5 h-3.5 text-primary-container animate-spin" /> High-Gain
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
