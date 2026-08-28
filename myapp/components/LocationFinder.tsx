"use client";

import React, { useState } from "react";
import { MapPin, ExternalLink, Navigation, Loader2, MapPinOff, Building2 } from "lucide-react";

interface FacilityResult {
  name: string;
  type: string;
  distance_km: number;
  address: string;
  lat: number;
  lon: number;
}

export const LocationFinder: React.FC = () => {
  const [locations, setLocations] = useState<FacilityResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [locatedCity, setLocatedCity] = useState<string>("");

  const fetchNearbyFacilities = async () => {
    setLoading(true);
    setError(null);
    try {
      const pos = await new Promise<GeolocationPosition>((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 10000 })
      );
      const { latitude: lat, longitude: lon } = pos.coords;

      // Reverse geocode for city name
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
          { headers: { "User-Agent": "EcoSortAI/1.0" } }
        );
        const data = await res.json();
        setLocatedCity(data.address?.city || data.address?.town || data.address?.suburb || data.address?.state || "your area");
      } catch {
        setLocatedCity("your area");
      }

      // Query Overpass for recycling/waste facilities
      const radius = 10000;
      const overpassQuery = `[out:json][timeout:15];(
        node["amenity"="recycling"](around:${radius},${lat},${lon});
        node["amenity"="waste_disposal"](around:${radius},${lat},${lon});
        node["amenity"="waste_transfer_station"](around:${radius},${lat},${lon});
        way["amenity"="recycling"](around:${radius},${lat},${lon});
        way["amenity"="waste_disposal"](around:${radius},${lat},${lon});
      );out center body;`;

      const overpassRes = await fetch("https://overpass-api.de/api/interpreter", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `data=${encodeURIComponent(overpassQuery)}`,
      });
      const overpassData = await overpassRes.json();

      interface OverpassElement {
        lat?: number;
        lon?: number;
        center?: { lat: number; lon: number };
        tags?: {
          name?: string;
          operator?: string;
          amenity?: string;
          "addr:street"?: string;
          "addr:full"?: string;
        };
      }

      const facilities: FacilityResult[] = ((overpassData.elements || []) as OverpassElement[])
        .map((el) => {
          const elLat = el.lat ?? el.center?.lat;
          const elLon = el.lon ?? el.center?.lon;
          if (!elLat || !elLon) return null;
          const d = haversine(lat, lon, elLat, elLon);
          return {
            name: el.tags?.name || el.tags?.operator || "Recycling Drop-off Center",
            type: el.tags?.amenity?.replace(/_/g, " ") || "recycling",
            distance_km: d,
            address: el.tags?.["addr:street"] || el.tags?.["addr:full"] || "",
            lat: elLat,
            lon: elLon,
          } as FacilityResult;
        })
        .filter((f): f is FacilityResult => Boolean(f))
        .sort((a, b) => a.distance_km - b.distance_km)
        .slice(0, 10);

      setLocations(facilities);
      if (facilities.length === 0) {
        setError("No public recycling facilities found within 10 km on OpenStreetMap. You can search directly on Google Maps below.");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "";
      setError(
        msg.includes("denied")
          ? "Location access was denied. Please allow location permissions to find nearby centers."
          : "Could not fetch nearby facilities automatically. You can view open drop-off points."
      );
    } finally {
      setLoading(false);
    }
  };

  const haversine = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4 animate-fade-in">
      {/* Header Banner */}
      <div className="card-cute p-5 sm:p-6 bg-gradient-to-r from-emerald-50 via-white to-teal-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="h-12 w-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20 shrink-0">
            <Building2 className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-gray-900 tracking-tight">
              Nearby Drop-off &amp; Recycling Centers
            </h2>
            <p className="text-xs text-gray-500">
              Live OpenStreetMap GIS directory for verified disposal points
            </p>
          </div>
        </div>

        <button
          onClick={fetchNearbyFacilities}
          disabled={loading}
          className="flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm shadow-emerald-600/30 hover:bg-emerald-700 active:scale-95 transition-all disabled:opacity-50 shrink-0"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Locating...
            </>
          ) : (
            <>
              <Navigation className="h-4 w-4" /> Find Nearest Centers
            </>
          )}
        </button>
      </div>

      {/* Error / Empty info */}
      {error && (
        <div className="card-cute p-4 text-center space-y-2 bg-amber-50/70 border-amber-200">
          <MapPinOff className="h-6 w-6 text-amber-500 mx-auto" />
          <p className="text-xs text-amber-900 font-medium">{error}</p>
          <a
            href="https://www.google.com/maps/search/recycling+center+near+me"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 underline mt-1"
          >
            Search Google Maps <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      )}

      {/* Default Guide if not searched yet */}
      {locations.length === 0 && !loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
          <div className="card-cute p-4 space-y-1.5">
            <div className="h-8 w-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <MapPin className="h-4 w-4" />
            </div>
            <h4 className="text-xs font-bold text-gray-800">E-Waste Points</h4>
            <p className="text-[11px] text-gray-500">Batteries, old phones, cables, and hazardous electronics.</p>
          </div>
          <div className="card-cute p-4 space-y-1.5">
            <div className="h-8 w-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <Building2 className="h-4 w-4" />
            </div>
            <h4 className="text-xs font-bold text-gray-800">Recycling Hubs</h4>
            <p className="text-[11px] text-gray-500">Cardboard, plastic bottles, metal cans, glass jars.</p>
          </div>
          <div className="card-cute p-4 space-y-1.5">
            <div className="h-8 w-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <Navigation className="h-4 w-4" />
            </div>
            <h4 className="text-xs font-bold text-gray-800">Community Donation</h4>
            <p className="text-[11px] text-gray-500">Wearable clothes, pairs of shoes, and reusable books.</p>
          </div>
        </div>
      )}

      {/* Results List */}
      {locations.length > 0 && (
        <div className="space-y-2.5">
          <div className="flex items-center justify-between px-1">
            <p className="text-xs font-bold text-emerald-900">
              Found {locations.length} centers near {locatedCity}:
            </p>
            <button
              onClick={fetchNearbyFacilities}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-900"
            >
              Refresh
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {locations.map((loc, idx) => (
              <div
                key={idx}
                className="card-cute p-3.5 flex items-center justify-between gap-3 hover:border-emerald-300"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-9 w-9 rounded-xl bg-emerald-100/70 text-emerald-700 flex items-center justify-center shrink-0">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-gray-800 truncate">{loc.name}</h4>
                    <p className="text-[11px] text-gray-500 capitalize truncate">
                      {loc.type} {loc.address ? `• ${loc.address}` : ""}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="rounded-full bg-emerald-100 text-emerald-800 font-extrabold px-2 py-0.5 text-[10px]">
                    {loc.distance_km.toFixed(1)} km
                  </span>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${loc.lat},${loc.lon}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-7 w-7 rounded-full bg-gray-100 hover:bg-emerald-600 hover:text-white flex items-center justify-center text-gray-600 transition-colors"
                  >
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
