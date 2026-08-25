"use client";

import React from "react";
import { Leaf, Sparkles, MapPin, BarChart3, Info } from "lucide-react";

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
    <header className="sticky top-0 z-50 border-b border-emerald-900/10 bg-white/80 backdrop-blur-md dark:border-emerald-100/10 dark:bg-slate-900/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Brand */}
        <div
          className="flex cursor-pointer items-center gap-3"
          onClick={() => setActiveTab("classify")}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-white shadow-md shadow-emerald-500/20">
            <Leaf className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                EcoSort<span className="text-emerald-600 dark:text-emerald-400">AI</span>
              </span>
              <span className="hidden rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 md:inline-block">
                Decision Support System
              </span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300">
              Explainable AI for Sustainable Waste Management
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => setActiveTab("classify")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
              activeTab === "classify"
                ? "bg-emerald-600 text-white shadow-sm shadow-emerald-600/30"
                : "text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
            }`}
          >
            <Sparkles className="h-4 w-4" />
            <span className="hidden sm:inline">Identify & Sort</span>
            <span className="sm:hidden">Sort</span>
          </button>

          <button
            onClick={() => setActiveTab("locations")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
              activeTab === "locations"
                ? "bg-emerald-600 text-white shadow-sm shadow-emerald-600/30"
                : "text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
            }`}
          >
            <MapPin className="h-4 w-4" />
            <span className="hidden sm:inline">Disposal Points</span>
            <span className="sm:hidden">Map</span>
          </button>

          <button
            onClick={() => setActiveTab("dashboard")}
            className={`relative flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
              activeTab === "dashboard"
                ? "bg-emerald-600 text-white shadow-sm shadow-emerald-600/30"
                : "text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
            }`}
          >
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Impact Dashboard</span>
            <span className="sm:hidden">Impact</span>
            {savedCount > 0 && (
              <span className="ml-1 rounded-full bg-amber-500 px-1.5 py-0.2 text-[10px] font-bold text-white">
                {savedCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("about")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
              activeTab === "about"
                ? "bg-emerald-600 text-white shadow-sm shadow-emerald-600/30"
                : "text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
            }`}
          >
            <Info className="h-4 w-4" />
            <span className="hidden md:inline">About & XAI</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
