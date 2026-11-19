import { describe, it, expect } from "vitest";
import { calculateEnvironmentalImpact } from "@/lib/calculator/impactCalculator";

describe("Transparent Environmental Impact Calculator", () => {
  it("should calculate correct avoided emissions for petrol car to electric metro shift", () => {
    // 10 km one-way = 20 km round-trip daily
    // Petrol car: 0.192 kg/km, Metro: 0.028 kg/km -> Delta = 0.164 kg/km
    // Daily CO2 avoided = 20 * 0.164 = 3.28 kg CO2e
    const result = calculateEnvironmentalImpact({
      distanceKm: 10,
      commuteMode: "private_car_petrol",
      alternativeMode: "metro_train",
      daysPerWeek: 5,
    });

    expect(result.avoidedDistanceKm).toBe(20);
    expect(result.co2eAvoidedKg).toBe(3.28);
    expect(result.annualCo2eAvoidedKg).toBeCloseTo(3.28 * 5 * 48, 0);
    expect(result.isMeasuredOrEstimated).toBe("estimated");
  });

  it("should calculate equivalent mature tree absorption using EPA 21.77 kg benchmark", () => {
    const result = calculateEnvironmentalImpact({
      distanceKm: 15,
      commuteMode: "private_car_petrol",
      alternativeMode: "metro_train",
      daysPerWeek: 5,
    });

    // ~1180 kg annual / 21.77 ~= 54 trees
    expect(result.equivalentTreesPlanted).toBeGreaterThan(0);
    expect(result.equivalentTreesPlanted).toBeCloseTo(result.annualCo2eAvoidedKg / 21.77, 0);
  });

  it("should explicitly include transparent formula, emission sources, and health distinction", () => {
    const result = calculateEnvironmentalImpact({
      distanceKm: 8,
      commuteMode: "private_car_diesel",
      alternativeMode: "electric_bus",
      daysPerWeek: 4,
    });

    expect(result.formulaExplained).toContain("Avoided Daily CO₂e =");
    expect(result.emissionFactorSource).toContain("DEFRA");
    expect(result.uncertaintyMargin).toContain("±");
    expect(result.healthContextDisclaimer.toLowerCase()).toContain("co₂e represents planetary climate");
    expect(result.healthContextDisclaimer.toLowerCase()).toContain("does not automatically equal an immediate");
  });

  it("should handle boundary condition of zero distance or minimum distance gracefully", () => {
    const result = calculateEnvironmentalImpact({
      distanceKm: 0.5,
      commuteMode: "two_wheeler",
      alternativeMode: "carpool_4",
      daysPerWeek: 1,
    });

    expect(result.avoidedDistanceKm).toBe(1);
    expect(result.co2eAvoidedKg).toBeGreaterThanOrEqual(0);
  });
});
