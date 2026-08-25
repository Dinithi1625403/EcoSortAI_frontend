import { WasteCategory, WasteKnowledgeItem } from "@/types/waste";

export const WASTE_KNOWLEDGE_BASE: Record<WasteCategory, WasteKnowledgeItem> = {
  battery: {
    id: "battery",
    name: "Battery & Electronic Cells",
    type: "Hazardous Waste",
    colorClass: {
      bg: "bg-red-50 dark:bg-red-950/40",
      text: "text-red-700 dark:text-red-400",
      border: "border-red-200 dark:border-red-800",
      badge: "bg-red-100 text-red-800 border-red-300",
      binColor: "bg-red-600 text-white",
      binName: "Red / Hazardous E-Waste Bin",
    },
    summary:
      "Batteries contain toxic heavy metals (lithium, lead, cadmium, mercury, acid) that cause severe soil and groundwater contamination and fire hazards if crushed in general waste.",
    actions: [
      "Do NOT place in standard household or recycling bins.",
      "Tape both terminal ends (+ and -) with non-conductive electrical or clear tape.",
      "Store in a cool, dry plastic container away from flammable objects.",
      "Drop off at an authorized battery collection point or e-waste recycling depot.",
    ],
    dos: [
      "Tape battery terminals to prevent short circuits and spontaneous fires.",
      "Keep separate from other metals and household trash.",
      "Take to local electronics retailers, supermarkets, or municipal e-waste centers.",
    ],
    donts: [
      "Never puncture, crush, incinerate, or dismantle batteries.",
      "Do not mix corroded/leaking batteries with fresh ones without gloves.",
      "Never toss rechargeable or lithium batteries into regular bins.",
    ],
    hazards:
      "High fire risk in garbage trucks and landfills. Toxic heavy metal leakage destroys ecosystems and contaminates drinking water aquifers.",
    environmentalImpact: {
      co2OffsetKg: 1.8,
      landfillSpaceLiters: 0.2,
      decompositionYears: "100+ years (never naturally degrades)",
      fact: "Recycling 1 ton of lithium-ion batteries prevents over 3 tons of toxic greenhouse and mining emissions.",
    },
    preparationSteps: [
      "Inspect battery for swelling or corrosive leakage.",
      "Apply tape over metal contact terminals.",
      "Place into a non-metallic bag or box.",
      "Transport to certified e-waste bin.",
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
      binName: "Green / Compost Bin",
    },
    summary:
      "Food scraps, fruit peels, vegetable remains, coffee grounds, and garden clippings. Rich in organic nutrients, ideal for composting and biogas generation.",
    actions: [
      "Separate from all non-biodegradable packaging, plastics, stickers, and twist-ties.",
      "Deposit into home compost, community organics bin, or municipal green bin.",
      "Keep wet organic waste well-drained to minimize odor and leachate.",
      "Use as soil conditioner for gardens or balcony plants.",
    ],
    dos: [
      "Remove fruit stickers and plastic twist-ties before composting.",
      "Layer with brown materials (dry leaves, shredded cardboard) for balanced compost.",
      "Use compostable certified caddy liners if using indoor food bins.",
    ],
    donts: [
      "Do not mix plastic cutlery, foil wrappers, or glossy coated wrappers.",
      "Avoid adding diseased plants or aggressive weeds to home compost.",
      "Do not wrap in conventional single-use plastic bags.",
    ],
    hazards:
      "When buried in anaerobic landfills, organic matter decomposes to generate methane ($CH_4$), a greenhouse gas 28x more potent than carbon dioxide.",
    environmentalImpact: {
      co2OffsetKg: 0.9,
      landfillSpaceLiters: 1.5,
      decompositionYears: "2 weeks - 6 months (aerobic)",
      fact: "Composting organic waste turns food scraps into nutrient-rich humus and reduces municipal methane emissions by up to 60%.",
    },
    preparationSteps: [
      "Peel off fruit label stickers and discard plastic packaging.",
      "Chop large food scraps to accelerate microbial breakdown.",
      "Transfer to an aerated green bin or home compost tumbler.",
    ],
  },

  cardboard: {
    id: "cardboard",
    name: "Corrugated Cardboard & Paperboard",
    type: "Recyclable Waste",
    colorClass: {
      bg: "bg-amber-50 dark:bg-amber-950/40",
      text: "text-amber-800 dark:text-amber-300",
      border: "border-amber-200 dark:border-amber-800",
      badge: "bg-amber-100 text-amber-800 border-amber-300",
      binColor: "bg-amber-700 text-white",
      binName: "Blue / Paper & Cardboard Bin",
    },
    summary:
      "Clean shipping boxes, cereal boxes, cardboard packaging, and parcel cartons. Highly recyclable cellulose fiber that can be remanufactured up to 7 times.",
    actions: [
      "Flatten all boxes to save space in collection bins.",
      "Remove plastic shipping bubbles, styrofoam, and heavy packing tape.",
      "Ensure cardboard is clean and dry; keep away from water and food grease.",
      "Place into paper/cardboard recycling container.",
    ],
    dos: [
      "Break down boxes flat before placing in bins.",
      "Keep cardboard dry and free of food residues.",
      "Recycle clean pizza box lids (tear off greasy bases).",
    ],
    donts: [
      "Do not recycle cardboard soaked with cooking oils, grease, or paint.",
      "Do not include styrofoam packaging blocks in the cardboard bin.",
      "Do not place wet cardboard into recycling chutes.",
    ],
    hazards:
      "Grease and oil soak into cardboard pulp fibers, ruining entire pulp recycling batches by preventing fibers from binding.",
    environmentalImpact: {
      co2OffsetKg: 1.2,
      landfillSpaceLiters: 3.5,
      decompositionYears: "2 - 3 months",
      fact: "Recycling 1 ton of cardboard saves 17 trees, 7,000 gallons of water, and 4,000 kWh of electricity.",
    },
    preparationSteps: [
      "Cut or pull off excess plastic packing tape.",
      "Remove internal bubble wrap and styrofoam fillers.",
      "Flatten the box completely.",
      "Place in a dry paper recycling bin.",
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
      binName: "Purple / Textile Donation Bin",
    },
    summary:
      "Wearable or damaged shirts, pants, jackets, dresses, towels, and fabrics. High potential for direct donation, upcycling, or textile fiber reclamation.",
    actions: [
      "If in wearable condition, wash and donate to charities, thrift stores, or shelter drives.",
      "If damaged or torn, repurpose as cleaning rags, DIY cloths, or deposit into textile fiber recycling bins.",
      "Keep dry and clean to prevent mildew during storage and transport.",
    ],
    dos: [
      "Wash and dry garments before donating.",
      "Donate wearable items to local charities, shelters, or second-hand thrift stores.",
      "Repurpose worn or torn cotton clothing into cleaning rags.",
    ],
    donts: [
      "Do not donate wet or mildew-stained textiles.",
      "Never put clothing in regular curbside single-stream recycling bins (tangles sorting machinery).",
      "Do not discard gently used clothes into landfill trash.",
    ],
    hazards:
      "Synthetic fabrics (polyester, nylon, acrylic) shed microplastics and take hundreds of years to break down in landfills while releasing greenhouse gases.",
    environmentalImpact: {
      co2OffsetKg: 3.6,
      landfillSpaceLiters: 2.0,
      decompositionYears: "20 - 200+ years (synthetics)",
      fact: "Extending the life of clothes by just 9 months of active reuse reduces its carbon, water, and waste footprint by 20–30%.",
    },
    preparationSteps: [
      "Launder and thoroughly dry the garments.",
      "Check pockets for personal belongings.",
      "Fold and place inside a clean bag for donation or drop-off.",
    ],
  },

  glass: {
    id: "glass",
    name: "Glass Bottles & Jars",
    type: "Recyclable Waste",
    colorClass: {
      bg: "bg-cyan-50 dark:bg-cyan-950/40",
      text: "text-cyan-800 dark:text-cyan-300",
      border: "border-cyan-200 dark:border-cyan-800",
      badge: "bg-cyan-100 text-cyan-800 border-cyan-300",
      binColor: "bg-cyan-600 text-white",
      binName: "Teal / Glass Recycling Bin",
    },
    summary:
      "Beverage bottles, condiment jars, jam jars, cosmetic glass containers. Glass is 100% infinitely recyclable without any loss in purity or quality.",
    actions: [
      "Empty any remaining liquids or sauces.",
      "Rinse with a splash of water to remove residual food.",
      "Remove metal/plastic screw caps (recycle caps separately).",
      "Place into designated glass recycling bin or color-sorted igloo.",
    ],
    dos: [
      "Rinse out food residues to avoid attracting pests.",
      "Sort by color (clear, green, amber) if your local facility requires it.",
      "Leave paper labels intact (they burn off safely during the melting process).",
    ],
    donts: [
      "Do not mix mirror glass, light bulbs, window panes, Pyrex, or ceramics (different melting temperatures).",
      "Do not deliberately smash glass before disposal (creates safety hazard for handlers).",
      "Do not put drinking glassware in glass recycling.",
    ],
    hazards:
      "Non-container glass (borosilicate, ceramics, mirrors) contaminates glass furnaces and ruins recycled batches.",
    environmentalImpact: {
      co2OffsetKg: 0.7,
      landfillSpaceLiters: 0.8,
      decompositionYears: "1 Million+ years (essentially indestructible)",
      fact: "Every ton of glass recycled saves 1.2 tons of raw quarry materials and reduces emissions by 30% compared to new glass.",
    },
    preparationSteps: [
      "Empty contents completely.",
      "Quick-rinse inside.",
      "Remove metal lid or cork.",
      "Drop into glass bin gently.",
    ],
  },

  metal: {
    id: "metal",
    name: "Metal Cans, Tins & Aluminum",
    type: "Recyclable Waste",
    colorClass: {
      bg: "bg-slate-100 dark:bg-slate-800/60",
      text: "text-slate-700 dark:text-slate-300",
      border: "border-slate-300 dark:border-slate-700",
      badge: "bg-slate-200 text-slate-800 border-slate-400",
      binColor: "bg-slate-600 text-white",
      binName: "Yellow / Metal & Plastic Bin",
    },
    summary:
      "Aluminum beverage cans, steel soup tins, food cans, tin foil, and metal lids. Metals are infinitely recyclable with extraordinary energy savings.",
    actions: [
      "Empty leftover food or drink residues.",
      "Rinse lightly with water.",
      "Crush aluminum beverage cans to conserve collection volume.",
      "Place in the metal/dry recycling container.",
    ],
    dos: [
      "Crush drink cans to save up to 75% volume in bins.",
      "Tuck clean lids inside tin cans and press the rim closed.",
      "Recycle clean, scrunched aluminum baking foil (ball it up to at least golf-ball size).",
    ],
    donts: [
      "Do not include aerosol cans with contents remaining.",
      "Do not recycle metal containers that held harsh motor oil or chemical solvents.",
      "Do not mix with electronic scrap or batteries.",
    ],
    hazards:
      "Discarded metal in nature poses puncture hazards to wildlife and squanders huge amounts of non-renewable bauxite/iron ores.",
    environmentalImpact: {
      co2OffsetKg: 2.1,
      landfillSpaceLiters: 0.6,
      decompositionYears: "50 - 500 years",
      fact: "Recycling an aluminum can saves 95% of the energy needed to produce new metal from bauxite ore—saving enough energy to run a TV for 3 hours!",
    },
    preparationSteps: [
      "Empty and give a quick rinse.",
      "Crush can with foot or can crusher if aluminum.",
      "Deposit in metal recycling receptacle.",
    ],
  },

  paper: {
    id: "paper",
    name: "Paper, Documents & Newspapers",
    type: "Recyclable Waste",
    colorClass: {
      bg: "bg-blue-50 dark:bg-blue-950/40",
      text: "text-blue-700 dark:text-blue-300",
      border: "border-blue-200 dark:border-blue-800",
      badge: "bg-blue-100 text-blue-800 border-blue-300",
      binColor: "bg-blue-600 text-white",
      binName: "Blue / Paper Recycling Bin",
    },
    summary:
      "Office documents, newspapers, magazines, flyers, notebooks, paper envelopes, and brochures. Clean cellulose fibers can be re-pulped 5 to 7 times.",
    actions: [
      "Keep dry and protected from weather elements.",
      "Remove plastic sleeves, binder clips, and cellophane windows if possible.",
      "Staples are acceptable (extracted by industrial magnets during pulping).",
      "Place in blue paper recycling bin.",
    ],
    dos: [
      "Keep paper dry; wet paper fibers break down prematurely and rot.",
      "Shred sensitive documents and compost or bag securely.",
      "Recycle office paper, magazines, envelopes, and printed flyers.",
    ],
    donts: [
      "Do not recycle soiled napkins, greasy paper towels, or tissues (short fibers + bacteria).",
      "Do not recycle thermal receipts (coated with BPA/BPS chemicals).",
      "Do not recycle wax-coated or laminated foil paper.",
    ],
    hazards:
      "Contaminated or wet paper cannot be processed by mill hydrapulpers and causes mold during bulk storage.",
    environmentalImpact: {
      co2OffsetKg: 1.0,
      landfillSpaceLiters: 1.8,
      decompositionYears: "2 - 6 weeks",
      fact: "Recycling 1 ton of paper saves 17 trees, 26,000 liters of water, and 3.3 cubic yards of landfill space.",
    },
    preparationSteps: [
      "Separate from plastic sleeves and spiral binders.",
      "Stack flat and keep dry.",
      "Drop into paper bin.",
    ],
  },

  plastic: {
    id: "plastic",
    name: "Plastic Bottles, Containers & Polymers",
    type: "Recyclable Waste",
    colorClass: {
      bg: "bg-amber-50/70 dark:bg-amber-950/30",
      text: "text-amber-700 dark:text-amber-400",
      border: "border-amber-200 dark:border-amber-800",
      badge: "bg-amber-100 text-amber-800 border-amber-300",
      binColor: "bg-amber-500 text-white",
      binName: "Yellow / Plastic Recycling Bin",
    },
    summary:
      "Rigid plastic bottles (PET #1, HDPE #2), jugs, cleaning fluid bottles, tubs, and food containers. Check resin identification codes on bottom.",
    actions: [
      "Empty contents completely.",
      "Rinse with water to remove food/liquid residues.",
      "Compress or squash bottle to reduce volume, then re-attach cap.",
      "Place in yellow recycling bin.",
    ],
    dos: [
      "Check the resin code (PET #1, HDPE #2, PP #5 are most widely recyclable).",
      "Rinse containers to eliminate residue.",
      "Crush bottles to maximize bin capacity.",
    ],
    donts: [
      "Do not recycle soft film plastic, chip bags, or flimsy cling wrap in curbside bins (clogs sorter belts).",
      "Do not recycle styrofoam (expanded polystyrene #6) in regular plastic bins.",
      "Do not leave half-full containers in bins.",
    ],
    hazards:
      "Plastics persist for centuries, disintegrating into microscopic toxic microplastics that bioaccumulate across marine food webs and human organs.",
    environmentalImpact: {
      co2OffsetKg: 1.5,
      landfillSpaceLiters: 2.2,
      decompositionYears: "450 - 1000 years",
      fact: "Recycling 1 ton of plastic saves 5,774 kWh of electricity, 16.3 barrels of petroleum oil, and 30 cubic yards of landfill space.",
    },
    preparationSteps: [
      "Empty leftover liquids.",
      "Rinse lightly.",
      "Squash to expel air.",
      "Screw cap back on and place in yellow bin.",
    ],
  },

  shoes: {
    id: "shoes",
    name: "Footwear & Shoes",
    type: "Reusable / Donation",
    colorClass: {
      bg: "bg-violet-50 dark:bg-violet-950/40",
      text: "text-violet-700 dark:text-violet-400",
      border: "border-violet-200 dark:border-violet-800",
      badge: "bg-violet-100 text-violet-800 border-violet-300",
      binColor: "bg-violet-600 text-white",
      binName: "Purple / Shoe & Clothing Donation Bin",
    },
    summary:
      "Athletic sneakers, leather shoes, boots, and sandals. Complex multi-material composition (rubber, foam, leather, adhesives) makes reuse the primary disposal path.",
    actions: [
      "Tie pair together by laces or rubber band so they do not get separated.",
      "If in wearable shape, donate to charity organizations, shoe drives, or secondhand stores.",
      "If completely worn out, deposit into athletic brand shoe recycling programs (e.g. Nike Reuse-A-Shoe for playground rubber).",
    ],
    dos: [
      "Tie shoe pairs securely together before donating.",
      "Clean off exterior mud and dirt.",
      "Look for brand-specific athletic shoe recycling drop-boxes for worn-out soles.",
    ],
    donts: [
      "Do not throw matched wearable pairs in landfill trash.",
      "Never put shoes into automated single-stream recycling conveyors.",
      "Do not donate damp or mildewed shoes.",
    ],
    hazards:
      "Multi-material polyurethane foams, EVA, and vulcanized rubber take centuries to decompose in landfills and release toxic VOCs when improperly incinerated.",
    environmentalImpact: {
      co2OffsetKg: 4.2,
      landfillSpaceLiters: 3.0,
      decompositionYears: "50 - 100 years",
      fact: "Reusing a pair of shoes saves over 14 kg of carbon emissions associated with new manufacturing, tanning, and global logistics.",
    },
    preparationSteps: [
      "Brush off excess dirt or mud.",
      "Tie laces together to keep the pair united.",
      "Drop off at donation center or shoe recycling bin.",
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
      binName: "Black / Grey General Landfill Bin",
    },
    summary:
      "Non-recyclable composite items, contaminated food packaging, greasy wrappers, broken ceramics, hygiene items, and mixed plastic films.",
    actions: [
      "Bag securely before placing in the black/grey municipal residual bin.",
      "Keep separate from clean recyclables and organic compost.",
      "Consider reusable zero-waste alternatives for future purchases.",
    ],
    dos: [
      "Tie trash bags securely to prevent windblown litter.",
      "Wrap sharp broken ceramics or glass shards in paper before tossing.",
      "Actively explore zero-waste swaps to minimize future residual landfill waste.",
    ],
    donts: [
      "Never throw hazardous materials (batteries, chemicals, e-waste) into general trash.",
      "Do not place organic food scraps in trash when composting options exist.",
      "Do not place recyclable clean paper/cans in trash.",
    ],
    hazards:
      "Direct contributor to municipal landfill volume and methane emissions. Improper disposal risks animal ingestion and waterways contamination.",
    environmentalImpact: {
      co2OffsetKg: 0.1,
      landfillSpaceLiters: 1.0,
      decompositionYears: "Varies (up to 500+ years)",
      fact: "Over 40% of typical household landfill trash consists of recyclable or compostable materials that could have been diverted.",
    },
    preparationSteps: [
      "Verify item cannot be recycled, composted, or repaired.",
      "Place into standard municipal trash bin.",
    ],
  },
};
