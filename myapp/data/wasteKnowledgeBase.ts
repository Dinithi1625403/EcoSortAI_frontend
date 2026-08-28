import { WasteCategory, WasteKnowledgeItem } from "@/types/waste";

export const WASTE_KNOWLEDGE_BASE: Record<WasteCategory, WasteKnowledgeItem> = {
  battery: {
    id: "battery",
    name: "Battery & Electronic Cells",
    type: "Hazardous E-Waste",
    colorClass: {
      bg: "bg-red-50 dark:bg-red-950/40",
      text: "text-red-700 dark:text-red-400",
      border: "border-red-200 dark:border-red-800",
      badge: "bg-red-100 text-red-800 border-red-300",
      binColor: "bg-red-600 text-white",
      binName: "Red / CEA E-Waste Drop-box (විද්‍යුත් අපද්‍රව්‍ය)",
    },
    summary:
      "Batteries contain toxic heavy metals (lithium, cadmium, lead, acid). Never mix with household garbage. In Sri Lanka, drop them into CEA e-waste kiosks at Dialog, Mobitel, or Singer showrooms.",
    actions: [
      "Do NOT place in standard household or municipal garbage bins.",
      "Tape both terminal ends (+ and -) with clear or electrical tape.",
      "Store in a dry plastic box away from heat and moisture.",
      "Drop off at CEA Battaramulla, Dialog, Mobitel, or Singer e-waste collection bins.",
    ],
    dos: [
      "Tape battery terminals to prevent short circuits and fire hazards.",
      "Keep separate from metal cans and wet kitchen waste.",
      "Take to local electronics stores or CEA drop-off points.",
    ],
    donts: [
      "Never burn, puncture, or discard batteries in open dumps.",
      "Do not mix leaking batteries with other household trash.",
      "Never toss rechargeable lithium cells into regular municipal bins.",
    ],
    hazards:
      "High fire risk in collection trucks. Toxic heavy metals leak into Sri Lankan groundwater and paddy waterways.",
    environmentalImpact: {
      co2OffsetKg: 1.8,
      landfillSpaceLiters: 0.2,
      decompositionYears: "100+ years (never naturally degrades)",
      fact: "Recycling 1 ton of e-waste in Sri Lanka saves critical rare metals and prevents ground soil poisoning.",
    },
    preparationSteps: [
      "Inspect battery for swelling or acid leakage.",
      "Apply tape over metal contact terminals.",
      "Place into a small non-metallic bag or box.",
      "Drop off at nearest CEA e-waste partner kiosk.",
    ],
  },

  biological: {
    id: "biological",
    name: "Organic & Biodegradable Waste",
    type: "Organic Waste",
    colorClass: {
      bg: "bg-emerald-50 dark:bg-emerald-950/40",
      text: "text-emerald-700 dark:text-emerald-400",
      border: "border-emerald-200 dark:border-emerald-800",
      badge: "bg-emerald-100 text-emerald-800 border-emerald-300",
      binColor: "bg-emerald-600 text-white",
      binName: "Green / දිරන අපද්‍රව්‍ය (Organic Compost Bin)",
    },
    summary:
      "Food scraps, rice, fruit peels, vegetable leftovers, tea leaves, and garden trimmings. Collected by municipal green trucks (CMC / local councils) for organic fertilizer.",
    actions: [
      "Separate from all non-biodegradable polythene lunch sheets, wrappers, and stickers.",
      "Deposit into home compost barrel, community compost site, or municipal green collection bin.",
      "Drain excess liquids to minimize odor and leachate.",
    ],
    dos: [
      "Remove plastic stickers and lunch sheet wraps before discarding food.",
      "Layer kitchen scraps with dry leaves in home compost bins.",
      "Keep food waste separate for municipal organic collection days.",
    ],
    donts: [
      "Do not mix plastic cutlery, foil wrappers, or polythene bags.",
      "Avoid mixing meat bones or animal carcasses in standard compost units.",
      "Do not bundle organic waste inside tied plastic grocery bags.",
    ],
    hazards:
      "Anaerobic breakdown in dumps like Karadiyana/Aruwakkalu creates methane and toxic leachate that pollutes surrounding wetlands.",
    environmentalImpact: {
      co2OffsetKg: 0.9,
      landfillSpaceLiters: 1.5,
      decompositionYears: "2 weeks - 3 months",
      fact: "Composting organic waste in Sri Lanka creates rich natural fertilizer for agriculture and cuts municipal landfill loads by over 55%.",
    },
    preparationSteps: [
      "Remove all polythene wrappers and stickers.",
      "Chop large fruit rinds or plant stems.",
      "Place into green bin or compost unit.",
    ],
  },

  cardboard: {
    id: "cardboard",
    name: "Corrugated Cardboard & Cartons",
    type: "Recyclable Waste",
    colorClass: {
      bg: "bg-blue-50 dark:bg-blue-950/40",
      text: "text-blue-800 dark:text-blue-300",
      border: "border-blue-200 dark:border-blue-800",
      badge: "bg-blue-100 text-blue-800 border-blue-300",
      binColor: "bg-blue-600 text-white",
      binName: "Blue / කඩදාසි (Paper & Cardboard Bin)",
    },
    summary:
      "Clean shipping cartons, packing boxes, food packaging boards, and parcel boxes. High recycling value for Sri Lankan paper mills (e.g. Neptune Papers).",
    actions: [
      "Flatten boxes to save space in bins.",
      "Remove plastic packing tape, styrofoam, and bubble wrap.",
      "Keep dry and protected from monsoon rain.",
      "Deposit into blue recycling bin or give to local cardboard collectors.",
    ],
    dos: [
      "Flatten boxes flat before bundling.",
      "Keep cardboard dry and away from grease/water.",
      "Recycle clean packaging boxes and egg cartons.",
    ],
    donts: [
      "Do not recycle cardboard soaked with cooking oils or curry gravy.",
      "Do not include styrofoam blocks with cardboard.",
      "Do not leave cardboard outside in the rain.",
    ],
    hazards:
      "Wet or oily cardboard rots in storage and cannot be re-pulped by local recyclers.",
    environmentalImpact: {
      co2OffsetKg: 1.2,
      landfillSpaceLiters: 3.5,
      decompositionYears: "2 - 3 months",
      fact: "Recycling 1 ton of cardboard saves 17 trees and thousands of liters of fresh water in paper manufacturing.",
    },
    preparationSteps: [
      "Remove plastic tape and styrofoam padding.",
      "Fold or press flat.",
      "Stack neatly in a dry area.",
    ],
  },

  clothes: {
    id: "clothes",
    name: "Textiles & Apparel",
    type: "Reusable / Donation",
    colorClass: {
      bg: "bg-indigo-50 dark:bg-indigo-950/40",
      text: "text-indigo-700 dark:text-indigo-400",
      border: "border-indigo-200 dark:border-indigo-800",
      badge: "bg-indigo-100 text-indigo-800 border-indigo-300",
      binColor: "bg-indigo-600 text-white",
      binName: "Purple / Textile & Donation Hub (ඇඳුම් පරිත්‍යාග)",
    },
    summary:
      "Wearable shirts, trousers, sarees, frocks, school uniforms, and fabrics. Best suited for donation drives (Sarvodaya, Red Cross, local temples/churches) or upcycling into cleaning cloths.",
    actions: [
      "Wash, dry, and fold wearable clothes for charity donation drives.",
      "If torn or damaged, cut into household cleaning rags or send to textile recyclers.",
      "Keep dry to prevent fungus and mildew during tropical humidity.",
    ],
    dos: [
      "Launder and dry garments before donating.",
      "Donate to orphanages, elderly homes, or disaster relief collections.",
      "Reuse old cotton t-shirts as household floor mops or wiping rags.",
    ],
    donts: [
      "Never put clothing in municipal open dumps where synthetic threads persist.",
      "Do not donate soiled or torn undergarments.",
    ],
    hazards:
      "Synthetic polyester fabrics shed microplastics into rivers and coastal marine life around Sri Lanka.",
    environmentalImpact: {
      co2OffsetKg: 3.6,
      landfillSpaceLiters: 2.0,
      decompositionYears: "20 - 200+ years",
      fact: "Reusing and donating clothes prevents hundreds of tons of fabric waste from reaching municipal dumping sites.",
    },
    preparationSteps: [
      "Wash and thoroughly dry.",
      "Fold into a clean reusable bag.",
      "Hand over to local donation drives or welfare centers.",
    ],
  },

  glass: {
    id: "glass",
    name: "Glass Bottles & Jars",
    type: "Recyclable Waste",
    colorClass: {
      bg: "bg-red-50 dark:bg-red-950/40",
      text: "text-red-800 dark:text-red-300",
      border: "border-red-200 dark:border-red-800",
      badge: "bg-red-100 text-red-800 border-red-300",
      binColor: "bg-red-600 text-white",
      binName: "Red / වීදුරු (CEA Glass Recycling Bin)",
    },
    summary:
      "Beverage bottles, sauce jars, jam bottles, and glass containers. According to Sri Lanka CEA color code, glass is collected in Red bins or returned to shops for bottle deposit refund.",
    actions: [
      "Return standard soft drink and beer bottles to retail shops for cash deposit refund.",
      "Rinse food jars with a splash of water.",
      "Remove metal crown caps or plastic screw lids.",
      "Place into Red Glass bin or hand over to neighborhood glass collectors ('Bothal Paththara' collectors).",
    ],
    dos: [
      "Return deposit bottles to local grocery / wine stores for refund.",
      "Rinse out sticky sauce or jam residues.",
      "Separate broken glass safely inside a secure box.",
    ],
    donts: [
      "Do not mix mirror glass, light bulbs, or Pyrex cookware with bottle glass.",
      "Never throw unbroken glass bottles into general plastic or food waste.",
    ],
    hazards:
      "Broken glass in municipal garbage causes severe puncture wounds to waste collectors and sanitation workers.",
    environmentalImpact: {
      co2OffsetKg: 0.7,
      landfillSpaceLiters: 0.8,
      decompositionYears: "1 Million+ years (never degrades)",
      fact: "Returning bottles to Ceylon Glass Company / Piramal Glass saves vast furnace fuel and raw silica sand.",
    },
    preparationSteps: [
      "Empty leftover liquids.",
      "Rinse with clean water.",
      "Remove metal caps.",
      "Keep in a designated box or drop into Red Glass bin.",
    ],
  },

  metal: {
    id: "metal",
    name: "Metal Cans, Tins & Scrap",
    type: "Recyclable Waste",
    colorClass: {
      bg: "bg-amber-900/10 dark:bg-amber-950/40",
      text: "text-amber-900 dark:text-amber-300",
      border: "border-amber-300 dark:border-amber-800",
      badge: "bg-amber-100 text-amber-900 border-amber-300",
      binColor: "bg-amber-800 text-white",
      binName: "Brown / ලෝහ (Metal & Can Recycling Bin)",
    },
    summary:
      "Aluminum soda cans, tin fish cans, milk powder tins, aerosol cans (empty), and scrap metal. In Sri Lanka, metals are sorted into Brown bins or sold to local metal scrap yards.",
    actions: [
      "Rinse out canned fish (tin mee) or milk residue with water.",
      "Crush drink cans to save storage space.",
      "Deposit in Brown metal bin or sell to local scrap metal buyers.",
    ],
    dos: [
      "Wash food cans clean before storing to prevent stray animals and flies.",
      "Crush aluminum beverage cans flat.",
      "Collect and sell bulk tins to neighborhood recyclers.",
    ],
    donts: [
      "Do not throw unwashed fish tins into open bins.",
      "Do not puncture pressurized gas cylinders.",
    ],
    hazards:
      "Rusty jagged cans in open garbage spread tetanus and injure workers.",
    environmentalImpact: {
      co2OffsetKg: 2.1,
      landfillSpaceLiters: 0.6,
      decompositionYears: "50 - 500 years",
      fact: "Recycling an aluminum can saves 95% of the energy compared to refining virgin bauxite ore.",
    },
    preparationSteps: [
      "Rinse with water.",
      "Crush or flatten.",
      "Place into brown metal recycling container.",
    ],
  },

  paper: {
    id: "paper",
    name: "Paper, Newspapers & Books",
    type: "Recyclable Waste",
    colorClass: {
      bg: "bg-blue-50 dark:bg-blue-950/40",
      text: "text-blue-700 dark:text-blue-300",
      border: "border-blue-200 dark:border-blue-800",
      badge: "bg-blue-100 text-blue-800 border-blue-300",
      binColor: "bg-blue-600 text-white",
      binName: "Blue / කඩදාසි (Paper Recycling Bin)",
    },
    summary:
      "Newspapers, school exercise books, office printing paper, envelopes, and paper bags. Kept dry for local paper recycling drives and municipal blue collection.",
    actions: [
      "Keep dry and protected from rain.",
      "Bundle old newspapers, magazines, and textbooks.",
      "Place in blue paper bin or hand over to school paper collection drives.",
    ],
    dos: [
      "Keep paper dry and stacked flat.",
      "Recycle clean newspapers, flyers, and shredded office docs.",
      "Donate used textbooks to libraries or younger students.",
    ],
    donts: [
      "Do not recycle greasy lunch wrappers or oil-soaked pastry bags.",
      "Do not recycle thermal supermarket receipts (contain chemical coatings).",
    ],
    hazards:
      "Wet or moldy paper cannot be recycled by local mills and causes fires when discarded in dry leaf dumps.",
    environmentalImpact: {
      co2OffsetKg: 1.0,
      landfillSpaceLiters: 1.8,
      decompositionYears: "2 - 6 weeks",
      fact: "Recycling paper in Sri Lanka reduces foreign exchange spent on importing virgin paper pulp.",
    },
    preparationSteps: [
      "Separate from plastic binders.",
      "Bundle with string or stack flat.",
      "Deposit into blue paper bin.",
    ],
  },

  plastic: {
    id: "plastic",
    name: "Plastic Bottles, Containers & Polythene",
    type: "Recyclable Waste",
    colorClass: {
      bg: "bg-orange-50 dark:bg-orange-950/30",
      text: "text-orange-800 dark:text-orange-300",
      border: "border-orange-200 dark:border-orange-800",
      badge: "bg-orange-100 text-orange-800 border-orange-300",
      binColor: "bg-orange-500 text-white",
      binName: "Orange / ප්ලාස්ටික් (CEA Plastic & PET Bin)",
    },
    summary:
      "PET beverage bottles, water bottles, shampoo jugs, detergent tubs, and plastic containers. In Sri Lanka, clean plastics go to Orange bins and 'PlasticCycle' collection bins.",
    actions: [
      "Empty contents completely.",
      "Rinse with water to remove drink residues.",
      "Crush bottle flat to save volume, then replace cap.",
      "Place in Orange plastic bin or public PlasticCycle bins at supermarkets.",
    ],
    dos: [
      "Look for PET (#1) and HDPE (#2) markings on containers.",
      "Rinse containers to eliminate sweet drink residues.",
      "Crush bottles before dropping in Orange bins.",
    ],
    donts: [
      "Never burn plastics or polythene in garden fires (releases toxic carcinogenic dioxins).",
      "Do not throw plastics into waterways, rivers, or beach coastlines.",
    ],
    hazards:
      "Burning plastic in home gardens causes respiratory disease and releases dioxins. Plastics in drainage canals cause urban flooding in Colombo and suburban areas.",
    environmentalImpact: {
      co2OffsetKg: 1.5,
      landfillSpaceLiters: 2.2,
      decompositionYears: "450 - 1000 years",
      fact: "Plastic bottles collected in Sri Lanka are upcycled into polyester yarn by Eco Spindles for apparel manufacturing.",
    },
    preparationSteps: [
      "Empty leftover liquid.",
      "Rinse lightly.",
      "Crush bottle flat.",
      "Drop into Orange plastic recycling bin.",
    ],
  },

  shoes: {
    id: "shoes",
    name: "Accessories",
    type: "Reusable / Donation",
    colorClass: {
      bg: "bg-violet-50 dark:bg-violet-950/40",
      text: "text-violet-700 dark:text-violet-400",
      border: "border-violet-200 dark:border-violet-800",
      badge: "bg-violet-100 text-violet-800 border-violet-300",
      binColor: "bg-violet-600 text-white",
      binName: "Purple / Accessories & Donation Bin (උපාංග පරිත්‍යාග)",
    },
    summary:
      "Footwear (shoes, sandals, slippers, boots), bags, backpacks, school bags, and leather accessories. Reusing and donating keeps these composite materials out of landfills.",
    actions: [
      "If in wearable shape, donate to charity organizations, school drives, or local community centers.",
      "For shoes: tie pairs together by laces so they do not separate.",
      "For school bags & purses: empty all pockets and wipe clean.",
    ],
    dos: [
      "Check and empty all inner pockets of bags before donating.",
      "Tie shoe pairs securely together.",
      "Donate usable school bags and footwear to underprivileged school drives.",
    ],
    donts: [
      "Do not throw usable shoes and bags into landfill garbage.",
      "Never burn leather or rubber slippers in open fires.",
    ],
    hazards:
      "Rubber soles and composite synthetic leather take decades to decompose in landfill dumps.",
    environmentalImpact: {
      co2OffsetKg: 4.2,
      landfillSpaceLiters: 3.0,
      decompositionYears: "50 - 100+ years",
      fact: "Donating a usable pair of shoes or school bag helps a student in need and prevents 14 kg of manufacturing emissions.",
    },
    preparationSteps: [
      "Check and empty all pockets and compartments.",
      "Wipe off dust and dirt.",
      "Tie shoe laces together if applicable.",
      "Hand over to a donation drive or charity center.",
    ],
  },

  trash: {
    id: "trash",
    name: "General Residual Waste / Non-Recyclable",
    type: "General Landfill",
    colorClass: {
      bg: "bg-neutral-100 dark:bg-neutral-900/60",
      text: "text-neutral-700 dark:text-neutral-300",
      border: "border-neutral-300 dark:border-neutral-700",
      badge: "bg-neutral-200 text-neutral-800 border-neutral-400",
      binColor: "bg-neutral-800 text-white",
      binName: "Black / නොදිරන අපද්‍රව්‍ය (Municipal Residual Bin)",
    },
    summary:
      "Non-recyclable composite packaging, soiled wrappers, dirty tissues, broken ceramics, and mixed residual items that cannot be composted or recycled.",
    actions: [
      "Bag securely before handing over to municipal waste collection trucks on residual waste days.",
      "Keep strictly separate from clean recyclables and kitchen organic waste.",
    ],
    dos: [
      "Tie trash bags securely before collection.",
      "Wrap sharp broken ceramic pieces in old newspaper before discarding.",
    ],
    donts: [
      "Never throw batteries, electronics, or toxic chemicals in general trash.",
      "Do not mix clean dry paper or plastics in residual trash.",
    ],
    hazards:
      "Overfilling landfills in Karadiyana and Kerawalapitiya creates massive environmental pressure on urban wetlands.",
    environmentalImpact: {
      co2OffsetKg: 0.1,
      landfillSpaceLiters: 1.0,
      decompositionYears: "Varies (up to 500+ years)",
      fact: "Proper waste segregation in Sri Lanka can divert more than 60% of household waste away from landfills.",
    },
    preparationSteps: [
      "Verify item cannot be recycled, composted, or donated.",
      "Bag securely for municipal collection.",
    ],
  },
};

