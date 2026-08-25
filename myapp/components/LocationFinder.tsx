"use client";

import React, { useState } from "react";
import { WasteCategory, DisposalLocation } from "@/types/waste";
import { VERIFIED_DISPOSAL_LOCATIONS } from "@/data/disposalLocations";
import {
  MapPin,
  Clock,
  Phone,
  Navigation,
  CheckCircle2,
  Filter,
  ExternalLink,
  Layers,
} from "lucide-react";

interface LocationFinderProps {
  highlightCategory?: WasteCategory;
  showAllInitially?: boolean;
}

export const LocationFinder: React.FC<LocationFinderProps> = ({
  highlightCategory,
  showAllInitially = false,
}) => {
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>(
    showAllInitially ? "all" : highlightCategory || "all"
  );
  const [selectedLocation, setSelectedLocation] = useState<DisposalLocation | null>(null);

  const filteredLocations = VERIFIED_DISPOSAL_LOCATIONS.filter((loc) => {
    if (selectedCategoryFilter === "all") return true;
    return loc.acceptedCategories.includes(selectedCategoryFilter as WasteCategory);
  });

  const activeLoc = selectedLocation || filteredLocations[0] || VERIFIED_DISPOSAL_LOCATIONS[0];

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white/90 shadow-xl shadow-slate-200/40 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-none">
      {/* Section Header */}
      <div className="flex flex-wrap items-center justify-between border-b border-slate-100 bg-slate-50/70 px-6 py-4 dark:border-slate-800/80 dark:bg-slate-800/50">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-xs">
            <MapPin className="h-4 w-4" />
          </span>
          <div>
            <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
              📍 Step 4: Decision Support — Where to Dispose & Nearby Drop-Offs
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Verified municipal drop-off hubs, e-waste collectors, donation centers, and composters
            </p>
          </div>
        </div>

        {/* Filter Indicator */}
        {highlightCategory && (
          <div className="rounded-md bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
            Auto-filtered for: <strong className="uppercase">{highlightCategory}</strong>
          </div>
        )}
      </div>

      <div className="p-6">
        {/* Category Filter Pills */}
        <div className="mb-6 flex flex-wrap items-center gap-1.5">
          <span className="mr-1 flex items-center gap-1 text-xs font-bold text-slate-500 dark:text-slate-400">
            <Filter className="h-3 w-3" /> Waste Type:
          </span>
          {["all", "battery", "plastic", "glass", "metal", "clothes", "shoes", "biological", "paper", "cardboard", "trash"].map(
            (cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategoryFilter(cat)}
                className={`rounded-lg px-2.5 py-1 text-xs font-medium capitalize transition-all ${
                  selectedCategoryFilter === cat
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "border border-slate-200 bg-slate-100/80 text-slate-700 hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                }`}
              >
                {cat === "all" ? "All Locations" : cat}
              </button>
            )
          )}
        </div>

        {/* Map & Facility Directory Layout */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Facility List (Left 7 Cols) */}
          <div className="space-y-3 lg:col-span-7">
            {filteredLocations.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
                No registered locations specifically for this filter. Showing all available centers.
              </div>
            ) : (
              filteredLocations.map((loc) => {
                const isSelected = activeLoc?.id === loc.id;
                const matchesCurrent =
                  highlightCategory && loc.acceptedCategories.includes(highlightCategory);

                return (
                  <div
                    key={loc.id}
                    onClick={() => setSelectedLocation(loc)}
                    className={`cursor-pointer rounded-xl border p-4 transition-all ${
                      isSelected
                        ? "border-indigo-500 bg-indigo-50/60 shadow-md shadow-indigo-500/10 dark:border-indigo-500 dark:bg-indigo-950/40"
                        : "border-slate-200 bg-slate-50/60 hover:border-slate-300 hover:bg-white dark:border-slate-800 dark:bg-slate-800/40 dark:hover:bg-slate-800"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                            {loc.name}
                          </h4>
                          {matchesCurrent && (
                            <span className="flex items-center gap-1 rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                              <CheckCircle2 className="h-3 w-3" /> Recommended
                            </span>
                          )}
                        </div>
                        <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                          {loc.address}, {loc.city}
                        </p>
                      </div>

                      <span className="rounded-full bg-slate-200/80 px-2.5 py-0.5 text-xs font-bold text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                        {loc.distanceKm} km away
                      </span>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 dark:text-slate-300">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-slate-400" />
                        {loc.operatingHours}
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone className="h-3.5 w-3.5 text-slate-400" />
                        {loc.phone}
                      </span>
                    </div>

                    <div className="mt-2.5 flex flex-wrap items-center gap-1">
                      <span className="text-[11px] font-medium text-slate-400">Accepts:</span>
                      {loc.acceptedCategories.map((cat) => (
                        <span
                          key={cat}
                          className="rounded bg-slate-200/60 px-1.5 py-0.5 text-[10px] font-medium uppercase text-slate-700 dark:bg-slate-700 dark:text-slate-300"
                        >
                          {cat}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Interactive Visual Map & Route View (Right 5 Cols) */}
          <div className="flex flex-col justify-between overflow-hidden rounded-xl border border-slate-200 bg-slate-900 p-4 text-white dark:border-slate-800 lg:col-span-5">
            <div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-400">
                  <Navigation className="h-3.5 w-3.5" /> Interactive Map View
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  {activeLoc.coordinates.lat.toFixed(4)}° N, {Math.abs(activeLoc.coordinates.lng).toFixed(4)}° W
                </span>
              </div>

              {/* Styled SVG Map Simulation */}
              <div className="relative mt-3 flex h-48 w-full items-center justify-center overflow-hidden rounded-lg bg-slate-950">
                {/* Grid Overlay */}
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage:
                      "linear-gradient(#6366f1 1px, transparent 1px), linear-gradient(90deg, #6366f1 1px, transparent 1px)",
                    backgroundSize: "24px 24px",
                  }}
                />

                {/* Radar sweep simulation */}
                <div className="absolute h-36 w-36 rounded-full border border-indigo-500/30 bg-indigo-500/5 animate-ping opacity-75" />

                {/* Location Marker Pins */}
                <div className="relative flex flex-col items-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg shadow-indigo-500/50">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <span className="mt-1 rounded bg-black/80 px-2 py-0.5 text-[11px] font-bold text-indigo-300 backdrop-blur-xs">
                    {activeLoc.name.split(" ")[0]} ({activeLoc.distanceKm} km)
                  </span>
                </div>
              </div>

              {/* Active Selected Location Details */}
              <div className="mt-4 space-y-2 text-xs">
                <div className="font-bold text-white">{activeLoc.name}</div>
                <p className="text-slate-300">{activeLoc.notes}</p>
                <div className="rounded bg-slate-800/80 p-2.5 text-slate-300">
                  <span className="font-semibold text-slate-200">Address:</span> {activeLoc.address},{" "}
                  {activeLoc.city}
                </div>
              </div>
            </div>

            {/* External Directions Button */}
            <div className="mt-4 pt-3">
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  `${activeLoc.name} ${activeLoc.address}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-600/30 transition-all hover:bg-indigo-500 active:scale-98"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Get Directions in Google Maps
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
