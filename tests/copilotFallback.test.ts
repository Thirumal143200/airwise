import { describe, it, expect } from "vitest";
import { generateDeterministicCopilotPlan } from "@/lib/ai/geminiClient";
import { AirQualityData, UserProfile } from "@/types";

const mockAqi: AirQualityData = {
  location: { name: "Delhi", city: "Delhi", country: "India", lat: 28.61, lng: 77.2 },
  aqi: 340,
  scale: "IN_CPCB",
  tier: "severe",
  tierLabel: "Severe Smog",
  healthSummary: "High health risk",
  dominantPollutant: "PM2.5",
  pollutants: {
    pm25: { name: "PM2.5", chemicalFormula: "PM2.5", value: 240, unit: "µg/m³", whoGuideline24h: 15, status: "hazardous", healthImplications: "Lung deep penetration" },
    pm10: { name: "PM10", chemicalFormula: "PM10", value: 380, unit: "µg/m³", whoGuideline24h: 45, status: "hazardous", healthImplications: "Airway irritation" },
    no2: { name: "NO2", chemicalFormula: "NO₂", value: 90, unit: "µg/m³", whoGuideline24h: 25, status: "unhealthy", healthImplications: "Inflammation" },
    so2: { name: "SO2", chemicalFormula: "SO₂", value: 20, unit: "µg/m³", whoGuideline24h: 40, status: "safe", healthImplications: "Safe" },
    co: { name: "CO", chemicalFormula: "CO", value: 2.5, unit: "mg/m³", whoGuideline24h: 4, status: "safe", healthImplications: "Safe" },
    o3: { name: "O3", chemicalFormula: "O₃", value: 40, unit: "µg/m³", whoGuideline24h: 100, status: "safe", healthImplications: "Safe" },
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
  dailyCommuteKm: 12,
  exerciseHabit: "morning_outdoor",
  budgetTier: "low_cost",
  hasAirPurifier: true,
  hasExhaustFan: true,
  hasVulnerableMember: true,
};

describe("GenAI Copilot Deterministic Fallback Engine", () => {
  it("should return valid structured response with recommendation, reason, and action for running queries", () => {
    const plan = generateDeterministicCopilotPlan("Can I go for an outdoor run this morning?", mockAqi, mockProfile);

    expect(plan.recommendation.toLowerCase()).toContain("cancel all outdoor");
    expect(plan.reason).toContain("minute ventilation volume");
    expect(plan.practicalAction.toLowerCase()).toContain("indoors");
    expect(plan.isDeterministicFallback).toBe(true);
    expect(plan.confidence).toBe("high");
    expect(plan.sourceReferences.length).toBeGreaterThan(0);
  });

  it("should prioritize pediatric safety for child or school sports questions", () => {
    const plan = generateDeterministicCopilotPlan("Should my 6-year-old child attend outdoor school sports today?", mockAqi, mockProfile);

    expect(plan.recommendation.toLowerCase()).toContain("pediatric");
    expect(plan.reason.toLowerCase()).toContain("children breathe 50% more air");
    expect(plan.practicalAction.toLowerCase()).toContain("suspend outdoor sports");
    expect(plan.isDeterministicFallback).toBe(true);
  });

  it("should provide actionable guidance for ventilation and window inquiries", () => {
    const plan = generateDeterministicCopilotPlan("When should we open windows to ventilate the home?", mockAqi, mockProfile);

    expect(plan.recommendation.toLowerCase()).toContain("sealed");
    expect(plan.practicalAction).toContain("1:00 PM and 2:30 PM");
    expect(plan.isDeterministicFallback).toBe(true);
  });
});
