"use client";

import React from "react";
import {
  Shuffle,
  ArrowRight,
  TrendingDown,
  CheckCircle2,
  AlertTriangle,
  Leaf,
} from "lucide-react";
import { SUSTAINABLE_ALTERNATIVES } from "@/lib/alternatives/alternativesEngine";

export function SustainableAlternativesSection() {
  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
        <div className="flex items-center gap-2">
          <Shuffle className="w-6 h-6 text-forest-700" />
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            Sustainable Alternatives & Exposure Balance Engine
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-gray-600 mt-1 max-w-3xl">
          Making cleaner daily decisions requires balancing your personal lung exposure against systemic environmental emissions. AirWise recommends realistic alternatives that protect your health first while cutting community pollution.
        </p>

        {/* Fundamental Principle Banner */}
        <div className="mt-4 p-4 rounded-xl bg-forest-50/90 border border-forest-200 flex items-start gap-3">
          <Leaf className="w-5 h-5 text-forest-800 flex-shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm text-forest-950">
            <strong>The Exposure-Emission Principle:</strong> &ldquo;Never encourage an individual to cycle or jog in severe winter smog simply to be zero-emission. Inhaling 40 L/min of toxic particulate air causes severe acute alveolar injury. Sustainable choices must prioritize personal pulmonary safety.&rdquo;
          </div>
        </div>
      </div>

      {/* Alternatives Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {SUSTAINABLE_ALTERNATIVES.map((alt) => (
          <article
            key={alt.id}
            className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs hover:border-forest-300 transition-all flex flex-col justify-between"
          >
            <div>
              {/* Category & Feasibility */}
              <div className="flex items-start justify-between border-b border-gray-100 pb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-tealbrand-800 bg-tealbrand-50 px-2 py-0.5 rounded border border-tealbrand-200">
                  {alt.category.toUpperCase()}
                </span>
                <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-2.5 py-0.5 rounded-full">
                  Feasibility: <strong>{alt.feasibilityRating}</strong>
                </span>
              </div>

              {/* Title */}
              <h3 className="text-base sm:text-lg font-bold text-gray-900 mt-3">
                {alt.title}
              </h3>

              {/* Baseline vs Cleaner Alternative */}
              <div className="mt-4 space-y-3">
                <div className="bg-rose-50/70 p-3 rounded-xl border border-rose-100">
                  <span className="text-[11px] font-bold text-rose-800 uppercase tracking-wider">
                    Baseline Habit:
                  </span>
                  <p className="text-xs text-rose-950 mt-0.5">{alt.baselineHabit}</p>
                </div>

                <div className="flex justify-center -my-1">
                  <ArrowRight className="w-4 h-4 text-forest-700 transform rotate-90 sm:rotate-0" />
                </div>

                <div className="bg-emerald-50/80 p-3 rounded-xl border border-emerald-200">
                  <span className="text-[11px] font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Cleaner Alternative:
                  </span>
                  <p className="text-xs text-emerald-950 mt-0.5 font-medium">
                    {alt.cleanerAlternative}
                  </p>
                </div>
              </div>

              {/* Exposure Tradeoff vs Systemic Benefit */}
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-gray-100">
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <span className="text-[10px] font-bold text-gray-600 uppercase tracking-wider">
                    Personal Lung Exposure Impact:
                  </span>
                  <p className="text-xs text-gray-800 mt-1">{alt.exposureTradeoff}</p>
                </div>

                <div className="bg-tealbrand-50/50 p-3 rounded-xl border border-tealbrand-100">
                  <span className="text-[10px] font-bold text-tealbrand-800 uppercase tracking-wider flex items-center gap-1">
                    <TrendingDown className="w-3.5 h-3.5 text-tealbrand-600" />
                    Systemic Emission Cut:
                  </span>
                  <p className="text-xs text-tealbrand-950 mt-1 font-medium">
                    {alt.emissionReductionBenefit}
                  </p>
                </div>
              </div>
            </div>

            {/* Critical Safety Caveat */}
            <div className="mt-4 pt-3 border-t border-gray-100 bg-amber-50/80 rounded-xl p-3 border border-amber-200 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
              <div className="text-[11px] text-amber-950 leading-relaxed">
                <strong>Critical Health Caveat:</strong> {alt.safetyCaveat}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
