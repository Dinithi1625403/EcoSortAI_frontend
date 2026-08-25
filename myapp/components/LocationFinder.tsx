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
  const [locationLabel, setLocationLabel] = useState<string>("Default Metro Area");
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
      alert(`Could not find coordinates for "${searchQuery}".`);
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
    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white/90 shadow-xl shadow-slate-200/40 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-none">
      {/* Section Header */}
      <div className="flex flex-wrap items-center justify-between border-b border-slate-100 bg-slate-50/70 px-6 py-4 dark:border-slate-800/80 dark:bg-slate-800/50">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-xs">
            <MapPin className="h-4 w-4" />
          </span>
          <div>
            <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
              📍 Step 4: Decision Support — Where to Dispose &amp; Drop-Off Points
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Real-world open GIS directory and municipal disposal points matching the identified waste
            </p>
          </div>
        </div>

        {/* Live Data Badge */}
        <div className="mt-2 flex items-center gap-1.5 sm:mt-0">
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
              dataSource === "live_osm"
                ? "bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300"
                : "bg-indigo-100 text-indigo-800 border border-indigo-300 dark:bg-indigo-950 dark:text-indigo-300"
            }`}
          >
            {dataSource === "live_osm" ? (
              <>
                <Radio className="h-3 w-3 animate-pulse text-emerald-600" />
                Live OpenStreetMap (OSM) Data
              </>
            ) : (
              <>
                <Globe className="h-3 w-3 text-indigo-600" />
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
            className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm shadow-indigo-600/20 transition-all hover:bg-indigo-700 active:scale-98 sm:col-span-4"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <LocateFixed className="h-4 w-4" />
            )}
            Use My Current GPS Location
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
                placeholder="Search city, district, or postal code (e.g. London, Tokyo, Berlin, Austin)..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50/80 py-2 pl-9 pr-4 text-xs font-medium text-slate-900 transition-all focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-xs hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              Search
            </button>
          </form>
        </div>

        {/* Current Active Location Info Banner */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-100 bg-slate-50/70 px-4 py-2 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-400">
          <div>
            <span className="font-semibold text-slate-900 dark:text-white">Active Region:</span> {locationLabel}
          </div>
          <div className="flex items-center gap-2">
            <span>Radius:</span>
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
                className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                  radiusKm === r
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300"
                }`}
              >
                {r} km
              </button>
            ))}
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="mb-6 flex flex-wrap items-center gap-1.5">
          <span className="mr-1 flex items-center gap-1 text-xs font-bold text-slate-500 dark:text-slate-400">
            <Filter className="h-3 w-3" /> Filter by Type:
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
              className={`rounded-lg px-2.5 py-1 text-xs font-medium capitalize transition-all ${
                selectedCategoryFilter === cat
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "border border-slate-200 bg-slate-100/80 text-slate-700 hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              }`}
            >
              {cat === "all" ? "All Types" : cat}
            </button>
          ))}
        </div>

        {/* Map & Facility Directory Layout */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Facility List (Left 7 Cols) */}
          <div className="space-y-3 lg:col-span-7">
            {loading ? (
              <div className="flex flex-col items-center justify-center rounded-xl border border-slate-200 p-12 text-center text-xs text-slate-500 dark:border-slate-800">
                <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
                <p className="mt-2 font-medium">Querying OpenStreetMap GIS nodes...</p>
              </div>
            ) : locations.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
                No active disposal locations found for this filter in the current radius. Try expanding the radius or switching waste categories.
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
                          {loc.address}
                        </p>
                      </div>

                      <span className="rounded-full bg-slate-200/80 px-2.5 py-0.5 text-xs font-bold text-slate-700 dark:bg-slate-700 dark:text-slate-300">
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
                      <span className="text-[11px] font-medium text-slate-400">Materials:</span>
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

          {/* Interactive Visual Map View (Right 5 Cols) */}
          {activeLoc && (
            <div className="flex flex-col justify-between overflow-hidden rounded-xl border border-slate-200 bg-slate-900 p-4 text-white dark:border-slate-800 lg:col-span-5">
              <div>
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-400">
                    <Navigation className="h-3.5 w-3.5" /> Interactive GIS View
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">
                    {activeLoc.coordinates.lat.toFixed(4)}°, {activeLoc.coordinates.lng.toFixed(4)}°
                  </span>
                </div>

                {/* Styled GIS Radar / Grid Map View */}
                <div className="relative mt-3 flex h-48 w-full items-center justify-center overflow-hidden rounded-lg bg-slate-950">
                  <div
                    className="absolute inset-0 opacity-20"
                    style={{
                      backgroundImage:
                        "linear-gradient(#6366f1 1px, transparent 1px), linear-gradient(90deg, #6366f1 1px, transparent 1px)",
                      backgroundSize: "24px 24px",
                    }}
                  />

                  <div className="absolute h-36 w-36 rounded-full border border-indigo-500/30 bg-indigo-500/5 animate-ping opacity-75" />

                  <div className="relative flex flex-col items-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg shadow-indigo-500/50">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <span className="mt-1 max-w-[200px] truncate rounded bg-black/80 px-2 py-0.5 text-[11px] font-bold text-indigo-300 backdrop-blur-xs">
                      {activeLoc.name} ({activeLoc.distanceKm} km)
                    </span>
                  </div>
                </div>

                {/* Selected Location Details */}
                <div className="mt-4 space-y-2 text-xs">
                  <div className="font-bold text-white">{activeLoc.name}</div>
                  <p className="text-slate-300">{activeLoc.notes}</p>
                  <div className="rounded bg-slate-800/80 p-2.5 text-slate-300">
                    <span className="font-semibold text-slate-200">Address:</span> {activeLoc.address}
                  </div>
                </div>
              </div>

              {/* External Google Maps / OSM Directions Link */}
              <div className="mt-4 pt-3">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${activeLoc.coordinates.lat},${activeLoc.coordinates.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-600/30 transition-all hover:bg-indigo-500 active:scale-98"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  Get Exact Directions in Google Maps
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
