import { AirQualityScale, AirQualityTier } from "@/types";

interface Breakpoint {
  cLow: number;
  cHigh: number;
  iLow: number;
  iHigh: number;
}

// CPCB (India) Breakpoints
const CPCB_PM25_BREAKPOINTS: Breakpoint[] = [
  { cLow: 0, cHigh: 30, iLow: 0, iHigh: 50 },
  { cLow: 31, cHigh: 60, iLow: 51, iHigh: 100 },
  { cLow: 61, cHigh: 90, iLow: 101, iHigh: 200 },
  { cLow: 91, cHigh: 120, iLow: 201, iHigh: 300 },
  { cLow: 121, cHigh: 250, iLow: 301, iHigh: 400 },
  { cLow: 251, cHigh: 500, iLow: 401, iHigh: 500 },
];

const CPCB_PM10_BREAKPOINTS: Breakpoint[] = [
  { cLow: 0, cHigh: 50, iLow: 0, iHigh: 50 },
  { cLow: 51, cHigh: 100, iLow: 51, iHigh: 100 },
  { cLow: 101, cHigh: 250, iLow: 101, iHigh: 200 },
  { cLow: 251, cHigh: 350, iLow: 201, iHigh: 300 },
  { cLow: 351, cHigh: 430, iLow: 301, iHigh: 400 },
  { cLow: 431, cHigh: 600, iLow: 401, iHigh: 500 },
];

const CPCB_NO2_BREAKPOINTS: Breakpoint[] = [
  { cLow: 0, cHigh: 40, iLow: 0, iHigh: 50 },
  { cLow: 41, cHigh: 80, iLow: 51, iHigh: 100 },
  { cLow: 81, cHigh: 180, iLow: 101, iHigh: 200 },
  { cLow: 181, cHigh: 280, iLow: 201, iHigh: 300 },
  { cLow: 281, cHigh: 400, iLow: 301, iHigh: 400 },
  { cLow: 401, cHigh: 800, iLow: 401, iHigh: 500 },
];

// US EPA Breakpoints (ug/m3 for PM2.5)
const EPA_PM25_BREAKPOINTS: Breakpoint[] = [
  { cLow: 0.0, cHigh: 12.0, iLow: 0, iHigh: 50 },
  { cLow: 12.1, cHigh: 35.4, iLow: 51, iHigh: 100 },
  { cLow: 35.5, cHigh: 55.4, iLow: 101, iHigh: 150 },
  { cLow: 55.5, cHigh: 150.4, iLow: 151, iHigh: 200 },
  { cLow: 150.5, cHigh: 250.4, iLow: 201, iHigh: 300 },
  { cLow: 250.5, cHigh: 500.4, iLow: 301, iHigh: 500 },
];

/**
 * Standard linear interpolation equation:
 * Ip = [ (Ihi - Ilo) / (BPhi - BPlo) ] * (Cp - BPlo) + Ilo
 */
function calculateSubIndex(concentration: number, breakpoints: Breakpoint[]): number {
  if (concentration < 0 || isNaN(concentration)) return 0;
  
  for (const bp of breakpoints) {
    if (concentration >= bp.cLow && concentration <= bp.cHigh) {
      const index = ((bp.iHigh - bp.iLow) / (bp.cHigh - bp.cLow)) * (concentration - bp.cLow) + bp.iLow;
      return Math.round(index);
    }
  }

  // Beyond highest breakpoint
  const highest = breakpoints[breakpoints.length - 1];
  if (concentration > highest.cHigh) {
    return 500;
  }
  return 0;
}

export function computeCpcbSubIndexPm25(pm25: number): number {
  return calculateSubIndex(pm25, CPCB_PM25_BREAKPOINTS);
}

export function computeCpcbSubIndexPm10(pm10: number): number {
  return calculateSubIndex(pm10, CPCB_PM10_BREAKPOINTS);
}

export function computeCpcbSubIndexNo2(no2: number): number {
  return calculateSubIndex(no2, CPCB_NO2_BREAKPOINTS);
}

export function computeEpaSubIndexPm25(pm25: number): number {
  return calculateSubIndex(pm25, EPA_PM25_BREAKPOINTS);
}

/**
 * Derives overall AQI and dominant pollutant based on CPCB standard logic
 * CPCB rule: AQI = max(sub-indices), dominant pollutant = pollutant with max sub-index
 */
export function calculateOverallAQI(
  pollutants: { pm25?: number; pm10?: number; no2?: number; so2?: number; co?: number; o3?: number },
  scale: AirQualityScale = "IN_CPCB"
): { aqi: number; dominantPollutant: string; subIndices: Record<string, number> } {
  const subIndices: Record<string, number> = {};

  if (scale === "IN_CPCB") {
    if (pollutants.pm25 !== undefined) subIndices["PM2.5"] = computeCpcbSubIndexPm25(pollutants.pm25);
    if (pollutants.pm10 !== undefined) subIndices["PM10"] = computeCpcbSubIndexPm10(pollutants.pm10);
    if (pollutants.no2 !== undefined) subIndices["NO2"] = computeCpcbSubIndexNo2(pollutants.no2);
  } else {
    // US EPA
    if (pollutants.pm25 !== undefined) subIndices["PM2.5"] = computeEpaSubIndexPm25(pollutants.pm25);
    if (pollutants.pm10 !== undefined) subIndices["PM10"] = computeCpcbSubIndexPm10(pollutants.pm10);
  }

  let maxVal = 0;
  let dominant = "PM2.5";

  for (const [key, val] of Object.entries(subIndices)) {
    if (val > maxVal) {
      maxVal = val;
      dominant = key;
    }
  }

  return {
    aqi: maxVal,
    dominantPollutant: dominant,
    subIndices,
  };
}

