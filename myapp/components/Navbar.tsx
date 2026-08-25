"use client";

import React from "react";
import { Sparkles, MapPin, BookOpen } from "lucide-react";
import Image from "next/image";

export type NavTab = "classify" | "locations" | "about";

interface NavbarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
}

const navItems: { id: NavTab; label: string; shortLabel: string; icon: React.ElementType }[] = [
  { id: "classify", label: "AI Sorter & XAI", shortLabel: "Sort", icon: Sparkles },
  { id: "locations", label: "Drop-off Centers", shortLabel: "Drop-offs", icon: MapPin },
  { id: "about", label: "Waste Guide & AI", shortLabel: "Guide", icon: BookOpen },
];

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-emerald-100/80 shadow-xs transition-all">
      <div className="mx-auto max-w-6xl flex items-center justify-between px-4 sm:px-6 py-2.5">
        {/* Cute Brand Logo */}
        <button
          onClick={() => setActiveTab("classify")}
          className="flex items-center gap-2.5 text-left group transition-transform active:scale-98"
        >
          <div className="relative h-10 w-10 rounded-2xl overflow-hidden shadow-xs border border-emerald-200 bg-white flex items-center justify-center group-hover:shadow-emerald-200 transition-shadow">
            <Image
              src="/images/cute_eco_mascot.jpg"
              alt="Eco Mascot"
              width={40}
              height={40}
              className="object-cover"
              priority
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-base font-extrabold tracking-tight text-gray-900">
                EcoSort<span className="text-emerald-600">AI</span>
              </span>
              <span className="hidden sm:inline-block rounded-full bg-emerald-100/90 text-emerald-800 text-[10px] font-bold px-2 py-0.5 border border-emerald-200">
                Smart XAI
              </span>
            </div>
            <p className="text-[11px] font-medium text-emerald-700/80 -mt-0.5">
              Decision Support System
            </p>
          </div>
        </button>

        {/* Clean Pill Navigation */}
        <nav className="flex items-center gap-1 sm:gap-1.5 bg-white/70 backdrop-blur-sm p-1 rounded-full border border-emerald-200/80 shadow-2xs">
          {navItems.map(({ id, label, shortLabel, icon: Icon }) => {
            const isActive = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`relative flex items-center gap-1.5 rounded-full px-3.5 sm:px-4 py-1.5 text-xs sm:text-[13px] font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-emerald-600 text-white shadow-sm shadow-emerald-600/30 scale-100"
                    : "text-emerald-900/70 hover:text-emerald-950 hover:bg-emerald-100/60"
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${isActive ? "text-emerald-100" : "text-emerald-600"}`} />
                <span className="hidden sm:inline">{label}</span>
                <span className="sm:hidden">{shortLabel}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
