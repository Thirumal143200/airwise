"use client";

import React from "react";
import { AlertTriangle, CheckCircle } from "lucide-react";
import { PollutantReading } from "@/types";

interface PollutantsGridProps {
  pollutants: {
    pm25: PollutantReading;
    pm10: PollutantReading;
    no2: PollutantReading;
    so2: PollutantReading;
    co: PollutantReading;
    o3: PollutantReading;
  };
}

const STATUS_BADGE_CONFIG: Record<
  PollutantReading["status"],
  { badgeClass: string; isAlert: boolean }
> = {
  hazardous: {
    badgeClass: "bg-rose-100 text-rose-800 border border-rose-300",
    isAlert: true,
  },
  unhealthy: {
    badgeClass: "bg-amber-100 text-amber-800 border border-amber-300",
    isAlert: true,
  },
  moderate: {
    badgeClass: "bg-amber-100 text-amber-800 border border-amber-300",
    isAlert: false,
  },
  safe: {
    badgeClass: "bg-emerald-100 text-emerald-800 border border-emerald-300",
    isAlert: false,
  },
};

export function PollutantsGrid({ pollutants }: PollutantsGridProps) {
  const items = [
    pollutants.pm25,
    pollutants.pm10,
    pollutants.no2,
    pollutants.o3,
    pollutants.so2,
    pollutants.co,
  ];

  return (
    <section aria-labelledby="pollutants-breakdown-heading" className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 id="pollutants-breakdown-heading" className="text-xl font-bold text-gray-900">
            Key Air Pollutants Breakdown
          </h2>
          <p className="text-xs sm:text-sm text-gray-600">
            Individual pollutant concentrations compared against World Health Organization (WHO) 24-hour health guidelines.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => {
          if (!item) return null;
          const ratioToWho = item.whoGuideline24h > 0 ? (item.value / item.whoGuideline24h).toFixed(1) : null;
          const isExceeded = ratioToWho && parseFloat(ratioToWho) > 1.0;

          return (
            <div
              key={item.chemicalFormula}
              className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs hover:border-forest-300 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header: Chemical Formula & Name */}
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-bold text-forest-700 bg-forest-50 px-2 py-0.5 rounded border border-forest-100">
                      {item.chemicalFormula}
                    </span>
                    <h3 className="text-sm font-semibold text-gray-900 mt-1">{item.name}</h3>
                  </div>

                  {/* Status Badge */}
                  {(() => {
                    const statusConfig =
                      STATUS_BADGE_CONFIG[item.status] || STATUS_BADGE_CONFIG.moderate;
                    return (
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${statusConfig.badgeClass}`}
                      >
                        {statusConfig.isAlert ? (
                          <AlertTriangle className="w-3 h-3" />
                        ) : (
                          <CheckCircle className="w-3 h-3" />
                        )}
                        <span className="capitalize">{item.status}</span>
                      </span>
                    );
                  })()}
                </div>

                {/* Main Concentration Value */}
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-gray-900">{item.value}</span>
                  <span className="text-xs text-gray-500 font-medium">{item.unit}</span>
                </div>

                {/* WHO Guideline Comparison */}
                <div className="mt-2 text-xs">
                  {isExceeded ? (
                    <span className="text-amber-700 font-semibold bg-amber-50 px-2 py-1 rounded inline-block">
                      ⚠️ {ratioToWho}× above WHO 24h limit ({item.whoGuideline24h} {item.unit})
                    </span>
                  ) : (
                    <span className="text-emerald-700 font-medium bg-emerald-50 px-2 py-1 rounded inline-block">
                      ✓ Within WHO 24h limit ({item.whoGuideline24h} {item.unit})
                    </span>
                  )}
                </div>

                {/* Health Implications */}
                <p className="mt-3 text-xs text-gray-600 leading-relaxed border-t border-gray-100 pt-2">
                  {item.healthImplications}
                </p>
              </div>

              {/* Sub-index if available */}
              {item.subIndex !== undefined && (
                <div className="mt-3 text-[11px] text-gray-500 flex justify-between items-center border-t border-gray-100 pt-2">
                  <span>Sub-Index Score:</span>
                  <span className="font-bold text-gray-800">{item.subIndex}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