export function getTierFromAQI(aqi: number, scale: AirQualityScale = "IN_CPCB"): {
  tier: AirQualityTier;
  label: string;
  badgeClass: string;
  dotColor: string;
  healthSummary: string;
  maskRecommended: boolean;
  schoolOutdoorSafe: boolean;
} {
  if (scale === "IN_CPCB") {
    if (aqi <= 50) {
      return {
        tier: "good",
        label: "Good (Minimal Impact)",
        badgeClass: "bg-emerald-100 text-emerald-800 border-emerald-300",
        dotColor: "#059669",
        healthSummary: "Air quality is satisfactory with minimal to no health risk. Ideal for all outdoor exercises.",
        maskRecommended: false,
        schoolOutdoorSafe: true,
      };
    } else if (aqi <= 100) {
      return {
        tier: "moderate",
        label: "Satisfactory / Moderate",
        badgeClass: "bg-amber-100 text-amber-800 border-amber-300",
        dotColor: "#d97706",
        healthSummary: "Minor breathing discomfort to sensitive individuals (asthmatics, children, elderly). Acceptable air quality.",
        maskRecommended: false,
        schoolOutdoorSafe: true,
      };
    } else if (aqi <= 200) {
      return {
        tier: "poor",
        label: "Moderate to Poor",
        badgeClass: "bg-orange-100 text-orange-800 border-orange-300",
        dotColor: "#ea580c",
        healthSummary: "Breathing discomfort to people with lungs, asthma, and heart diseases. Children should limit prolonged outdoor exertion.",
        maskRecommended: true,
        schoolOutdoorSafe: false,
      };
    } else if (aqi <= 300) {
      return {
        tier: "very_poor",
        label: "Very Poor (High Health Alert)",
        badgeClass: "bg-red-100 text-red-800 border-red-300",
        dotColor: "#dc2626",
        healthSummary: "Respiratory illness on prolonged exposure. Pronounced effect on people with lung and heart diseases. Wear N95 outdoors.",
        maskRecommended: true,
        schoolOutdoorSafe: false,
      };
    } else if (aqi <= 400) {
      return {
        tier: "severe",
        label: "Severe Smog Emergency",
        badgeClass: "bg-purple-100 text-purple-800 border-purple-300",
        dotColor: "#7e22ce",
        healthSummary: "Affects healthy people and seriously impacts those with existing diseases. Cease all outdoor cardio/sports. Keep windows closed.",
        maskRecommended: true,
        schoolOutdoorSafe: false,
      };
    } else {
      return {
        tier: "hazardous",
        label: "Severe+ / Hazardous Crisis",
        badgeClass: "bg-rose-100 text-rose-900 border-rose-400",
        dotColor: "#881337",
        healthSummary: "Severe public health emergency. Hazardous particulate levels. High risk of systemic inflammation. Strictly stay indoors.",
        maskRecommended: true,
        schoolOutdoorSafe: false,
      };
    }
  }

  // EPA scale default fallback
  if (aqi <= 50) return { tier: "good", label: "Good", badgeClass: "bg-emerald-100 text-emerald-800 border-emerald-300", dotColor: "#059669", healthSummary: "Air quality is satisfactory.", maskRecommended: false, schoolOutdoorSafe: true };
  if (aqi <= 100) return { tier: "moderate", label: "Moderate", badgeClass: "bg-amber-100 text-amber-800 border-amber-300", dotColor: "#d97706", healthSummary: "Acceptable; sensitive individuals take caution.", maskRecommended: false, schoolOutdoorSafe: true };
  if (aqi <= 150) return { tier: "poor", label: "Unhealthy for Sensitive Groups", badgeClass: "bg-orange-100 text-orange-800 border-orange-300", dotColor: "#ea580c", healthSummary: "Sensitive groups may experience health effects.", maskRecommended: true, schoolOutdoorSafe: false };
  if (aqi <= 200) return { tier: "very_poor", label: "Unhealthy", badgeClass: "bg-red-100 text-red-800 border-red-300", dotColor: "#dc2626", healthSummary: "Everyone may begin to experience health effects.", maskRecommended: true, schoolOutdoorSafe: false };
  if (aqi <= 300) return { tier: "severe", label: "Very Unhealthy", badgeClass: "bg-purple-100 text-purple-800 border-purple-300", dotColor: "#7e22ce", healthSummary: "Health alert: emergency conditions for the entire population.", maskRecommended: true, schoolOutdoorSafe: false };
  return { tier: "hazardous", label: "Hazardous", badgeClass: "bg-rose-100 text-rose-900 border-rose-400", dotColor: "#881337", healthSummary: "Health warnings of emergency conditions.", maskRecommended: true, schoolOutdoorSafe: false };
}
