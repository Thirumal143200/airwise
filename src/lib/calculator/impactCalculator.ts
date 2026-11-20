import { CommuteMode, ImpactCalculationInput, ImpactCalculationResult } from "@/types";

/**
 * Standardized Emission Factors (kg CO2e per passenger-kilometer)
 * Sources:
 * - UK Department for Environment, Food & Rural Affairs (DEFRA) 2024 Greenhouse Gas Conversion Factors
 * - ARAI (Automotive Research Association of India) Average Urban Fleet Emission Factors (2022-2023)
 * - US EPA GHG Emission Factors for Greenhouse Gas Inventories (2024 update)
 */
const EMISSION_FACTORS: Record<
  CommuteMode | "metro_train" | "electric_bus" | "carpool_4" | "work_from_home",
  { kgCo2ePerKm: number; fuelLitersPerKm: number; sourceNote: string }
> = {
  private_car_petrol: {
    kgCo2ePerKm: 0.192, // ~192 g CO2e/km (average petrol car, 1 occupant)
    fuelLitersPerKm: 0.08, // ~12.5 km/liter
    sourceNote: "DEFRA 2024 Conversion Factors (Average petrol passenger car, including Well-to-Tank life-cycle; ARAI urban congestion reference: ~192 g CO2e/p-km)",
  },
  private_car_diesel: {
    kgCo2ePerKm: 0.171, // ~171 g CO2e/km (diesel car, 1 occupant)
    fuelLitersPerKm: 0.065, // ~15.4 km/liter
    sourceNote: "DEFRA 2024 Conversion Factors (Diesel mid-size car, single occupant; ARAI urban baseline)",
  },
  two_wheeler: {
    kgCo2ePerKm: 0.068, // ~68 g CO2e/km (motorcycle / scooter)
    fuelLitersPerKm: 0.025, // ~40 km/liter
    sourceNote: "ARAI 2023 / CPCB Urban Two-Wheeler 4-stroke benchmark",
  },
  public_metro_bus: {
    kgCo2ePerKm: 0.038, // average public metro/bus per passenger-km
    fuelLitersPerKm: 0.0,
    sourceNote: "Delhi Metro DMRC Clean Development Mechanism / DEFRA 2024 Heavy Rail",
  },
  walking_cycling: {
    kgCo2ePerKm: 0.0,
    fuelLitersPerKm: 0.0,
    sourceNote: "Active mobility zero direct operational tailpipe emissions",
  },
  work_from_home: {
    kgCo2ePerKm: 0.0,
    fuelLitersPerKm: 0.0,
    sourceNote: "Zero commuting transit emissions (net household heating/cooling variance not modeled)",
  },
  metro_train: {
    kgCo2ePerKm: 0.028, // High-efficiency electric urban metro
    fuelLitersPerKm: 0.0,
    sourceNote: "Central Electricity Authority (CEA) Grid Intensity + DMRC CDM Carbon Credits Baseline 2023",
  },
  electric_bus: {
    kgCo2ePerKm: 0.035, // Electric bus with Indian/global average grid mix
    fuelLitersPerKm: 0.0,
    sourceNote: "Convergent Energy & Resources Institute / ARAI E-Bus Life-Cycle Audit",
  },
  carpool_4: {
    kgCo2ePerKm: 0.048, // Petrol car shared across 4 passengers (0.192 / 4)
    fuelLitersPerKm: 0.02,
    sourceNote: "Calculated: baseline private car divided by 4-person occupancy factor",
  },
};

export function calculateEnvironmentalImpact(
  input: ImpactCalculationInput
): ImpactCalculationResult {
  const { commuteMode, distanceKm, alternativeMode, daysPerWeek } = input;

  const baseline = EMISSION_FACTORS[commuteMode] || EMISSION_FACTORS.private_car_petrol;
  const replacement = EMISSION_FACTORS[alternativeMode] || EMISSION_FACTORS.metro_train;

  // Round-trip daily distance
  const dailyDistanceKm = distanceKm * 2;
  const weeklyDistanceKm = dailyDistanceKm * Math.max(1, Math.min(7, daysPerWeek));
  const annualDistanceKm = weeklyDistanceKm * 48; // assuming 48 working weeks

  // Differences per kilometer
  const deltaCo2ePerKm = Math.max(0, baseline.kgCo2ePerKm - replacement.kgCo2ePerKm);
  const deltaFuelPerKm = Math.max(0, baseline.fuelLitersPerKm - replacement.fuelLitersPerKm);

  // Daily savings
  const dailyCo2eAvoidedKg = Number((dailyDistanceKm * deltaCo2ePerKm).toFixed(2));
  const dailyFuelSavedLiters = Number((dailyDistanceKm * deltaFuelPerKm).toFixed(2));

  // Annual savings
  const annualCo2eAvoidedKg = Number((annualDistanceKm * deltaCo2ePerKm).toFixed(1));

  // Equivalent mature tree absorption benchmark:
  // US EPA standard: ~21.77 kg CO2 absorbed per urban mature tree per year
  const equivalentTrees = Number((annualCo2eAvoidedKg / 21.77).toFixed(1));

  // Avoided trips per week
  const tripsAvoidedPerWeek = alternativeMode === "work_from_home" ? daysPerWeek * 2 : 0;

  const formulaExplained =
    `Avoided Daily CO₂e = Daily Distance (2 × ${distanceKm} km = ${dailyDistanceKm} km) × ` +
    `[Baseline Emission Factor (${baseline.kgCo2ePerKm.toFixed(3)} kg/p-km) − Alternative Emission Factor (${replacement.kgCo2ePerKm.toFixed(3)} kg/p-km)] ` +
    `= ${dailyDistanceKm} km × ${deltaCo2ePerKm.toFixed(3)} kg/km = ${dailyCo2eAvoidedKg} kg CO₂e/day.`;

  return {
    avoidedDistanceKm: dailyDistanceKm,
    fuelSavedLiters: dailyFuelSavedLiters,
    co2eAvoidedKg: dailyCo2eAvoidedKg,
    annualCo2eAvoidedKg,
    equivalentTreesPlanted: equivalentTrees,
    tripsAvoided: tripsAvoidedPerWeek,
    formulaExplained,
    emissionFactorSource: `${baseline.sourceNote} compared with ${replacement.sourceNote}`,
    emissionFactorValue: `Baseline: ${baseline.kgCo2ePerKm} kg/km | Alternative: ${replacement.kgCo2ePerKm} kg/km`,
    isMeasuredOrEstimated: "estimated",
    uncertaintyMargin: "± 12–18% (Accounts for variations in traffic idling, vehicle age, tire pressure, and local electrical grid carbon intensity)",
    healthContextDisclaimer:
      "IMPORTANT SCIENTIFIC DISTINCTION: Avoided CO₂e represents planetary climate mitigation and long-term greenhouse gas reduction. It does NOT automatically equal an immediate, measurable reduction in local roadside PM2.5 or personal toxic exposure for that specific morning. Individual health protection requires proper indoor filtration, air-recirculation in vehicles, and N95 masks when outside.",
  };
}
