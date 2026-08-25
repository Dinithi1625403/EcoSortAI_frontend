"use client";

import React, { useState, useEffect } from "react";
import { WasteCategory, DisposalLocation } from "@/types/waste";
import {
  fetchLiveOsmLocations,
  getRecalculatedCuratedLocations,
  geocodeCity,
} from "@/lib/locationService";
import {
  MapPin,
  Clock,
  Phone,
  Navigation,
  CheckCircle2,
  Filter,
  ExternalLink,
  LocateFixed,
  Search,
  Loader2,
  Globe,
  Radio,
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
  const [locations, setLocations] = useState<DisposalLocation[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<DisposalLocation | null>(null);
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<"live_osm" | "verified_repo">("verified_repo");
  const [searchQuery, setSearchQuery] = useState("");
  const [locationLabel, setLocationLabel] = useState<string>("Standard Reference Grid");
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [radiusKm, setRadiusKm] = useState<number>(10);

  // Initial load
  useEffect(() => {
    const initialList = getRecalculatedCuratedLocations(
      undefined,
      undefined,
      (highlightCategory || "all") as WasteCategory | "all"
    );
    setLocations(initialList);
    setSelectedLocation(initialList[0] || null);
  }, [highlightCategory]);

  // Request browser GPS location
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setUserCoords({ lat, lng });
        setLocationLabel(`GPS (${lat.toFixed(3)}°, ${lng.toFixed(3)}°)`);

        try {
          const liveData = await fetchLiveOsmLocations(
            lat,
            lng,
            radiusKm * 1000,
            (selectedCategoryFilter || "all") as WasteCategory | "all"
          );

          if (liveData.length > 0) {
            setLocations(liveData);
            setSelectedLocation(liveData[0]);
            setDataSource("live_osm");
          } else {
            const fallback = getRecalculatedCuratedLocations(
              lat,
              lng,
              (selectedCategoryFilter || "all") as WasteCategory | "all"
            );
            setLocations(fallback);
            setSelectedLocation(fallback[0]);
            setDataSource("verified_repo");
          }
        } catch {
          const fallback = getRecalculatedCuratedLocations(
            lat,
            lng,
            (selectedCategoryFilter || "all") as WasteCategory | "all"
          );
          setLocations(fallback);
          setSelectedLocation(fallback[0]);
          setDataSource("verified_repo");
        } finally {
          setLoading(false);
        }
      },
      () => {
        setLoading(false);
        alert("Unable to retrieve your location. Check browser location permissions.");
      },
      { timeout: 8000 }
    );
  };

  // Search by city query
  const handleCitySearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    const geo = await geocodeCity(searchQuery.trim());
    if (geo) {
      setUserCoords({ lat: geo.lat, lng: geo.lon });
      setLocationLabel(geo.displayName.split(",")[0]);

      const liveData = await fetchLiveOsmLocations(
        geo.lat,
        geo.lon,
        radiusKm * 1000,
        (selectedCategoryFilter || "all") as WasteCategory | "all"
      );

      if (liveData.length > 0) {
        setLocations(liveData);
        setSelectedLocation(liveData[0]);
        setDataSource("live_osm");
      } else {
        const fallback = getRecalculatedCuratedLocations(
          geo.lat,
          geo.lon,
          (selectedCategoryFilter || "all") as WasteCategory | "all"
        );
        setLocations(fallback);
        setSelectedLocation(fallback[0]);
        setDataSource("verified_repo");
      }
    } else {
      alert(`Could not resolve coordinates for "${searchQuery}".`);
    }
    setLoading(false);
  };

  // Handle category filter change
  const handleCategoryFilter = async (cat: string) => {
    setSelectedCategoryFilter(cat);
    setLoading(true);

    const lat = userCoords?.lat || 37.7749;
    const lng = userCoords?.lng || -122.4194;

    if (userCoords) {
      const liveData = await fetchLiveOsmLocations(
        lat,
        lng,
        radiusKm * 1000,
        cat as WasteCategory | "all"
      );
      if (liveData.length > 0) {
        setLocations(liveData);
        setSelectedLocation(liveData[0]);
        setDataSource("live_osm");
      } else {
        const fallback = getRecalculatedCuratedLocations(
          lat,
          lng,
          cat as WasteCategory | "all"
        );
        setLocations(fallback);
        setSelectedLocation(fallback[0]);
        setDataSource("verified_repo");
      }
    } else {
      const fallback = getRecalculatedCuratedLocations(
        undefined,
        undefined,
        cat as WasteCategory | "all"
      );
      setLocations(fallback);
      setSelectedLocation(fallback[0]);
      setDataSource("verified_repo");
    }

    setLoading(false);
  };

  const activeLoc = selectedLocation || locations[0];

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      {/* Section Header */}
      <div className="flex flex-wrap items-center justify-between border-b border-slate-200 bg-slate-50/80 px-6 py-3.5 dark:border-slate-800 dark:bg-slate-800/40">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded bg-slate-900 text-white dark:bg-indigo-600">
            <MapPin className="h-3.5 w-3.5" />
          </span>
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
              Stage 4: Decision Support — Disposal &amp; Collection Point Locator
            </h2>
          </div>
        </div>

        {/* Live Data Badge */}
        <div className="mt-2 flex items-center gap-1.5 sm:mt-0">
          <span
            className={`inline-flex items-center gap-1.5 rounded border px-2.5 py-1 text-xs font-semibold ${
              dataSource === "live_osm"
                ? "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-900"
                : "bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700"
            }`}
          >
            {dataSource === "live_osm" ? (
              <>
                <Radio className="h-3.5 w-3.5 text-emerald-700 dark:text-emerald-400" />
                Live OpenStreetMap (OSM) GIS
              </>
            ) : (
              <>
                <Globe className="h-3.5 w-3.5 text-slate-600 dark:text-slate-400" />
                Verified Municipal Repository
              </>
            )}
          </span>
        </div>
      </div>

      <div className="p-6">
        {/* Geolocation & Search Controls Toolbar */}
        <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-12">
          {/* GPS Detector Button */}
          <button
            onClick={handleDetectLocation}
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-700 sm:col-span-4"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <LocateFixed className="h-4 w-4" />
            )}
            Detect Current Coordinates
          </button>

          {/* City / Area Search Bar */}
          <form
            onSubmit={handleCitySearch}
            className="flex items-center gap-2 sm:col-span-8"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search municipality, district, or postal code..."
                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-4 text-xs font-medium text-slate-900 transition-colors focus:border-slate-400 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              Search
            </button>
          </form>
        </div>

        {/* Active Region & Radius Banner */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-400">
          <div>
            <span className="font-semibold text-slate-900 dark:text-white">Active Geographic Area:</span> {locationLabel}
          </div>
          <div className="flex items-center gap-2">
            <span>Query Radius:</span>
            {[5, 10, 25].map((r) => (
              <button
                key={r}
                onClick={() => {
                  setRadiusKm(r);
                  if (userCoords) {
                    fetchLiveOsmLocations(
                      userCoords.lat,
                      userCoords.lng,
                      r * 1000,
                      selectedCategoryFilter as WasteCategory | "all"
                    ).then((data) => {
                      if (data.length > 0) {
                        setLocations(data);
                        setSelectedLocation(data[0]);
                      }
                    });
                  }
                }}
                className={`rounded px-2 py-0.5 text-[11px] font-semibold ${
                  radiusKm === r
                    ? "bg-slate-900 text-white dark:bg-indigo-600"
                    : "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300"
                }`}
              >
                {r} km
              </button>
            ))}
          </div>
        </div>

        {/* Category Filter Toolbar */}
        <div className="mb-6 flex flex-wrap items-center gap-1.5">
          <span className="mr-1 flex items-center gap-1 text-xs font-bold text-slate-500 dark:text-slate-400">
            <Filter className="h-3 w-3" /> Waste Stream:
          </span>
          {[
            "all",
            "battery",
            "plastic",
            "glass",
            "metal",
            "clothes",
            "shoes",
            "biological",
            "paper",
            "cardboard",
            "trash",
          ].map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryFilter(cat)}
              className={`rounded-md px-2.5 py-1 text-xs font-medium capitalize transition-colors ${
                selectedCategoryFilter === cat
                  ? "bg-slate-900 text-white dark:bg-indigo-600"
                  : "border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300"
              }`}
            >
              {cat === "all" ? "All Categories" : cat}
            </button>
          ))}
        </div>

        {/* Facility Directory Layout */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Facility List (Left 7 Cols) */}
          <div className="space-y-3 lg:col-span-7">
            {loading ? (
              <div className="flex flex-col items-center justify-center rounded-lg border border-slate-200 p-12 text-center text-xs text-slate-500 dark:border-slate-800">
                <Loader2 className="h-6 w-6 animate-spin text-slate-700 dark:text-slate-300" />
                <p className="mt-2 font-medium">Querying Geographic Information System (GIS) Nodes...</p>
              </div>
            ) : locations.length === 0 ? (
              <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center text-xs text-slate-500 dark:border-slate-700 dark:text-slate-400">
                No active disposal locations found for this filter within {radiusKm} km.
              </div>
            ) : (
              locations.map((loc) => {
                const isSelected = activeLoc?.id === loc.id;
                const matchesCurrent =
                  highlightCategory && loc.acceptedCategories.includes(highlightCategory);

                return (
                  <div
                    key={loc.id}
                    onClick={() => setSelectedLocation(loc)}
                    className={`cursor-pointer rounded-lg border p-4 transition-colors ${
                      isSelected
                        ? "border-slate-900 bg-slate-50 dark:border-indigo-500 dark:bg-slate-800/80"
                        : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800/40"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                            {loc.name}
                          </h4>
                          {matchesCurrent && (
                            <span className="flex items-center gap-1 rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                              <CheckCircle2 className="h-3 w-3" /> Recommended Node
                            </span>
                          )}
                        </div>
                        <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                          {loc.address}
                        </p>
                      </div>

                      <span className="font-mono text-xs font-semibold text-slate-700 dark:text-slate-300">
                        {loc.distanceKm} km
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
                      <span className="text-[11px] font-medium text-slate-400">Accepted Streams:</span>
                      {loc.acceptedCategories.map((cat) => (
                        <span
                          key={cat}
                          className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium uppercase text-slate-700 dark:bg-slate-800 dark:text-slate-300"
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

          {/* Interactive GIS Display (Right 5 Cols) */}
          {activeLoc && (
            <div className="flex flex-col justify-between overflow-hidden rounded-lg border border-slate-200 bg-slate-900 p-4 text-white dark:border-slate-800 lg:col-span-5">
              <div>
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-300">
                    <Navigation className="h-3.5 w-3.5 text-slate-400" /> GIS Coordinates
                  </span>
                  <span className="font-mono text-[11px] text-slate-400">
                    {activeLoc.coordinates.lat.toFixed(4)}°, {activeLoc.coordinates.lng.toFixed(4)}°
                  </span>
                </div>

                {/* Structured GIS View */}
                <div className="relative mt-3 flex h-44 w-full items-center justify-center overflow-hidden rounded bg-slate-950">
                  <div
                    className="absolute inset-0 opacity-15"
                    style={{
                      backgroundImage:
                        "linear-gradient(#94a3b8 1px, transparent 1px), linear-gradient(90deg, #94a3b8 1px, transparent 1px)",
                      backgroundSize: "20px 20px",
                    }}
                  />

                  <div className="relative flex flex-col items-center">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 text-white border border-slate-600">
                      <MapPin className="h-4 w-4" />
                    </div>
                    <span className="mt-1.5 max-w-[200px] truncate rounded bg-black/80 px-2 py-0.5 font-mono text-[11px] font-bold text-slate-200">
                      {activeLoc.name} ({activeLoc.distanceKm} km)
                    </span>
                  </div>
                </div>

                {/* Selected Location Details */}
                <div className="mt-4 space-y-2 text-xs">
                  <div className="font-bold text-white">{activeLoc.name}</div>
                  <p className="text-slate-300">{activeLoc.notes}</p>
                  <div className="rounded border border-slate-800 bg-slate-950 p-2.5 text-slate-300">
                    <span className="font-semibold text-slate-200">Address:</span> {activeLoc.address}
                  </div>
                </div>
              </div>

              {/* External Navigation Link */}
              <div className="mt-4 pt-3">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${activeLoc.coordinates.lat},${activeLoc.coordinates.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-md bg-white py-2 text-xs font-bold text-slate-900 transition-colors hover:bg-slate-100"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  Open Navigation in Google Maps
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
