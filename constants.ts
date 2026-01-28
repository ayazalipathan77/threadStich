import { Fabric, TechPack } from './types';

export const TEMPLATES = [
  {
    id: 'tp-cargo',
    name: "Men's Utility Cargo",
    category: "Woven",
    image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&q=80&w=300",
    description: "Complex woven construction with multiple stress points."
  },
  {
    id: 'tp-active',
    name: "Women's Active Hoodie",
    category: "Knit",
    image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=300",
    description: "High-stretch knit garment with flatlock stitching."
  }
];

export const MOCK_TECH_PACKS: Record<string, TechPack> = {
  'tp-cargo': {
    techPackId: "TP-2026-00127",
    buyer: "ZARA",
    styleCode: "ZR-M-CARGO-241",
    garmentType: "Cargo Pant",
    gender: "Men",
    category: "Woven",
    season: "SS26",
    sizeRange: ["S", "M", "L", "XL", "XXL"],
    measurements: [
      { point: "Waist", toleranceCm: 0.5 },
      { point: "Hip", toleranceCm: 0.5 },
      { point: "Outseam", toleranceCm: 0.7 },
      { point: "Inseam", toleranceCm: 0.7 }
    ],
    construction: {
      stitchType: "Lock Stitch",
      spi: 12,
      seamType: "Stress"
    },
    trims: ["Zipper", "Button", "Pocket Rivet"],
    washing: "Enzyme Wash"
  },
  'tp-active': {
    techPackId: "TP-2026-00882",
    buyer: "LULULEMON",
    styleCode: "LL-W-HOOD-09",
    garmentType: "Active Hoodie",
    gender: "Women",
    category: "Knit",
    season: "FW25",
    sizeRange: ["XS", "S", "M", "L"],
    measurements: [
      { point: "Chest", toleranceCm: 1.0 },
      { point: "Length", toleranceCm: 1.0 },
      { point: "Sleeve", toleranceCm: 0.8 }
    ],
    construction: {
      stitchType: "Flatlock",
      spi: 14,
      seamType: "Stretch"
    },
    trims: ["Drawstring", "Eyelet"],
    washing: "Bio Polish"
  }
};

// Initial Mock Tech Pack (Simulating the parsing result for file upload)
export const MOCK_PARSED_TECH_PACK: TechPack = MOCK_TECH_PACKS['tp-cargo'];

export const FABRIC_LIBRARY: Fabric[] = [
  {
    fabricId: "FAB-COT-TWL-200",
    name: "Standard Cotton Twill",
    type: "Woven",
    composition: "100% Cotton Twill",
    gsm: 180,
    widthInches: 58,
    stretchPercent: 0,
    shrinkagePercent: 3,
    dyeType: "Reactive",
    costPerMeter: 3.20,
    imageUrl: "https://picsum.photos/id/194/200/200"
  },
  {
    fabricId: "FAB-HVY-DNS-300",
    name: "Heavy Duty Canvas",
    type: "Woven",
    composition: "100% Cotton Canvas",
    gsm: 280,
    widthInches: 60,
    stretchPercent: 0,
    shrinkagePercent: 1.5,
    dyeType: "Pigment",
    costPerMeter: 4.50,
    imageUrl: "https://picsum.photos/id/204/200/200"
  },
  {
    fabricId: "FAB-POLY-STR-150",
    name: "Poly Stretch Blend",
    type: "Woven",
    composition: "95% Poly 5% Spandex",
    gsm: 150,
    widthInches: 56,
    stretchPercent: 5,
    shrinkagePercent: 2,
    dyeType: "Disperse",
    costPerMeter: 2.80,
    imageUrl: "https://picsum.photos/id/250/200/200"
  },
  {
    fabricId: "FAB-KNIT-JSY-160",
    name: "Single Jersey",
    type: "Knit",
    composition: "100% Cotton",
    gsm: 160,
    widthInches: 70,
    stretchPercent: 15,
    shrinkagePercent: 5,
    dyeType: "Reactive",
    costPerMeter: 3.00,
    imageUrl: "https://picsum.photos/id/305/200/200"
  }
];

// Fixed costs for estimation logic
export const BASE_COSTS = {
  trimCost: 0.90,
  cmCost: 3.50,
  washingCost: 0.80,
  overheadCost: 0.70,
  buyerPrice: 11.50
};
