"use client";

import React, { useState } from "react";
import { VERIFIED_DISPOSAL_LOCATIONS } from "@/data/disposalLocations";
import {
  MapPin,
  ExternalLink,
  Navigation,
  Loader2,
  Building2,
  Phone,
  Clock,
  Sparkles,
} from "lucide-react";

interface FacilityResult {
  name: string;
  type: string;
  distance_km: number;
  address: string;
  lat: number;
  lon: number;
  phone?: string;
  operatingHours?: string;
  notes?: string;
}

export const LocationFinder: React.FC = () => {
  const [locations, setLocations] = useState<FacilityResult[]>(() =>
    VERIFIED_DISPOSAL_LOCATIONS.map((loc) => ({
      name: loc.name,
      type: loc.type,
      distance_km: loc.distanceKm,
      address: `${loc.address}, ${loc.city}`,
      lat: loc.coordinates.lat,
      lon: loc.coordinates.lng,
      phone: loc.phone,
      operatingHours: loc.operatingHours,
      notes: loc.notes,
    }))
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [locatedCity, setLocatedCity] = useState<string>("Sri Lanka (Western Province & Nationwide)");

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
        setLocatedCity(
          data.address?.city ||
            data.address?.town ||
            data.address?.suburb ||
            data.address?.state ||
            "your current location"
        );
      } catch {
        setLocatedCity("your current location");
      }

      // Query Overpass for recycling/waste facilities
      const radius = 15000;
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
            name: el.tags?.name || el.tags?.operator || "Recycling Drop-off Point",
            type: el.tags?.amenity?.replace(/_/g, " ") || "recycling",
            distance_km: d,
            address: el.tags?.["addr:street"] || el.tags?.["addr:full"] || "Local Area, Sri Lanka",
            lat: elLat,
            lon: elLon,
          } as FacilityResult;
        })
        .filter((f): f is FacilityResult => Boolean(f))
        .sort((a, b) => a.distance_km - b.distance_km)
        .slice(0, 12);

      if (facilities.length > 0) {
        setLocations(facilities);
      } else {
        // Recalculate distance to verified Sri Lankan locations
        const updated = VERIFIED_DISPOSAL_LOCATIONS.map((loc) => ({
          name: loc.name,
          type: loc.type,
          distance_km: haversine(lat, lon, loc.coordinates.lat, loc.coordinates.lng),
          address: `${loc.address}, ${loc.city}`,
          lat: loc.coordinates.lat,
          lon: loc.coordinates.lng,
          phone: loc.phone,
          operatingHours: loc.operatingHours,
          notes: loc.notes,
        })).sort((a, b) => a.distance_km - b.distance_km);

        setLocations(updated);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "";
      setError(
        msg.includes("denied")
          ? "Location permission was denied. Showing verified Sri Lankan recycling hubs below."
          : "Could not fetch GPS location. Showing verified Sri Lankan collection centers below."
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
          <div className="h-12 w-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20 shrink-0">
            <Building2 className="h-6 w-6" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1 text-[11px] font-extrabold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-full mb-1">
              <Sparkles className="h-3 w-3 text-emerald-600" /> Sri Lanka Verified Directory
            </div>
            <h2 className="text-lg font-extrabold text-gray-900 tracking-tight">
              Sri Lankan Drop-off &amp; Recycling Hubs
            </h2>
            <p className="text-xs text-gray-600 font-medium">
              Verified CEA e-waste centers, CMC municipal facilities &amp; PlasticCycle bins
            </p>
          </div>
        </div>

        <button
          onClick={fetchNearbyFacilities}
          disabled={loading}
          className="flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-2.5 text-xs font-extrabold text-white shadow-sm shadow-emerald-600/30 hover:bg-emerald-700 active:scale-95 transition-all disabled:opacity-50 shrink-0 cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Locating nearest...
            </>
          ) : (
            <>
              <Navigation className="h-4 w-4" /> Use GPS Location
            </>
          )}
        </button>
      </div>

      {/* Error info if GPS denied */}
      {error && (
        <div className="card-cute p-3.5 text-center space-y-1 bg-amber-50/80 border-amber-200">
          <p className="text-xs text-amber-900 font-medium">{error}</p>
        </div>
      )}

      {/* Results Header */}
      <div className="flex items-center justify-between px-1">
        <p className="text-xs font-extrabold text-emerald-950">
          Showing {locations.length} verified centers in {locatedCity}:
        </p>
        <span className="text-[11px] text-gray-500 font-medium">
          Central Environmental Authority (CEA) Network
        </span>
      </div>

      {/* Results List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {locations.map((loc, idx) => (
          <div
            key={idx}
            className="card-cute p-4 flex flex-col justify-between gap-3 hover:border-emerald-300 transition-all shadow-2xs"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 rounded-xl bg-emerald-100/80 text-emerald-800 flex items-center justify-center shrink-0">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-[13px] font-extrabold text-gray-900 leading-snug">
                      {loc.name}
                    </h4>
                    <span className="inline-block rounded-md bg-emerald-50 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 border border-emerald-100 mt-0.5">
                      {loc.type}
                    </span>
                  </div>
                </div>

                <span className="rounded-full bg-emerald-100 text-emerald-900 font-black px-2.5 py-0.5 text-[10px] shrink-0">
                  {loc.distance_km.toFixed(1)} km
                </span>
              </div>

              <p className="text-xs text-gray-600 font-medium mt-2 leading-relaxed">
                {loc.address}
              </p>

              {loc.notes && (
                <p className="text-[11px] text-gray-500 bg-gray-50/80 rounded-lg p-2 border border-gray-100 mt-2 leading-relaxed">
                  {loc.notes}
                </p>
              )}
            </div>

            <div className="pt-2 border-t border-emerald-100/60 flex items-center justify-between text-xs text-gray-600">
              {loc.phone ? (
                <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-800">
                  <Phone className="h-3 w-3" /> {loc.phone}
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[11px] text-gray-400">
                  <Clock className="h-3 w-3" /> Public Drop-off
                </span>
              )}

              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${loc.lat},${loc.lon}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-[11px] font-extrabold text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200 transition-colors"
              >
                Directions <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
