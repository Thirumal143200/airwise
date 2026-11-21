import { AirQualityData, CopilotPlanResponse, UserProfile } from "@/types";
import { sanitizeInput } from "@/lib/security";

/**
 * Deterministic Rules-Based Engine Fallback
 * Generates structured, scientifically sound guidance when Gemini API key
 * is not configured or external AI network request encounters timeout/rate limit.
 */
export function generateDeterministicCopilotPlan(
  userQuery: string,
  aqiData?: AirQualityData,
  profile?: UserProfile
): CopilotPlanResponse {
  const queryLower = userQuery.toLowerCase();
  const aqi = aqiData?.aqi ?? 280;
  const isSevere = aqi > 300;
  const isPoor = aqi > 150;

  // 1. Children / School / Elderly / Vulnerability queries (Prioritized for maximum family protection)
  if (
    queryLower.includes("child") ||
    queryLower.includes("kid") ||
    queryLower.includes("school") ||
    queryLower.includes("elderly") ||
    queryLower.includes("baby") ||
    queryLower.includes("parent") ||
    queryLower.includes("asthma")
  ) {
    return {
      recommendation: "Implement strict pediatric and elder vulnerability protections indoors.",
      reason:
        `Children breathe 50% more air per kilogram of body weight than adults (WHO and American Academy of Pediatrics pediatric exposure benchmarks) and have developing alveolar architecture. Current measured AQI (${aqi}) poses acute bronchospastic risk.`,
      practicalAction:
        "Ensure children remain indoors during early morning hours. Suspend outdoor sports sessions at school. Check that rescue inhalers are readily accessible for anyone with asthma. Use damp mopping instead of dry dusting.",
      estimatedImpact:
        "Substantially reduces the incidence of acute nocturnal wheezing and emergency room pediatric admissions.",
      confidence: "high",
      sourceReferences: [
        "Lancet Commission on Pollution and Health",
        "Indian Academy of Pediatrics (IAP) Winter Smog Advisory",
      ],
      isDeterministicFallback: true,
    };
  }

  // 2. Outdoor activity / running / exercise queries
  if (
    queryLower.includes("run") ||
    queryLower.includes("exercise") ||
    queryLower.includes("walk") ||
    queryLower.includes("jog") ||
    queryLower.includes("sport") ||
    queryLower.includes("outdoor")
  ) {
    if (isSevere) {
      return {
        recommendation: "Cancel all outdoor aerobic workouts immediately; shift to low-intensity indoor training.",
        reason:
          `Current AQI is ${aqi} (${aqiData?.tierLabel ?? "Severe"}). High-intensity cardio elevates minute ventilation volume by 6–8x, deeply forcing fine particles (PM2.5) past upper airway defenses directly into the pulmonary alveoli and vascular endothelium.`,
        practicalAction:
          "Exercise indoors in an enclosed room with an active air cleaner or closed windows between 12:00 PM and 2:00 PM (peak thermal dispersion window). Focus on bodyweight stretching, yoga, or resistance bands.",
        estimatedImpact:
          "Prevents an estimated 75–85% of acute particulate lung dose compared to a 30-minute outdoor morning run.",
        confidence: "high",
        sourceReferences: [
          "WHO Global Air Quality Guidelines (2021)",
          "Central Pollution Control Board (CPCB) Health Advisory on Severe Air Quality",
        ],
        isDeterministicFallback: true,
      };
    } else if (isPoor) {
      return {
        recommendation: "Shift outdoor workouts to the midday window (12:00–02:30 PM) or wear an N95 respirator.",
        reason:
          `Current AQI is ${aqi}. Inversion dynamics cause high surface particulate concentration in early morning and late evening, while midday solar convection dilutes surface smoke by up to 40%.`,
        practicalAction:
          "Limit cardio to moderate intensity. If walking outside, do not exercise along heavy truck corridors; choose inner residential green belts.",
        estimatedImpact:
          "Halves peak inhaled particulate load by avoiding morning boundary-layer inversion.",
        confidence: "high",
        sourceReferences: [
          "American Thoracic Society Guidelines on Air Pollution & Exercise",
          "Indian NAAQI Advisory Protocols",
        ],
        isDeterministicFallback: true,
      };
    } else {
      return {
        recommendation: "Outdoor exercise is safe under current air measurements.",
        reason:
          `Current AQI is ${aqi} (${aqiData?.tierLabel ?? "Acceptable"}). Cardiorespiratory and metabolic benefits of active outdoor fitness outweigh minor pollutant exposure risks.`,
        practicalAction: "Enjoy your outdoor walk or run. Hydrate well and maintain your routine.",
        confidence: "high",
        sourceReferences: ["WHO Ambient Air Quality Guidelines"],
        isDeterministicFallback: true,
      };
    }
  }

  // 3. Indoor air, windows, purifiers, or cooking
  if (
    queryLower.includes("window") ||
    queryLower.includes("purifier") ||
    queryLower.includes("ventilate") ||
    queryLower.includes("cook") ||
    queryLower.includes("fan") ||
    queryLower.includes("indoor")
  ) {
    return {
      recommendation:
        "Keep exterior windows sealed during inversion hours, manage kitchen exhaust, and deploy mechanical filtration.",
      reason:
        "Without proper window management, ambient smog readily infiltrates homes (infiltration ratio of 0.6–0.8). Furthermore, indoor frying or burning incense adds dangerous localized particle spikes.",
      practicalAction:
        "Seal bedroom drafts. Run kitchen exhaust fans with pan lids on while cooking. If indoor air feels stale, crack leeward windows for only 15 minutes between 1:00 PM and 2:30 PM when ambient particulate levels are at daily minimums.",
      estimatedImpact:
        "Maintains indoor PM2.5 levels 40–70% lower than outdoor ambient levels, protecting nighttime sleep quality.",
      confidence: "high",
      sourceReferences: [
        "US EPA Guide to Air Cleaners in the Home",
        "Lawrence Berkeley National Laboratory Indoor Air Science",
      ],
      isDeterministicFallback: true,
    };
  }

  // 4. Default comprehensive guidance
  return {
    recommendation: `Follow the AirWise safety protocol for ${aqiData?.location.city || "your region"} (Current AQI: ${aqi}).`,
    reason:
      `Measured dominant pollutant is ${aqiData?.dominantPollutant || "PM2.5"} with a current reading of ${aqiData?.pollutants.pm25.value || 160} µg/m³. This requires proactive exposure mitigation.`,
    practicalAction:
      "Wear a certified N95 respirator during outdoor transit, avoid dry sweeping inside the home, defer non-essential motor journeys, and utilize midday solar hours for necessary movement.",
    estimatedImpact:
      "Protects respiratory membranes from acute particulate irritation while lowering urban traffic congestion.",
    confidence: "high",
    sourceReferences: [
      "CPCB National Air Quality Index Guidelines",
      "World Health Organization Public Health Guidance",
    ],
    isDeterministicFallback: true,
  };
}

