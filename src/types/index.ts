import { z } from "zod";

// ==========================================
// 1. Environmental & Air Quality Data Types
// ==========================================

export type AirQualityScale = "IN_CPCB" | "US_EPA" | "EU_AQI" | "WHO";

export type AirQualityTier =
  | "good"
  | "moderate"
  | "poor"
  | "very_poor"
  | "severe"
  | "hazardous";

export interface PollutantReading {
  name: string;
  chemicalFormula: string;
  value: number; // in ug/m3 or mg/m3
  unit: string;
  whoGuideline24h: number;
  subIndex?: number;
  status: "safe" | "moderate" | "unhealthy" | "hazardous";
  healthImplications: string;
}

export interface HourlyForecastPoint {
  time: string; // ISO or "09:00"
  aqi: number;
  pm25: number;
  pm10: number;
  tier: AirQualityTier;
  recommendedOutdoorAction: "safe" | "limit_heavy" | "avoid_all";
}

export interface GeocodingResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string;
}

export interface OpenMeteoGeocodingItem {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string;
}

export interface AirQualityData {
  location: {
    name: string;
    city: string;
    state?: string;
    country: string;
    lat: number;
    lng: number;
  };
  aqi: number;
  scale: AirQualityScale;
  tier: AirQualityTier;
  tierLabel: string;
  healthSummary: string;
  dominantPollutant: string;
  pollutants: {
    pm25: PollutantReading;
    pm10: PollutantReading;
    no2: PollutantReading;
    so2: PollutantReading;
    co: PollutantReading;
    o3: PollutantReading;
  };
  hourlyForecast: HourlyForecastPoint[];
  timestamp: string; // ISO string of measurement/model
  source: string;
  dataSourceType:
    | "observed_ground"
    | "atmospheric_model"
    | "satellite_estimated"
    | "cached_reference";
  dataFreshness: "live" | "recent" | "cached" | "offline_reference";
  limitations: string[];
}

// ==========================================
// 2. User Profile & Preferences
// ==========================================

export type HouseholdType =
  | "family_with_kids"
  | "elderly_care"
  | "working_adults"
  | "single_active"
  | "chronic_respiratory";

export type CommuteMode =
  | "private_car_petrol"
  | "private_car_diesel"
  | "two_wheeler"
  | "public_metro_bus"
  | "walking_cycling"
  | "work_from_home";

export type ExerciseHabit =
  | "morning_outdoor"
  | "midday_outdoor"
  | "evening_outdoor"
  | "indoor_gym"
  | "home_exercise"
  | "none";

export type BudgetTier = "zero_cost" | "low_cost" | "medium_cost" | "high_investment";

export interface UserProfile {
  householdType: HouseholdType;
  commuteMode: CommuteMode;
  dailyCommuteKm: number;
  exerciseHabit: ExerciseHabit;
  budgetTier: BudgetTier;
  hasAirPurifier: boolean;
  hasExhaustFan: boolean;
  hasVulnerableMember: boolean; // infants, elderly, asthma
}

// ==========================================
// 3. Personalized Daily Routine
// ==========================================

export interface RoutineSlot {
  timeSlot: "morning" | "midday" | "evening" | "night";
  timeLabel: string; // e.g. "06:00 - 10:00 AM"
  title: string;
  whatToDo: string;
  whySuggested: string;
  whenMostUseful: string;
  alternativeOption: string;
  likelyBenefit: string;
  importantLimitation: string;
  activityTag: "exercise" | "commute" | "ventilation" | "school_kids" | "household";
  riskLevel: "low" | "moderate" | "high" | "severe";
}

// ==========================================
// 4. Indoor Air Quality Guidance
// ==========================================

export interface IndoorIntervention {
  id: string;
  category: "ventilation" | "cooking_exhaust" | "cleaning" | "filtration" | "source_control";
  costTier: "zero_cost" | "low_cost" | "medium_cost" | "high_investment";
  title: string;
  oneLineSummary: string;
  actionSteps: string[];
  scientificRationale: string;
  dos: string[];
  donts: string[];
  evidenceSource: string;
  estimatedCostRange: string;
}

// ==========================================
// 5. Sustainable Alternatives
// ==========================================

