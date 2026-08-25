"use client";

import React from "react";
import {
  Leaf,
  ScanLine,
  MapPin,
  BarChart3,
  Info,
  ShieldCheck,
} from "lucide-react";

export type NavTab = "classify" | "locations" | "dashboard" | "about";

interface NavbarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  savedCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  savedCount,
}) => {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Brand */}
        <div
          className="flex cursor-pointer items-center gap-3"
          onClick={() => setActiveTab("classify")}
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-700 text-white shadow-xs">
            <Leaf className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                EcoSort<span className="text-emerald-700 dark:text-emerald-400">AI</span>
              </span>
              <span className="hidden rounded border border-slate-200 bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 md:inline-block">
                Decision Support System
              </span>
            </div>
            <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
              Explainable AI for Waste Classification &amp; Circular Logistics
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => setActiveTab("classify")}
            className={`flex items-center gap-2 rounded-md px-3 py-2 text-xs font-semibold transition-colors ${
              activeTab === "classify"
                ? "bg-slate-900 text-white dark:bg-emerald-600 dark:text-white"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
            }`}
          >
            <ScanLine className="h-4 w-4" />
            <span className="hidden sm:inline">Classification &amp; Analysis</span>
            <span className="sm:hidden">Analyze</span>
          </button>

          <button
            onClick={() => setActiveTab("locations")}
            className={`flex items-center gap-2 rounded-md px-3 py-2 text-xs font-semibold transition-colors ${
              activeTab === "locations"
                ? "bg-slate-900 text-white dark:bg-emerald-600 dark:text-white"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
            }`}
          >
            <MapPin className="h-4 w-4" />
            <span className="hidden sm:inline">Collection Locator</span>
            <span className="sm:hidden">Locations</span>
          </button>

          <button
            onClick={() => setActiveTab("dashboard")}
            className={`relative flex items-center gap-2 rounded-md px-3 py-2 text-xs font-semibold transition-colors ${
              activeTab === "dashboard"
                ? "bg-slate-900 text-white dark:bg-emerald-600 dark:text-white"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
            }`}
          >
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Audit Dashboard</span>
            <span className="sm:hidden">Dashboard</span>
            {savedCount > 0 && (
              <span className="ml-1 rounded bg-emerald-100 px-1.5 py-0.2 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                {savedCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("about")}
            className={`flex items-center gap-2 rounded-md px-3 py-2 text-xs font-semibold transition-colors ${
              activeTab === "about"
                ? "bg-slate-900 text-white dark:bg-emerald-600 dark:text-white"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
            }`}
          >
            <Info className="h-4 w-4" />
            <span className="hidden md:inline">Methodology</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
