import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { generateDeterministicCopilotPlan, askGeminiCopilot } from "@/lib/ai/geminiClient";
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

describe("askGeminiCopilot Complete Lifecycle & Fallback Robustness", () => {
  const originalEnv = process.env.GEMINI_API_KEY;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    process.env.GEMINI_API_KEY = originalEnv;
    vi.restoreAllMocks();
  });

  it("should cleanly fall back to deterministic engine when GEMINI_API_KEY is not configured", async () => {
    delete process.env.GEMINI_API_KEY;
    const plan = await askGeminiCopilot("Can my kids play outside today?", mockAqi, mockProfile);

    expect(plan.isDeterministicFallback).toBe(true);
    expect(plan.recommendation.toLowerCase()).toContain("pediatric");
  });

  it("should successfully parse and return Gemini structured JSON when API responds with 200", async () => {
    process.env.GEMINI_API_KEY = "test-secret-key-12345";

    const mockGeminiResponse = {
      candidates: [
        {
          content: {
            parts: [
              {
                text: JSON.stringify({
                  recommendation: "Stay indoors with True HEPA air purifier on high speed.",
                  reason: "Fine particulate PM2.5 levels of 240 ug/m3 exceed safe thresholds by 16x.",
                  practicalAction: "Seal window edges with damp towels and avoid frying foods indoors.",
                  estimatedImpact: "Reduces acute pulmonary particle deposition by up to 80%.",
                  confidence: "high",
                  sourceReferences: ["WHO AQG 2021", "US EPA Indoor Air Quality Guide"],
                }),
              },
            ],
          },
        },
      ],
    };

    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => mockGeminiResponse,
    } as any);

    const plan = await askGeminiCopilot("How do I stay safe during severe smog?", mockAqi, mockProfile);

    expect(plan.isDeterministicFallback).toBe(false);
    expect(plan.recommendation).toContain("Stay indoors with True HEPA");
    expect(plan.confidence).toBe("high");
    expect(plan.sourceReferences).toContain("WHO AQG 2021");
  });

  it("should successfully extract JSON when Gemini wraps response in markdown code blocks", async () => {
    process.env.GEMINI_API_KEY = "test-secret-key-12345";

    const rawMarkdownJson = `\`\`\`json
{
  "recommendation": "Use N95 respirator during commute.",
  "reason": "Severe ambient inversion trapped particulate matter near ground.",
  "practicalAction": "Switch to metro transit rather than walking.",
  "confidence": "high",
  "sourceReferences": ["CPCB Guidelines"]
}
\`\`\``;

    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({
        candidates: [{ content: { parts: [{ text: rawMarkdownJson }] } }],
      }),
    } as any);

    const plan = await askGeminiCopilot("What commute method is safe?", mockAqi, mockProfile);

    expect(plan.isDeterministicFallback).toBe(false);
    expect(plan.recommendation).toBe("Use N95 respirator during commute.");
  });

  it("should engage deterministic fallback when Gemini API returns HTTP 429 or 500 error", async () => {
    process.env.GEMINI_API_KEY = "test-secret-key-12345";

    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: false,
      status: 429,
      json: async () => ({ error: { message: "Quota exceeded" } }),
    } as any);

    const plan = await askGeminiCopilot("Is it safe to run outdoors?", mockAqi, mockProfile);

    expect(plan.isDeterministicFallback).toBe(true);
    expect(plan.recommendation.toLowerCase()).toContain("cancel all outdoor");
  });

  it("should engage deterministic fallback when Gemini API times out with AbortError", async () => {
    process.env.GEMINI_API_KEY = "test-secret-key-12345";

    vi.spyOn(globalThis, "fetch").mockRejectedValueOnce(
      Object.assign(new Error("The operation was aborted"), { name: "AbortError" })
    );

    const plan = await askGeminiCopilot("When should we open windows?", mockAqi, mockProfile);

    expect(plan.isDeterministicFallback).toBe(true);
    expect(plan.recommendation.toLowerCase()).toContain("sealed");
  });

  it("should engage deterministic fallback when Gemini API returns malformed unparseable text", async () => {
    process.env.GEMINI_API_KEY = "test-secret-key-12345";

    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({
        candidates: [{ content: { parts: [{ text: "This is not valid JSON at all!" }] } }],
      }),
    } as any);

    const plan = await askGeminiCopilot("Should children go to school?", mockAqi, mockProfile);

    expect(plan.isDeterministicFallback).toBe(true);
    expect(plan.recommendation.toLowerCase()).toContain("pediatric");
  });
});