/**
 * Constructs the bounding system instruction guiding Gemini's persona,
 * factual constraints, and strict JSON output schema.
 */
export function buildCopilotSystemInstruction(): string {
  return `You are the AirWise Environmental Intelligence Assistant.
Your mission is to provide accurate, scientifically grounded, actionable, non-alarmist air quality and routine guidance to families.

CRITICAL OPERATIONAL RULES:
1. NEVER invent AQI numbers, monitoring stations, or medical diagnoses. Cite ONLY the verified environmental data provided below.
2. If specific data is missing or unavailable, explicitly say so.
3. Distinguish clearly between climate CO2 savings (which are long-term greenhouse gas reductions) and local PM2.5 particulate exposure.
4. Always provide practical, realistic low-cost alternatives.
5. Return ONLY a valid JSON object matching this exact schema:
{
  "recommendation": "string (1-2 sentences on what to do)",
  "reason": "string (scientific rationale based on data)",
  "practicalAction": "string (specific action steps, timing, and alternatives)",
  "estimatedImpact": "string (approximate exposure reduction or avoided emissions, if supported)",
  "confidence": "high" | "medium" | "low",
  "sourceReferences": ["string", "string"]
}`;
}

/**
 * Builds the verified environmental and user profile context object.
 */
export function buildCopilotContextData(
  aqiData?: AirQualityData,
  profile?: UserProfile
): Record<string, unknown> {
  return {
    location: aqiData?.location.name || "Urban Center",
    currentAqi: aqiData?.aqi ?? "Unavailable",
    aqiScale: aqiData?.scale || "IN_CPCB",
    tier: aqiData?.tierLabel || "Moderate",
    dominantPollutant: aqiData?.dominantPollutant || "PM2.5",
    pollutants: {
      pm25: aqiData?.pollutants.pm25.value ?? "N/A",
      pm10: aqiData?.pollutants.pm10.value ?? "N/A",
      no2: aqiData?.pollutants.no2.value ?? "N/A",
      so2: aqiData?.pollutants.so2.value ?? "N/A",
      co: aqiData?.pollutants.co.value ?? "N/A",
      o3: aqiData?.pollutants.o3.value ?? "N/A",
    },
    dataSource: aqiData?.source || "Open-Meteo Atmospheric Integration",
    timestamp: aqiData?.timestamp || new Date().toISOString(),
    userProfile: profile || {
      householdType: "family_with_kids",
      commuteMode: "private_car_petrol",
      budgetTier: "low_cost",
    },
  };
}

/**
 * Redacts API keys and secret query parameters from error strings.
 */
export function sanitizeCopilotErrorMessage(rawMsg: string, apiKey: string): string {
  if (!rawMsg) return "";
  let sanitized = rawMsg.replace(/key=[^&\s]+/gi, "key=[REDACTED]");
  if (apiKey && apiKey.trim().length > 0) {
    sanitized = sanitized.split(apiKey).join("[REDACTED]");
  }
  return sanitized;
}

/**
 * Strips markdown code fences (```json ... ```) and parses structured Gemini JSON.
 */
