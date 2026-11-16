import { Request, Response } from 'express';

interface EstimateInput {
  builtUpArea: number; // in sq ft
  packageType: 'standard' | 'premium' | 'luxury';
  city?: string;
  floors?: number;
}

const RATES_PER_SQFT = {
  standard: 1850, // Base construction with trusted brands
  premium: 2350,  // Premium tiles, teak wood, engineered fittings, Vastu optimization
  luxury: 3200,   // High-end Italian marble, double-glazed glass, smart home automation
};

export const calculateEstimate = async (req: Request, res: Response): Promise<void> => {
  try {
    const { builtUpArea, packageType = 'premium', city = 'Delhi NCR', floors = 2 } = req.body as EstimateInput;

    if (!builtUpArea || builtUpArea <= 0) {
      res.status(400).json({ success: false, message: 'Please provide a valid built-up area in square feet.' });
      return;
    }

    const rate = RATES_PER_SQFT[packageType] || RATES_PER_SQFT.premium;
    const baseConstructionCost = Math.round(builtUpArea * rate);
    
    // Detailed cost breakdown
    const civilStructureCost = Math.round(baseConstructionCost * 0.48); // 48% (Cement, Steel, Bricks, Sand, Concrete)
    const finishingAndInteriors = Math.round(baseConstructionCost * 0.28); // 28% (Flooring, Painting, Doors, Windows)
    const plumbingAndElectrical = Math.round(baseConstructionCost * 0.14); // 14% (Concealed conduit, wiring, fixtures)
    const architecturalAndQA = Math.round(baseConstructionCost * 0.10); // 10% (3D Vastu, 310+ QA checks, Escrow audit)
    
    const estimatedDurationMonths = Math.max(5, Math.ceil((builtUpArea / 1000) * 2.8) + (floors - 1));

    res.json({
      success: true,
      data: {
        builtUpArea,
        packageType,
        city,
        floors,
        ratePerSqFt: rate,
        totalEstimatedCost: baseConstructionCost,
        breakdown: {
          civilStructureCost,
          finishingAndInteriors,
          plumbingAndElectrical,
          architecturalAndQA,
        },
        estimatedDurationMonths,
        paymentSafety: {
          escrowProtection: '100% Escrow Protection',
          qaMilestoneGates: 'Payment unlocked across 6 major site audit milestones',
          structuralWarranty: '10-Year Structural Integrity Warranty',
        },
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

