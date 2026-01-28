export type ProcessStep = 'UPLOAD' | 'ANALYSIS' | 'FABRIC_SELECTION' | 'VALIDATION' | 'DECISION';

export interface TechPack {
  techPackId: string;
  buyer: string;
  styleCode: string;
  garmentType: string;
  gender: string;
  category: 'Woven' | 'Knit';
  season: string;
  sizeRange: string[];
  measurements: { point: string; toleranceCm: number }[];
  construction: {
    stitchType: string;
    spi: number;
    seamType: string;
  };
  trims: string[];
  washing: string;
}

export interface Fabric {
  fabricId: string;
  name: string;
  type: 'Woven' | 'Knit';
  composition: string;
  gsm: number;
  widthInches: number;
  stretchPercent: number;
  shrinkagePercent: number;
  dyeType: string;
  costPerMeter: number;
  imageUrl?: string;
}

export interface RuleResult {
  ruleId: string;
  severity: 'CRITICAL' | 'RISK' | 'SAFE';
  message: string;
  category: string;
  aiExplanation?: string;
}

export interface Costing {
  fabricCost: number;
  trimCost: number;
  cmCost: number;
  washingCost: number;
  overheadCost: number;
  totalCostPerPiece: number;
  buyerPrice: number;
  marginPercent: number;
}

export interface ReadinessReport {
  score: number;
  status: 'PRODUCTION READY' | 'SAMPLE WITH CAUTION' | 'REJECTED';
  failCount: number;
  warningCount: number;
}
