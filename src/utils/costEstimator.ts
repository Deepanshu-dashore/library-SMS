/**
 * Software Development Cost Estimator Utility
 * 
 * This utility calculates a professional, industry-grade software cost estimation 
 * using a hybrid bottom-up and parametric estimation model. It takes into account 
 * development effort, planning, feature complexity, lines of code, and professional 
 * overheads (QA, PM, Risk Buffers, and Maintenance).
 */

export type ComplexityLevel = 'low' | 'medium' | 'high' | 'critical';

export interface SoftwareEstimationInput {
  featureCount: number;          // Total estimated features
  linesOfCode: number;           // Estimated target Lines of Code (LOC)
  complexity: ComplexityLevel;   // Technical complexity rating
  approxDevEffortHours: number;  // Estimated pure development hours
  approxPlanningHours: number;   // Estimated discovery, planning & design hours
  
  // Optional parameters with industry-standard defaults
  hourlyRate?: number;           // Standard developer hourly rate (default: 1500 for INR, 75 for USD)
  qaMultiplier?: number;         // Quality Assurance cost ratio (default: 0.20 -> 20% of engineering)
  pmMultiplier?: number;         // Project Management & communication ratio (default: 0.15 -> 15% of engineering)
  riskBufferPercentage?: number; // Safety buffer for unforeseen scope creep (default: 0.20 -> 20%)
  currencyCode?: string;         // ISO Currency Code (default: 'INR')
}

export interface CostBreakdown {
  planningCost: number;
  developmentCost: number;
  complexityPremium: number;
  featureOverheadCost: number;
  locReviewPremium: number;
  engineeringSubtotal: number;
  qaCost: number;
  pmCost: number;
  riskBuffer: number;
  totalEstimatedPrice: number;
  suggestedUpfrontRetainer: number;
  annualMaintenanceCost: number;
}

export interface SoftwareEstimationOutput {
  inputs: Required<SoftwareEstimationInput>;
  calculatedRates: {
    baseHourlyRate: number;
    effectiveHourlyRate: number; // Total price divided by total estimated hours (planning + dev)
  };
  breakdown: CostBreakdown;
  confidenceScore: number;       // Accuracy confidence percentage (0 - 100) based on inputs
  formattedBreakdown: {
    planningCost: string;
    developmentCost: string;
    complexityPremium: string;
    featureOverheadCost: string;
    locReviewPremium: string;
    engineeringSubtotal: string;
    qaCost: string;
    pmCost: string;
    riskBuffer: string;
    totalEstimatedPrice: string;
    suggestedUpfrontRetainer: string;
    annualMaintenanceCost: string;
  };
}

// Complexity scale factor map
const COMPLEXITY_MULTIPLIERS: Record<ComplexityLevel, number> = {
  low: 1.0,
  medium: 1.35,
  high: 1.75,
  critical: 2.50,
};

/**
 * Calculates a detailed software cost estimation based on engineering inputs.
 * 
 * @param input Configuration options for the software cost estimation
 * @returns Comprehensive price breakdown, effective rates, and formatted outputs
 */
