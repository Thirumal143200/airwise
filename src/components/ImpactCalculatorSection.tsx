"use client";

import React, { useState, useMemo } from "react";
import {
  Calculator,
  Leaf,
  Fuel,
  TrendingDown,
  TreePine,
  HelpCircle,
  AlertTriangle,
} from "lucide-react";
import { CommuteMode } from "@/types";
import { calculateEnvironmentalImpact } from "@/lib/calculator/impactCalculator";

type AlternativeCommuteMode = "metro_train" | "electric_bus" | "carpool_4" | "work_from_home";

export function ImpactCalculatorSection() {
  const [distanceKm, setDistanceKm] = useState<number>(14);
  const [commuteMode, setCommuteMode] = useState<CommuteMode>("private_car_petrol");
  const [alternativeMode, setAlternativeMode] = useState<AlternativeCommuteMode>("metro_train");
  const [daysPerWeek, setDaysPerWeek] = useState<number>(5);

  const impact = useMemo(
    () =>
      calculateEnvironmentalImpact({
        distanceKm,
        commuteMode,
        alternativeMode,
        daysPerWeek,
      }),
    [distanceKm, commuteMode, alternativeMode, daysPerWeek]
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
        <div className="flex items-center gap-2">
          <Calculator className="w-6 h-6 text-forest-700" />
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            Transparent Environmental Impact Calculator
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-gray-600 mt-1 max-w-3xl">
          Evaluate the genuine environmental dividend of your lifestyle shifts. Unlike typical &ldquo;black-box&rdquo; carbon counters, AirWise discloses every mathematical formula, emission coefficient, and uncertainty factor.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Input Controls (5 Cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-5">
          <h3 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-2">
            Configure Your Commute Variables
          </h3>

          {/* Commute Distance Slider */}
          <div>
            <div className="flex justify-between items-center mb-1 text-xs sm:text-sm font-semibold text-gray-800">
              <span>One-Way Commute Distance:</span>
              <span className="text-forest-700 font-extrabold text-base">{distanceKm} km</span>
            </div>
            <input
              type="range"
              min="1"
              max="50"
              value={distanceKm}
              onChange={(e) => setDistanceKm(parseInt(e.target.value))}
              className="w-full accent-forest-700 h-2 bg-gray-200 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-gray-400 mt-1">
              <span>1 km</span>
              <span>Round-trip: {distanceKm * 2} km/day</span>
              <span>50 km</span>
            </div>
          </div>

          {/* Baseline Commute Mode */}
          <div>
            <label className="block text-xs font-semibold text-gray-800 mb-1">
              Current Baseline Mode:
            </label>
            <select
              value={commuteMode}
              onChange={(e) => setCommuteMode(e.target.value as CommuteMode)}
              className="w-full p-2.5 text-xs sm:text-sm border border-gray-300 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-forest-600 focus:outline-none"
            >
              <option value="private_car_petrol">Private Petrol Car (192 g CO₂e/p-km)</option>
              <option value="private_car_diesel">Private Diesel Car (171 g CO₂e/p-km)</option>
              <option value="two_wheeler">Two-Wheeler / Scooter (68 g CO₂e/p-km)</option>
            </select>
          </div>

          {/* Replacement Alternative Mode */}
          <div>
            <label className="block text-xs font-semibold text-gray-800 mb-1">
              Cleaner Alternative Choice:
            </label>
            <select
              value={alternativeMode}
              onChange={(e) => setAlternativeMode(e.target.value as AlternativeCommuteMode)}
              className="w-full p-2.5 text-xs sm:text-sm border border-gray-300 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-forest-600 focus:outline-none"
            >
              <option value="metro_train">Electric Urban Metro Rail (28 g CO₂e/p-km)</option>
              <option value="electric_bus">Electric Transit Bus (35 g CO₂e/p-km)</option>
              <option value="carpool_4">4-Person High-Occupancy Carpool (48 g CO₂e/p-km)</option>
              <option value="work_from_home">Work from Home / Remote (0 g transit CO₂e)</option>
            </select>
          </div>

          {/* Days Per Week */}
          <div>
            <label className="block text-xs font-semibold text-gray-800 mb-2">
              Commute Frequency (Days / Week):
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5, 6].map((day) => (
                <button
                  key={day}
                  onClick={() => setDaysPerWeek(day)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                    daysPerWeek === day
                      ? "bg-forest-900 text-white border-forest-900 shadow-xs"
                      : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  {day}d
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic Impact Results (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Key Metric Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {/* Daily CO2 Avoided */}
            <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex flex-col justify-between">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                <TrendingDown className="w-3.5 h-3.5 text-emerald-600" />
                Daily CO₂e Cut
              </span>
              <div className="my-2">
                <span className="text-2xl sm:text-3xl font-extrabold text-forest-900">
                  {impact.co2eAvoidedKg}
                </span>
                <span className="text-xs text-gray-500 font-medium ml-1">kg/day</span>
              </div>
              <span className="text-[10px] text-emerald-700 font-semibold">
                Avoided direct tailpipe greenhouse gas
              </span>
            </div>

            {/* Annual CO2e Avoided */}
            <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex flex-col justify-between">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                <Leaf className="w-3.5 h-3.5 text-tealbrand-600" />
                Annual CO₂e Cut
              </span>
              <div className="my-2">
                <span className="text-2xl sm:text-3xl font-extrabold text-tealbrand-800">
                  {impact.annualCo2eAvoidedKg}
                </span>
                <span className="text-xs text-gray-500 font-medium ml-1">kg/year</span>
              </div>
              <span className="text-[10px] text-tealbrand-700 font-semibold">
                Across 48 working weeks
              </span>
            </div>

            {/* Trees Equivalent */}
            <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex flex-col justify-between col-span-2 sm:col-span-1">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                <TreePine className="w-3.5 h-3.5 text-emerald-700" />
                Tree Offset Equiv.
              </span>
              <div className="my-2">
                <span className="text-2xl sm:text-3xl font-extrabold text-emerald-800">
                  {impact.equivalentTreesPlanted}
                </span>
                <span className="text-xs text-gray-500 font-medium ml-1">mature trees</span>
              </div>
              <span className="text-[10px] text-gray-500">
                Based on EPA 21.8 kg CO₂/tree/yr
              </span>
            </div>
          </div>

          {/* Mathematical Proof Box */}
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-forest-700" />
              Transparent Mathematical Methodology
            </h4>

            {/* Formula display */}
            <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 font-mono text-xs text-gray-800 break-words leading-relaxed">
              {impact.formulaExplained}
            </div>

            {/* Emission factor sources */}
            <div className="text-[11px] text-gray-600 space-y-1 pt-1">
              <div>
                <strong>Emission Factors:</strong> {impact.emissionFactorValue}
              </div>
              <div>
                <strong>Authoritative Source:</strong> {impact.emissionFactorSource}
              </div>
              <div>
                <strong>Uncertainty Margin:</strong> {impact.uncertaintyMargin}
              </div>
            </div>
          </div>

          {/* Crucial Scientific Distinction Alert */}
          <div className="bg-amber-50/90 border border-amber-300 rounded-2xl p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-800 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-amber-950 leading-relaxed">
              {impact.healthContextDisclaimer}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
