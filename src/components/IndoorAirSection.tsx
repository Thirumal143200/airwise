"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  CheckCircle,
  XCircle,
  DollarSign,
  AlertTriangle,
  BookOpen,
  Filter,
  Flame,
  Wind,
  Sparkles,
} from "lucide-react";
import { IndoorIntervention } from "@/types";
import { INDOOR_INTERVENTIONS } from "@/lib/indoor/indoorEngine";

export function IndoorAirSection() {
  const [selectedCostFilter, setSelectedCostFilter] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filteredInterventions = INDOOR_INTERVENTIONS.filter((item) => {
    if (selectedCostFilter !== "all" && item.costTier !== selectedCostFilter) {
      return false;
    }
    if (selectedCategory !== "all" && item.category !== selectedCategory) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-forest-700" />
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            Indoor Air Quality & Family Protection Guide
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-gray-600 mt-1 max-w-3xl">
          Urban indoor air can be 2 to 5 times more polluted than outdoor air if domestic combustion and dust resuspension are unmanaged. Explore evidence-based practices categorized by cost and practical feasibility.
        </p>

        {/* Filter Chips Bar */}
        <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap gap-2 items-center">
          <span className="text-xs font-bold text-gray-500 mr-2 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Budget Tier:
          </span>

          {[
            { id: "all", label: "All Interventions" },
            { id: "zero_cost", label: "Zero-Cost (Behavioral)" },
            { id: "low_cost", label: "Low-Cost ($20–$60 DIY)" },
            { id: "high_investment", label: "Certified HEPA Appliances" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedCostFilter(tab.id)}
              className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-all ${
                selectedCostFilter === tab.id
                  ? "bg-forest-900 text-white border-forest-900 shadow-xs"
                  : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Critical Safety Notice: Ozone Warning */}
      <div className="bg-rose-50 border-2 border-rose-200 rounded-2xl p-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-rose-700 flex-shrink-0 mt-0.5" />
        <div className="text-xs sm:text-sm text-rose-950">
          <strong className="font-bold text-rose-900">Critical Air Purifier Warning:</strong> Never use or purchase air cleaners advertised as "ozone generators", "ionizers", or "electronic plasma oxidizers". The California Air Resources Board (CARB) warns that intentional ozone emission creates secondary respiratory toxins that trigger severe asthma attacks. Always choose purely mechanical True HEPA filters.
        </div>
      </div>

      {/* Interventions Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredInterventions.map((item) => (
          <article
            key={item.id}
            className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs hover:border-forest-300 transition-all flex flex-col justify-between"
          >
            <div>
              {/* Card Header: Category + Cost Badge */}
              <div className="flex items-start justify-between gap-2 border-b border-gray-100 pb-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-forest-700 bg-forest-50 px-2 py-0.5 rounded border border-forest-100">
                    {item.category.replace("_", " ")}
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mt-1">
                    {item.title}
                  </h3>
                </div>

                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 whitespace-nowrap">
                  {item.estimatedCostRange}
                </span>
              </div>

              {/* One line summary */}
              <p className="mt-3 text-xs sm:text-sm text-gray-700 font-medium italic">
                "{item.oneLineSummary}"
              </p>

              {/* Action Steps */}
              <div className="mt-4">
                <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">
                  Action Steps:
                </h4>
                <ul className="space-y-1.5 text-xs text-gray-700">
                  {item.actionSteps.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-4 h-4 rounded-full bg-forest-100 text-forest-800 font-bold text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Do's and Don'ts */}
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-gray-100">
                <div className="bg-emerald-50/60 rounded-xl p-3 border border-emerald-200">
                  <h5 className="text-[11px] font-bold text-emerald-900 flex items-center gap-1 mb-1">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    Essential Do's
                  </h5>
                  <ul className="text-[11px] text-emerald-950 space-y-1">
                    {item.dos.map((d, i) => (
                      <li key={i}>• {d}</li>
                    ))}
                  </ul>
                </div>

                <div className="bg-rose-50/60 rounded-xl p-3 border border-rose-200">
                  <h5 className="text-[11px] font-bold text-rose-900 flex items-center gap-1 mb-1">
                    <XCircle className="w-3.5 h-3.5 text-rose-600" />
                    Critical Don'ts
                  </h5>
                  <ul className="text-[11px] text-rose-950 space-y-1">
                    {item.donts.map((d, i) => (
                      <li key={i}>• {d}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Scientific Rationale */}
              <div className="mt-4 text-xs text-gray-600 bg-gray-50 rounded-xl p-3 border border-gray-100 leading-relaxed">
                <strong>Mechanism:</strong> {item.scientificRationale}
              </div>
            </div>

            {/* Evidence Source Footer */}
            <div className="mt-4 pt-3 border-t border-gray-100 text-[11px] text-gray-500 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-forest-700 flex-shrink-0" />
              <span>
                <strong>Evidence:</strong> {item.evidenceSource}
              </span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