export function extractAndParseCopilotJson(textOutput: string): CopilotPlanResponse | null {
  if (!textOutput || typeof textOutput !== "string") return null;

  let cleanJson = textOutput.trim();
  if (cleanJson.startsWith("```")) {
    cleanJson = cleanJson.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "");
  }

  const parsed = JSON.parse(cleanJson);
  if (!parsed || typeof parsed !== "object") return null;

  return {
    recommendation: parsed.recommendation || "Follow safety protocols for high AQI.",
    reason: parsed.reason || "Air pollutant levels require exposure protection.",
    practicalAction: parsed.practicalAction || "Limit outdoor exposure and run air filtration.",
    estimatedImpact: parsed.estimatedImpact,
    confidence: parsed.confidence === "low" || parsed.confidence === "medium" ? parsed.confidence : "high",
    sourceReferences: Array.isArray(parsed.sourceReferences) && parsed.sourceReferences.length > 0
      ? parsed.sourceReferences
      : ["CPCB Air Quality Guidelines", "WHO Global Ambient Air Standards"],
    isDeterministicFallback: false,
  };
}

/**
 * Calls live Google Gemini API if GEMINI_API_KEY is available in environment.
 * Bounded with AbortController, structured schema prompt, safe diagnostic logging, and fallback.
 */
export async function askGeminiCopilot(
  userQuery: string,
  aqiData?: AirQualityData,
  profile?: UserProfile
): Promise<CopilotPlanResponse> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey.trim() === "" || apiKey === "your-gemini-api-key") {
    console.log("[Copilot Diagnostics] GEMINI_API_KEY is unconfigured; activating deterministic rules engine.");
    return generateDeterministicCopilotPlan(userQuery, aqiData, profile);
  }

  const cleanQuery = sanitizeInput(userQuery, 800);
  console.log(`[Copilot Diagnostics] Initiating Gemini request: queryLength=${cleanQuery.length}, hasAqiData=${!!aqiData}, hasProfile=${!!profile}`);

  const systemInstruction = buildCopilotSystemInstruction();
  const contextData = buildCopilotContextData(aqiData, profile);

  const promptContent = `CURRENT VERIFIED ENVIRONMENTAL CONTEXT:
${JSON.stringify(contextData, null, 2)}

USER QUESTION:
<<<USER_QUERY>>>
${cleanQuery}
<<<USER_QUERY>>>

Provide your response in strict JSON format:`;

  const controller = new AbortController();
  const timeoutMs = 8000;
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, timeoutMs);

  try {
    const model = process.env.GEMINI_MODEL || "gemini-3.8-flash";
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: systemInstruction + "\n\n" + promptContent },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 800,
          responseMimeType: "application/json",
        },
      }),
    });

    console.log(`[Copilot Diagnostics] Gemini HTTP response status=${res.status}`);

    if (!res.ok) {
      let safeErrorDetail = "";
      try {
        const errorJson = await res.json();
        const rawMsg = errorJson?.error?.message || JSON.stringify(errorJson);
        safeErrorDetail = sanitizeCopilotErrorMessage(rawMsg, apiKey);
      } catch {
        safeErrorDetail = `HTTP ${res.status} ${res.statusText}`;
      }

      if (res.status === 404) {
        console.warn(
          `[Copilot Diagnostics] Gemini returned 404 NOT_FOUND for model '${model}'. Detail: ${safeErrorDetail}; activating deterministic rules engine.`
        );
      } else {
        console.warn(
          `[Copilot Diagnostics] Gemini returned non-OK status (${res.status}). Detail: ${safeErrorDetail}; activating deterministic rules engine.`
        );
      }
      return generateDeterministicCopilotPlan(userQuery, aqiData, profile);
    }

    const data = await res.json();
    const textOutput = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!textOutput || typeof textOutput !== "string") {
      console.warn("[Copilot Diagnostics] Gemini response content empty or missing parts; activating fallback.");
      return generateDeterministicCopilotPlan(userQuery, aqiData, profile);
    }

    const plan = extractAndParseCopilotJson(textOutput);
    if (!plan) {
      console.warn("[Copilot Diagnostics] Failed to parse structured plan from Gemini response; activating fallback.");
      return generateDeterministicCopilotPlan(userQuery, aqiData, profile);
    }

    console.log("[Copilot Diagnostics] Successfully parsed structured Gemini response.");
    return plan;
  } catch (err: unknown) {
    const isAbort =
      (err instanceof DOMException && err.name === "AbortError") ||
      (err instanceof Error && err.name === "AbortError");

    if (isAbort) {
      console.warn(`[Copilot Diagnostics] Gemini API request timed out after ${timeoutMs}ms; engaging deterministic rules engine.`);
    } else {
      const errMsg = err instanceof Error ? err.message : String(err);
      console.warn("[Copilot Diagnostics] Gemini API call encountered error; engaging deterministic rules engine:", errMsg);
    }
    return generateDeterministicCopilotPlan(userQuery, aqiData, profile);
  } finally {
    clearTimeout(timeoutId);
  }
}