export function estimateSoftwareCost(input: SoftwareEstimationInput): SoftwareEstimationOutput {
  // 1. Resolve default values for optional parameters
  const currencyCode = input.currencyCode ?? 'INR';
  const hourlyRate = input.hourlyRate ?? (currencyCode === 'INR' ? 1500 : 75);
  const qaMultiplier = input.qaMultiplier ?? 0.20;
  const pmMultiplier = input.pmMultiplier ?? 0.15;
  const riskBufferPercentage = input.riskBufferPercentage ?? 0.20;

  const completedInputs: Required<SoftwareEstimationInput> = {
    featureCount: Math.max(0, input.featureCount),
    linesOfCode: Math.max(0, input.linesOfCode),
    complexity: input.complexity,
    approxDevEffortHours: Math.max(0, input.approxDevEffortHours),
    approxPlanningHours: Math.max(0, input.approxPlanningHours),
    hourlyRate,
    qaMultiplier,
    pmMultiplier,
    riskBufferPercentage,
    currencyCode,
  };

  // 2. Fetch Complexity Multiplier
  const complexityMult = COMPLEXITY_MULTIPLIERS[input.complexity] ?? 1.0;

  // 3. Base Calculations
  const planningCost = completedInputs.approxPlanningHours * hourlyRate;
  const baseDevCost = completedInputs.approxDevEffortHours * hourlyRate;

  // 4. Complexity Premium (Extra engineering friction for complex architectures)
  const complexityPremium = baseDevCost * (complexityMult - 1.0);

  // 5. Feature Overhead (Features require integrations, routing, state wiring, regression tests)
  // We model 2.5 engineering hours per feature unit adjusted by complexity
  const hoursPerFeature = 2.5;
  const featureOverheadCost = completedInputs.featureCount * hoursPerFeature * hourlyRate * complexityMult;

  // 6. Lines of Code (LOC) Review & Refactoring Premium
  // Larger codebases introduce scaling complexity, documentation overhead and automated testing times.
  // We estimate about 15 hours of review/refactoring overhead per 1000 lines of code written.
  const hoursPerLOC = 15 / 1000;
  const locReviewPremium = completedInputs.linesOfCode * hoursPerLOC * hourlyRate;

  // 7. Subtotals
  const engineeringSubtotal = planningCost + baseDevCost + complexityPremium + featureOverheadCost + locReviewPremium;

  // 8. Overheads (QA & PM)
  const qaCost = engineeringSubtotal * qaMultiplier;
  const pmCost = engineeringSubtotal * pmMultiplier;

  // 9. Risk Contingency Buffer
  const priceBeforeBuffer = engineeringSubtotal + qaCost + pmCost;
  const riskBuffer = priceBeforeBuffer * riskBufferPercentage;

  // 10. Total Estimated Price
  const totalEstimatedPrice = priceBeforeBuffer + riskBuffer;

  // 11. Upfront retainer (industry-standard 30% to secure resource commitment)
  const suggestedUpfrontRetainer = totalEstimatedPrice * 0.30;

  // 12. Annual Maintenance & Support (typically 18% of initial build cost per year)
  const annualMaintenanceCost = totalEstimatedPrice * 0.18;

  // 13. Effective Hourly Rates
  const totalHours = completedInputs.approxPlanningHours + completedInputs.approxDevEffortHours;
  const effectiveHourlyRate = totalHours > 0 ? totalEstimatedPrice / totalHours : hourlyRate;

  // 14. Confidence Score Calculation (0-100%)
  // High variance happens when we estimate huge codebases with tiny hourly estimates, or vice-versa.
  const confidenceScore = calculateConfidenceScore(
    completedInputs.featureCount,
    completedInputs.linesOfCode,
    completedInputs.approxDevEffortHours
  );

  const breakdown: CostBreakdown = {
    planningCost: roundToTwo(planningCost),
    developmentCost: roundToTwo(baseDevCost),
    complexityPremium: roundToTwo(complexityPremium),
    featureOverheadCost: roundToTwo(featureOverheadCost),
    locReviewPremium: roundToTwo(locReviewPremium),
    engineeringSubtotal: roundToTwo(engineeringSubtotal),
    qaCost: roundToTwo(qaCost),
    pmCost: roundToTwo(pmCost),
    riskBuffer: roundToTwo(riskBuffer),
    totalEstimatedPrice: roundToTwo(totalEstimatedPrice),
    suggestedUpfrontRetainer: roundToTwo(suggestedUpfrontRetainer),
    annualMaintenanceCost: roundToTwo(annualMaintenanceCost),
  };

  // Helper for formatting currencies
  const formatCurrency = (val: number) => {
    const locale = currencyCode === 'INR' ? 'en-IN' : 'en-US';
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currencyCode,
      maximumFractionDigits: 0
    }).format(val);
  };

  const formattedBreakdown = {
    planningCost: formatCurrency(breakdown.planningCost),
    developmentCost: formatCurrency(breakdown.developmentCost),
    complexityPremium: formatCurrency(breakdown.complexityPremium),
    featureOverheadCost: formatCurrency(breakdown.featureOverheadCost),
    locReviewPremium: formatCurrency(breakdown.locReviewPremium),
    engineeringSubtotal: formatCurrency(breakdown.engineeringSubtotal),
    qaCost: formatCurrency(breakdown.qaCost),
    pmCost: formatCurrency(breakdown.pmCost),
    riskBuffer: formatCurrency(breakdown.riskBuffer),
    totalEstimatedPrice: formatCurrency(breakdown.totalEstimatedPrice),
    suggestedUpfrontRetainer: formatCurrency(breakdown.suggestedUpfrontRetainer),
    annualMaintenanceCost: formatCurrency(breakdown.annualMaintenanceCost),
  };

  return {
    inputs: completedInputs,
    calculatedRates: {
      baseHourlyRate: hourlyRate,
      effectiveHourlyRate: roundToTwo(effectiveHourlyRate),
    },
    breakdown,
    confidenceScore,
    formattedBreakdown,
  };
}

/**
 * Rounds a number to exactly two decimal places.
 */
function roundToTwo(num: number): number {
  return Math.round((num + Number.EPSILON) * 100) / 100;
}

/**
 * Calculates a model confidence score (0-100) based on input alignment.
 * If the lines of code or feature count don't match up logically with estimated hours,
 * confidence drops because the estimates are conflicting.
 */
function calculateConfidenceScore(features: number, loc: number, hours: number): number {
  if (hours <= 0 || features <= 0) return 30; // Highly speculative

  let baseScore = 95;

  // 1. Average hours per feature sanity check (typically 5 to 40 hours per feature)
  const hoursPerFeature = hours / features;
  if (hoursPerFeature < 2 || hoursPerFeature > 80) {
    baseScore -= 20; // Diverges from realistic scope mapping
  }

  // 2. Average Lines of Code per hour sanity check (typically 10 to 80 lines of code per hour)
  const locPerHour = loc / hours;
  if (locPerHour < 2 || locPerHour > 120) {
    baseScore -= 15; // Diverges from coding velocity norms
  }

  // 3. Absolute size penalty (extremely massive projects are notoriously harder to predict)
  if (hours > 1000) {
    baseScore -= 10;
  }

  return Math.max(10, Math.min(100, baseScore));
}
