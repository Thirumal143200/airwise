import { AirQualityScale, AirQualityTier } from "@/types";

interface Breakpoint {
  cLow: number;
  cHigh: number;
  iLow: number;
  iHigh: number;
}

// =========================================================================
// CPCB (India) Breakpoints — Official Central Pollution Control Board NAAQI
// Breakpoints are made continuous at interval boundaries to prevent float gaps.
// =========================================================================
const CPCB_PM25_BREAKPOINTS: Breakpoint[] = [
  { cLow: 0, cHigh: 30, iLow: 0, iHigh: 50 },
  { cLow: 30, cHigh: 60, iLow: 51, iHigh: 100 },
  { cLow: 60, cHigh: 90, iLow: 101, iHigh: 200 },
  { cLow: 90, cHigh: 120, iLow: 201, iHigh: 300 },
  { cLow: 120, cHigh: 250, iLow: 301, iHigh: 400 },
  { cLow: 250, cHigh: 500, iLow: 401, iHigh: 500 },
];

const CPCB_PM10_BREAKPOINTS: Breakpoint[] = [
  { cLow: 0, cHigh: 50, iLow: 0, iHigh: 50 },
  { cLow: 50, cHigh: 100, iLow: 51, iHigh: 100 },
  { cLow: 100, cHigh: 250, iLow: 101, iHigh: 200 },
  { cLow: 250, cHigh: 350, iLow: 201, iHigh: 300 },
  { cLow: 350, cHigh: 430, iLow: 301, iHigh: 400 },
  { cLow: 430, cHigh: 600, iLow: 401, iHigh: 500 },
];

const CPCB_NO2_BREAKPOINTS: Breakpoint[] = [
  { cLow: 0, cHigh: 40, iLow: 0, iHigh: 50 },
  { cLow: 40, cHigh: 80, iLow: 51, iHigh: 100 },
  { cLow: 80, cHigh: 180, iLow: 101, iHigh: 200 },
  { cLow: 180, cHigh: 280, iLow: 201, iHigh: 300 },
  { cLow: 280, cHigh: 400, iLow: 301, iHigh: 400 },
  { cLow: 400, cHigh: 800, iLow: 401, iHigh: 500 },
];

const CPCB_SO2_BREAKPOINTS: Breakpoint[] = [
  { cLow: 0, cHigh: 40, iLow: 0, iHigh: 50 },
  { cLow: 40, cHigh: 80, iLow: 51, iHigh: 100 },
  { cLow: 80, cHigh: 380, iLow: 101, iHigh: 200 },
  { cLow: 380, cHigh: 800, iLow: 201, iHigh: 300 },
  { cLow: 800, cHigh: 1600, iLow: 301, iHigh: 400 },
  { cLow: 1600, cHigh: 2000, iLow: 401, iHigh: 500 },
];

// CO (8-hr average in mg/m3)
const CPCB_CO_BREAKPOINTS: Breakpoint[] = [
  { cLow: 0.0, cHigh: 1.0, iLow: 0, iHigh: 50 },
  { cLow: 1.0, cHigh: 2.0, iLow: 51, iHigh: 100 },
  { cLow: 2.0, cHigh: 10.0, iLow: 101, iHigh: 200 },
  { cLow: 10.0, cHigh: 17.0, iLow: 201, iHigh: 300 },
  { cLow: 17.0, cHigh: 34.0, iLow: 301, iHigh: 400 },
  { cLow: 34.0, cHigh: 50.0, iLow: 401, iHigh: 500 },
];

// Ozone (8-hr average in ug/m3)
const CPCB_O3_BREAKPOINTS: Breakpoint[] = [
  { cLow: 0, cHigh: 50, iLow: 0, iHigh: 50 },
  { cLow: 50, cHigh: 100, iLow: 51, iHigh: 100 },
  { cLow: 100, cHigh: 168, iLow: 101, iHigh: 200 },
  { cLow: 168, cHigh: 208, iLow: 201, iHigh: 300 },
  { cLow: 208, cHigh: 748, iLow: 301, iHigh: 400 },
  { cLow: 748, cHigh: 1000, iLow: 401, iHigh: 500 },
];

// =========================================================================
// US EPA Breakpoints (ug/m3 for PM2.5, PM10, etc.)
// =========================================================================
const EPA_PM25_BREAKPOINTS: Breakpoint[] = [
  { cLow: 0.0, cHigh: 12.0, iLow: 0, iHigh: 50 },
  { cLow: 12.0, cHigh: 35.4, iLow: 51, iHigh: 100 },
  { cLow: 35.4, cHigh: 55.4, iLow: 101, iHigh: 150 },
  { cLow: 55.4, cHigh: 150.4, iLow: 151, iHigh: 200 },
  { cLow: 150.4, cHigh: 250.4, iLow: 201, iHigh: 300 },
  { cLow: 250.4, cHigh: 500.4, iLow: 301, iHigh: 500 },
];

