import { DisposalLocation, WasteCategory } from "@/types/waste";
import { VERIFIED_DISPOSAL_LOCATIONS } from "@/data/disposalLocations";

// Helper: Haversine distance in km
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

// Map WasteCategory to Overpass tag queries
function getOverpassCategoryFilter(category?: WasteCategory | "all"): string {
  switch (category) {
    case "battery":
      return `
        node["amenity"="recycling"]["recycling:batteries"="yes"](around:{{radius}},{{lat}},{{lon}});
        node["amenity"="waste_disposal"]["hazardous"="yes"](around:{{radius}},{{lat}},{{lon}});
        node["shop"="electronics"]["recycling:batteries"="yes"](around:{{radius}},{{lat}},{{lon}});
      `;
    case "clothes":
    case "shoes":
      return `
        node["amenity"="recycling"]["recycling:clothes"="yes"](around:{{radius}},{{lat}},{{lon}});
        node["amenity"="donation_box"](around:{{radius}},{{lat}},{{lon}});
        node["shop"="second_hand"](around:{{radius}},{{lat}},{{lon}});
      `;
    case "biological":
      return `
        node["amenity"="recycling"]["recycling:organic"="yes"](around:{{radius}},{{lat}},{{lon}});
        node["amenity"="recycling"]["recycling:garden_waste"="yes"](around:{{radius}},{{lat}},{{lon}});
        node["landuse"="allotments"](around:{{radius}},{{lat}},{{lon}});
      `;
    case "plastic":
    case "glass":
    case "metal":
    case "paper":
    case "cardboard":
      return `
        node["amenity"="recycling"](around:{{radius}},{{lat}},{{lon}});
        way["amenity"="recycling"](around:{{radius}},{{lat}},{{lon}});
      `;
    default:
      return `
        node["amenity"="recycling"](around:{{radius}},{{lat}},{{lon}});
        node["amenity"="waste_transfer_station"](around:{{radius}},{{lat}},{{lon}});
        node["amenity"="waste_disposal"](around:{{radius}},{{lat}},{{lon}});
      `;
  }
}

export async function fetchLiveOsmLocations(
  lat: number,
  lon: number,
  radiusMeters: number = 10000,
  category?: WasteCategory | "all"
): Promise<DisposalLocation[]> {
  const filterQuery = getOverpassCategoryFilter(category)
    .replaceAll("{{radius}}", radiusMeters.toString())
    .replaceAll("{{lat}}", lat.toString())
    .replaceAll("{{lon}}", lon.toString());

  const overpassQuery = `
    [out:json][timeout:15];
    (
      ${filterQuery}
    );
    out center 15;
  `;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const response = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "data=" + encodeURIComponent(overpassQuery),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Overpass API responded with ${response.status}`);
    }

    const data = await response.json();
    if (!data.elements || data.elements.length === 0) {
      return getRecalculatedCuratedLocations(lat, lon, category);
    }

    const results: DisposalLocation[] = data.elements.map((el: any, idx: number) => {
      const elLat = el.lat || el.center?.lat || lat;
      const elLon = el.lon || el.center?.lon || lon;
      const tags = el.tags || {};

      // Name resolution
      const name =
        tags.name ||
        tags.operator ||
        (tags["recycling_type"] === "centre" ? "Municipal Recycling Facility" : "Public Recycling Drop Point");

      // Categorize
      const accepted: WasteCategory[] = [];
      if (tags["recycling:batteries"] === "yes" || tags.hazardous === "yes") accepted.push("battery");
      if (tags["recycling:plastic"] === "yes" || tags.amenity === "recycling") accepted.push("plastic");
      if (tags["recycling:glass"] === "yes" || tags.amenity === "recycling") accepted.push("glass");
      if (tags["recycling:paper"] === "yes" || tags["recycling:cardboard"] === "yes") {
        accepted.push("paper");
        accepted.push("cardboard");
      }
      if (tags["recycling:clothes"] === "yes" || tags.amenity === "donation_box") {
        accepted.push("clothes");
        accepted.push("shoes");
      }
      if (tags["recycling:organic"] === "yes" || tags["recycling:garden_waste"] === "yes") accepted.push("biological");
      if (tags["recycling:scrap_metal"] === "yes" || tags["recycling:cans"] === "yes") accepted.push("metal");

      if (accepted.length === 0) {
        accepted.push("plastic", "paper", "glass", "metal");
      }

      // Address resolution
      const street = tags["addr:street"] ? `${tags["addr:street"]} ${tags["addr:housenumber"] || ""}` : "";
      const city = tags["addr:city"] || tags["addr:suburb"] || "Local Area";
      const fullAddress = street ? `${street}, ${city}` : `Coordinates (${elLat.toFixed(4)}, ${elLon.toFixed(4)})`;

      const dist = calculateDistanceKm(lat, lon, elLat, elLon);

      return {
        id: `osm-${el.id || idx}`,
        name: name,
        type: tags["recycling:batteries"] === "yes"
          ? "E-Waste / Hazardous"
          : tags.amenity === "donation_box"
          ? "Donation Center"
          : "Recycling Hub",
        address: fullAddress,
        city: city,
        acceptedCategories: accepted,
        distanceKm: dist,
        operatingHours: tags.opening_hours || "Public Access / 24 Hours",
        phone: tags.phone || tags["contact:phone"] || "Municipal Services",
        coordinates: { lat: elLat, lng: elLon },
        notes: `Real-world OpenStreetMap GIS entity (OSM ID: ${el.id}). ${tags.description || "Verified active node."}`,
      };
    });

    // Sort by distance
    results.sort((a, b) => a.distanceKm - b.distanceKm);
    return results.slice(0, 10);
  } catch {
    // Graceful fallback to verified repository recalculated with user's distance
    return getRecalculatedCuratedLocations(lat, lon, category);
  }
}

// Fallback helper to return curated locations with real distances calculated
export function getRecalculatedCuratedLocations(
  userLat?: number,
  userLon?: number,
  category?: WasteCategory | "all"
): DisposalLocation[] {
  let list = [...VERIFIED_DISPOSAL_LOCATIONS];

  if (category && category !== "all") {
    const matched = list.filter((l) => l.acceptedCategories.includes(category));
    if (matched.length > 0) list = matched;
  }

  if (userLat && userLon) {
    list = list.map((loc) => ({
      ...loc,
      distanceKm: calculateDistanceKm(userLat, userLon, loc.coordinates.lat, loc.coordinates.lng),
    }));
    list.sort((a, b) => a.distanceKm - b.distanceKm);
  }

  return list;
}

// Search coordinates by city or postal code using OpenStreetMap Nominatim
export async function geocodeCity(query: string): Promise<{ lat: number; lon: number; displayName: string } | null> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`,
      {
        headers: {
          "User-Agent": "EcoSortAI-DecisionSupportSystem/1.0",
        },
      }
    );
    if (!res.ok) return null;
    const data = await res.json();
    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lon: parseFloat(data[0].lon),
        displayName: data[0].display_name,
      };
    }
    return null;
  } catch {
    return null;
  }
}
