"use client";

import React from "react";
import { Clock, Sun, AlertCircle } from "lucide-react";
import { HourlyForecastPoint } from "@/types";

interface HourlyForecastBarProps {
  forecast: HourlyForecastPoint[];
}

export function HourlyForecastBar({ forecast }: HourlyForecastBarProps) {
  if (!forecast || forecast.length === 0) return null;

  return (
    <section aria-labelledby="hourly-forecast-heading" className="mt-8 bg-white rounded-2xl border border-gray-200 p-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-forest-700" />
            <h2 id="hourly-forecast-heading" className="text-xl font-bold text-gray-900">
              12-Hour Smog & Dispersion Timeline
            </h2>
          </div>
          <p className="text-xs text-gray-600 mt-1">
            Diurnal pollution shifts driven by atmospheric temperature inversion and rush-hour emissions.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-[11px] text-gray-600">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Safe Outdoor
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Limit Exertion
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-600" /> Avoid All Cardio
          </span>
        </div>
      </div>

      {/* Horizontal Scrollable Timeline */}
      <div className="overflow-x-auto pb-2">
        <div className="flex items-center gap-3 min-w-[700px]">
          {forecast.map((point, index) => {
            const isMiddayClean = point.time >= "11:00" && point.time <= "15:00";
            return (
              <div
                key={`${point.time}-${index}`}
                className={`flex-1 rounded-xl p-3 border text-center transition-all ${
                  isMiddayClean
                    ? "bg-tealbrand-50/50 border-tealbrand-300 ring-1 ring-tealbrand-200"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <div className="text-xs font-semibold text-gray-600 flex items-center justify-center gap-1">
                  {isMiddayClean && <Sun className="w-3 h-3 text-amber-500" />}
                  <span>{point.time}</span>
                </div>

                <div className="mt-2 text-xl font-extrabold text-gray-900">{point.aqi}</div>
                <div className="text-[10px] text-gray-500">PM2.5: {Math.round(point.pm25)} µg/m³</div>

                {/* Recommendation Tag */}
                <div className="mt-2">
                  <span
                    className={`inline-block text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider ${
                      point.recommendedOutdoorAction === "safe"
                        ? "bg-emerald-100 text-emerald-800"
                        : point.recommendedOutdoorAction === "limit_heavy"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-rose-100 text-rose-800"
                    }`}
                  >
                    {point.recommendedOutdoorAction === "safe"
                      ? "Safe"
                      : point.recommendedOutdoorAction === "limit_heavy"
                      ? "Limit"
                      : "Avoid"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Meteorological Insight Note */}
      <div className="mt-4 bg-forest-50/80 rounded-xl p-3 border border-forest-200 flex items-start gap-2 text-xs text-forest-900">
        <AlertCircle className="w-4 h-4 text-forest-700 flex-shrink-0 mt-0.5" />
        <p>
          <strong>Scientific Guidance:</strong> Winter air pollution is typically highest between <strong>06:00 AM – 09:30 AM</strong> due to radiative nocturnal surface cooling (inversion layer). Vertical thermal mixing expands after 11:30 AM, creating the day&apos;s safest window for essential errands or brief home ventilation.
        </p>
      </div>
    </section>
  );
}
