"use client";

import React from "react";
import { WasteLogEntry } from "@/types/waste";
import { WASTE_KNOWLEDGE_BASE } from "@/data/wasteKnowledgeBase";
import {
  BarChart3,
  Award,
  ShieldCheck,
  Zap,
  Leaf,
  Trash2,
  Download,
  Calendar,
  CheckCircle2,
  TrendingUp,
  Check,
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
  const totalItems = logs.length;
  const totalCo2 = logs.reduce((acc, curr) => acc + (curr.co2SavedKg || 0), 0);
  const recycledOrComposted = logs.filter((l) => l.category !== "trash").length;
  const diversionRate =
    totalItems > 0 ? ((recycledOrComposted / totalItems) * 100).toFixed(0) : "0";

  const categoryCounts = logs.reduce<Record<string, number>>((acc, l) => {
    acc[l.category] = (acc[l.category] || 0) + 1;
    return acc;
  }, {});

  const badges = [
    {
      title: "Initial Audit Verification",
      desc: "Classified and audited first waste stream",
      unlocked: totalItems >= 1,
      icon: Leaf,
    },
    {
      title: "Hazardous Stream Compliance",
      desc: "Isolated and diverted battery or electronic cells",
      unlocked: (categoryCounts.battery || 0) >= 1,
      icon: Zap,
    },
    {
      title: "Organics Diversion Pioneer",
      desc: "Diverted biological waste to compost streams",
      unlocked: (categoryCounts.biological || 0) >= 1,
      icon: ShieldCheck,
    },
    {
      title: "Carbon Abatement Benchmark",
      desc: "Avoided over 5.0 kg of equivalent CO₂ emissions",
      unlocked: totalCo2 >= 5.0,
      icon: TrendingUp,
    },
    {
      title: "Circular Economy Compliance",
      desc: "Logged 10+ verifiable audit sessions",
      unlocked: totalItems >= 10,
      icon: Award,
    },
  ];

  const handleExportJson = () => {
    const dataStr =
      "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(logs, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `ecosort_audit_log_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      {/* Metric Cards Row */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {/* Total Items */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Total Audited Items
          </div>
          <div className="mt-2 font-mono text-3xl font-bold text-slate-900 dark:text-white">
            {totalItems}
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Classified sessions
          </p>
        </div>

        {/* Total CO2 Avoided */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            CO₂ Abatement
          </div>
          <div className="mt-2 font-mono text-3xl font-bold text-slate-900 dark:text-white">
            {totalCo2.toFixed(1)}{" "}
            <span className="text-sm font-medium text-slate-500">kg</span>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Estimated avoided footprint
          </p>
        </div>

        {/* Diversion Rate */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Landfill Diversion Rate
          </div>
          <div className="mt-2 font-mono text-3xl font-bold text-slate-900 dark:text-white">
            {diversionRate}%
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Diverted to recycling / compost
          </p>
        </div>

        {/* Milestones */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Compliance Milestones
          </div>
          <div className="mt-2 font-mono text-3xl font-bold text-slate-900 dark:text-white">
            {badges.filter((b) => b.unlocked).length} / {badges.length}
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Audit criteria verified
          </p>
        </div>
      </div>

      {/* Compliance Standards Shelf */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
          <Award className="h-4 w-4 text-slate-700 dark:text-slate-300" />
          Sustainability Benchmarks &amp; Verified Milestones
        </h3>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {badges.map((b, idx) => {
            const Icon = b.icon;
            return (
              <div
                key={idx}
                className={`rounded-lg border p-3.5 transition-colors ${
                  b.unlocked
                    ? "border-slate-300 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/60"
                    : "border-slate-200 bg-slate-50/40 opacity-40 dark:border-slate-800 dark:bg-slate-900/40"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-8 w-8 items-center justify-center rounded bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-200">
                    <Icon className="h-4 w-4" />
                  </div>
                  <span
                    className={`rounded px-1.5 py-0.5 font-mono text-[10px] font-bold uppercase ${
                      b.unlocked
                        ? "bg-slate-900 text-white dark:bg-emerald-600"
                        : "bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-400"
                    }`}
                  >
                    {b.unlocked ? "Verified" : "Pending"}
                  </span>
                </div>
                <h4 className="mt-2.5 text-xs font-bold text-slate-900 dark:text-white">
                  {b.title}
                </h4>
                <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">{b.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sorting Audit Log Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-wrap items-center justify-between border-b border-slate-200 bg-slate-50/80 px-6 py-3.5 dark:border-slate-800 dark:bg-slate-800/40">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded bg-slate-900 text-white dark:bg-emerald-600">
              <BarChart3 className="h-3.5 w-3.5" />
            </span>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
              Personal Waste Classification Audit Log
            </h3>
          </div>

          <div className="mt-2 flex items-center gap-2 sm:mt-0">
            {logs.length > 0 && (
              <>
                <button
                  onClick={handleExportJson}
                  className="flex items-center gap-1.5 rounded border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
                  <Download className="h-3.5 w-3.5" /> Export JSON Audit
                </button>
                <button
                  onClick={onClearLogs}
                  className="flex items-center gap-1.5 rounded border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-100 dark:border-rose-900/60 dark:bg-rose-950 dark:text-rose-300"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Clear Audit Records
                </button>
              </>
            )}
          </div>
        </div>

        {logs.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500 dark:text-slate-400">
            No audit records registered. Perform a classification session and click &quot;Log in Audit Tracker&quot; to begin building your verifiable trail.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-400">
                <tr>
                  <th className="px-6 py-3 font-semibold">Timestamp</th>
                  <th className="px-6 py-3 font-semibold">Class &amp; Category</th>
                  <th className="px-6 py-3 font-semibold">Model Confidence</th>
                  <th className="px-6 py-3 font-semibold">CO₂ Abatement</th>
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
                      <td className="px-6 py-3.5 font-mono text-slate-500 dark:text-slate-400">
                        {new Date(log.timestamp).toLocaleDateString()} {new Date(log.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </td>

                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-2">
                          <span
                            className={`rounded px-1.5 py-0.5 font-bold uppercase text-[10px] ${knowledge.colorClass.badge}`}
                          >
                            {log.category}
                          </span>
                          <span className="font-semibold text-slate-800 dark:text-slate-200">
                            {knowledge.name}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-3.5 font-mono font-semibold text-slate-700 dark:text-slate-300">
                        {(log.confidence * 100).toFixed(1)}%
                      </td>

                      <td className="px-6 py-3.5 font-mono font-semibold text-slate-800 dark:text-slate-200">
                        +{log.co2SavedKg} kg
                      </td>

                      <td className="px-6 py-3.5">
                        <select
                          value={log.status}
                          onChange={(e) =>
                            onUpdateStatus(
                              log.id,
                              e.target.value as WasteLogEntry["status"]
                            )
                          }
                          className="rounded border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                        >
                          <option value="sorted">Sorted &amp; Stored</option>
                          <option value="dropped_off">Transferred to Depot</option>
                          <option value="reused">Reused / Repurposed</option>
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
