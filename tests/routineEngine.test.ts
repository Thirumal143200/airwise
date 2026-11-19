import { describe, it, expect } from "vitest";
import { generateDailyRoutine } from "@/lib/routine/routineEngine";
import { AirQualityData, UserProfile } from "@/types";

const mockSevereAqiData: AirQualityData = {
  location: { name: "Delhi", city: "Delhi", country: "India", lat: 28.61, lng: 77.2 },
  aqi: 385,
  scale: "IN_CPCB",
  tier: "severe",
  tierLabel: "Severe Smog Emergency",
  healthSummary: "Affects healthy people and seriously impacts sensitive groups.",
  dominantPollutant: "PM2.5",
  pollutants: {
    pm25: { name: "PM2.5", chemicalFormula: "PM2.5", value: 260, unit: "µg/m³", whoGuideline24h: 15, status: "hazardous", healthImplications: "Deep alveolar penetration" },
    pm10: { name: "PM10", chemicalFormula: "PM10", value: 390, unit: "µg/m³", whoGuideline24h: 45, status: "hazardous", healthImplications: "Upper airway irritation" },
    no2: { name: "NO2", chemicalFormula: "NO₂", value: 85, unit: "µg/m³", whoGuideline24h: 25, status: "unhealthy", healthImplications: "Airway inflammation" },
    so2: { name: "SO2", chemicalFormula: "SO₂", value: 20, unit: "µg/m³", whoGuideline24h: 40, status: "safe", healthImplications: "Safe" },
    co: { name: "CO", chemicalFormula: "CO", value: 2.1, unit: "mg/m³", whoGuideline24h: 4, status: "safe", healthImplications: "Safe" },
    o3: { name: "O3", chemicalFormula: "O₃", value: 35, unit: "µg/m³", whoGuideline24h: 100, status: "safe", healthImplications: "Safe" },
  },
  hourlyForecast: [],
  timestamp: new Date().toISOString(),
  source: "Open-Meteo",
  dataSourceType: "atmospheric_model",
  dataFreshness: "live",
  limitations: [],
};

const mockProfile: UserProfile = {
  householdType: "family_with_kids",
  commuteMode: "private_car_petrol",
  dailyCommuteKm: 15,
  exerciseHabit: "morning_outdoor",
  budgetTier: "low_cost",
  hasAirPurifier: true,
  hasExhaustFan: true,
  hasVulnerableMember: true,
};

describe("Personalized Daily Routine Engine", () => {
  it("should generate 4 complete time slots covering morning, midday, evening, and night", () => {
    const slots = generateDailyRoutine(mockSevereAqiData, mockProfile);
    expect(slots).toHaveLength(4);
    expect(slots.map((s) => s.timeSlot)).toEqual(["morning", "midday", "evening", "night"]);
  });

  it("should enforce morning outdoor exercise cancellation during Severe AQI", () => {
    const slots = generateDailyRoutine(mockSevereAqiData, mockProfile);
    const morningSlot = slots.find((s) => s.timeSlot === "morning");
    expect(morningSlot).toBeDefined();
    expect(morningSlot?.riskLevel).toBe("severe");
    expect(morningSlot?.whatToDo.toLowerCase()).toContain("cancel");
    expect(morningSlot?.whySuggested.toLowerCase()).toContain("inversion");
  });

  it("should identify the midday solar convection window for necessary errands", () => {
    const slots = generateDailyRoutine(mockSevereAqiData, mockProfile);
    const middaySlot = slots.find((s) => s.timeSlot === "midday");
    expect(middaySlot).toBeDefined();
    expect(middaySlot?.timeLabel).toContain("11:30 AM");
    expect(middaySlot?.whySuggested.toLowerCase()).toContain("boundary layer");
  });

  it("should verify that every routine card satisfies all 6 challenge required fields", () => {
    const slots = generateDailyRoutine(mockSevereAqiData, mockProfile);
    for (const slot of slots) {
      expect(slot.whatToDo.trim().length).toBeGreaterThan(10);
      expect(slot.whySuggested.trim().length).toBeGreaterThan(10);
      expect(slot.whenMostUseful.trim().length).toBeGreaterThan(5);
      expect(slot.alternativeOption.trim().length).toBeGreaterThan(5);
      expect(slot.likelyBenefit.trim().length).toBeGreaterThan(10);
      expect(slot.importantLimitation.trim().length).toBeGreaterThan(10);
    }
  });
});
