"use client";

import React, { useState } from "react";
import {
  Recycle, Trash2, BarChart3, TrendingUp, Clock,
  ChevronDown, ChevronUp, Leaf
} from "lucide-react";

interface AuditEntry {
  id: string;
  timestamp: string;
  category: string;
  confidence: number;
  wasteType: string;
}

export const ImpactDashboard: React.FC = () => {
  const [entries, setEntries] = useState<AuditEntry[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem("ecosort_audit_log");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [expanded, setExpanded] = useState(false);

  const categoryStats = entries.reduce<Record<string, number>>((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + 1;
    return acc;
  }, {});
  const topCategory = Object.entries(categoryStats).sort((a, b) => b[1] - a[1])[0];
  const recyclable = entries.filter((e) => e.wasteType === "recyclable").length;
  const divertRate = entries.length > 0 ? Math.round((recyclable / entries.length) * 100) : 0;

  const statCards = [
    {
      icon: Recycle, label: "Items Classified", value: entries.length.toString(),
      sublabel: "total scans", color: "text-green-600", bg: "bg-green-50",
    },
    {
      icon: Leaf, label: "Diversion Rate", value: `${divertRate}%`,
      sublabel: "recyclable items", color: "text-emerald-600", bg: "bg-emerald-50",
    },
    {
      icon: TrendingUp, label: "Top Category", value: topCategory?.[0] || "None",
      sublabel: topCategory ? `${topCategory[1]} items` : "no data", color: "text-blue-600", bg: "bg-blue-50",
    },
  ];

  const visibleEntries = expanded ? entries : entries.slice(0, 5);

  const handleClear = () => {
    localStorage.removeItem("ecosort_audit_log");
    setEntries([]);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-5 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="h-12 w-12 rounded-2xl bg-green-100 flex items-center justify-center mx-auto">
          <BarChart3 className="h-6 w-6 text-green-600" />
        </div>
        <h1 className="text-xl font-bold text-gray-900">My Impact</h1>
        <p className="text-sm text-gray-400">Track your classification history and waste diversion</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-3">
        {statCards.map((s, i) => (
          <div key={i} className="card p-4 text-center space-y-2">
            <div className={`h-9 w-9 rounded-xl ${s.bg} flex items-center justify-center mx-auto`}>
              <s.icon className={`h-5 w-5 ${s.color}`} />
            </div>
            <p className="text-lg font-extrabold text-gray-900 capitalize">{s.value}</p>
            <p className="text-xs text-gray-400">{s.sublabel}</p>
          </div>
        ))}
      </div>

      {/* History table */}
      <div className="card">
        <div className="card-header flex items-center justify-between">
          <h2 className="text-sm font-bold text-gray-800">Classification History</h2>
          {entries.length > 0 && (
            <button onClick={handleClear}
              className="text-xs font-medium text-red-400 hover:text-red-600 transition-colors">
              Clear all
            </button>
          )}
        </div>

        {entries.length === 0 ? (
          <div className="p-10 text-center space-y-2">
            <Trash2 className="h-8 w-8 text-gray-200 mx-auto" />
            <p className="text-sm text-gray-400">
              No items classified yet. Start by uploading a waste image.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {visibleEntries.map((entry) => (
              <div key={entry.id} className="flex items-center gap-4 px-5 py-3">
                <div className="h-8 w-8 rounded-lg bg-green-50 flex items-center justify-center shrink-0">
                  <Recycle className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 capitalize">{entry.category}</p>
                  <p className="text-xs text-gray-400 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {new Date(entry.timestamp).toLocaleString()}
                  </p>
                </div>
                <span className={`text-xs font-semibold rounded-full px-2 py-1 ${
                  entry.wasteType === "recyclable"
                    ? "bg-green-50 text-green-700"
                    : "bg-gray-50 text-gray-500"
                }`}>
                  {(entry.confidence * 100).toFixed(0)}%
                </span>
              </div>
            ))}

            {entries.length > 5 && (
              <button onClick={() => setExpanded(!expanded)}
                className="w-full flex items-center justify-center gap-1 p-3 text-xs font-semibold text-green-600 hover:bg-green-50 transition-colors">
                {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                {expanded ? "Show less" : `Show all ${entries.length} items`}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
