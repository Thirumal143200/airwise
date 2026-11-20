import { describe, it, expect } from "vitest";
import {
  computeCpcbSubIndexPm25,
  computeCpcbSubIndexPm10,
  computeCpcbSubIndexNo2,
  computeCpcbSubIndexSo2,
  computeCpcbSubIndexCo,
  computeCpcbSubIndexO3,
  computeEpaSubIndexPm25,
  computeEpaSubIndexPm10,
  calculateOverallAQI,
  getTierFromAQI,
} from "@/lib/environmental/aqiScales";

describe("AQI Calculation Scales & Breakpoints", () => {
  it("should correctly calculate CPCB PM2.5 sub-index across breakpoints", () => {
    // 0 ug/m3 -> 0
    expect(computeCpcbSubIndexPm25(0)).toBe(0);

    // 30 ug/m3 -> 50 (upper bound of Good)
    expect(computeCpcbSubIndexPm25(30)).toBe(50);

    // 60 ug/m3 -> 100 (upper bound of Satisfactory)
    expect(computeCpcbSubIndexPm25(60)).toBe(100);

    // 90 ug/m3 -> 200 (upper bound of Moderate)
    expect(computeCpcbSubIndexPm25(90)).toBe(200);

    // 120 ug/m3 -> 300 (upper bound of Poor)
    expect(computeCpcbSubIndexPm25(120)).toBe(300);

    // 250 ug/m3 -> 400 (upper bound of Very Poor)
    expect(computeCpcbSubIndexPm25(250)).toBe(400);

    // 380 ug/m3 -> Severe range (401-500)
    const severeVal = computeCpcbSubIndexPm25(380);
    expect(severeVal).toBeGreaterThan(400);
    expect(severeVal).toBeLessThanOrEqual(500);
  });

  it("should handle continuous float concentrations without falling into breakpoint gaps", () => {
    // 30.5 ug/m3 falls between 30 and 60 -> should return ~51-52, NOT 0
    const val30_5 = computeCpcbSubIndexPm25(30.5);
    expect(val30_5).toBeGreaterThan(50);
    expect(val30_5).toBeLessThanOrEqual(55);

    // 60.5 ug/m3 falls between 60 and 90 -> should return ~102-105, NOT 0
    const val60_5 = computeCpcbSubIndexPm25(60.5);
    expect(val60_5).toBeGreaterThan(100);
    expect(val60_5).toBeLessThanOrEqual(105);
  });

  it("should compute sub-indices for SO2, CO, and O3", () => {
    // SO2: 40 ug/m3 -> 50
    expect(computeCpcbSubIndexSo2(40)).toBe(50);

    // CO: 1.0 mg/m3 -> 50, 2.0 mg/m3 -> 100
    expect(computeCpcbSubIndexCo(1.0)).toBe(50);
    expect(computeCpcbSubIndexCo(2.0)).toBe(100);

    // O3: 50 ug/m3 -> 50, 100 ug/m3 -> 100
    expect(computeCpcbSubIndexO3(50)).toBe(50);
    expect(computeCpcbSubIndexO3(100)).toBe(100);
  });

  it("should calculate US EPA PM2.5 AQI breakpoints", () => {
    // 12.0 ug/m3 -> 50
    expect(computeEpaSubIndexPm25(12.0)).toBe(50);

    // 35.4 ug/m3 -> 100
    expect(computeEpaSubIndexPm25(35.4)).toBe(100);

    // 55.4 ug/m3 -> 150
    expect(computeEpaSubIndexPm25(55.4)).toBe(150);

    // EPA PM10: 54 -> 50, 154 -> 100
    expect(computeEpaSubIndexPm10(54)).toBe(50);
    expect(computeEpaSubIndexPm10(154)).toBe(100);
  });

  it("should determine overall AQI and dominant pollutant according to CPCB max-index rule across all pollutants", () => {
    const readings = {
      pm25: 110, // Poor (~260-280)
      pm10: 80,  // Satisfactory (~80)
      no2: 30,   // Good (~35)
      so2: 15,   // Good (~19)
      co: 1.5,   // Satisfactory (~76)
      o3: 40,    // Good (~40)
    };

    const result = calculateOverallAQI(readings, "IN_CPCB");
    expect(result.dominantPollutant).toBe("PM2.5");
    expect(result.aqi).toBeGreaterThan(200);
    expect(result.subIndices["SO2"]).toBeDefined();
    expect(result.subIndices["CO"]).toBeDefined();
    expect(result.subIndices["O3"]).toBeDefined();
  });

  it("should assign correct tier labels and health implications", () => {
    const good = getTierFromAQI(40, "IN_CPCB");
    expect(good.tier).toBe("good");
    expect(good.maskRecommended).toBe(false);
    expect(good.schoolOutdoorSafe).toBe(true);

    const severe = getTierFromAQI(385, "IN_CPCB");
    expect(severe.tier).toBe("severe");
    expect(severe.maskRecommended).toBe(true);
    expect(severe.schoolOutdoorSafe).toBe(false);
  });
});
