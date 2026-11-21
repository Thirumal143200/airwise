"use client";

import React from "react";
import {
  ShieldAlert,
  ShieldCheck,
  AlertOctagon,
  Clock,
  Database,
  MapPin,
  HeartPulse,
  Baby,
  Activity,
  type LucideIcon,
} from "lucide-react";
import { AirQualityData } from "@/types";

interface TierStyleConfig {
  bgClass: string;
  borderClass: string;
  textClass: string;
  icon: LucideIcon;
  accentBg: string;
}

const TIER_CONFIG: Record<string, TierStyleConfig> = {
  good: {
    bgClass: "bg-emerald-50",
    borderClass: "border-emerald-300",
    textClass: "text-emerald-900",
    icon: ShieldCheck,
    accentBg: "bg-emerald-600",
  },
  moderate: {
    bgClass: "bg-amber-50",
    borderClass: "border-amber-300",
    textClass: "text-amber-950",
    icon: Activity,
    accentBg: "bg-amber-500",
  },
  poor: {
    bgClass: "bg-orange-50",
    borderClass: "border-orange-300",
    textClass: "text-orange-950",
    icon: AlertOctagon,
    accentBg: "bg-orange-500",
  },
  very_poor: {
    bgClass: "bg-red-50",
    borderClass: "border-red-300",
    textClass: "text-red-950",
    icon: ShieldAlert,
    accentBg: "bg-red-600",
  },
  severe: {
    bgClass: "bg-purple-50",
    borderClass: "border-purple-300",
    textClass: "text-purple-950",
    icon: ShieldAlert,
    accentBg: "bg-purple-700",
  },
  hazardous: {
    bgClass: "bg-rose-50",
    borderClass: "border-rose-400",
    textClass: "text-rose-950",
    icon: AlertOctagon,
    accentBg: "bg-rose-800",
  },
};

interface AqiHeroCardProps {
  data: AirQualityData;
  onRefresh: () => void;
  isLoading: boolean;
}

export function AqiHeroCard({ data, onRefresh, isLoading }: AqiHeroCardProps) {
  const { aqi, scale, tier, tierLabel, healthSummary, dominantPollutant, location, timestamp, source, dataFreshness } = data;

  const currentConfig = TIER_CONFIG[tier] || TIER_CONFIG.moderate;
  const TierIcon = currentConfig.icon;

  const isHighRisk = aqi > 200;
  const isSevere = aqi > 300;

  return (
    <section
      aria-labelledby="aqi-hero-heading"
      className={`rounded-2xl border-2 ${currentConfig.borderClass} ${currentConfig.bgClass} p-6 sm:p-8 shadow-sm transition-all`}
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Left Column: AQI Number & Multi-channel Status */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          {/* Main Visual Badge */}
          <div className="flex items-center gap-4">
            <div
              className={`w-28 h-28 sm:w-32 sm:h-32 rounded-2xl ${currentConfig.accentBg} text-white flex flex-col items-center justify-center shadow-lg p-2 text-center flex-shrink-0`}
            >
              <span className="text-[11px] font-semibold tracking-wider uppercase opacity-90">
                {scale === "IN_CPCB" ? "CPCB AQI" : "US EPA AQI"}
              </span>
              <span className="text-4xl sm:text-5xl font-extrabold tracking-tight">{aqi}</span>
              <span className="text-[10px] font-medium opacity-90 truncate max-w-[100px]">
                {dominantPollutant} Dominant
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <MapPin className="w-4 h-4 text-forest-700" />
                <h1 id="aqi-hero-heading" className="text-lg sm:text-2xl font-bold text-gray-900">
                  {location.name}
                </h1>
                <span className="text-xs bg-white/80 border border-gray-300 px-2 py-0.5 rounded text-gray-700">
                  {location.country}
                </span>
              </div>

              {/* Multi-sensory non-color severity tag */}
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs sm:text-sm font-bold border ${currentConfig.borderClass} bg-white shadow-sm`}
                >
                  <TierIcon className="w-4 h-4" />
                  <span>{tierLabel}</span>
                </span>

                <span className="text-xs text-gray-600 bg-white/70 px-2.5 py-1 rounded-md border border-gray-200">
                  Dominant: <strong className="text-gray-900">{dominantPollutant}</strong>
                </span>
              </div>

              {/* Health Impact Summary */}
              <p className="text-xs sm:text-sm text-gray-700 max-w-xl leading-relaxed">
                {healthSummary}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Family & Vulnerability Quick Advisories */}
        <div className="flex flex-col gap-3 min-w-[280px]">
          {/* Mask Advisory */}
          <div className="bg-white/90 border border-gray-200 rounded-xl p-3 flex items-center gap-3 shadow-xs">
            <div className={`p-2 rounded-lg ${isHighRisk ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700"}`}>
              <HeartPulse className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-gray-900">Respirator Advisory</div>
              <div className="text-xs text-gray-600">
                {isSevere
                  ? "Mandatory N95 / FFP2 mask outdoors"
                  : isHighRisk
                  ? "N95 recommended for active transit"
                  : "Normal breathing; no mask needed"}
              </div>
            </div>
          </div>

          {/* School & Kids Advisory */}
          <div className="bg-white/90 border border-gray-200 rounded-xl p-3 flex items-center gap-3 shadow-xs">
            <div className={`p-2 rounded-lg ${isHighRisk ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}>
              <Baby className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-gray-900">Children & Schools</div>
              <div className="text-xs text-gray-600">
                {isHighRisk
                  ? "Suspend all outdoor sports & recess"
                  : "Outdoor play and sports permitted"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer: Data Provenance & Freshness Details */}
      <div className="mt-6 pt-4 border-t border-gray-200/70 flex flex-wrap items-center justify-between text-xs text-gray-600 gap-2">
        <div className="flex items-center gap-2">
          <Database className="w-3.5 h-3.5 text-forest-700" />
          <span>
            <strong>Data Source:</strong> {source}
          </span>
          <span className="hidden sm:inline">•</span>
          <span
            className={`inline-flex items-center gap-1 font-medium ${
              dataFreshness === "live"
                ? "text-emerald-700"
                : dataFreshness === "cached"
                ? "text-amber-700"
                : "text-purple-700"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                dataFreshness === "live" ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
              }`}
            />
            {dataFreshness === "live"
              ? "Live Verified Feed"
              : dataFreshness === "cached"
              ? "Cached (Fresh)"
              : "Calibrated Regional Reference"}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            Updated: {new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </span>
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="text-forest-700 hover:text-forest-900 font-semibold underline disabled:opacity-50 text-xs"
          >
            {isLoading ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </div>
    </section>
  );
}