export interface SustainableAlternativeItem {
  id: string;
  category: "commute" | "short_trips" | "delivery" | "energy" | "cooking" | "waste";
  title: string;
  baselineHabit: string;
  cleanerAlternative: string;
  exposureTradeoff: string;
  emissionReductionBenefit: string;
  feasibilityRating: "High" | "Medium" | "Requires Community Action";
  safetyCaveat: string;
}

// ==========================================
// 6. Impact Calculator
// ==========================================

export interface ImpactCalculationInput {
  commuteMode: CommuteMode;
  distanceKm: number;
  alternativeMode: "metro_train" | "electric_bus" | "carpool_4" | "work_from_home";
  daysPerWeek: number;
  avoidTrashBurning?: boolean;
  reduceIdlingMinutes?: number;
}

export interface ImpactCalculationResult {
  avoidedDistanceKm: number;
  fuelSavedLiters: number;
  co2eAvoidedKg: number;
  annualCo2eAvoidedKg: number;
  equivalentTreesPlanted: number;
  tripsAvoided: number;
  formulaExplained: string;
  emissionFactorSource: string;
  emissionFactorValue: string;
  isMeasuredOrEstimated: "estimated";
  uncertaintyMargin: string;
  healthContextDisclaimer: string;
}

// ==========================================
// 7. GenAI Copilot Types & Schemas
// ==========================================

export interface CopilotPlanResponse {
  recommendation: string;
  reason: string;
  practicalAction: string;
  estimatedImpact?: string;
  confidence: "high" | "medium" | "low";
  sourceReferences: string[];
  isDeterministicFallback?: boolean;
}

export interface CopilotMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  plan?: CopilotPlanResponse;
  timestamp: string;
}

// ==========================================
// 8. Zod Validation Schemas
// ==========================================

export const LocationQuerySchema = z.object({
  city: z.string().min(1).max(100).optional(),
  lat: z.number().min(-90).max(90).optional(),
  lng: z.number().min(-180).max(180).optional(),
  scale: z.enum(["IN_CPCB", "US_EPA", "EU_AQI", "WHO"]).default("IN_CPCB"),
});

export const UserProfileSchema = z.object({
  householdType: z.enum([
    "family_with_kids",
    "elderly_care",
    "working_adults",
    "single_active",
    "chronic_respiratory",
  ]),
  commuteMode: z.enum([
    "private_car_petrol",
    "private_car_diesel",
    "two_wheeler",
    "public_metro_bus",
    "walking_cycling",
    "work_from_home",
  ]),
  dailyCommuteKm: z.number().min(0).max(250),
  exerciseHabit: z.enum([
    "morning_outdoor",
    "midday_outdoor",
    "evening_outdoor",
    "indoor_gym",
    "home_exercise",
    "none",
  ]),
  budgetTier: z.enum(["zero_cost", "low_cost", "medium_cost", "high_investment"]),
  hasAirPurifier: z.boolean(),
  hasExhaustFan: z.boolean(),
  hasVulnerableMember: z.boolean(),
});

export const ImpactCalculationInputSchema = z.object({
  commuteMode: z.enum([
    "private_car_petrol",
    "private_car_diesel",
    "two_wheeler",
    "public_metro_bus",
    "walking_cycling",
    "work_from_home",
  ]),
  distanceKm: z.number().min(0.5).max(300),
  alternativeMode: z.enum(["metro_train", "electric_bus", "carpool_4", "work_from_home"]),
  daysPerWeek: z.number().min(1).max(7),
  avoidTrashBurning: z.boolean().optional(),
  reduceIdlingMinutes: z.number().optional(),
});

export const CopilotPlanResponseSchema = z.object({
  recommendation: z.string().min(1),
  reason: z.string().min(1),
  practicalAction: z.string().min(1),
  estimatedImpact: z.string().optional(),
  confidence: z.enum(["high", "medium", "low"]).default("high"),
  sourceReferences: z.array(z.string()).default([]),
  isDeterministicFallback: z.boolean().optional(),
});

export const CopilotRequestSchema = z.object({
  message: z.string().min(1).max(1000),
  currentAqiData: z.record(z.string(), z.unknown()).optional(),
  userProfile: UserProfileSchema.optional(),
});
