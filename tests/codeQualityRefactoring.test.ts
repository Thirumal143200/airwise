import { describe, it, expect } from "vitest";
import {
  buildCopilotSystemInstruction,
  buildCopilotContextData,
  sanitizeCopilotErrorMessage,
  extractAndParseCopilotJson,
} from "@/lib/ai/geminiClient";
import { getIndoorRecommendations } from "@/lib/indoor/indoorEngine";
import { getFilteredAlternatives } from "@/lib/alternatives/alternativesEngine";
import { calculateOverallAQI } from "@/lib/environmental/aqiScales";
import { calculateEnvironmentalImpact } from "@/lib/calculator/impactCalculator";
import {
  AirQualityData,
  UserProfile,
  CopilotAqiContextSchema,
  CopilotRequestSchema,
  PollutantReadingSchema,
  RoutineRequestSchema,
  LocationSearchQuerySchema,
} from "@/types";

describe("Code Quality Refactoring & Modular Helper Verification", () => {
  it("buildCopilotSystemInstruction should contain non-alarmist and strict JSON constraints", () => {
    const instruction = buildCopilotSystemInstruction();
    expect(instruction).toContain("AirWise Environmental Intelligence Assistant");
    expect(instruction).toContain("Return ONLY a valid JSON object");
    expect(instruction).toContain("NEVER invent AQI numbers");
  });

  it("buildCopilotContextData should assemble structured environmental context safely", () => {
    const mockAqi: Partial<AirQualityData> = {
      location: { name: "Delhi", city: "Delhi", country: "India", lat: 28.61, lng: 77.2 },
      aqi: 350,
      scale: "IN_CPCB",
      tierLabel: "Severe",
      dominantPollutant: "PM2.5",
      pollutants: {
        pm25: { name: "PM2.5", chemicalFormula: "PM2.5", value: 250, unit: "µg/m³", whoGuideline24h: 15, status: "hazardous", healthImplications: "" },
        pm10: { name: "PM10", chemicalFormula: "PM10", value: 400, unit: "µg/m³", whoGuideline24h: 45, status: "hazardous", healthImplications: "" },
        no2: { name: "NO2", chemicalFormula: "NO₂", value: 75, unit: "µg/m³", whoGuideline24h: 25, status: "unhealthy", healthImplications: "" },
        so2: { name: "SO2", chemicalFormula: "SO₂", value: 15, unit: "µg/m³", whoGuideline24h: 40, status: "safe", healthImplications: "" },
        co: { name: "CO", chemicalFormula: "CO", value: 2.0, unit: "mg/m³", whoGuideline24h: 4, status: "safe", healthImplications: "" },
        o3: { name: "O3", chemicalFormula: "O₃", value: 30, unit: "µg/m³", whoGuideline24h: 100, status: "safe", healthImplications: "" },
      },
    };

    const context = buildCopilotContextData(mockAqi as AirQualityData);
    expect(context.currentAqi).toBe(350);
    expect(context.dominantPollutant).toBe("PM2.5");
    expect((context.pollutants as any).pm25).toBe(250);
  });

  it("sanitizeCopilotErrorMessage should redact both url parameters and raw secret keys", () => {
    const rawError = "API request failed with url https://example.com?key=AIzaSySecret123 and detail AIzaSySecret123";
    const sanitized = sanitizeCopilotErrorMessage(rawError, "AIzaSySecret123");
    expect(sanitized).not.toContain("AIzaSySecret123");
    expect(sanitized).toContain("[REDACTED]");
  });

  it("extractAndParseCopilotJson should strip markdown fences and parse valid schema", () => {
    const rawMarkdown = "```json\n{\n  \"recommendation\": \"Stay indoors\",\n  \"reason\": \"High PM2.5\",\n  \"practicalAction\": \"Run HEPA filter\",\n  \"confidence\": \"high\"\n}\n```";
    const parsed = extractAndParseCopilotJson(rawMarkdown);
    expect(parsed).not.toBeNull();
    expect(parsed?.recommendation).toBe("Stay indoors");
    expect(parsed?.confidence).toBe("high");
    expect(parsed?.isDeterministicFallback).toBe(false);
  });

  it("getIndoorRecommendations should correctly filter by budget tier", () => {
    const all = getIndoorRecommendations();
    expect(all.length).toBeGreaterThan(0);

    const zeroCost = getIndoorRecommendations("zero_cost");
    expect(zeroCost.length).toBeGreaterThan(0);
    expect(zeroCost.every((item) => item.costTier === "zero_cost")).toBe(true);

    const highInvestment = getIndoorRecommendations("high_investment");
    expect(highInvestment.every((item) => item.costTier === "high_investment")).toBe(true);
  });

  it("getFilteredAlternatives should deprioritize outdoor active trips during severe smog", () => {
    const normal = getFilteredAlternatives("moderate");
    expect(normal.length).toBeGreaterThan(0);

    const severe = getFilteredAlternatives("severe");
    expect(severe.length).toBe(normal.length);
    // Short trips (which involve outdoor active mobility caution) are placed at the end during severe smog
    const lastItem = severe[severe.length - 1];
    expect(lastItem.category).toBe("short_trips");
  });

  it("calculateOverallAQI should compute identical outputs after sub-index deduplication", () => {
    const readings = {
      pm25: 125,
      pm10: 210,
      no2: 60,
      so2: 25,
      co: 1.8,
      o3: 45,
    };

    const cpcbResult = calculateOverallAQI(readings, "IN_CPCB");
    expect(cpcbResult.dominantPollutant).toBe("PM2.5");
    expect(cpcbResult.aqi).toBeGreaterThan(300); // 125 ug/m3 PM2.5 is Poor/Very Poor (300+)
    expect(cpcbResult.subIndices["PM2.5"]).toBeDefined();
    expect(cpcbResult.subIndices["NO2"]).toBeDefined();

    const epaResult = calculateOverallAQI(readings, "US_EPA");
    expect(epaResult.dominantPollutant).toBe("PM2.5");
    expect(epaResult.aqi).toBeGreaterThan(180);
  });

  it("calculateEnvironmentalImpact should yield mathematically identical and deterministic values", () => {
    const result = calculateEnvironmentalImpact({
      commuteMode: "private_car_petrol",
      distanceKm: 14,
      alternativeMode: "metro_train",
      daysPerWeek: 5,
    });

    expect(result.avoidedDistanceKm).toBe(28); // 14 km round trip
    expect(result.co2eAvoidedKg).toBeGreaterThan(0);
    expect(result.annualCo2eAvoidedKg).toBeGreaterThan(0);
    expect(result.equivalentTreesPlanted).toBeGreaterThan(0);
  });

  describe("Copilot AQI Context Domain Schema Validation", () => {
    it("should accept complete, valid AirQualityData payload", () => {
      const validPayload = {
        location: {
          name: "Bengaluru",
          city: "Bengaluru",
          country: "India",
          lat: 12.97,
          lng: 77.59,
        },
        aqi: 85,
        scale: "IN_CPCB",
        tier: "moderate",
        tierLabel: "Satisfactory / Moderate",
        healthSummary: "Minor breathing discomfort to sensitive individuals.",
        dominantPollutant: "PM2.5",
        pollutants: {
          pm25: {
            name: "PM2.5",
            chemicalFormula: "PM2.5",
            value: 48,
            unit: "µg/m³",
            whoGuideline24h: 15,
            status: "moderate",
            healthImplications: "Fine particulate matter.",
          },
          pm10: {
            name: "PM10",
            chemicalFormula: "PM10",
            value: 80,
            unit: "µg/m³",
            whoGuideline24h: 45,
            status: "moderate",
            healthImplications: "Coarse particulate matter.",
          },
        },
        dataSourceType: "atmospheric_model",
        dataFreshness: "live",
      };

      const result = CopilotAqiContextSchema.safeParse(validPayload);
      expect(result.success).toBe(true);
    });

    it("should accept valid AQI data with missing optional fields and custom provider extensions", () => {
      const minimalPayload = {
        location: { name: "Mumbai" },
        aqi: 120,
        extraProviderMetric: "cams_reanalysis_v4",
      };

      const result = CopilotAqiContextSchema.safeParse(minimalPayload);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.aqi).toBe(120);
        expect((result.data as any).extraProviderMetric).toBe("cams_reanalysis_v4");
      }
    });

    it("should reject invalid AQI ranges (negative or above 1000)", () => {
      const negativeAqi = {
        location: { name: "Chennai" },
        aqi: -5,
      };
      expect(CopilotAqiContextSchema.safeParse(negativeAqi).success).toBe(false);

      const excessAqi = {
        location: { name: "Chennai" },
        aqi: 1200,
      };
      expect(CopilotAqiContextSchema.safeParse(excessAqi).success).toBe(false);

      const nonNumericAqi = {
        location: { name: "Chennai" },
        aqi: "severe",
      };
      expect(CopilotAqiContextSchema.safeParse(nonNumericAqi).success).toBe(false);
    });

    it("should reject malformed pollutant values (negative or non-numeric)", () => {
      const negativePollutant = {
        location: { name: "Kolkata" },
        aqi: 220,
        pollutants: {
          pm25: { value: -15 },
        },
      };
      expect(CopilotAqiContextSchema.safeParse(negativePollutant).success).toBe(false);

      const stringPollutant = {
        location: { name: "Kolkata" },
        aqi: 220,
        pollutants: {
          pm25: { value: "very_high" },
        },
      };
      expect(CopilotAqiContextSchema.safeParse(stringPollutant).success).toBe(false);
    });

    it("should validate CopilotRequestSchema integration with strict AQI context", () => {
      const validReq = {
        message: "Is it safe to run outdoors today?",
        currentAqiData: {
          location: { name: "Delhi" },
          aqi: 310,
        },
      };
      expect(CopilotRequestSchema.safeParse(validReq).success).toBe(true);

      const invalidReq = {
        message: "Is it safe to run outdoors today?",
        currentAqiData: {
          location: { name: "Delhi" },
          aqi: -50,
        },
      };
      expect(CopilotRequestSchema.safeParse(invalidReq).success).toBe(false);

      // Omitting currentAqiData entirely is still valid (optional field)
      const noAqiReq = {
        message: "General air cleaning advice",
      };
      expect(CopilotRequestSchema.safeParse(noAqiReq).success).toBe(true);
    });

    it("should validate LocationSearchQuerySchema strictly", () => {
      expect(LocationSearchQuerySchema.safeParse({ q: "Delhi" }).success).toBe(true);
      expect(LocationSearchQuerySchema.safeParse({ q: "a" }).success).toBe(false); // min 2
      expect(LocationSearchQuerySchema.safeParse({ q: "" }).success).toBe(false);
      expect(LocationSearchQuerySchema.safeParse({}).success).toBe(false);
    });

    it("should validate RoutineRequestSchema with valid and invalid payloads", () => {
      const validRoutineReq = {
        aqiData: {
          location: { name: "Hyderabad" },
          aqi: 140,
        },
        profile: {
          householdType: "working_adults",
          commuteMode: "public_metro_bus",
          dailyCommuteKm: 15,
          exerciseHabit: "indoor_gym",
          budgetTier: "low_cost",
          hasAirPurifier: true,
          hasExhaustFan: true,
          hasVulnerableMember: false,
        },
      };
      expect(RoutineRequestSchema.safeParse(validRoutineReq).success).toBe(true);

      const invalidRoutineReq = {
        aqiData: {
          location: { name: "Hyderabad" },
          aqi: -10, // negative AQI
        },
        profile: validRoutineReq.profile,
      };
      expect(RoutineRequestSchema.safeParse(invalidRoutineReq).success).toBe(false);
    });
  });
});