const EPA_PM10_BREAKPOINTS: Breakpoint[] = [
  { cLow: 0, cHigh: 54, iLow: 0, iHigh: 50 },
  { cLow: 54, cHigh: 154, iLow: 51, iHigh: 100 },
  { cLow: 154, cHigh: 254, iLow: 101, iHigh: 150 },
  { cLow: 254, cHigh: 354, iLow: 151, iHigh: 200 },
  { cLow: 354, cHigh: 424, iLow: 201, iHigh: 300 },
  { cLow: 424, cHigh: 604, iLow: 301, iHigh: 500 },
];

/**
 * Standard piecewise linear interpolation equation:
 * Ip = [ (Ihi - Ilo) / (BPhi - BPlo) ] * (Cp - BPlo) + Ilo
 */
function calculateSubIndex(concentration: number, breakpoints: Breakpoint[]): number {
  if (concentration < 0 || isNaN(concentration)) return 0;

  for (let i = 0; i < breakpoints.length; i++) {
    const bp = breakpoints[i];
    // First breakpoint includes 0; subsequent breakpoints match (cLow, cHigh]
    const matches = i === 0
      ? concentration >= bp.cLow && concentration <= bp.cHigh
      : concentration > bp.cLow && concentration <= bp.cHigh;

    if (matches) {
      const index =
        ((bp.iHigh - bp.iLow) / (bp.cHigh - bp.cLow)) * (concentration - bp.cLow) + bp.iLow;
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

export function computeCpcbSubIndexSo2(so2: number): number {
  return calculateSubIndex(so2, CPCB_SO2_BREAKPOINTS);
}

export function computeCpcbSubIndexCo(co: number): number {
  return calculateSubIndex(co, CPCB_CO_BREAKPOINTS);
}

export function computeCpcbSubIndexO3(o3: number): number {
  return calculateSubIndex(o3, CPCB_O3_BREAKPOINTS);
}

export function computeEpaSubIndexPm25(pm25: number): number {
  return calculateSubIndex(pm25, EPA_PM25_BREAKPOINTS);
}

export function computeEpaSubIndexPm10(pm10: number): number {
  return calculateSubIndex(pm10, EPA_PM10_BREAKPOINTS);
}

/**
 * Derives overall AQI and dominant pollutant based on official standard logic.
 * CPCB rule: AQI = max(sub-indices), dominant pollutant = pollutant with max sub-index.
 */
export function calculateOverallAQI(
  pollutants: { pm25?: number; pm10?: number; no2?: number; so2?: number; co?: number; o3?: number },
  scale: AirQualityScale = "IN_CPCB"
): { aqi: number; dominantPollutant: string; subIndices: Record<string, number> } {
  const subIndices: Record<string, number> = {};

  if (scale === "IN_CPCB") {
    if (pollutants.pm25 !== undefined && pollutants.pm25 !== null) {
      subIndices["PM2.5"] = computeCpcbSubIndexPm25(pollutants.pm25);
    }
    if (pollutants.pm10 !== undefined && pollutants.pm10 !== null) {
      subIndices["PM10"] = computeCpcbSubIndexPm10(pollutants.pm10);
    }
    if (pollutants.no2 !== undefined && pollutants.no2 !== null) {
      subIndices["NO2"] = computeCpcbSubIndexNo2(pollutants.no2);
    }
    if (pollutants.so2 !== undefined && pollutants.so2 !== null) {
      subIndices["SO2"] = computeCpcbSubIndexSo2(pollutants.so2);
    }
    if (pollutants.co !== undefined && pollutants.co !== null) {
      subIndices["CO"] = computeCpcbSubIndexCo(pollutants.co);
    }
    if (pollutants.o3 !== undefined && pollutants.o3 !== null) {
      subIndices["O3"] = computeCpcbSubIndexO3(pollutants.o3);
    }
  } else {
    // US EPA
    if (pollutants.pm25 !== undefined && pollutants.pm25 !== null) {
      subIndices["PM2.5"] = computeEpaSubIndexPm25(pollutants.pm25);
    }
    if (pollutants.pm10 !== undefined && pollutants.pm10 !== null) {
      subIndices["PM10"] = computeEpaSubIndexPm10(pollutants.pm10);
    }
    if (pollutants.no2 !== undefined && pollutants.no2 !== null) {
      subIndices["NO2"] = computeCpcbSubIndexNo2(pollutants.no2);
    }
    if (pollutants.so2 !== undefined && pollutants.so2 !== null) {
      subIndices["SO2"] = computeCpcbSubIndexSo2(pollutants.so2);
    }
    if (pollutants.co !== undefined && pollutants.co !== null) {
      subIndices["CO"] = computeCpcbSubIndexCo(pollutants.co);
    }
    if (pollutants.o3 !== undefined && pollutants.o3 !== null) {
      subIndices["O3"] = computeCpcbSubIndexO3(pollutants.o3);
    }
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
