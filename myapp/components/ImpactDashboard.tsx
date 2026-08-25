"use client";

import React from "react";
import { WasteLogEntry } from "@/types/waste";
import { WASTE_KNOWLEDGE_BASE } from "@/data/wasteKnowledgeBase";
import {
  BarChart3,
  Award,
  TreePine,
  Sparkles,
  Trash2,
  Download,
  Calendar,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";

interface ImpactDashboardProps {
  logs: WasteLogEntry[];
  onClearLogs: () => void;
  onUpdateStatus: (id: string, status: WasteLogEntry["status"]) => void;
}

export const ImpactDashboard: React.FC<ImpactDashboardProps> = ({
  logs,
  onClearLogs,
  onUpdateStatus,
}) => {
  // Aggregate Stats
  const totalItems = logs.length;
  const totalCo2 = logs.reduce((acc, curr) => acc + (curr.co2SavedKg || 0), 0);
  const recycledOrComposted = logs.filter(
    (l) => l.category !== "trash"
  ).length;
  const diversionRate =
    totalItems > 0 ? ((recycledOrComposted / totalItems) * 100).toFixed(0) : "0";

  // Category counts
  const categoryCounts = logs.reduce<Record<string, number>>((acc, l) => {
    acc[l.category] = (acc[l.category] || 0) + 1;
    return acc;
  }, {});

  // Badges Earned
  const badges = [
    {
      title: "First Sort Hero",
      desc: "Classified your first waste item",
      unlocked: totalItems >= 1,
      icon: "🌱",
    },
    {
      title: "E-Waste Guardian",
      desc: "Properly handled battery/e-waste",
      unlocked: (categoryCounts.battery || 0) >= 1,
      icon: "⚡",
    },
    {
      title: "Compost Pioneer",
      desc: "Diverted biological waste to organics",
      unlocked: (categoryCounts.biological || 0) >= 1,
      icon: "🍎",
    },
    {
      title: "Carbon Offset Champion",
      desc: "Avoided over 5 kg of CO₂ emissions",
      unlocked: totalCo2 >= 5.0,
      icon: "🏆",
    },
    {
      title: "Zero-Waste Scholar",
      desc: "Sorted 10+ items accurately",
      unlocked: totalItems >= 10,
      icon: "🎓",
    },
  ];

  const handleExportJson = () => {
    const dataStr =
      "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(logs, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `ecosort_waste_audit_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      {/* Metric Cards Row */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {/* Total Items */}
        <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/90">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            <span>Items Sorted</span>
            <Sparkles className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="mt-3 text-3xl font-extrabold text-slate-900 dark:text-white">
            {totalItems}
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Total classified sessions
          </p>
        </div>

        {/* Total CO2 Avoided */}
        <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/90">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            <span>CO₂ Avoided</span>
            <TreePine className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="mt-3 text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
            {totalCo2.toFixed(1)}{" "}
            <span className="text-base font-semibold text-slate-500">kg</span>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Net carbon footprint reduction
          </p>
        </div>

        {/* Diversion Rate */}
        <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/90">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            <span>Diversion Rate</span>
            <TrendingUp className="h-4 w-4 text-indigo-500" />
          </div>
          <div className="mt-3 text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">
            {diversionRate}%
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Saved from municipal landfills
          </p>
        </div>

        {/* Badges Earned */}
        <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/90">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            <span>Eco-Badges</span>
            <Award className="h-4 w-4 text-amber-500" />
          </div>
          <div className="mt-3 text-3xl font-extrabold text-amber-600 dark:text-amber-400">
            {badges.filter((b) => b.unlocked).length} / {badges.length}
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Milestones unlocked
          </p>
        </div>
      </div>

      {/* Badges Shelf */}
      <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/90">
        <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-100">
          <Award className="h-4 w-4 text-amber-500" />
          Sustainability Badges & Achievements
        </h3>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {badges.map((b, idx) => (
            <div
              key={idx}
              className={`rounded-xl border p-3 text-center transition-all ${
                b.unlocked
                  ? "border-amber-200 bg-amber-50/70 dark:border-amber-900/40 dark:bg-amber-950/30"
                  : "border-slate-200 bg-slate-100/50 opacity-40 grayscale dark:border-slate-800 dark:bg-slate-800/40"
              }`}
            >
              <div className="text-2xl">{b.icon}</div>
              <h4 className="mt-1 text-xs font-bold text-slate-900 dark:text-white">
                {b.title}
              </h4>
              <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">{b.desc}</p>
              <span
                className={`mt-2 inline-block rounded px-1.5 py-0.2 text-[10px] font-bold ${
                  b.unlocked
                    ? "bg-amber-200 text-amber-900 dark:bg-amber-900/80 dark:text-amber-200"
                    : "bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-400"
                }`}
              >
                {b.unlocked ? "Unlocked" : "Locked"}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Sorting Audit Log Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white/90 shadow-sm dark:border-slate-800 dark:bg-slate-900/90">
        <div className="flex flex-wrap items-center justify-between border-b border-slate-100 bg-slate-50/70 px-6 py-4 dark:border-slate-800/80 dark:bg-slate-800/50">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-xs">
              <BarChart3 className="h-4 w-4" />
            </span>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
              Personal Waste Sorting Audit Log
            </h3>
          </div>

          <div className="mt-2 flex items-center gap-2 sm:mt-0">
            {logs.length > 0 && (
              <>
                <button
                  onClick={handleExportJson}
                  className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                >
                  <Download className="h-3.5 w-3.5" /> Export JSON
                </button>
                <button
                  onClick={onClearLogs}
                  className="flex items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 shadow-xs hover:bg-rose-100 dark:border-rose-900 dark:bg-rose-950 dark:text-rose-300 dark:hover:bg-rose-900"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Clear History
                </button>
              </>
            )}
          </div>
        </div>

        {logs.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
              No waste classification entries logged yet.
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Classify an item in the &quot;Identify &amp; Sort&quot; tab and click &quot;Log in Tracker&quot; to begin building your eco profile.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 bg-slate-50 text-slate-500 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-400">
                <tr>
                  <th className="px-6 py-3 font-semibold">Timestamp</th>
                  <th className="px-6 py-3 font-semibold">Item & Category</th>
                  <th className="px-6 py-3 font-semibold">Model Confidence</th>
                  <th className="px-6 py-3 font-semibold">Est. CO₂ Avoided</th>
                  <th className="px-6 py-3 font-semibold">Disposal Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {logs.map((log) => {
                  const knowledge =
                    WASTE_KNOWLEDGE_BASE[log.category] || WASTE_KNOWLEDGE_BASE.trash;

                  return (
                    <tr
                      key={log.id}
                      className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30"
                    >
                      <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1.5 font-mono">
                          <Calendar className="h-3.5 w-3.5" />
                          {new Date(log.timestamp).toLocaleDateString()} {new Date(log.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={`rounded px-2 py-0.5 font-bold uppercase text-[10px] ${knowledge.colorClass.badge}`}
                          >
                            {log.category}
                          </span>
                          <span className="font-semibold text-slate-800 dark:text-slate-200">
                            {knowledge.name}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4 font-mono font-semibold text-slate-700 dark:text-slate-300">
                        {(log.confidence * 100).toFixed(1)}%
                      </td>

                      <td className="px-6 py-4 font-semibold text-emerald-600 dark:text-emerald-400">
                        +{log.co2SavedKg} kg
                      </td>

                      <td className="px-6 py-4">
                        <select
                          value={log.status}
                          onChange={(e) =>
                            onUpdateStatus(
                              log.id,
                              e.target.value as WasteLogEntry["status"]
                            )
                          }
                          className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                        >
                          <option value="sorted">✅ Sorted</option>
                          <option value="dropped_off">📍 Dropped Off</option>
                          <option value="reused">♻️ Reused</option>
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
